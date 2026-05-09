# Librario - Library Management System

A minimal full-stack project with Role-Based Access Control (RBAC).

## Tech Stack
- **Backend:** Java Spring Boot, MySQL, Spring Security (JWT)
- **Frontend:** React, Bootstrap

## Setup Instructions

### 1. Database Setup
1. Open MySQL and run the script in `backend/schema.sql`.
2. This will create the `librario_db` and insert default users:
   - **Admin:** `admin@librario.com` / `password123`
   - **Member:** `john@member.com` / `password123`

### 2. Backend Setup
1. Navigate to the `backend` folder.
2. Update `src/main/resources/application.properties` with your MySQL username and password.
3. Run the application using Maven:
   ```bash
   mvn spring-boot:run
   ```

### 3. Frontend Setup
1. Navigate to the `frontend` folder.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## Roles & Permissions
- **ADMIN:** Add, View, and Delete books.
- **MEMBER:** View books, Issue books, and Return books.

## API Endpoints
- `POST /api/auth/login`: Authenticate and get JWT.
- `GET /api/books`: Get all books (Any role).
- `POST /api/books`: Add a book (Admin only).
- `DELETE /api/books/{id}`: Delete a book (Admin only).
- `POST /api/transactions/issue`: Issue a book to the logged-in member.
- `POST /api/transactions/return`: Return a book and calculate fine.
