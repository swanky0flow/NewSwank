import type Database from 'better-sqlite3';
import { getDb } from './db';
import type { Article, Product } from './content-generator';

export interface StoredArticle extends Article {
  id: number;
  createdAt: string;
  updatedAt: string;
}

export interface StoredProduct extends Product {
  id: number;
  articleId: number;
}

/**
 * Article repository for database operations.
 */
export class ArticleRepository {
  private db: Database.Database;

  constructor(db?: Database.Database) {
    this.db = db || getDb();
  }

  /**
   * Save a new article to the database.
   */
  saveArticle(article: Article): number {
    const stmt = this.db.prepare(`
      INSERT INTO articles (title, slug, content, excerpt, category, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, datetime('now'), datetime('now'))
    `);

    const result = stmt.run(
      article.title,
      article.slug,
      article.content,
      article.excerpt || null,
      article.category || null
    );

    return result.lastInsertRowid as number;
  }

  /**
   * Retrieve an article by ID.
   */
  getArticleById(id: number): StoredArticle | null {
    const stmt = this.db.prepare('SELECT * FROM articles WHERE id = ?');
    return (stmt.get(id) as StoredArticle) || null;
  }

  /**
   * Retrieve all articles with pagination.
   */
  listArticles(limit: number = 20, offset: number = 0): StoredArticle[] {
    const stmt = this.db.prepare(
      'SELECT * FROM articles ORDER BY created_at DESC LIMIT ? OFFSET ?'
    );
    return stmt.all(limit, offset) as StoredArticle[];
  }

  /**
   * Find article by slug.
   */
  findBySlug(slug: string): StoredArticle | null {
    const stmt = this.db.prepare('SELECT * FROM articles WHERE slug = ?');
    return (stmt.get(slug) as StoredArticle) || null;
  }

  /**
   * Update an article.
   */
  updateArticle(id: number, article: Partial<Article>): void {
    const updates: string[] = [];
    const values: unknown[] = [];

    if (article.title !== undefined) {
      updates.push('title = ?');
      values.push(article.title);
    }
    if (article.content !== undefined) {
      updates.push('content = ?');
      values.push(article.content);
    }
    if (article.excerpt !== undefined) {
      updates.push('excerpt = ?');
      values.push(article.excerpt);
    }

    if (updates.length === 0) return;

    updates.push('updated_at = datetime("now")');
    values.push(id);

    const stmt = this.db.prepare(`UPDATE articles SET ${updates.join(', ')} WHERE id = ?`);
    stmt.run(...values);
  }

  /**
   * Delete an article.
   */
  deleteArticle(id: number): void {
    const stmt = this.db.prepare('DELETE FROM articles WHERE id = ?');
    stmt.run(id);
  }
}

/**
 * Product repository for database operations.
 */
export class ProductRepository {
  private db: Database.Database;

  constructor(db?: Database.Database) {
    this.db = db || getDb();
  }

  /**
   * Save a product associated with an article.
   */
  saveProduct(articleId: number, product: Product): number {
    const stmt = this.db.prepare(`
      INSERT INTO products (article_id, asin, name, description, price, image, affiliate_url, rating, review_count)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      articleId,
      product.asin,
      product.name,
      product.description || null,
      product.price || null,
      product.image || null,
      product.affiliateUrl || null,
      product.rating || null,
      product.reviewCount || null
    );

    return result.lastInsertRowid as number;
  }

  /**
   * Get all products for an article.
   */
  getProductsByArticleId(articleId: number): StoredProduct[] {
    const stmt = this.db.prepare('SELECT * FROM products WHERE article_id = ? ORDER BY name');
    return stmt.all(articleId) as StoredProduct[];
  }

  /**
   * Get a product by ASIN.
   */
  findByAsin(asin: string): StoredProduct | null {
    const stmt = this.db.prepare('SELECT * FROM products WHERE asin = ?');
    return (stmt.get(asin) as StoredProduct) || null;
  }
}
