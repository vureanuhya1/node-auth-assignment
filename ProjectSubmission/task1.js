const express = require("express");
const bcrypt = require("bcrypt");

const app = express();
app.use(express.json());

// In-memory "database"
const users = [];

// ==========================
// Register API
// ==========================
app.post("/register", async (req, res) => {
  const { username, password } = req.body;

  // Check if user already exists
  const existingUser = users.find(u => u.username === username);
  if (existingUser) {
    return res.status(400).json({ message: "User already exists" });
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Save user
  users.push({ username, password: hashedPassword });
  res.json({ message: "User registered successfully" });
});

// ==========================
// Login API
// ==========================
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const user = users.find(u => u.username === username);
  if (!user) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  res.json({ message: "Login successful" });
});

// ==========================
// Start server
// ==========================
const PORT = 3000;
app.listen(PORT, () => console.log(`Task 1 server running on port ${PORT}`));
