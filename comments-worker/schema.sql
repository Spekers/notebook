CREATE TABLE IF NOT EXISTS comments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT NOT NULL,
  name TEXT NOT NULL,
  body TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  approved INTEGER NOT NULL DEFAULT 0,
  ip_hash TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_comments_slug
  ON comments(slug, approved, created_at);

CREATE INDEX IF NOT EXISTS idx_comments_ip_recent
  ON comments(ip_hash, created_at);

CREATE TABLE IF NOT EXISTS subscribers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL UNIQUE,
  token TEXT NOT NULL UNIQUE,
  created_at INTEGER NOT NULL,
  confirmed_at INTEGER,
  ip_hash TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_subscribers_confirmed
  ON subscribers(confirmed_at);

CREATE INDEX IF NOT EXISTS idx_subscribers_ip_recent
  ON subscribers(ip_hash, created_at);
