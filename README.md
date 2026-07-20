# 🎓 University Management System

A high-performance, full-stack academic administration platform built with **Spring Boot 3** and **React 19 (Vite)**. Standardized exclusively on **PostgreSQL** for data storage, featuring real-time GPA calculations, faculty grading portals, student academic transcripts, campus announcement broadcasts, robust Jakarta validations, and role-based JWT authentication.

---

## 🌟 Specialized Role Portals & Real University Features

### 🎓 Student Portal (`ROLE_STUDENT`)
- **📜 Official Academic Transcript (`/transcript`)**: Comprehensive view of completed and active courses, letter grades (`A` through `F`), numerical score percentages, earned credit totals, and instructor feedback remarks.
- **📊 Real-time Cumulative GPA Engine**: Automated calculation of Grade Point Average on a standard `0.0` – `4.0` scale based on course credit weightings.
- **🎒 Course Catalog & Self-Enrollment (`/courses`)**: Instant course registration with real-time seat availability tracking.

### 👩‍🏫 Faculty / Teacher Portal (`ROLE_TEACHER`)
- **📝 Class Roster & Grading Portal (`/grading`)**: Select any assigned course to view enrolled students, assign or update numerical scores (0–100%), select letter grades, and add custom feedback remarks.
- **📖 Syllabus & Course Management**: Update course outlines, titles, and department descriptions for taught classes.

### 📢 Admin Portal (`ROLE_ADMIN`)
- **📣 Campus Announcement Broadcast Engine (`/announcements`)**: Publish university-wide announcements targeted to all users, students, or faculty.
- **📈 Real-time System Analytics Dashboard (`/`)**: Comprehensive overview tracking user counts, total courses, system seat capacities, and enrollment utilization rates.
- **👥 Full User Directory & Access Control (`/users`)**: Manage user accounts and assign system roles (`ADMIN`, `TEACHER`, `STUDENT`).

---

## 🛠️ Required Tools & Tech Stack

- **Backend Framework**: Java 21+ / Java 23, Spring Boot 3, Spring Security, Spring Data JPA
- **Frontend Framework**: React 19, Vite 8, Tailwind CSS v4, Lucide Icons, Axios, React Router v7
- **Database Engine**: **PostgreSQL 14+** (Exclusive database)
- **Authentication**: Stateless JSON Web Tokens (JWT) with HS256 encryption

| Tool | Required Version | Download Link |
| :--- | :--- | :--- |
| **Git** | `v2.x`+ | [git-scm.com](https://git-scm.com/downloads) |
| **Java JDK** | `v21` or `v23` | [Adoptium Temurin OpenJDK](https://adoptium.net/) |
| **Node.js** | `v18.x` or `v20.x`+ | [nodejs.org](https://nodejs.org/) |
| **PostgreSQL** | `v14` or higher | [postgresql.org](https://www.postgresql.org/download/) |

---

## 📁 Project Directory Layout

```text
university-management-system/
├── backend/
│   ├── src/main/java/com/university/management/
│   │   ├── controller/
│   │   │   ├── AnalyticsController.java     # GET /api/analytics/summary
│   │   │   ├── AnnouncementController.java  # Campus announcement broadcasts
│   │   │   ├── AuthController.java          # Authentication & Registration
│   │   │   ├── CourseController.java        # Course CRUD & Enrollment
│   │   │   ├── GradeController.java         # Transcript & Grading Portal
│   │   │   └── UserController.java          # User Directory
│   │   ├── dto/
│   │   │   ├── AnalyticsDto.java
│   │   │   ├── AnnouncementDto.java
│   │   │   ├── CourseDto.java
│   │   │   ├── GradeDto.java / GradeSubmissionDto.java
│   │   │   ├── SignupRequest.java / LoginRequest.java
│   │   │   └── TranscriptDto.java
│   │   ├── model/
│   │   │   ├── Announcement.java            # Announcement entity
│   │   │   ├── Course.java                  # Course entity (credits, capacity, dept)
│   │   │   ├── Grade.java                   # Grade & GPA entity
│   │   │   ├── Role.java                    # Enum (ADMIN, TEACHER, STUDENT)
│   │   │   └── User.java                    # User entity
│   │   ├── repository/
│   │   │   ├── AnnouncementRepository.java
│   │   │   ├── CourseRepository.java
│   │   │   ├── GradeRepository.java
│   │   │   └── UserRepository.java
│   │   └── security/
│   │       ├── GlobalExceptionHandler.java    # Centralized JSON Exception Interceptor
│   │       └── WebSecurityConfig.java
│   └── src/main/resources/
│       └── application.properties           # PostgreSQL configuration
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AnnouncementsWidget.jsx      # Broadcast Feed & Admin Creator
│   │   │   ├── DashboardLayout.jsx          # Role-based Navigation Sidebar
│   │   │   └── PrivateRoute.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── pages/
│   │   │   ├── CourseCatalog.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── StudentTranscript.jsx        # Academic Transcript & GPA Card
│   │   │   ├── TeacherGradingPortal.jsx     # Roster & Grade Submission
│   │   │   └── UserManagement.jsx
│   │   └── services/
│   │       └── api.js                       # Axios endpoints
│   ├── package.json
│   └── vite.config.js
└── README.md
```

---

## 🚀 Quick Setup & Execution

### 1️⃣ Clone & Configure PostgreSQL Database
```sql
CREATE DATABASE university_db;
```

### 2️⃣ Run Spring Boot Backend
```bash
cd backend
./mvnw spring-boot:run
```
> Server starts on **`http://localhost:8080`**. Data seeds automatically on first run.

### 3️⃣ Run Vite + React Frontend
```bash
cd frontend
npm install
npm run dev
```
> Access web portal at **`http://localhost:5173`**.

---

## 🔑 Pre-Seeded Test Credentials

| Username | Password | Role | Access Rights |
| :--- | :--- | :--- | :--- |
| `admin` | `admin123` | `ROLE_ADMIN` | Full System Oversight, User Management, Announcements & Analytics |
| `john_doe` | `teacher123` | `ROLE_TEACHER` | Faculty Grading Portal (`/grading`), Class Roster & Syllabus Outlines |
| `alice_jones` | `student123` | `ROLE_STUDENT` | Official Transcript (`/transcript`), GPA Engine & Course Enrollment |

---

## 📡 REST API Summary

### 🔑 Auth & Analytics
- `POST /api/auth/login` | `POST /api/auth/register`
- `GET /api/analytics/summary`

### 🎓 Grades & Transcripts
- `GET /api/grades/transcript` - Student transcript and cumulative GPA
- `GET /api/grades/course/{courseId}` - Faculty view of class roster grades
- `POST /api/grades/submit` - Faculty submission of numerical score & letter grade

### 📣 Announcements
- `GET /api/announcements` - Fetch active announcements
- `POST /api/announcements` - Admin broadcast creation
- `DELETE /api/announcements/{id}` - Remove announcement

### 📚 Courses & Users
- `GET /api/courses` | `POST /api/courses` | `POST /api/courses/{id}/enroll`
- `GET /api/users` | `GET /api/users/teachers`

---

## 🤝 Contributing Guidelines

1. **Fork the Repo**: Click **Fork** on [GitHub](https://github.com/himarbi/university-management-system).
2. **Branch**: `git checkout -b feature/your-feature-name`
3. **Commit**: `git commit -m "feat: your feature"`
4. **Push**: `git push origin feature/your-feature-name` and open a Pull Request.

---

## 📜 License & Author

- **Author**: [Ibrahim A. Ahmed (himarbi)](https://github.com/himarbi)
- **Repository**: [https://github.com/himarbi/university-management-system](https://github.com/himarbi/university-management-system)
