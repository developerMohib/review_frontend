# Project Submission & Review Dashboard

A full-stack web application for students to submit their projects and for mentors to review, approve, or reject them. Built with a strong focus on security, performance, robust validation, and Role-Based Access Control (RBAC).

## 🌟 Features

### 👨‍🎓 Student View (Submission Portal)
- **Project Submission Form:** Submit Project Name, Repo URL, Live Link, and Description.
- **Robust Validation:** Strict frontend and backend validation using **Zod** to prevent malformed data.
- **Duplicate Prevention:** Database constraints and backend logic ensure a student cannot submit multiple pending projects simultaneously.
- **Rate Limiting:** Basic rate limiting implemented on the backend submission endpoint to prevent spam.

### 👨‍🏫 Mentor View (Review Dashboard)
- **Paginated Data Table:** View all student submissions with efficient server-side pagination.
- **Actionable Review:** Approve or reject submissions directly from the dashboard.
- **Server-Side Filtering:** Filter submissions by status (Pending, Approved, Rejected) handled entirely on the backend (Express/Prisma) for optimal performance.
- **Aggregated Statistics:** Real-time stats showing Total Pending, Total Approved, and Total Rejected submissions.

### 🔐 Authentication & Authorization
- **JWT-based Auth:** Secure login and signup mechanisms with HTTP-only cookies / secure token storage.
- **Role-Based Access Control (RBAC):** Strict middleware separation for Student, Mentor, and Admin roles.
- **Admin Seeding:** Admin and Mentor users are seeded directly into the database via Prisma scripts (no public signup for Admins/Mentors).

## 🛠️ Tech Stack

- **Frontend:** Next.js (App Router), TypeScript, TailwindCSS, ShadCN UI
- **Validation:** Zod

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL (running locally or via a cloud provider)
- npm or yarn

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/project-submission-dashboard.git
cd project-submission-dashboard
```