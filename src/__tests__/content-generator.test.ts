import { describe, it, expect } from 'vitest';
import { generateValueDrivenArticle } from '../lib/content-generator';

describe('Content Generator', () => {
  it('should generate an article with required fields', async () => {
    const article = await generateValueDrivenArticle();

    expect(article).toBeDefined();
    expect(article.title).toBeDefined();
    expect(article.slug).toBeDefined();
    expect(article.content).toBeDefined();
  });

  it('should create valid slug from title', async () => {
    const article = await generateValueDrivenArticle();

    // Slug should be lowercase and contain only alphanumeric and hyphens
    expect(article.slug).toMatch(/^[a-z0-9-]+$/);
  });

  it('should handle custom topic', async () => {
    const customTopic = 'best running shoes';
    const article = await generateValueDrivenArticle(customTopic);

    expect(article.title).toBeDefined();
    expect(article.content).toBeDefined();
  });
});
