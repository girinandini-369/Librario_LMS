CREATE DATABASE IF NOT EXISTS librario;
USE librario;

-- Users table
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('ADMIN', 'MEMBER') NOT NULL
);

-- Books table
CREATE TABLE books (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(100) NOT NULL,
    available_copies INT NOT NULL DEFAULT 0
);

-- Transactions table
CREATE TABLE transactions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    book_id BIGINT NOT NULL,
    issue_date DATE NOT NULL,
    return_date DATE,
    fine DECIMAL(10, 2) DEFAULT 0.00,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (book_id) REFERENCES books(id)
);

-- Initial Data
INSERT INTO users (name, email, password, role) VALUES 
('Librarian Admin', 'admin@librario.com', '$2a$10$8.UnVuG9HHgffUDAlk8qn.6n5HPRxeE.6S8p.6S8p.6S8p', 'ADMIN'), -- password: password123
('John Doe', 'john@member.com', '$2a$10$8.UnVuG9HHgffUDAlk8qn.6n5HPRxeE.6S8p.6S8p.6S8p', 'MEMBER');

INSERT INTO books (title, author, available_copies) VALUES 
('The Great Gatsby', 'F. Scott Fitzgerald', 5),
('1984', 'George Orwell', 3),
('To Kill a Mockingbird', 'Harper Lee', 2);
