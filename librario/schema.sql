-- Librario - Library Management System
-- MySQL Schema

CREATE DATABASE IF NOT EXISTS librario;
USE librario;

CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('ADMIN', 'MEMBER') NOT NULL DEFAULT 'MEMBER'
);

CREATE TABLE books (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    author VARCHAR(100) NOT NULL,
    available_copies INT NOT NULL DEFAULT 1
);

CREATE TABLE transactions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    book_id BIGINT NOT NULL,
    issue_date DATE NOT NULL,
    return_date DATE,
    fine DECIMAL(10,2) DEFAULT 0.00,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (book_id) REFERENCES books(id)
);

-- Seed data
-- Password for both accounts is: password123
INSERT INTO users (name, email, password, role) VALUES
('Admin User', 'admin@librario.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iYqiSfFe/p/fPjaipfRBEv0tBiSy', 'ADMIN'),
('John Member', 'john@librario.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iYqiSfFe/p/fPjaipfRBEv0tBiSy', 'MEMBER');

INSERT INTO books (title, author, available_copies) VALUES
('The Great Gatsby', 'F. Scott Fitzgerald', 3),
('To Kill a Mockingbird', 'Harper Lee', 2),
('1984', 'George Orwell', 4),
('Clean Code', 'Robert C. Martin', 2),
('The Pragmatic Programmer', 'Andrew Hunt', 1);
