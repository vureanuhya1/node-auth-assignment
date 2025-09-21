const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();
app.use(express.json());

// In-memory "database"
const users = [];

// Secret key for JWT
const SECRET_KEY = "mysecretkey"; // in real apps use process.env.SECRET_KEY

// ==========================
// Register API
// ==========================
app.post("/register", async (req, res) => {
  const { username, password } = req.body;

  const existingUser = users.find(u => u.username === username);
  if (existingUser) {
    return res.status(400).json({ message: "User already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  users.push({ username, password: hashedPassword });

  res.json({ message: "User registered successfully" });
});

// ==========================
// Login API (with JWT)
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

  // Generate JWT
  const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: "1h" });
  res.json({ message: "Login successful", token });
});

// ==========================
// Middleware to verify JWT
// ==========================
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401).json({ message: "Unauthorized" });

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid/Expired token" });

    req.user = user;
    next();
  });
}

// ==========================
// Protected Route
// ==========================
app.get("/profile", authenticateToken, (req, res) => {
  res.json({ message: `Welcome ${req.user.username}` });
});

// ==========================
// Start server
// ==========================
const PORT = 4000;
app.listen(PORT, () => console.log(`Task 2 server running on port ${PORT}`));
