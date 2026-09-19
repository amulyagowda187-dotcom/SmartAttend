import { useEffect, useState } from "react";

function AdminDashboard() {
  const [attendance, setAttendance] = useState([]);
  const [students, setStudents] = useState([]);
  const [reports, setReports] = useState([]);

  const [message, setMessage] = useState("Loading attendance...");
  const [studentMessage, setStudentMessage] = useState("");

  const [search, setSearch] = useState("");
  const [date, setDate] = useState("");

  // Load Attendance
  const loadAttendance = async () => {
    try {
      setMessage("Loading attendance...");

      let url = "http://127.0.0.1:8000/admin/attendance";

      const params = new URLSearchParams();

      if (date) {
        params.append("date", date);
      }

      if (search) {
        params.append("search", search);
      }

      if (params.toString()) {
        url += "?" + params.toString();
      }

      const response = await fetch(url);
      const data = await response.json();

      setAttendance(data.attendance || []);
      setMessage("");
    } catch (error) {
      console.error(error);
      setMessage("Unable to load attendance.");
    }
  };

  // Load Students
  const loadStudents = async () => {
    try {
      const response = await fetch(
        "http://127.0.0.1:8000/admin/students"
      );

      const data = await response.json();

      setStudents(data.students || []);
      setStudentMessage("");
    } catch (error) {
      console.error(error);
      setStudentMessage("Unable to load students.");
    }
  };

  // Load Reports
  const loadReports = async () => {
    try {
      const response = await fetch(
        "http://127.0.0.1:8000/admin/report"
      );

      const data = await response.json();

      setReports(data.reports || []);
    } catch (error) {
      console.error(error);
    }
  };

  // Load everything when page opens
  useEffect(() => {
    loadAttendance();
    loadStudents();
    loadReports();
  }, []);

  // Attendance statistics
  const totalRecords = attendance.length;

  const presentCount = attendance.filter(
    (record) => record.status === "Present"
  ).length;

  const absentCount = attendance.filter(
    (record) => record.status === "Absent"
  ).length;

  // Search
  const handleSearch = () => {
    loadAttendance();
  };

  // Clear filters
  const clearFilters = () => {
    setSearch("");
    setDate("");

    setTimeout(() => {
      loadAttendance();
    }, 0);
  };

  // Refresh everything
  const refreshEverything = () => {
    loadAttendance();
    loadStudents();
    loadReports();
  };

  return (
    <div className="admin-dashboard">

      {/* ================= HEADER ================= */}

      <div className="admin-header">
        <div>
          <p className="dashboard-label">ADMIN PORTAL</p>

          <h1>Attendance Management</h1>

          <p className="dashboard-subtitle">
            Monitor and manage student attendance records.
          </p>
        </div>

        <div className="admin-badge">
          🛡️ Admin
        </div>
      </div>


      {/* ================= STATISTICS ================= */}

      <div className="admin-stats">

        <div className="stat-card">
          <span>Total Students</span>

          <strong>{students.length}</strong>

          <small>
            Registered students
          </small>
        </div>


        <div className="stat-card">
          <span>Present</span>

          <strong>{presentCount}</strong>

          <small>
            Students present
          </small>
        </div>


        <div className="stat-card">
          <span>Absent</span>

          <strong>{absentCount}</strong>

          <small>
            Students absent
          </small>
        </div>

      </div>


      {/* ================= ATTENDANCE RECORDS ================= */}

      <div className="admin-records">

        <div className="admin-records-header">

          <div>
            <p className="dashboard-label">
              RECORDS
            </p>

            <h2>
              Student Attendance
            </h2>
          </div>


          <button
            className="refresh-button"
            onClick={refreshEverything}
          >
            🔄 Refresh
          </button>

        </div>


        {/* FILTERS */}

        <div className="admin-filters">

          <input
            type="text"
            placeholder="🔎 Search Name or USN"
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />


          <input
            type="date"
            value={date}
            onChange={(e) =>
              setDate(e.target.value)
            }
          />


          <button
            className="filter-button"
            onClick={handleSearch}
          >
            Search
          </button>


          <button
            className="clear-button"
            onClick={clearFilters}
          >
            Clear
          </button>

        </div>


        {/* MESSAGE */}

        {message && (
          <p className="admin-message">
            {message}
          </p>
        )}


        {/* ATTENDANCE TABLE */}

        {attendance.length > 0 ? (

          <div className="table-container">

            <table>

              <thead>

                <tr>

                  <th>USN</th>

                  <th>Name</th>

                  <th>Branch</th>

                  <th>Date</th>

                  <th>Time</th>

                  <th>Status</th>

                </tr>

              </thead>


              <tbody>

                {attendance.map((record) => (

                  <tr key={record.id}>

                    <td>
                      {record.usn}
                    </td>


                    <td>
                      {record.name}
                    </td>


                    <td>
                      {record.branch}
                    </td>


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

          !message && (

            <div className="empty-state">

              <div>📋</div>

              <p>
                No attendance records found.
              </p>

            </div>

          )

        )}

      </div>


      {/* ================= STUDENT MANAGEMENT ================= */}

      <div className="admin-records student-management">

        <div className="admin-records-header">

          <div>

            <p className="dashboard-label">
              STUDENTS
            </p>

            <h2>
              Student Management
            </h2>

          </div>


          <div className="student-count">
            👥 {students.length} Students
          </div>

        </div>


        {studentMessage && (

          <p className="admin-message">
            {studentMessage}
          </p>

        )}


        {students.length > 0 ? (

          <div className="table-container">

            <table>

              <thead>

                <tr>

                  <th>ID</th>

                  <th>Name</th>

                  <th>USN</th>

                  <th>Branch</th>

                  <th>Email</th>

                </tr>

              </thead>


              <tbody>

                {students.map((student) => (

                  <tr key={student.id}>

                    <td>
                      {student.id}
                    </td>

                    <td>
                      {student.name}
                    </td>

                    <td>
                      {student.usn}
                    </td>

                    <td>
                      {student.branch}
                    </td>

                    <td>
                      {student.email}
                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        ) : (

          !studentMessage && (

            <div className="empty-state">

              <div>👥</div>

              <p>
                No students registered.
              </p>

            </div>

          )

        )}

      </div>


      {/* ================= ATTENDANCE REPORTS ================= */}

      <div className="admin-records attendance-reports">

        <div className="admin-records-header">

          <div>

            <p className="dashboard-label">
              REPORTS
            </p>

            <h2>
              📊 Attendance Reports
            </h2>

          </div>


          <button
            className="refresh-button"
            onClick={loadReports}
          >
            🔄 Refresh Report
          </button>

        </div>


        {reports.length > 0 ? (

          <div className="table-container">

            <table>

              <thead>

                <tr>

                  <th>Name</th>

                  <th>USN</th>

                  <th>Branch</th>

                  <th>Total Days</th>

                  <th>Present</th>

                  <th>Absent</th>

                  <th>Attendance</th>

                </tr>

              </thead>


              <tbody>

                {reports.map((report) => (

                  <tr key={report.id}>

                    <td>
                      {report.name}
                    </td>


                    <td>
                      {report.usn}
                    </td>


                    <td>
                      {report.branch}
                    </td>


                    <td>
                      {report.total_days}
                    </td>


                    <td>

                      <span className="status-present">
                        {report.present_days}
                      </span>

                    </td>


                    <td>

                      <span className="status-absent">
                        {report.absent_days}
                      </span>

                    </td>


                    <td>

                      <strong className="attendance-percentage">
                        {report.percentage}%
                      </strong>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        ) : (

          <div className="empty-state">

            <div>📊</div>

            <p>
              No attendance report available.
            </p>

          </div>

        )}

      </div>

    </div>
  );
}

export default AdminDashboard;