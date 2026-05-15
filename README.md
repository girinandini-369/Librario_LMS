# 📚 Librario – Library Management System

A full-stack Library Management System with **Role-Based Access Control (RBAC)**, built using Java Spring Boot and React.

---

## 🚀 Overview

Librario is a minimal yet complete LMS that allows admins to manage books and members to borrow and return them — all secured with JWT-based authentication.

---

## 🧰 Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Java Spring Boot |
| Database | MySQL |
| Authentication | Spring Security + JWT |
| Frontend | React, Bootstrap |

---

## 📁 Project Structure

```
Librario_LMS/
├── backend/
│   ├── src/
│   │   └── main/
│   │       ├── java/         # Spring Boot application
│   │       └── resources/
│   │           └── application.properties
│   └── schema.sql            # DB setup script
├── frontend/
│   ├── src/                  # React components
│   ├── package.json
│   └── vite.config.js
├── railway.json              # Railway deployment config
├── render.yaml               # Render deployment config
└── README.md
```

---

## ⚙️ Setup Instructions

### 1. 🗄️ Database Setup

Open MySQL and run the setup script:

```sql
source backend/schema.sql;
```

This creates the `librario_db` database and inserts two default users:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@librario.com | password123 |
| Member | john@member.com | password123 |

---

### 2. 🖥️ Backend Setup

```bash
cd backend
```

Update `src/main/resources/application.properties` with your MySQL credentials:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/librario_db
spring.datasource.username=YOUR_USERNAME
spring.datasource.password=YOUR_PASSWORD
```

Run the application:

```bash
mvn spring-boot:run
```

The backend will start at `http://localhost:8080`.

---

### 3. 🌐 Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend will start at `http://localhost:5173`.

---

## 🔐 Roles & Permissions

| Permission | Admin | Member |
|-----------|-------|--------|
| View books | ✅ | ✅ |
| Add books | ✅ | ❌ |
| Delete books | ✅ | ❌ |
| Issue a book | ❌ | ✅ |
| Return a book | ❌ | ✅ |

---

## 🔌 API Endpoints

### Auth

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| `POST` | `/api/auth/login` | Authenticate and receive JWT | Public |
| `POST` | `/api/auth/register` | Register with role selection | Public |

### Books

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| `GET` | `/api/books` | Get all books | All roles |
| `POST` | `/api/books` | Add a new book | Admin only |
| `DELETE` | `/api/books/{id}` | Delete a book | Admin only |

### Transactions

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| `POST` | `/api/transactions/issue` | Issue a book to logged-in member | Member |
| `POST` | `/api/transactions/return` | Return a book & calculate fine | Member |

---


## ⚠️ Limitations

- No persistent fine history beyond current session
- Single-library instance (no multi-branch support)
- No book search or filter functionality yet

---

## 🔮 Future Improvements

- [ ] Book search and filter by genre/author
- [ ] Fine history and payment tracking
- [ ] Email notifications for due dates
- [ ] Member dashboard with borrowing history
- [ ] Pagination for large book catalogs
- [ ] Admin analytics (most issued books, active members)

---

## 🤝 Contributing

Pull requests are welcome! Please open an issue first for major changes.

---

