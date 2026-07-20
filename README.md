# 🎓 University Management System

A modern full-stack web application for managing university courses, users, and roles. Built with **Spring Boot** on the backend and **React (Vite)** on the frontend, featuring secure JWT-based authentication and role-based access control.

---

## 🚀 Key Features

- **🔐 User Authentication & Authorization**: Secure signup, login, and JWT token-based authorization.
- **👥 Role-Based Access Control (RBAC)**: Support for `ADMIN`, `FACULTY`, and `STUDENT` roles with granular access controls.
- **📚 Course Management**: Create, view, update, and manage university courses.
- **👤 User Management**: Admin dashboard to manage users, assign roles, and inspect profiles.
- **💾 Dual Database Support**: Lightweight **H2 In-Memory Database** for instant local development, plus **PostgreSQL** support for production readiness.
- **🎨 Modern UI/UX**: Dynamic responsive dashboard built with React 19, Tailwind CSS v4, and Lucide icons.

---

## 🛠️ Prerequisites & Required Tools

Before getting started, ensure you have the following installed on your machine:

| Tool | Recommended Version | Download / Installation Link |
| :--- | :--- | :--- |
| **Git** | `v2.x` or higher | [git-scm.com](https://git-scm.com/downloads) |
| **Java JDK** | `v21` or `v23` | [OpenJDK Download](https://adoptium.net/) or [Oracle JDK](https://www.oracle.com/java/technologies/downloads/) |
| **Node.js** | `v18.x` or `v20.x`+ | [nodejs.org](https://nodejs.org/) |
| **npm** | `v9.x`+ (bundled with Node) | Included with Node.js |
| **PostgreSQL** *(Optional)* | `v14` or higher | [postgresql.org](https://www.postgresql.org/download/) (Required only if running with full DB) |
| **IDE** | VS Code / IntelliJ IDEA | [VS Code](https://code.visualstudio.com/) or [IntelliJ IDEA](https://www.jetbrains.com/idea/) |

---

## 📁 Project Structure

```text
university-management-system/
│
├── 📂 backend/                     # Spring Boot Java Backend
│   ├── 📂 src/
│   │   ├── 📂 main/java/com/university/management/
│   │   │   ├── 📂 controller/      # REST Endpoints (Auth, User, Course)
│   │   │   ├── 📂 dto/             # Data Transfer Objects
│   │   │   ├── 📂 model/           # JPA Entities (User, Role, Course)
│   │   │   ├── 📂 repository/      # Spring Data Repositories
│   │   │   └── 📂 security/        # Spring Security & JWT Filter Setup
│   │   └── 📂 main/resources/
│   │       ├── application.properties    # PostgreSQL configuration
│   │       └── application-h2.properties # H2 memory database configuration
│   ├── mvnw / mvnw.cmd             # Maven Wrapper scripts
│   └── pom.xml                     # Maven project dependencies
│
├── 📂 frontend/                    # Vite + React Frontend
│   ├── 📂 src/
│   │   ├── 📂 components/          # Reusable UI components & layouts
│   │   ├── 📂 context/             # Authentication state context
│   │   ├── 📂 pages/               # Dashboard, Login, UserManagement, CourseCatalog
│   │   └── 📂 services/            # Axios API instance & endpoints
│   ├── package.json                # Frontend dependencies & npm scripts
│   └── vite.config.js              # Vite configuration & dev proxy
│
└── README.md                       # Project Documentation
```

---

## 💻 Quick Start & Setup Guide

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/himarbi/university-management-system.git
cd university-management-system
```

---

### 2️⃣ Run the Backend (Spring Boot)

You can launch the backend using either the lightweight **H2 In-Memory Database** (no setup required) or **PostgreSQL**.

#### Option A: Run with H2 In-Memory DB (Recommended for quick testing)

**On Windows (PowerShell):**
```powershell
cd backend
$env:SPRING_PROFILES_ACTIVE="h2"; .\mvnw spring-boot:run
```

**On Linux / macOS (Bash):**
```bash
cd backend
SPRING_PROFILES_ACTIVE=h2 ./mvnw spring-boot:run
```

> **H2 Console Access**: Once started, navigate to [http://localhost:8080/h2-console](http://localhost:8080/h2-console)  
> - **JDBC URL**: `jdbc:h2:mem:university_db`  
> - **Username**: `sa`  
> - **Password**: *(leave blank)*

#### Option B: Run with PostgreSQL

1. Ensure PostgreSQL is running locally on port `5432` with database `university_db`.
2. Update database credentials in [`backend/src/main/resources/application.properties`](backend/src/main/resources/application.properties).
3. Run:
```bash
cd backend
./mvnw spring-boot:run
```

---

### 3️⃣ Run the Frontend (React + Vite)

Open a new terminal window:

```bash
cd frontend
npm install
npm run dev
```

The application will be accessible at:  
👉 **[http://localhost:5173](http://localhost:5173)**

---

## 🔑 Default Initial Credentials

When started for the first time, initial seed data is generated automatically:

| Username | Password | Default Role |
| :--- | :--- | :--- |
| `admin` | `admin123` | `ROLE_ADMIN` |

---

## 🔌 API Endpoints Summary

### Authentication (`/api/auth`)
- `POST /api/auth/signup` - Register a new user account
- `POST /api/auth/login` - Authenticate user and receive JWT token

### Users (`/api/users`)
- `GET /api/users` - List all registered users (Admin only)
- `GET /api/users/{id}` - Fetch single user details

### Courses (`/api/courses`)
- `GET /api/courses` - Fetch available course catalog
- `POST /api/courses` - Create a new course (Admin/Faculty)
- `DELETE /api/courses/{id}` - Remove a course

---

## 🤝 Contribution Guidelines

We welcome contributions from everyone! Follow these steps to submit your changes:

1. **Fork the Repository**: Click the "Fork" button at the top right of this GitHub page.
2. **Create a Feature Branch**:
   ```bash
   git checkout -b feature/amazing-new-feature
   ```
3. **Make Your Changes**: Ensure code formatting is clean and tests pass.
4. **Commit Your Changes**:
   ```bash
   git commit -m "feat: Add amazing new feature"
   ```
5. **Push to Your Branch**:
   ```bash
   git push origin feature/amazing-new-feature
   ```
6. **Open a Pull Request**: Go to the original repository and click **New Pull Request**.

---

## 📜 License & Author

- **Author / Maintainer**: [Ibrahim A. Ahmed (himarbi)](https://github.com/himarbi)
- **Project Repository**: [university-management-system](https://github.com/himarbi/university-management-system)
