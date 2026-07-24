# 🎓 University Management System

A high-performance, full-stack academic administration platform built with **Spring Boot 3** and **React 19 (Vite)**. Standardized exclusively on **PostgreSQL** for data storage, featuring dedicated pages for Attendance Tracking, Tuition & Fee Statements, GPA Transcripts, Faculty Grading Portals, Announcement Broadcasts, and Sidebar-only Navigation Architecture.

---

## 🌟 Key Architecture & Dedicated Role Modules

Every feature in the application resides on its own dedicated page accessed exclusively via the **Sidebar Navigation**:

### 📅 Attendance Tracking Module (`/attendance`)
* **Student View**: Track course attendance rates (% Present), total session logs, and present/absent dates.
* **Teacher View**: Daily attendance sheet recorder for taught classes with statuses like *Present*, *Absent*, *Late*, and *Excused*.

### 💳 Tuition & Fee Management Module (`/fees`)
* **Student View**: View itemized fee breakdowns (Tuition per credit, Lab fees, Registration fees), balance due, status badges (`PAID`, `PENDING`, `PENDING_VERIFICATION`, `OVERDUE`), and simulated payment submissions.
* **Admin View**: Generate student billing statements, view fee collections, and approve or reject pending tuition payments.

### 🎓 Student Transcript & GPA Engine (`/transcript`)
* **Academic Transcript**: Official record of completed/enrolled courses, credits earned, letter grades (`A`–`F`), numerical scores, and instructor feedback.
* **GPA Engine**: Cumulative Grade Point Average calculation (0.0 to 4.0 scale) and **Academic Honors designation** (*Summa Cum Laude*, *Magna Cum Laude*, *Good Standing*, *Academic Warning*).
* **Printable Transcript**: Official printable transcript layout complete with registrar header and date.

### 👩‍🏫 Faculty Grading Portal (`/grading`)
* **Class Performance Analytics**: Real-time stats (Class average score %, pass rate %, highest score).
* **Bulk Roster Grading**: Update multiple student grades in the roster simultaneously with quick score shortcuts.

### 📢 Campus Broadcast System (`/announcements`)
* **Priority Pinning**: Urgent and high-priority announcements highlighted with priority banners.
* **Category Filtering**: Filter alerts by `EXAMS`, `ACADEMIC`, `EMERGENCY`, `CAMPUS_LIFE`, or `GENERAL`.
* **Audience Filtering**: Broadcasts targeted to specific audiences (`ALL`, `STUDENTS`, `TEACHERS`).

### 👥 User Directory Management (`/users`)
* **Administrative Operations**: Admins can search, view, create, edit, and delete user profiles (Admins, Teachers, and Students).
* **Cascading Cleanses**: Deletes cascade cleanly across the database transactionally:
  * Teachers: set `teacher = null` for all taught courses.
  * Students: unenroll them from all courses and delete all related attendances, grades, and billing statements.
  * Announcements: set `author = null` for announcements authored by the deleted user.

---

## 🛠️ Required Tools & Tech Stack

* **Backend Framework**: Java 21+ / Java 23, Spring Boot 3, Spring Security, Spring Data JPA
* **Frontend Framework**: React 19, Vite 8, Tailwind CSS v4, Lucide Icons, Axios, React Router v7
* **Database Engine**: **PostgreSQL 14+** (Exclusive database)
* **Authentication**: Stateless JSON Web Tokens (JWT) with HS256 encryption

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
│   │   │   ├── AnnouncementController.java  # Campus announcements
│   │   │   ├── AttendanceController.java    # Attendance tracking endpoints
│   │   │   ├── AuthController.java          # Authentication
│   │   │   ├── CourseController.java        # Course CRUD & enrollment
│   │   │   ├── FeeController.java           # Tuition & fee management
│   │   │   ├── GradeController.java         # Transcript & bulk grading
│   │   │   └── UserController.java          # User directory
│   │   ├── dto/
│   │   │   ├── AnalyticsDto.java / AnnouncementDto.java
│   │   │   ├── AttendanceDto.java / AttendanceSubmissionDto.java
│   │   │   ├── CourseDto.java / ClassStatsDto.java
│   │   │   ├── FeeStatementDto.java / PaymentSubmissionDto.java
│   │   │   └── GradeDto.java / TranscriptDto.java
│   │   ├── model/
│   │   │   ├── Attendance.java              # Attendance entity
│   │   │   ├── FeeStatement.java            # Tuition fee entity
│   │   │   ├── Announcement.java / Course.java / Grade.java / User.java
│   │   └── repository/
│   │       ├── AttendanceRepository.java / FeeStatementRepository.java
│   │       └── AnnouncementRepository.java / CourseRepository.java / GradeRepository.java / UserRepository.java
│   └── src/main/resources/
│       └── application.properties           # PostgreSQL configuration
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AnnouncementsWidget.jsx      # Broadcast feed
│   │   │   ├── ConfirmDialog.jsx            # Delete Confirmation popup
│   │   │   └── DashboardLayout.jsx          # Collapsible Sidebar Navigation
│   │   ├── pages/
│   │   │   ├── AttendanceManager.jsx        # Dedicated Attendance Page
│   │   │   ├── CourseCatalog.jsx            # Course Catalog Page
│   │   │   ├── Dashboard.jsx                # Clean Overview Page
│   │   │   ├── FeeManager.jsx               # Dedicated Tuition & Fees Page
│   │   │   ├── StudentTranscript.jsx        # Academic Transcript & GPA Page
│   │   │   ├── TeacherGradingPortal.jsx     # Faculty Roster & Grading Page
│   │   │   └── UserManagement.jsx           # User Management Page
│   │   └── services/
│   │       └── api.js                       # Axios API endpoints module
│   ├── package.json
│   └── vite.config.js
├── IMPLEMENTATION.md                        # Roadmap and improvement goals
└── README.md                                # Project documentation
```

---

## 🚀 Quick Setup & Execution

### 1️⃣ Configure PostgreSQL Database
Log in to your PostgreSQL CLI or GUI (PgAdmin/DBeaver) and create the system database:
```sql
CREATE DATABASE university_db;
```

Update `backend/src/main/resources/application.properties` with your PostgreSQL username and password:
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/university_db
spring.datasource.username=your_username
spring.datasource.password=your_password
```

### 2️⃣ Run Spring Boot Backend
```bash
cd backend
.\mvnw.cmd spring-boot:run
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

## 🔑 Pre-Seeded Somali Demo User Handles

### 👑 System Administrators (`password: admin123`)
| Username | Email | Role | Access Rights |
| :--- | :--- | :--- | :--- |
| `admin` | `abdirahman@odros.edu.so` | `ROLE_ADMIN` | System Analytics, Billing Generation, User Directory, Announcements, Course Admin |
| `khadra_gure` | `khadra.gure@odros.edu.so` | `ROLE_ADMIN` | Full System Oversight & Course Management |

### 👩‍🏫 Faculty Professors (`password: teacher123`)
| Username | Email | Department | Taught Courses |
| :--- | :--- | :--- | :--- |
| `ibrahim_ahmed` | `ibrahim.ahmed@odros.edu.so` | Computer Science | `CS-101` (Intro to CS), `CS-402` (Distributed Systems) |
| `fatima_jama` | `fatima.jama@odros.edu.so` | Mathematics | `MATH-201` (Calculus II) |
| `mohamed_hassan` | `mohamed.hassan@odros.edu.so` | Software Engineering | `SWE-310` (Software Architecture) |
| `amina_yusuf` | `amina.yusuf@odros.edu.so` | Electrical Engineering | `EE-220` (Circuit Analysis) |
| `hassan_abdi` | `hassan.abdi@odros.edu.so` | Business Administration | `BUS-110` (Principles of Management) |

### 🎓 Students (`password: student123`)
| Username | Email | Academic Standing | Enrolled Courses |
| :--- | :--- | :--- | :--- |
| `hamda_farah` | `hamda.farah@odros.edu.so` | **Summa Cum Laude (GPA 3.90)** | `CS-101`, `MATH-201`, `SWE-310`, `CS-402` |
| `bilal_warsame` | `bilal.warsame@odros.edu.so` | Good Standing (GPA 3.15) | `CS-101`, `MATH-201`, `EE-220`, `BUS-110` |
| `zakaria_aden` | `zakaria.aden@odros.edu.so` | Magna Cum Laude (GPA 3.70) | `CS-101`, `SWE-310`, `CS-402` |
| `hawa_dahir` | `hawa.dahir@odros.edu.so` | High Honors (GPA 4.00) | `MATH-201`, `SWE-310`, `EE-220` |
| `mustafa_shire` | `mustafa.shire@odros.edu.so` | Sophomore Student | `CS-101`, `EE-220`, `BUS-110` |
| `nimo_osman` | `nimo.osman@odros.edu.so` | Senior Student | `MATH-201`, `SWE-310`, `CS-402`, `BUS-110` |

---

## 📡 REST API Summary

### 📅 Attendance API
* `GET /api/attendance/my-attendance` - Fetch student attendance log
* `GET /api/attendance/course/{courseId}` - Fetch course attendance log
* `POST /api/attendance/record` - Record or update daily attendance (Teacher only)

### 💳 Fee & Payment API
* `GET /api/fees/my-statement` - Fetch student tuition balance & payment history
* `GET /api/fees/all` - Fetch all billing statements (Admin only)
* `POST /api/fees/pay` - Submit tuition payment (Student; changes status to `PENDING_VERIFICATION`)
* `POST /api/fees/generate` - Generate student billing statement (Admin only)
* `POST /api/fees/{id}/verify` - Approve/Reject tuition payment (Admin only)

### 📚 Course API
* `GET /api/courses` - Fetch courses (filtered by department for students, taught for teachers, all for admins)
* `GET /api/courses/{id}` - Fetch details of a course (with role checks)
* `POST /api/courses` - Create a course (Admin only)
* `PUT /api/courses/{id}` - Edit course details (Admin only)
* `DELETE /api/courses/{id}` - Delete course + clean cascade (Admin only)
* `POST /api/courses/{id}/enroll` - Enroll a student (Admin only)
* `POST /api/courses/{id}/unenroll` - Unenroll a student (Admin only)

### 👥 User Directory API
* `GET /api/users` - Fetch user directory
* `POST /api/users` - Create user profile (Admin only)
* `PUT /api/users/{id}` - Edit user profile (Admin only)
* `DELETE /api/users/{id}` - Delete user + clean cascade (Admin only)

### 🎓 Grades & Announcements API
* `GET /api/grades/transcript` - Retrieve student transcript with GPA engine calculations
* `POST /api/grades/submit-bulk` - Submit grades in bulk for a class (Teacher only)
* `GET /api/announcements` - Retrieve priority-sorted announcements filtered by user audience
* `POST /api/announcements` - Post a new campus announcement
* `DELETE /api/announcements/{id}` - Delete an announcement (Admin only)

---

## 📜 License & Author

* **Author**: [Ibrahim A. Ahmed (himarbi)](https://github.com/himarbi)
* **Repository**: [https://github.com/himarbi/university-management-system](https://github.com/himarbi/university-management-system)
