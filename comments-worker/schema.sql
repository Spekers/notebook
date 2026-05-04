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
