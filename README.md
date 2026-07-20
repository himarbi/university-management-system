# 🎓 University Management System

A high-performance, full-stack academic administration platform built with **Spring Boot 3** and **React 19 (Vite)**. Standardized exclusively on **PostgreSQL** for data storage, featuring robust Jakarta validation constraints, real-time analytics dashboards, course capacity enforcement, and role-based JWT authentication.

---

## ⚡ Recent Enhancements & Hype Features

- **📊 Real-time System Analytics API**: Instant metrics endpoint (`/api/analytics/summary`) tracking total students, faculty count, course offerings, total enrollments, and overall university seat utilization.
- **🛡️ Strict Field Validation Engine**: Centralized validation powered by Spring Validation (`@Valid`) and a custom `@RestControllerAdvice` Global Exception Handler. Validates email formats, username patterns, password lengths, course codes (`CS-101`), credits, and capacity bounds with field-specific JSON error payloads.
- **🪑 Seat Capacity & Enrollment Limits**: Auto-enforced seat limits (`maxCapacity`) preventing over-enrollment. Displays real-time progress meters per course card.
- **🏷️ Department & Credit Management**: Categorize courses by department (Computer Science, Mathematics, Software Engineering, etc.) and assign course credit values (1-6 Credits).
- **🔎 Dynamic Course Search & Department Filtering**: Live search by course code, title, instructor, or department category.
- **🗄️ Pure PostgreSQL Engine**: Standardized configuration running directly on PostgreSQL.

---

## 🛠️ Required Tools & Tech Stack

### Technology Stack
- **Backend Framework**: Java 21+ / Java 23, Spring Boot 3, Spring Security, Spring Data JPA
- **Frontend Framework**: React 19, Vite 8, Tailwind CSS v4, Lucide Icons, Axios, React Router v7
- **Database Engine**: **PostgreSQL 14+** (Exclusive database)
- **Authentication**: Stateless JSON Web Tokens (JWT) with HS256 encryption

### Prerequisites & Downloads

| Tool | Required Version | Download Link |
| :--- | :--- | :--- |
| **Git** | `v2.x`+ | [git-scm.com](https://git-scm.com/downloads) |
| **Java JDK** | `v21` or `v23` | [Adoptium Temurin OpenJDK](https://adoptium.net/) |
| **Node.js** | `v18.x` or `v20.x`+ | [nodejs.org](https://nodejs.org/) |
| **PostgreSQL** | `v14` or higher | [postgresql.org](https://www.postgresql.org/download/) |
| **IDE** | VS Code / IntelliJ IDEA | [Visual Studio Code](https://code.visualstudio.com/) |

---

## 🔒 Validation Constraints Reference

All client input is validated on the backend before processing:

| DTO / Model | Field | Validation Rules | Description / Example |
| :--- | :--- | :--- | :--- |
| `SignupRequest` | `username` | `@NotBlank`, `@Size(3, 20)`, `@Pattern` | Letters, numbers, dots, hyphens, underscores (e.g. `john_doe`) |
| `SignupRequest` | `email` | `@NotBlank`, `@Size(max=50)`, `@Email` | RFC-compliant email (e.g. `user@university.com`) |
| `SignupRequest` | `password` | `@NotBlank`, `@Size(6, 40)` | Minimum 6 characters required |
| `LoginRequest` | `username` | `@NotBlank`, `@Size(3, 50)` | Registered username |
| `CourseDto` | `courseCode` | `@NotBlank`, `@Size(2, 15)`, `@Pattern` | Uppercase letters, numbers, hyphens (e.g. `CS-101`) |
| `CourseDto` | `name` | `@NotBlank`, `@Size(3, 100)` | Descriptive title |
| `CourseDto` | `credits` | `@NotNull`, `@Min(1)`, `@Max(6)` | Academic credits (1-6) |
| `CourseDto` | `maxCapacity` | `@NotNull`, `@Min(1)`, `@Max(500)` | Maximum allowed enrolled students |
| `CourseDto` | `department` | `@NotBlank`, `@Size(max=100)` | Academic department |

### Validation Error Response Format
When validation fails, the API returns an `HTTP 400 Bad Request` JSON object:

```json
{
  "timestamp": "2026-07-20T20:15:00",
  "status": 400,
  "error": "Validation Failed",
  "errors": {
    "email": "Email must be a valid email address (e.g. user@domain.com)",
    "courseCode": "Course code must consist of uppercase letters, numbers, or hyphens (e.g., CS-101)"
  }
}
```

---

## 📁 Project Directory Layout

```text
university-management-system/
├── backend/
│   ├── src/main/java/com/university/management/
│   │   ├── controller/
│   │   │   ├── AnalyticsController.java  # GET /api/analytics/summary
│   │   │   ├── AuthController.java       # Login & Registration endpoints
│   │   │   ├── CourseController.java     # Course CRUD, Search & Enrollment
│   │   │   └── UserController.java       # User Directory & Role Assignment
│   │   ├── dto/
│   │   │   ├── AnalyticsDto.java         # Dashboard metrics transfer object
│   │   │   ├── CourseDto.java            # Validated Course DTO
│   │   │   ├── JwtResponse.java          # Auth token response
│   │   │   ├── LoginRequest.java         # Validated Login DTO
│   │   │   ├── SignupRequest.java        # Validated Registration DTO
│   │   │   └── UserDto.java              # User summary DTO
│   │   ├── model/
│   │   │   ├── Course.java               # JPA Entity (credits, capacity, dept)
│   │   │   ├── Role.java                 # Enum (ADMIN, TEACHER, STUDENT)
│   │   │   └── User.java                 # JPA Entity (username, email, pass)
│   │   ├── repository/
│   │   │   ├── CourseRepository.java
│   │   │   └── UserRepository.java
│   │   └── security/
│   │       ├── GlobalExceptionHandler.java # Validation Exception Interceptor
│   │       ├── JwtAuthenticationFilter.java
│   │       ├── JwtUtils.java
│   │       └── WebSecurityConfig.java
│   └── src/main/resources/
│       └── application.properties        # Pure PostgreSQL database configuration
├── frontend/
│   ├── src/
│   │   ├── components/                   # Navbar & Dashboard Layout
│   │   ├── context/                      # AuthContext token management
│   │   ├── pages/                        # Dashboard, CourseCatalog, UserManagement, Login
│   │   └── services/                     # Axios API endpoints module
│   ├── package.json
│   └── vite.config.js
└── README.md
```

---

## 🗄️ Database Setup (PostgreSQL)

This application uses **PostgreSQL** exclusively.

1. **Start PostgreSQL**: Ensure your PostgreSQL server is running on port `5432`.
2. **Create Database**:
   ```sql
   CREATE DATABASE university_db;
   ```
3. **Configure Database Credentials**:  
   Update [`backend/src/main/resources/application.properties`](backend/src/main/resources/application.properties) if your username or password differs:
   ```properties
   spring.datasource.url=jdbc:postgresql://localhost:5432/university_db
   spring.datasource.username=postgres
   spring.datasource.password=YOUR_POSTGRES_PASSWORD
   spring.datasource.driver-class-name=org.postgresql.Driver
   spring.jpa.hibernate.ddl-auto=update
   ```

---

## 🚀 Step-by-Step Running Guide

### 1️⃣ Clone Repository
```bash
git clone https://github.com/himarbi/university-management-system.git
cd university-management-system
```

### 2️⃣ Run Spring Boot Backend
```bash
cd backend
./mvnw spring-boot:run
```
> The server starts on **`http://localhost:8080`**.  
> *Initial data (Admin, Faculty, Students, Sample Courses) seeds automatically if the database is empty.*

### 3️⃣ Run Vite + React Frontend
In a new terminal:
```bash
cd frontend
npm install
npm run dev
```
> Access the web application at **`http://localhost:5173`**.

---

## 🔑 Initial Pre-Seeded Accounts

| Username | Password | Role | Access Level |
| :--- | :--- | :--- | :--- |
| `admin` | `admin123` | `ROLE_ADMIN` | Full System Management, User Roles & Course Creation |
| `john_doe` | `teacher123` | `ROLE_TEACHER` | Manage Assigned Class Syllabi & View Roster |
| `alice_jones` | `student123` | `ROLE_STUDENT` | Course Catalog Browsing & Self-Enrollment |

---

## 📡 Complete REST API Documentation

### 🔑 Authentication
- `POST /api/auth/register` - Register a new user (Validates username, email, password format)
- `POST /api/auth/login` - Authenticate and return JWT token

### 📊 Analytics
- `GET /api/analytics/summary` - System-wide statistics (Total Users, Enrollments, Capacity Rates)

### 📚 Courses
- `GET /api/courses` - Fetch courses (supports query params `?search=...&department=...`)
- `GET /api/courses/my-courses` - Fetch current user's enrolled or taught courses
- `GET /api/courses/{id}` - Fetch single course details
- `POST /api/courses` - Create new course (Admin only, validates capacity & credits)
- `PUT /api/courses/{id}` - Update course details (Admin / Assigned Teacher)
- `DELETE /api/courses/{id}` - Remove course (Admin only)
- `POST /api/courses/{id}/enroll` - Enroll in course (Auto-enforces capacity limit)
- `POST /api/courses/{id}/unenroll` - Drop enrolled course

### 👥 Users
- `GET /api/users` - Fetch user directory (Admin only)
- `GET /api/users/teachers` - List faculty instructors

---

## 🔮 Future Roadmap Features

- [ ] **GPA & Gradebook Module**: Faculty can enter letter grades; students view cumulative GPA.
- [ ] **Assignment & Submission Portal**: File uploads for student homework and automated deadline tracking.
- [ ] **Real-Time Notification Center**: Push notifications for enrollment confirmations and syllabus updates.
- [ ] **Transcript Export**: One-click PDF transcript download for students.
- [ ] **Google OAuth2 SSO**: Single Sign-On integration for university email domains.

---

## 🤝 Contributing Guidelines

1. **Fork the Repo**: Click **Fork** on [GitHub](https://github.com/himarbi/university-management-system).
2. **Branch Naming**:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Commit Messages**: Use clean commit conventions (`feat: ...`, `fix: ...`, `docs: ...`).
4. **Push & PR**: Push to your fork and submit a Pull Request to `main`.

---

## 📜 License & Author

- **Author**: [Ibrahim A. Ahmed (himarbi)](https://github.com/himarbi)
- **Repository**: [https://github.com/himarbi/university-management-system](https://github.com/himarbi/university-management-system)
