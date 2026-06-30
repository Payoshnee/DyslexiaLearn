-- Create the pgvector extension (just in case it's not created by Spring AI)
CREATE EXTENSION IF NOT EXISTS vector;

-- Remove duplicate users created by older seed runs.
DELETE FROM users a
USING users b
WHERE a.email = b.email
  AND a.id > b.id;

-- Keep one account per email so login queries remain unique.
CREATE UNIQUE INDEX IF NOT EXISTS users_email_unique_idx ON users (email);

-- Seed the users table
INSERT INTO users (email, password, name) 
VALUES ('student@dyslexialearn.com', 'password123', 'Demo Student')
ON CONFLICT (email) DO NOTHING;
