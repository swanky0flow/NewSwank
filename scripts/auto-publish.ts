import cron from 'node-cron';
import { generateValueDrivenArticle } from '../src/lib/content-generator';

/**
 * Start the auto-publish job.
 *
 * @param opts.schedule cron schedule string (defaults to env AUTO_PUBLISH_SCHEDULE or '0 2 * * *')
 * @param opts.runOnce if true, generate once and exit
 */npx ts-node scripts/auto-publish.ts --once
export async function startAutoPublish(opts?: { schedule?: string; runOnce?: boolean }) {
  const schedule = opts?.schedule ?? process.env.AUTO_PUBLISH_SCHEDULE ?? '0 2 * * *';
  const runOnce = opts?.runOnce ?? (process.argv.includes('--once') || process.env.RUN_ONCE === '1');

  async function generateAndHanpx ts-node scripts/auto-publish.ts --oncendle() {
    console.log('📅 auto-publish triggered — runOnce=' + runOnce);
    try {
      const article = await generateValueDrivenArticle();
      if (article && typeof article.title === 'string') {
        console.log('📝 Generated (scaffold):', article.title);
      } else {
        console.log('📝 Generated (scaffold): [no title]');
      }
      // TODO: persist to DB and cache products
    } catch (err) {
      console.error('Auto-publish error (scaffold):', err);
    }
  }

  if (runOnce) {
    await generateAndHandle();
    // allow caller / CLI to exit
    return;
  }

  const task = cron.schedule(schedule, generateAndHandle, { scheduled: true });
  console.log('Auto-publish scaffold scheduled — schedule =', schedule);

  // Graceful shutdown
  const shutdown = async () => {
    console.log('Shutting down auto-publish scheduler...');
    try {
      task.stop();
    } catch (e) {
      /* ignore */
    }
    // give any in-flight jobs a moment (if desired, add tracking)
    setTimeout(() => process.exit(0), 500);
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

// If run directly from the CLI, start with default options.
if (require.main === module) {
  // Start and don't await; the process will remain alive for scheduled runs.
  startAutoPublish().catch((err) => {
    console.error('Failed to start auto-publish:', err);
    process.exit(1);
  });
}
