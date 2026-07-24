# 🛠️ Future Implementation Roadmap & System Improvements

This document outlines key enhancement opportunities, structural refinements, and new features to elevate the **University Management System** into a production-grade, highly secure enterprise application.

---

## 🚀 Features We Might Add

### 1. 💳 Integration of Real-World Payment Gateways
* **Current Status**: Payment submission is fully simulated. When a student pays, the billing statement status changes to `PENDING_VERIFICATION` with a pending amount, requiring manual Admin approval or rejection.
* **Proposed Feature**:
  * Integrate SMS/Mobile Money gateways commonly used in East Africa (e.g., **Hormuud EVC Plus**, **Zaad**, or **Telesom**) or international cards via **Stripe** or **PayPal**.
  * Develop a **Payment Proof Upload** portal where students can upload receipt photos or bank transaction screenshots if paying offline, allowing Admins to view the image attachments before approving payments.

### 2. 📄 Digital Documents & PDF Export Engine
* **Current Status**: Transcripts and billing statements use CSS `@media print` rules for printing.
* **Proposed Feature**:
  * Implement an server-side export engine (e.g., using **OpenPDF** or **iText** in Spring Boot) to generate official, sealed, secure PDF documents for transcripts and fee receipts.
  * Add a verification QR code to printed/exported transcripts, allowing third parties to scan and verify the authenticity of the document on a public validation endpoint.

### 3. 💬 Real-Time Messaging & Direct Notifications
* **Current Status**: Communications are one-way, from Admins/Teachers to users via the Campus Broadcast system.
* **Proposed Feature**:
  * Build a secure, internal chat module using **Spring WebSockets (STOMP)** or **Socket.io** to enable real-time messaging between students and their course instructors.
  * Implement SMS alerts (via SMS gateways like Twilio) to dispatch high-priority notifications (emergency cancellations, overdue tuition alerts) directly to student phones.

### 📊 4. Course Syllabus, Material Repository, & Assignments
* **Current Status**: Courses only list names, codes, capacity, and enrolled rosters.
* **Proposed Feature**:
  * Expand the course dashboard to host a document repository where instructors can upload syllabus files, lecture notes, and assignment sheets.
  * Support student submission portals for assignments, coupled with auto-grading rules or grading rubrics.

### 🌓 5. Interactive Analytics & Dark/Light Mode
* **Current Status**: A static overview dashboard using CSS and Tailwind colors.
* **Proposed Feature**:
  * Integrate **Recharts** or **Chart.js** on the frontend to visualize class averages, grading distributions, fee collection charts, and attendance rates dynamically.
  * Add a global Dark Mode toggle with preference persistence in `localStorage`.

---

## 🔧 Areas for Improvement & Technical Debt

### 🔐 1. Authentication & Session Security
* **Issue**: The current JSON Web Tokens (JWT) are stateless and rely on simple local storage, without a built-in session expiration or token rotation mechanism.
* **Improvement**:
  * Implement **Refresh Tokens** stored in `HttpOnly` secure cookies to prevent XSS-based token theft.
  * Add password strength enforcement rules on user creation and a dedicated **Password Reset/Change** request flow.

### ⚙️ 2. API Pagination and Query Filtering
* **Issue**: Endpoints like `GET /api/users` and `GET /api/fees/all` fetch all database records at once. In a real campus with thousands of records, this will degrade server performance.
* **Improvement**:
  * Refactor repositories and controllers to use Spring Data `Pageable` and `Page<T>` responses.
  * Implement client-side pagination on the frontend tables using server-driven queries.

### 🧪 3. Automated Test Coverage
* **Issue**: The backend contains spring boot test files, but lacks comprehensive integration/unit test coverage for custom controllers, transactional cascades, and security configurations.
* **Improvement**:
  * Write unit tests for controllers and repositories using **JUnit 5**, **Mockito**, and **MockMvc**.
  * Introduce frontend testing using **Vitest** and **React Testing Library** for crucial components like the grading form and billing approvals.

### 🗃️ 4. Advanced Transaction Management & Database Constraints
* **Issue**: While deleting a user or course cleans up references via Hibernate/JPA, some database-level constraint handling could be improved to prevent orphan records or data inconsistencies during concurrent writes.
* **Improvement**:
  * Explicitly design database foreign key constraints to support `ON DELETE SET NULL` or `ON DELETE CASCADE` at the PostgreSQL engine level, rather than relying solely on Spring-level transactional cleanups.
  * Introduce soft deletes (`@SQLDelete(sql = "UPDATE ... SET deleted = true")` and `@Where(clause = "deleted = false")`) to avoid permanent accidental data loss of academic records.
