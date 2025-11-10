-- Products table (cached from Amazon)
CREATE TABLE IF NOT EXISTS products (
  asin TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  brand TEXT,
  category TEXT,
  price REAL,
  currency TEXT DEFAULT 'USD',
  image TEXT,
  affiliate_url TEXT NOT NULL,
  rating REAL DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  is_amazon_choice BOOLEAN DEFAULT 0,
  is_bestseller BOOLEAN DEFAULT 0,
  features TEXT,
  last_updated TEXT DEFAULT CURRENT_TIMESTAMP,
  times_featured INTEGER DEFAULT 0
);

-- Articles table
CREATE TABLE IF NOT EXISTS articles (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  category TEXT,
  cover_image TEXT,
  visuals TEXT,
  featured_products TEXT,
  author TEXT DEFAULT 'SwankyBoyz Editorial',
  published_date TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_date TEXT,
  read_time INTEGER,
  views INTEGER DEFAULT 0,
  status TEXT DEFAULT 'published'
);

-- Content generation log
CREATE TABLE IF NOT EXISTS content_log (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  topic TEXT,
  products_curated INTEGER,
  article_id TEXT,
  generation_time INTEGER,
  success BOOLEAN,
  error_message TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Additional tables omitted for brevity in scaffold
