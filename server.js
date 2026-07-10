import express from "express";
import mysql from "mysql2";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "philemonandrew12@gmail.com",
    database: "aptech_medical_ehr_db"
});

db.connect((err) => {
    if (err) {
        console.log("Database Connection Failed");
        console.log(err);
    } else {
        console.log("MySQL Connected Successfully");
    }
});

app.get("/api/patients", (req, res) => {

    const sql = "SELECT * FROM patients ORDER BY id DESC";

    db.query(sql, (err, result) => {

        if (err) {
            return res.status(500).json(err);
        }

        res.json(result);

    });

});

app.post("/api/patients", (req, res) => {

    const {
        patient_name,
        gender,
        date_of_birth,
        blood_group,
        medical_history
    } = req.body;

    const sql = `
    INSERT INTO patients
    (patient_name, gender, date_of_birth, blood_group, medical_history)
    VALUES (?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [
            patient_name,
            gender,
            date_of_birth,
            blood_group,
            medical_history
        ],
        (err, result) => {

            if (err) {
                return res.status(500).json(err);
            }

            res.json(result);

        }
    );

});

app.put("/api/patients/:id", (req, res) => {

    const id = req.params.id;

    const {
        patient_name,
        gender,
        date_of_birth,
        blood_group,
        medical_history
    } = req.body;

    const sql = `
    UPDATE patients
    SET
    patient_name=?,
    gender=?,
    date_of_birth=?,
    blood_group=?,
    medical_history=?
    WHERE id=?
    `;

    db.query(
        sql,
        [
            patient_name,
            gender,
            date_of_birth,
            blood_group,
            medical_history,
            id
        ],
        (err, result) => {

            if (err) {
                return res.status(500).json(err);
            }

            res.json(result);

        }
    );

});

app.delete("/api/patients/:id", (req, res) => {

    const id = req.params.id;

    db.query(
        "DELETE FROM patients WHERE id=?",
        [id],
        (err, result) => {

            if (err) {
                return res.status(500).json(err);
            }

            res.json(result);

        }
    );

});

app.listen(5000, () => {

    console.log("Server running on port 5000");

});