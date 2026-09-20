const express = require("express");
const mysql = require("mysql2");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CareConnect main folder
const mainFolder = path.join(__dirname, "..");

// Serve all website files
app.use(express.static(mainFolder));

// Home page
app.get("/", (req, res) => {
    res.sendFile(path.join(mainFolder, "index.html"));
});

// Login page
app.get("/login.html", (req, res) => {
    res.sendFile(path.join(mainFolder, "login.html"));
});

// Register page
app.get("/register.html", (req, res) => {
    res.sendFile(path.join(mainFolder, "register.html"));
});

// Admin page
app.get("/admin.html", (req, res) => {
    res.sendFile(path.join(mainFolder, "admin.html"));
});


// =========================
// MYSQL CONNECTION
// =========================

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "careconnect"
});

db.connect((err) => {
    if (err) {
        console.log("MySQL connection failed:", err.message);
        return;
    }

    console.log("MySQL connected successfully!");
});


// =========================
// TEST API
// =========================

app.get("/api/test", (req, res) => {
    res.json({
        message: "CareConnect server is working!"
    });
});


// =========================
// REGISTER USER
// =========================

app.post("/api/register", (req, res) => {

    const { name, email, phone, password } = req.body;

    const sql = `
        INSERT INTO users
        (name, email, phone, password)
        VALUES (?, ?, ?, ?)
    `;

    db.query(
        sql,
        [name, email, phone, password],
        (err, result) => {

            if (err) {
                console.log(err);

                return res.status(500).json({
                    success: false,
                    message: "Registration failed"
                });
            }

            res.json({
                success: true,
                message: "Account created successfully!"
            });
        }
    );
});


// =========================
// LOGIN USER
// =========================

app.post("/api/login", (req, res) => {

    const { email, password } = req.body;

    const sql = `
        SELECT * FROM users
        WHERE email = ? AND password = ?
    `;

    db.query(
        sql,
        [email, password],
        (err, results) => {

            if (err) {
                console.log(err);

                return res.status(500).json({
                    success: false,
                    message: "Database error"
                });
            }

            if (results.length === 0) {

                return res.json({
                    success: false,
                    message: "Invalid email or password"
                });
            }

            res.json({
                success: true,
                message: "Login successful"
            });
        }
    );
});

// GET MY APPOINTMENTS
app.get("/api/my-appointments", (req, res) => {

    const sql = `
        SELECT *
        FROM appointments
        ORDER BY appointment_date DESC, appointment_time DESC
    `;

    db.query(sql, (err, results) => {

        if (err) {
            console.log(err);

            return res.status(500).json({
                success: false,
                message: "Failed to load appointments"
            });
        }

        res.json({
            success: true,
            appointments: results
        });
    });
});
// =========================
// BOOK APPOINTMENT
// =========================

app.post("/api/appointments", (req, res) => {

    const {
        patient_name,
        patient_age,
        phone,
        email,
        doctor,
        appointment_date,
        appointment_time,
        health_problem
    } = req.body;

    const sql = `
        INSERT INTO appointments
        (
            patient_name,
            patient_age,
            phone,
            email,
            doctor,
            appointment_date,
            appointment_time,
            health_problem
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [
            patient_name,
            patient_age,
            phone,
            email,
            doctor,
            appointment_date,
            appointment_time,
            health_problem
        ],
        (err, result) => {

            if (err) {
                console.log(err);

                return res.status(500).json({
                    success: false,
                    message: "Appointment booking failed"
                });
            }

            res.json({
                success: true,
                message: "Appointment booked successfully!"
            });
        }
    );
});
// GET ALL REGISTERED USERS
app.get("/api/admin/users", (req, res) => {

    const sql = `
        SELECT id, name, email, phone
        FROM users
        ORDER BY id DESC
    `;

    db.query(sql, (err, results) => {

        if (err) {
            console.log(err);

            return res.status(500).json({
                success: false,
                message: "Failed to load users"
            });
        }

        res.json({
            success: true,
            users: results
        });
    });
});
// DELETE APPOINTMENT
app.delete("/api/admin/appointments/:id", (req, res) => {

    const appointmentId = req.params.id;

    const sql = "DELETE FROM appointments WHERE id = ?";

    db.query(sql, [appointmentId], (err, result) => {

        if (err) {
            console.log("Delete Error:", err);

            return res.status(500).json({
                success: false,
                message: "Failed to delete appointment"
            });
        }

        if (result.affectedRows === 0) {
            return res.json({
                success: false,
                message: "Appointment not found"
            });
        }

        res.json({
            success: true,
            message: "Appointment deleted successfully!"
        });

    });

});

// CANCEL APPOINTMENT
app.delete("/api/appointments/:id", (req, res) => {

    const appointmentId = req.params.id;

    const sql = "DELETE FROM appointments WHERE id = ?";

    db.query(sql, [appointmentId], (err, result) => {

        if (err) {
            console.log("Cancel Error:", err);

            return res.status(500).json({
                success: false,
                message: "Failed to cancel appointment"
            });
        }

        if (result.affectedRows === 0) {
            return res.json({
                success: false,
                message: "Appointment not found"
            });
        }

        res.json({
            success: true,
            message: "Appointment cancelled successfully!"
        });

    });

});
// =========================
// START SERVER
// =========================

app.listen(PORT, "0.0.0.0", () => {
    console.log(
        `CareConnect server running at http://localhost:${PORT}`
    );
});