const express = require('express');
const app = express();
const path = require('path');
const sqlite3 = require('sqlite3')
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));
app.use(express.static('public'));

const db = new sqlite3.Database("data.db");

// Create paramitor sqlite
db.run(`CREATE TABLE IF NOT EXISTS entries (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT,
  password TEXT,
  email TEXT UNIQUE
)`);

// Login path
app.get('/form', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/Login.html'));
});

// Show Data List in Webpage
app.post("/formPost", (req, res) => {
    const data = req.body;
    const sqlCheck = "SELECT * FROM entries WHERE username = ? OR email = ?";
    const sqlInsert = "INSERT INTO entries (username, password, email) VALUES (?, ?, ?)";

    db.get(sqlCheck, [data.username, data.email], (err, row) => {
        if (err) {
            return console.error(err.message);
        }

        if (row) {
            console.log("Entry with the same username or email already exists.");
            return res.sendFile(path.join(__dirname, "/public/ShowDataList.html"));
        }

        console.log("SQL Insert Statement:", sqlInsert);
        console.log("Data to be Inserted:", [data.username, data.password, data.email]);

        db.run(sqlInsert, [data.username, data.password, data.email], function (err) {
            if (err) {
                return console.error(err.message);
            }

            console.log(`A row has been inserted with rowid ${this.lastID}`);
            const thanksFilePath = path.join(__dirname, "/public/ShowDataList.html");
            res.sendFile(thanksFilePath);
        });
    });
});

app.get("/update", (req, res) => {
    res.sendFile(path.join(__dirname, "/public/UpdateData.html"));
});

// Handle update request
app.put("/updateData/:id", (req, res) => {
    const id = req.params.id;
    const updatedData = req.body;

    const sqlUpdate = "UPDATE entries SET username = ?, password = ?, email = ? WHERE id = ?";

    db.run(sqlUpdate, [updatedData.username, updatedData.password, updatedData.email, id], function (err) {
        if (err) {
            return res.status(500).json({
                error: err.message
            });
        }

        res.status(200).json({
            message: "Data updated successfully"
        });
    });
});

// Show Data path
app.get('/dataList', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/ShowDataList.html'));
});

// Data Id
app.get("/api/data", (req, res) => {
    const sqlSelect = "SELECT * FROM entries ORDER BY ROWID";

    db.all(sqlSelect, [], (err, rows) => {
        if (err) {
            return console.error(err.message);
        }

        res.json(rows);
    });
});

// Delete data by ID
app.delete("/api/data/:id", (req, res) => {
    const id = req.params.id;
    const sqlDelete = "DELETE FROM entries WHERE id = ?";

    db.run(sqlDelete, [id], (err) => {
        if (err) {
            return console.error(err.message);
        }

        console.log(`Row with ID ${id} has been deleted`);

        db.run("UPDATE entries SET id = id - 1 WHERE id > ?", [id], (updateErr) => {
            if (updateErr) {
                return console.error(updateErr.message);
            }

            console.log("Row IDs have been reorganized");

            db.run("UPDATE SQLITE_SEQUENCE SET seq = (SELECT MAX(id) FROM entries)", (sequenceUpdateErr) => {
                if (sequenceUpdateErr) {
                    return console.error(sequenceUpdateErr.message);
                }

                console.log("Sequence has been updated");
                res.status(200).json({
                    message: "Data deleted successfully"
                });
            });
        });
    });
});

app.listen(port, () => {
    console.log(`Server started at http://localhost:${port}`);
});