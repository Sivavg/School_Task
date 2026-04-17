# School Management Mini System (MERN Stack)

A professional, high-performance web application designed to manage school operations including student enrollment, academic assignments, and role-based authentication.

## 🚀 Features

- **Elite Dashboard**: Real-time performance insights and analytics for admins and students.
- **Student Roster**: Full CRUD (Create, Read, Update, Delete) management for student records.
- **Curriculum & Tasks**: Professional assignment assignment pipeline with real-time status syncing.
- **Enterprise Security**: Role-based JWT authentication for Admin and Student portals.
- **Elite UI/UX**: High-precision dark mode design with modern SaaS principles.

## 🛠️ Tech Stack

- **Frontend**: React.js, Lucide Icons, Modern CSS3
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)

## 📋 Prerequisites

- Node.js (v16+)
- MongoDB Atlas account or local MongoDB instance

## ⚙️ Setup Instructions

### 1. Clone the repository
```bash
git clone <your-repo-link>
cd school-management
```

### 2. Backend Setup
```bash
cd backend
npm install
```
Create a `.env` file in the `backend` folder:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```
Run the backend:
```bash
npm run dev
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
npm run dev
```

## 🔑 Access Credentials

| Role | Username | Password |
| :--- | :--- | :--- |
| **Admin** | `admin` | `admin123` |
| **Student** | `<Roll Number>` | `<Roll Number>` |

*Note: For students, use the Roll Number assigned by the admin during registration.*

## 📂 Project Structure

```text
├── backend
│   ├── models/       # Database schemas (User, Student, Task)
│   ├── routes/       # API endpoints (Auth, Students, Tasks)
│   ├── middleware/   # JWT Protection & Roles
│   └── server.js     # Entry point
└── frontend
    ├── src
    │   ├── components/ # Reusable UI Modules
    │   ├── pages/      # View Layers (Login, Dashboard)
    │   ├── context/    # Global Auth State
    │   └── api.js      # Backend communication logic
```

## 🎓 Author
[Siva]
