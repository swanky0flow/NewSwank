import cron from 'node-cron';
import { generateValueDrivenArticle } from '../src/lib/content-generator';

// This script is a scaffold. It demonstrates scheduling but does not persist articles.
const schedule = process.env.AUTO_PUBLISH_SCHEDULE || '0 2 * * *';

cron.schedule(schedule, async () => {
  console.log('📅 [scaffold] auto-publish triggered');
  try {
    const article = await generateValueDrivenArticle();
    console.log('📝 Generated (scaffold):', article.title);
    // TODO: persist to DB and cache products
  } catch (err) {
    console.error('Auto-publish error (scaffold):', err);
  }
});

console.log('Auto-publish scaffold scheduled — schedule =', schedule);
