import { useState } from "react";
import "./App.css";
import Login from "./login";
import AdminLogin from "./AdminLogin";

function App() {
  const [page, setPage] = useState("student");

  return (
    <div className="app-container">

      <h1 className="app-title">SmartAttend</h1>

      <p className="app-subtitle">
        Smart Location-Based Attendance System
      </p>

      <div className="nav-buttons">
        <button onClick={() => setPage("student")}>
          👨‍🎓 Student
        </button>

        <button onClick={() => setPage("admin")}>
          🛡️ Admin
        </button>
      </div>

      {page === "student" && <Login />}

      {page === "admin" && <AdminLogin />}

    </div>
  );
}

export default App;