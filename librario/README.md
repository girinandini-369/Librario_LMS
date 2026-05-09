# 📚 Librario - Library Management System

A minimal full-stack library management system with role-based access control (RBAC).
Built with Spring Boot + MySQL + plain HTML/Bootstrap.

---

## Tech Stack

| Layer      | Technology             |
|------------|------------------------|
| Backend    | Java 17 + Spring Boot 3.2 |
| Database   | MySQL 8.x              |
| Auth       | JWT (jjwt 0.11.5)      |
| Frontend   | HTML + Bootstrap 5     |

---

## Project Structure

```
librario/
├── backend/                    # Spring Boot project
│   ├── pom.xml
│   └── src/main/java/com/librario/
│       ├── LibrarioApplication.java
│       ├── config/
│       │   └── SecurityConfig.java
│       ├── controller/
│       │   ├── AuthController.java
│       │   ├── BookController.java
│       │   ├── TransactionController.java
│       │   └── UserController.java
│       ├── model/
│       │   ├── User.java
│       │   ├── Book.java
│       │   └── Transaction.java
│       ├── repository/
│       │   ├── UserRepository.java
│       │   ├── BookRepository.java
│       │   └── TransactionRepository.java
│       ├── security/
│       │   ├── JwtUtil.java
│       │   └── JwtFilter.java
│       └── service/
│           └── TransactionService.java
├── frontend/
│   ├── index.html              # Login page
│   └── dashboard.html          # Main app
└── schema.sql                  # MySQL schema + seed data
```

---

## Setup Instructions

### 1. MySQL Setup

```bash
# Login to MySQL
mysql -u root -p

# Run the schema file
source /path/to/librario/schema.sql
```

This creates the `librario` database with 3 tables and 2 seed users.

### 2. Backend Setup

Edit `backend/src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/librario
spring.datasource.username=root
spring.datasource.password=YOUR_MYSQL_PASSWORD
```

Then run:
```bash
cd backend
mvn spring-boot:run
```

Backend starts on: `http://localhost:8080`

### 3. Frontend Setup

Open `frontend/index.html` in a browser directly, OR serve with VS Code Live Server (port 5500).

If using Live Server, the CORS config already allows `http://127.0.0.1:5500`.

---

## Default Credentials

| Email                 | Password    | Role   |
|-----------------------|-------------|--------|
| admin@librario.com    | password123 | ADMIN  |
| john@librario.com     | password123 | MEMBER |

---

## API Endpoints

### Auth
```
POST /api/auth/login        - Login, returns JWT token
POST /api/auth/register     - Register new member
```

### Books
```
GET    /api/books           - List all books (ADMIN + MEMBER)
POST   /api/books           - Add a book (ADMIN only)
DELETE /api/books/{id}      - Delete a book (ADMIN only)
```

### Transactions
```
POST /api/transactions/issue     - Issue a book to logged-in user
POST /api/transactions/return    - Return a book
GET  /api/transactions/my        - View my borrowing history
GET  /api/transactions/active    - View all active loans (ADMIN only)
```

### Users (Admin)
```
GET /api/users              - List all users (ADMIN only)
```

---

## RBAC Rules

| Feature             | ADMIN | MEMBER |
|---------------------|-------|--------|
| View all books      | ✅    | ✅     |
| Add book            | ✅    | ❌     |
| Delete book         | ✅    | ❌     |
| Issue book          | ✅    | ✅     |
| Return book         | ✅    | ✅     |
| View own history    | ✅    | ✅     |
| View all loans      | ✅    | ❌     |
| View all users      | ✅    | ❌     |

---

## Fine Calculation Logic

- Borrow period: **14 days**
- Fine rate: **₹5 per overdue day**
- Calculated automatically on return

Example: Returned 3 days late → Fine = ₹15

---

## Example API Usage (curl)

```bash
# Login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@librario.com","password":"password123"}'

# Get all books (use token from login response)
curl http://localhost:8080/api/books \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# Add a book (admin only)
curl -X POST http://localhost:8080/api/books \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{"title":"Clean Code","author":"Robert Martin","availableCopies":2}'

# Issue a book
curl -X POST http://localhost:8080/api/transactions/issue \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{"bookId":1}'

# Return a book
curl -X POST http://localhost:8080/api/transactions/return \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{"bookId":1}'
```
