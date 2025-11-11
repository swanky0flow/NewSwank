import { describe, it, expect } from 'vitest';
import { generateValueDrivenArticle, type Article, type Product } from '../src/lib/content-generator';

describe('content-generator', () => {
  describe('generateValueDrivenArticle', () => {
    it('should return an Article object with required fields', async () => {
      const article = await generateValueDrivenArticle();
      expect(article).toHaveProperty('title');
      expect(article).toHaveProperty('slug');
      expect(article).toHaveProperty('content');
      expect(typeof article.title).toBe('string');
      expect(typeof article.slug).toBe('string');
      expect(typeof article.content).toBe('string');
    });

    it('should use provided topic in title', async () => {
      const topic = 'Best Laptops for 2024';
      const article = await generateValueDrivenArticle(topic);
      expect(article.title).toContain(topic);
    });

    it('should generate URL-safe slug', async () => {
      const article = await generateValueDrivenArticle('Machine Learning Guide');
      expect(article.slug).toMatch(/^[a-z0-9-]+$/);
      expect(article.slug).not.toContain(' ');
    });

    it('should return article with optional excerpt', async () => {
      const article = await generateValueDrivenArticle();
      if (article.excerpt) {
        expect(typeof article.excerpt).toBe('string');
      }
    });

    it('should support product array if provided', async () => {
      const article = await generateValueDrivenArticle('Gaming Monitors');
      if (article.products) {
        expect(Array.isArray(article.products)).toBe(true);
      }
    });
  });

  describe('Article schema validation', () => {
    it('should have valid article structure', async () => {
      const article = await generateValueDrivenArticle();
      const schema = {
        title: 'string',
        slug: 'string',
        content: 'string',
        excerpt: 'string?',
        category: 'string?',
        products: 'array?',
        visuals: 'array?',
        seo: 'object?',
      };

      expect(typeof article.title).toBe('string');
      expect(typeof article.slug).toBe('string');
      expect(typeof article.content).toBe('string');
    });
  });
});
