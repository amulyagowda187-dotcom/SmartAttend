from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import mysql.connector
from math import radians, sin, cos, sqrt, atan2


app = FastAPI()


# =========================================================
# CORS
# =========================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# =========================================================
# DATABASE CONNECTION
# =========================================================

def get_connection():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="ammu@123*#",
        database="smartattend"
    )


# =========================================================
# HOME / DATABASE TEST
# =========================================================

@app.get("/")
def home():

    connection = get_connection()

    cursor = connection.cursor()

    cursor.execute("SELECT DATABASE()")

    database = cursor.fetchone()

    cursor.close()
    connection.close()

    return {
        "message": "SmartAttend Backend is running!",
        "database": database[0]
    }


# =========================================================
# GET ALL STUDENTS
# =========================================================

@app.get("/students")
def get_students():

    connection = get_connection()

    cursor = connection.cursor(dictionary=True)

    cursor.execute("""
        SELECT
            id,
            name,
            email,
            usn,
            branch
        FROM students
        ORDER BY name ASC
    """)

    students = cursor.fetchall()

    cursor.close()
    connection.close()

    return {
        "students": students
    }


# =========================================================
# REGISTER STUDENT
# =========================================================

@app.post("/register")
def register_student(
    name: str,
    email: str,
    password: str,
    usn: str,
    branch: str = "ISE"
):

    connection = get_connection()

    cursor = connection.cursor()

    try:

        cursor.execute(
            """
            INSERT INTO students
            (name, email, password, usn, branch)
            VALUES (%s, %s, %s, %s, %s)
            """,
            (
                name,
                email,
                password,
                usn,
                branch
            )
        )

        connection.commit()

        student_id = cursor.lastrowid

        return {
            "message": "Student registered successfully!",
            "student_id": student_id,
            "branch": branch
        }

    except mysql.connector.Error as error:

        return {
            "message": "Registration failed.",
            "error": str(error)
        }

    finally:

        cursor.close()
        connection.close()


# =========================================================
# STUDENT LOGIN
# =========================================================

@app.post("/login")
def login(
    email: str,
    password: str
):

    connection = get_connection()

    cursor = connection.cursor(dictionary=True)

    cursor.execute(
        """
        SELECT
            id,
            name,
            email,
            usn,
            branch
        FROM students
        WHERE email = %s
        AND password = %s
        """,
        (
            email,
            password
        )
    )

    student = cursor.fetchone()

    cursor.close()
    connection.close()

    if student:

        return {
            "message": "Login successful!",
            "student": student
        }

    return {
        "message": "Invalid email or password."
    }


# =========================================================
# DISTANCE CALCULATION
# =========================================================

def calculate_distance(
    latitude1,
    longitude1,
    latitude2,
    longitude2
):

    earth_radius = 6371000

    latitude1 = radians(latitude1)
    latitude2 = radians(latitude2)

    difference_latitude = radians(
        latitude2 - latitude1
    )

    difference_longitude = radians(
        longitude2 - longitude1
    )

    a = (
        sin(difference_latitude / 2) ** 2
        +
        cos(latitude1)
        *
        cos(latitude2)
        *
        sin(difference_longitude / 2) ** 2
    )

    c = 2 * atan2(
        sqrt(a),
        sqrt(1 - a)
    )

    distance = earth_radius * c

    return distance


# =========================================================
# MARK ATTENDANCE
# =========================================================

@app.post("/attendance")
def mark_attendance(
    student_id: int,
    latitude: float,
    longitude: float
):

    # Bahubali College of Engineering
    training_latitude = 12.85627
    training_longitude = 76.47285

    # Allowed attendance radius
    allowed_radius = 50

    # Calculate distance
    distance = calculate_distance(
        latitude,
        longitude,
        training_latitude,
        training_longitude
    )

    connection = get_connection()

    cursor = connection.cursor(dictionary=True)

    # Check whether attendance is already marked today
    cursor.execute(
        """
        SELECT
            id,
            status
        FROM attendance
        WHERE student_id = %s
        AND date = CURDATE()
        """,
        (student_id,)
    )

    existing_attendance = cursor.fetchone()

    if existing_attendance:

        cursor.close()
        connection.close()

        return {
            "message": "Attendance already marked for today.",
            "status": "Already Marked",
            "previous_status": existing_attendance["status"]
        }

    # Check location
    if distance > allowed_radius:

        attendance_status = "Absent"

        message = (
            "You are outside the attendance location."
        )

    else:

        attendance_status = "Present"

        message = (
            "Attendance marked successfully!"
        )

    # Insert attendance
    cursor.close()

    cursor = connection.cursor()

    cursor.execute(
        """
        INSERT INTO attendance
        (student_id, date, time, status)
        VALUES
        (%s, CURDATE(), CURTIME(), %s)
        """,
        (
            student_id,
            attendance_status
        )
    )

    connection.commit()

    cursor.close()
    connection.close()

    return {
        "message": message,
        "distance": round(distance, 2),
        "status": attendance_status
    }


# =========================================================
# STUDENT ATTENDANCE HISTORY
# =========================================================

@app.get("/attendance/{student_id}")
def get_student_attendance(
    student_id: int
):

    connection = get_connection()

    cursor = connection.cursor(dictionary=True)

    cursor.execute(
        """
        SELECT
            id,
            student_id,
            date,
            time,
            status
        FROM attendance
        WHERE student_id = %s
        ORDER BY date DESC, time DESC
        """,
        (student_id,)
    )

    records = cursor.fetchall()

    # Convert date/time to string
    for record in records:

        record["date"] = str(
            record["date"]
        )

        record["time"] = str(
            record["time"]
        )

    cursor.close()
    connection.close()

    return {
        "attendance": records
    }


# =========================================================
# ADMIN - ALL ATTENDANCE
# =========================================================

@app.get("/admin/attendance")
def get_all_attendance(
    date: str = None,
    search: str = None
):

    connection = get_connection()

    cursor = connection.cursor(
        dictionary=True
    )

    query = """
        SELECT
            attendance.id,
            attendance.student_id,
            students.name,
            students.usn,
            students.email,
            students.branch,
            attendance.date,
            attendance.time,
            attendance.status
        FROM attendance
        JOIN students
        ON attendance.student_id = students.id
        WHERE 1=1
    """

    params = []

    # Date filter
    if date:

        query += """
            AND attendance.date = %s
        """

        params.append(date)

    # Search filter
    if search:

        query += """
            AND (
                students.name LIKE %s
                OR students.usn LIKE %s
            )
        """

        params.append(
            f"%{search}%"
        )

        params.append(
            f"%{search}%"
        )

    query += """
        ORDER BY
            attendance.date DESC,
            attendance.time DESC
    """

    cursor.execute(
        query,
        tuple(params)
    )

    records = cursor.fetchall()

    # Convert date/time to string
    for record in records:

        record["date"] = str(
            record["date"]
        )

        record["time"] = str(
            record["time"]
        )

    cursor.close()
    connection.close()

    return {
        "attendance": records
    }


# =========================================================
# ADMIN - STUDENT MANAGEMENT
# =========================================================

@app.get("/admin/students")
def get_all_students():

    connection = get_connection()

    cursor = connection.cursor(
        dictionary=True
    )

    cursor.execute(
        """
        SELECT
            id,
            name,
            email,
            usn,
            branch
        FROM students
        ORDER BY name ASC
        """
    )

    students = cursor.fetchall()

    cursor.close()
    connection.close()

    return {
        "students": students
    }


# =========================================================
# ADMIN - ATTENDANCE REPORT
# =========================================================

@app.get("/admin/report")
def get_attendance_report():

    connection = get_connection()

    cursor = connection.cursor(
        dictionary=True
    )

    cursor.execute(
        """
        SELECT
            students.id,
            students.name,
            students.usn,
            students.branch,

            COUNT(attendance.id)
            AS total_days,

            SUM(
                CASE
                    WHEN attendance.status = 'Present'
                    THEN 1
                    ELSE 0
                END
            ) AS present_days,

            SUM(
                CASE
                    WHEN attendance.status = 'Absent'
                    THEN 1
                    ELSE 0
                END
            ) AS absent_days

        FROM students

        LEFT JOIN attendance
        ON students.id = attendance.student_id

        GROUP BY
            students.id,
            students.name,
            students.usn,
            students.branch

        ORDER BY
            students.name ASC
        """
    )

    reports = cursor.fetchall()

    # Calculate attendance percentage
    for report in reports:

        total = (
            report["total_days"]
            or 0
        )

        present = (
            report["present_days"]
            or 0
        )

        absent = (
            report["absent_days"]
            or 0
        )

        report["total_days"] = total

        report["present_days"] = present

        report["absent_days"] = absent

        if total > 0:

            report["percentage"] = round(
                (present / total) * 100,
                2
            )

        else:

            report["percentage"] = 0

    cursor.close()
    connection.close()

    return {
        "reports": reports
    }