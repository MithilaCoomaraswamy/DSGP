CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL,
    password TEXT NOT NULL
);

INSERT INTO users (email, password) VALUES ('test@example.com', 'password123');