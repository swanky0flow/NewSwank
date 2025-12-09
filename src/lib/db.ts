import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const DB_PATH = process.env.DB_PATH || path.join(process.cwd(), 'data', 'app.db');

// Ensure data directory exists
const dataDir = path.dirname(DB_PATH);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

let db: Database.Database | null = null;

/**
 * Initialize or get the database connection.
 */
export function getDb(): Database.Database {
  if (!db) {
    db = new Database(DB_PATH);
    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');
  }
  return db;
}

/**
 * Close the database connection.
 */
export function closeDb(): void {
  if (db) {
    db.close();
    db = null;
  }
}

/**
 * Initialize schema from migration SQL files.
 */
export function initializeSchema(): void {
  const database = getDb();
  const migrationsDir = path.join(process.cwd(), 'migrations');

  if (!fs.existsSync(migrationsDir)) {
    console.warn('No migrations directory found');
    return;
  }

  const migrations = fs
    .readdirSync(migrationsDir)
    .filter((f) => f.endsWith('.sql'))
    .sort();

  for (const migration of migrations) {
    const migrationPath = path.join(migrationsDir, migration);
    const sql = fs.readFileSync(migrationPath, 'utf-8');
    console.log(`Applying migration: ${migration}`);
    database.exec(sql);
  }
}

/**
 * Article Repository
 */
export const articleRepository = {
  create(
    database: Database.Database,
    article: {
      title: string;
      slug: string;
      content: string;
      excerpt?: string;
      category?: string;
    }
  ): number {
    const stmt = database.prepare(`
      INSERT INTO articles (title, slug, content, excerpt, category, created_at)
      VALUES (?, ?, ?, ?, ?, datetime('now'))
    `);
    const result = stmt.run(
      article.title,
      article.slug,
      article.content,
      article.excerpt,
      article.category
    );
    return result.lastInsertRowid as number;
  },
  findById(database: Database.Database, id: number) {
    const stmt = database.prepare('SELECT * FROM articles WHERE id = ?');
    return stmt.get(id);
  },
  findAll(database: Database.Database) {
    const stmt = database.prepare('SELECT * FROM articles ORDER BY created_at DESC');
    return stmt.all();
  },
};

/**
 * Job Repository
 */
export const jobRepository = {
  create(database: Database.Database, type: string): number {
    const stmt = database.prepare(`
      INSERT INTO jobs (type, status, created_at)
      VALUES (?, ?, datetime('now'))
    `);
    const result = stmt.run(type, 'pending');
    return result.lastInsertRowid as number;
  },
  updateStatus(
    database: Database.Database,
    id: number,
    status: string,
    result?: string,
    error?: string
  ): void {
    const stmt = database.prepare(`
      UPDATE jobs SET status = ?, result = ?, error = ?, updated_at = datetime('now')
      WHERE id = ?
    `);
    stmt.run(status, result || null, error || null, id);
  },
  findById(database: Database.Database, id: number) {
    const stmt = database.prepare('SELECT * FROM jobs WHERE id = ?');
    return stmt.get(id);
  },
};

export default getDb;
