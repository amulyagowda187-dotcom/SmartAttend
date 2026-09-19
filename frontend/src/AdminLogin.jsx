import { useState } from "react";
import AdminDashboard from "./AdminDashboard";

function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [message, setMessage] = useState("");

  const handleLogin = () => {
    // Temporary admin credentials for testing
    if (username === "admin" && password === "admin123") {
      setLoggedIn(true);
      setMessage("");
    } else {
      setMessage("Invalid admin username or password");
    }
  };

  if (loggedIn) {
    return <AdminDashboard />;
  }

  return (
    <div>
      <h2>Admin Login</h2>

      <input
        type="text"
        placeholder="Enter Admin Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <br />
      <br />

      <input
        type="password"
        placeholder="Enter Admin Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <br />
      <br />

      <button onClick={handleLogin}>
        Admin Login
      </button>

      <p>{message}</p>
    </div>
  );
}

export default AdminLogin;