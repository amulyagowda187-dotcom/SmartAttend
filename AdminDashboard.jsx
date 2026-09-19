import { useEffect, useState } from "react";

function AdminDashboard() {
  const [attendance, setAttendance] = useState([]);
  const [message, setMessage] = useState("Loading attendance...");

  const loadAttendance = async () => {
    try {
      const response = await fetch(
        "http://127.0.0.1:8000/admin/attendance"
      );

      const data = await response.json();

      setAttendance(data.attendance);
      setMessage("");
    } catch (error) {
      console.error(error);
      setMessage("Unable to load attendance.");
    }
  };

  useEffect(() => {
    loadAttendance();
  }, []);

  return (
    <div>
      <h2>Admin Dashboard</h2>

      <button onClick={loadAttendance}>
        Refresh Attendance
      </button>

      <br />
      <br />

      {message && <p>{message}</p>}

      {attendance.length > 0 && (
        <table border="1" cellPadding="10">
          <thead>
            <tr>
              <th>USN</th>
              <th>Name</th>
              <th>Date</th>
              <th>Time</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {attendance.map((record) => (
              <tr key={record.id}>
                <td>{record.usn}</td>
                <td>{record.name}</td>
                <td>{record.date}</td>
                <td>{record.time}</td>
                <td>{record.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {attendance.length === 0 && !message && (
        <p>No attendance records found.</p>
      )}
    </div>
  );
}

export default AdminDashboard;