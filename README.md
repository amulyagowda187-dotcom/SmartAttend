# SmartAttend 📍

SmartAttend is a **location-based college attendance management system** designed to reduce proxy attendance by verifying a student's location before marking attendance.

## 🚀 Features

* 👨‍🎓 Student registration and login
* 📍 Location-based attendance verification
* ✅ Marks attendance when the student is within the permitted college location
* ❌ Prevents attendance when the student is outside the permitted location
* 🔄 Prevents duplicate attendance for the same day
* 👨‍💼 Admin dashboard for attendance management
* 🗄️ MySQL database for storing student and attendance information
* 🌐 REST APIs using FastAPI

## 🛠️ Technologies Used

### Frontend

* React
* Vite
* JavaScript
* HTML
* CSS

### Backend

* Python
* FastAPI
* Uvicorn

### Database

* MySQL

### Tools

* VS Code
* Git
* GitHub

## 📂 Project Structure

```text
SmartAttend/
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
├── main.py
├── database.py
├── location.py
├── AdminDashboard.jsx
├── requirements.txt
├── .gitignore
└── README.md
```

## ⚙️ Installation and Setup

### 1. Clone the repository

```bash
git clone https://github.com/amulyagowda187-dotcom/SmartAttend.git
cd SmartAttend
```

### 2. Create and activate virtual environment

```bash
python -m venv venv
```

**Windows PowerShell:**

```powershell
venv\Scripts\Activate.ps1
```

### 3. Install backend dependencies

```bash
pip install -r requirements.txt
```

### 4. Configure MySQL

Create a MySQL database named:

```sql
CREATE DATABASE smartattend;
```

Update the database configuration in the project according to your local MySQL setup.

> Do not commit database passwords or other sensitive credentials to GitHub.

## ▶️ Run the Backend

From the project root:

```bash
uvicorn main:app --reload
```

The FastAPI backend will run at:

```text
http://127.0.0.1:8000
```

API documentation is available at:

```text
http://127.0.0.1:8000/docs
```

## ▶️ Run the Frontend

Open a new terminal:

```bash
cd frontend
npm install
npm run dev
```

The frontend will normally run at:

```text
http://localhost:5173
```

## 📍 How Attendance Works

```text
Student Login
      ↓
Get Current Location
      ↓
Calculate Distance
      ↓
Within Allowed College Location?
      ↓
 ┌───────────────┐
 │               │
 YES             NO
 │               │
 ↓               ↓
Present        Outside/
               Not Present
```

The system compares the student's current location with the configured college location and allows attendance only when the student is within the permitted distance.

## 🗄️ Database

The system uses MySQL to store student and attendance information.

### Student

```text
id
name
email
password
usn
branch
```

### Attendance

```text
id
student_id
date
time
status
```

## 🎯 Objective

The main objective of SmartAttend is to provide a simple and reliable attendance system that uses **location verification** to reduce proxy attendance and make attendance management easier for students and administrators.

## 🔮 Future Enhancemen
