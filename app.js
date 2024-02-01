const express = require("express");
const path = require("path");
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded());
app.use(express.static("public"));

const enteredData = [];
let entryCounter = 1;

// Login Page
app.get("/form", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/Login.html"));
});

// Post data with an incrementing ID
app.post("/formPost", (req, res) => {
  const data = req.body;
  const entryWithId = { ...data, id: entryCounter++ };
  console.log(entryWithId);

  enteredData.push(entryWithId);

  const thanksFilePath = path.join(__dirname, "/public/ShowDataList.html");
  res.sendFile(thanksFilePath);
});

// Update Data Page
app.get("/update", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/UpdateData.html"));
});

app.put("/updateData", (req, res) => {
  console.log("Updating data:", req.body);

  res.status(200).json({ message: "Data updated successfully" });
});

// Show Data
app.get("/dataList", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/ShowDataList.html"));
});

// API endpoint to get all entered data
app.get("/api/data", (req, res) => {
  res.json(enteredData);
});

// Port HTTP
app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`);
});
