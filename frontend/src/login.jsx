import { useState } from "react";
import Dashboard from "./Dashboard";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [student, setStudent] = useState(null);

  const handleLogin = async () => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/login?email=${encodeURIComponent(
          email
        )}&password=${encodeURIComponent(password)}`,
        {
          method: "POST",
        }
      );

      const data = await response.json();

      setMessage(data.message);

      if (data.student) {
        setStudent(data.student);
      }
    } catch (error) {
      console.error(error);
      setMessage("Unable to connect to the server");
    }
  };

  if (student) {
    return <Dashboard student={student} />;
  }

  return (
    <div className="login-card">
      <h2>Student Login</h2>

      <input
        type="email"
        placeholder="Enter Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Enter Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={handleLogin}>
        Login
      </button>

      <p className="message">{message}</p>
    </div>
  );
}

export default Login;