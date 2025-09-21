// index.js
// Main entry file for Authentication Assignment

const express = require("express");
const bodyParser = require("body-parser");

// Importing Task files
const task1 = require("./task1");
const task2 = require("./task2");

const app = express();
app.use(bodyParser.json());

// ----------------------
// Default Route
// ----------------------
app.get("/", (req, res) => {
  res.send("Welcome to Node.js Authentication Assignment!");
});

// ----------------------
// Task 1 Routes (Password Hashing)
// ----------------------
app.use("/task1", task1);

// ----------------------
// Task 2 Routes (JWT Authentication)
// ----------------------
app.use("/task2", task2);

// ----------------------
// Start Server
// ----------------------
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
