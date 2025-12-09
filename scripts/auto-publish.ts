import cron from 'node-cron';
import { generateValueDrivenArticle } from '../src/lib/content-generator';
import { Logger } from '../src/lib/logger';
import { ENV } from '../src/lib/env';
import { getDb, initializeSchema, jobRepository } from '../src/lib/db';
import articleRepository from '../src/lib/db';

const logger = new Logger('auto-publish');

/**
 * Start the auto-publish job.
 *
 * @param opts.schedule cron schedule string (defaults to env AUTO_PUBLISH_SCHEDULE or '0 2 * * *')
 * @param opts.runOnce if true, generate once and exit
 */
export async function startAutoPublish(opts?: { schedule?: string; runOnce?: boolean }) {
  const schedule = opts?.schedule ?? ENV.AUTO_PUBLISH_SCHEDULE ?? '0 2 * * *';
  const runOnce = opts?.runOnce ?? process.argv.includes('--once');

  // Initialize database
  initializeSchema();
  const db = getDb();

  async function generateAndHandle() {
    const jobId = jobRepository.create(db, 'article_generation');
    jobRepository.updateStatus(db, jobId as number, 'running');

    logger.info('📅 auto-publish triggered');
    try {
      const article = await generateValueDrivenArticle();

      if (article && typeof article.title === 'string') {
        // Persist article to database
        const articleId = articleRepository.create(db, {
          title: article.title,
          slug: article.slug,
          content: article.content,
          excerpt: article.excerpt,
          category: article.category,
        });

        logger.info('📝 Article generated and persisted:', { id: articleId, title: article.title });
        jobRepository.updateStatus(
          db,
          jobId as number,
          'completed',
          JSON.stringify({ articleId, title: article.title })
        );
      } else {
        logger.warn('Generated article missing title');
        jobRepository.updateStatus(
          db,
          jobId as number,
          'failed',
          undefined,
          'Article missing title'
        );
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      logger.error('Auto-publish error:', { error: errorMsg });
      jobRepository.updateStatus(db, jobId as number, 'failed', undefined, errorMsg);
    }
  }

  if (runOnce) {
    await generateAndHandle();
    logger.info('Single run complete');
    process.exit(0);
  }

  const task = cron.schedule(schedule, generateAndHandle, { scheduled: true });
  logger.info('Auto-publish scheduler started', { schedule });

  // Graceful shutdown
  const shutdown = async () => {
    logger.info('Shutting down auto-publish scheduler...');
    try {
      task.stop();
    } catch (e) {
      logger.warn('Error stopping task:', e);
    }
    // give any in-flight jobs a moment
    setTimeout(() => {
      logger.info('Scheduler shutdown complete');
      process.exit(0);
    }, 500);
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

// If run directly from the CLI, start with default options.
if (require.main === module) {
  // Start and don't await; the process will remain alive for scheduled runs.
  startAutoPublish().catch((err) => {
    logger.error('Failed to start auto-publish:', err);
    process.exit(1);
  });
}
