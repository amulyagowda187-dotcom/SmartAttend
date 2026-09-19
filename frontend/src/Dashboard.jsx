import { useState } from "react";

function Dashboard({ student }) {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [attendance, setAttendance] = useState([]);

  // =============================
  // MARK ATTENDANCE
  // =============================

  const markAttendance = () => {
    setLoading(true);
    setMessage("📍 Getting your location...");

    if (!navigator.geolocation) {
      setMessage("❌ Geolocation is not supported by your browser.");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        try {
          const response = await fetch(
            `http://127.0.0.1:8000/attendance?student_id=${student.id}&latitude=${latitude}&longitude=${longitude}`,
            {
              method: "POST",
            }
          );

          const data = await response.json();

          console.log("Attendance response:", data);

          // Present
          if (data.status === "Present") {
            setMessage(`✅ ${data.message}`);
          }

          // Already marked
          else if (data.status === "Already Marked") {
            setMessage(`⚠️ ${data.message}`);
          }

          // Absent / outside location
          else {
            setMessage(`❌ ${data.message}`);
          }

        } catch (error) {
          console.error(error);
          setMessage("❌ Unable to connect to the server.");
        }

        setLoading(false);
      },

      (error) => {
        console.error(error);

        setMessage(
          "⚠️ Please allow location access to mark attendance."
        );

        setLoading(false);
      }
    );
  };


  // =============================
  // VIEW ATTENDANCE
  // =============================

  const viewAttendance = async () => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/attendance/${student.id}`
      );

      const data = await response.json();

      console.log("Attendance history:", data);

      if (data.attendance) {
        setAttendance(data.attendance);
        setMessage("");
      } else {
        setAttendance([]);
        setMessage("No attendance records found.");
      }

    } catch (error) {
      console.error(error);

      setMessage("❌ Unable to load attendance.");
    }
  };


  // =============================
  // ATTENDANCE STATISTICS
  // =============================

  const totalDays = attendance.length;

  const presentDays = attendance.filter(
    (record) => record.status === "Present"
  ).length;

  const attendancePercentage =
    totalDays > 0
      ? Math.round((presentDays / totalDays) * 100)
      : 0;


  // =============================
  // PAGE
  // =============================

  return (
    <div className="dashboard">


      {/* ================================= */}
      {/* HEADER */}
      {/* ================================= */}

      <div className="dashboard-header">

        <div>

          <p className="dashboard-label">
            STUDENT PORTAL
          </p>

          <h1>
            Welcome, {student.name} 👋
          </h1>

          <p className="dashboard-subtitle">
            Manage your attendance from one place.
          </p>

        </div>


        <div className="student-badge">
          🎓 Student
        </div>

      </div>


      {/* ================================= */}
      {/* STUDENT INFORMATION */}
      {/* ================================= */}

      <div className="student-info">


        <div className="info-card">

          <span>
            USN
          </span>

          <strong>
            {student.usn}
          </strong>

        </div>


        <div className="info-card">

          <span>
            Email
          </span>

          <strong>
            {student.email}
          </strong>

        </div>

      </div>


      {/* ================================= */}
      {/* ATTENDANCE STATISTICS */}
      {/* ================================= */}

      <div className="attendance-stats">


        <div className="attendance-stat-card">

          <span>
            Total Days
          </span>

          <strong>
            {totalDays}
          </strong>

          <small>
            Attendance records
          </small>

        </div>


        <div className="attendance-stat-card">

          <span>
            Present Days
          </span>

          <strong>
            {presentDays}
          </strong>

          <small>
            Days present
          </small>

        </div>


        <div className="attendance-stat-card">

          <span>
            Attendance
          </span>

          <strong>
            {attendancePercentage}%
          </strong>

          <small>
            Overall percentage
          </small>

        </div>

      </div>


      {/* ================================= */}
      {/* MARK ATTENDANCE */}
      {/* ================================= */}

      <div className="attendance-card">

        <div className="attendance-icon">
          📍
        </div>

        <h2>
          Mark Today's Attendance
        </h2>

        <p>
          Your location will be checked before marking your attendance.
        </p>


        <button
          className="attendance-button"
          onClick={markAttendance}
          disabled={loading}
        >

          {loading
            ? "Checking Location..."
            : "✓ Mark Attendance"}

        </button>


        {/* Attendance Message */}

        {message && (

          <div
            className={
              message.includes("outside")
                ? "attendance-message message-absent"
                : message.includes("already")
                ? "attendance-message message-warning"
                : "attendance-message"
            }
          >

            {message}

          </div>

        )}

      </div>


      {/* ================================= */}
      {/* ATTENDANCE HISTORY */}
      {/* ================================= */}

      <div className="history-section">


        <div className="history-header">

          <div>

            <p className="dashboard-label">
              RECORDS
            </p>

            <h2>
              Attendance History
            </h2>

          </div>


          <button
            className="refresh-button"
            onClick={viewAttendance}
          >

            🔄 View Records

          </button>

        </div>


        {/* Attendance Table */}

        {attendance.length > 0 ? (

          <div className="table-container">

            <table>

              <thead>

                <tr>

                  <th>
                    Date
                  </th>

                  <th>
                    Time
                  </th>

                  <th>
                    Status
                  </th>

                </tr>

              </thead>


              <tbody>

                {attendance.map((record, index) => (

                  <tr key={index}>

                    <td>
                      {record.date}
                    </td>

                    <td>
                      {record.time}
                    </td>

                    <td>

                      <span
                        className={
                          record.status === "Present"
                            ? "status-present"
                            : "status-absent"
                        }
                      >

                        ● {record.status}

                      </span>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        ) : (

          <div className="empty-state">

            <div>
              📋
            </div>

            <p>
              No attendance records loaded.
            </p>

            <small>
              Click "View Records" to check your attendance.
            </small>

          </div>

        )}

      </div>

    </div>
  );
}

export default Dashboard;