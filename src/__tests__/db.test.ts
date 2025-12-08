import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { getDb, closeDb, initializeSchema } from '../lib/db';
import type Database from 'better-sqlite3';

describe('Database', () => {
  let db: Database.Database;

  beforeAll(() => {
    // Use in-memory database for tests
    process.env.DB_PATH = ':memory:';
    db = getDb();
    initializeSchema();
  });

  afterAll(() => {
    closeDb();
  });

  it('should initialize with WAL mode', () => {
    const result = db.prepare('PRAGMA journal_mode').get() as { journal_mode: string };
    expect(result.journal_mode).toBe('wal');
  });

  it('should have articles table', () => {
    const result = db
      .prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='articles'")
      .get() as { name: string } | undefined;
    expect(result?.name).toBe('articles');
  });

  it('should have products table', () => {
    const result = db
      .prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='products'")
      .get() as { name: string } | undefined;
    expect(result?.name).toBe('products');
  });
});
