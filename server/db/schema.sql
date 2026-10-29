-- SQLite schema for client reviews (created automatically when the server starts).
CREATE TABLE IF NOT EXISTS portfolio_reviews (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  created_at  TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ','now')),
  name        TEXT    NOT NULL CHECK (length(name) BETWEEN 2 AND 80),
  business    TEXT    CHECK (business IS NULL OR length(business) <= 120),
  rating      INTEGER CHECK (rating BETWEEN 1 AND 5),
  review      TEXT    NOT NULL CHECK (length(review) BETWEEN 10 AND 1000),
  approved    INTEGER NOT NULL DEFAULT 1,   -- 1 = visible on the site, 0 = hidden
  ip          TEXT
);
CREATE INDEX IF NOT EXISTS idx_reviews_created ON portfolio_reviews (created_at);
