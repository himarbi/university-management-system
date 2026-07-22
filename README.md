# 🎓 University Management System

A high-performance, full-stack academic administration platform built with **Spring Boot 3** and **React 19 (Vite)**. Standardized exclusively on **PostgreSQL** for data storage, featuring dedicated pages for Attendance Tracking, Tuition & Fee Statements, GPA Transcripts, Faculty Grading Portals, Announcement Broadcasts, and Sidebar-only Navigation Architecture.

---

## 🌟 Architecture & Dedicated Role Modules

Every feature in the application resides on its own dedicated page accessed exclusively via the **Sidebar Navigation**:

### 📅 Attendance Tracking Module (`/attendance`)
- **Student View**: Track course attendance rates (% Present), total session logs, and present/absent dates.
- **Teacher View**: Daily attendance sheet recorder for taught classes (*Present*, *Absent*, *Late*, *Excused*).

### 💳 Tuition & Fee Management Module (`/fees`)
- **Student View**: Itemized fee breakdown (Tuition per credit, Lab fees, Registration fees), balance due, status badges (`PAID`, `PENDING`, `OVERDUE`), and online payment submission.
- **Admin View**: Generate student billing statements and monitor university fee collections.

### 🎓 Student Transcript & GPA Engine (`/transcript`)
- **Academic Transcript**: Official record of completed/enrolled courses, credits earned, letter grades (`A`–`F`), numerical scores, and instructor feedback.
- **GPA Engine**: Cumulative Grade Point Average calculation (0.0 to 4.0 scale) and **Academic Honors designation** (*Summa Cum Laude*, *Magna Cum Laude*, *Good Standing*, *Academic Warning*).
- **Printable Transcript**: Official printable transcript layout complete with registrar header and date.

### 👩‍🏫 Faculty Grading Portal (`/grading`)
- **Class Performance Analytics**: Real-time stats (Class average score %, pass rate %, highest score).
- **Bulk Roster Grading**: Update multiple student grades in the roster simultaneously with quick score shortcuts.

### 📢 Campus Broadcast System (`/announcements`)
- **Priority Pinning**: Urgent and high-priority announcements highlighted with priority banners.
- **Category Filtering**: Filter alerts by `EXAMS`, `ACADEMIC`, `EMERGENCY`, `CAMPUS_LIFE`, or `GENERAL`.

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
│   │   │   └── DashboardLayout.jsx          # Dedicated Sidebar Navigation (Collapsible)
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

## 🔑 Pre-Seeded Somali Demo User Handles

### 👑 System Administrators (`password: admin123`)
| Username | Email | Role | Access Rights |
| :--- | :--- | :--- | :--- |
| `admin` | `abdirahman@university.edu.so` | `ROLE_ADMIN` | System Analytics, Billing Generation, User Directory & Announcements |
| `khadra_gure` | `khadra.gure@university.edu.so` | `ROLE_ADMIN` | Full System Oversight & Course Management |

### 👩‍🏫 Faculty Professors (`password: teacher123`)
| Username | Email | Department | Taught Courses |
| :--- | :--- | :--- | :--- |
| `ibrahim_ahmed` | `ibrahim.ahmed@university.edu.so` | Computer Science | `CS-101`, `CS-402` |
| `fatima_jama` | `fatima.jama@university.edu.so` | Mathematics | `MATH-201` |
| `mohamed_hassan` | `mohamed.hassan@university.edu.so` | Software Engineering | `SWE-310` |
| `amina_yusuf` | `amina.yusuf@university.edu.so` | Electrical Engineering | `EE-220` |
| `hassan_abdi` | `hassan.abdi@university.edu.so` | Business Administration | `BUS-110` |

### 🎓 Students (`password: student123`)
| Username | Email | Academic Standing | Enrolled Courses |
| :--- | :--- | :--- | :--- |
| `hamda_farah` | `hamda.farah@university.edu.so` | **Summa Cum Laude (GPA 3.90)** | `CS-101`, `MATH-201`, `SWE-310`, `CS-402` |
| `bilal_warsame` | `bilal.warsame@university.edu.so` | Good Standing (GPA 3.15) | `CS-101`, `MATH-201`, `EE-220`, `BUS-110` |
| `zakaria_aden` | `zakaria.aden@university.edu.so` | Magna Cum Laude (GPA 3.70) | `CS-101`, `SWE-310`, `CS-402` |
| `hawa_dahir` | `hawa.dahir@university.edu.so` | High Honors (GPA 4.00) | `MATH-201`, `SWE-310`, `EE-220` |
| `mustafa_shire` | `mustafa.shire@university.edu.so` | Sophomore Student | `CS-101`, `EE-220`, `BUS-110` |
| `nimo_osman` | `nimo.osman@university.edu.so` | Senior Student | `MATH-201`, `SWE-310`, `CS-402`, `BUS-110` |

---

## 📡 REST API Summary

### 📅 Attendance API
- `GET /api/attendance/my-attendance` - Fetch student attendance log
- `GET /api/attendance/course/{courseId}` - Fetch course attendance log
- `POST /api/attendance/record` - Record or update daily attendance

### 💳 Fee & Payment API
- `GET /api/fees/my-statement` - Fetch student tuition balance & payment history
- `GET /api/fees/all` - Fetch all billing statements (Admin)
- `POST /api/fees/pay` - Process tuition payment
- `POST /api/fees/generate` - Generate student billing statement (Admin)

### 🎓 Grades & Announcements API
- `GET /api/grades/transcript` | `POST /api/grades/submit-bulk`
- `GET /api/announcements` | `POST /api/announcements`

---

## 📜 License & Author

- **Author**: [Ibrahim A. Ahmed (himarbi)](https://github.com/himarbi)
