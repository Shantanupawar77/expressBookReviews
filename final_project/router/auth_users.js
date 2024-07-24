const express = require('express');
const jwt = require('jsonwebtoken');
const books = require('./booksdb.js');
const regd_users = express.Router();
const JWT_SECRET = "1234567890";

let users = []; // Store user data

const isValid = (username) => {
  return !users.some(user => user.username === username);
}

const authenticatedUser = (username, password) => {
  return users.some(user => user.username === username && user.password === password);
}

// User registration
regd_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  if (!isValid(username)) {
    return res.status(400).json({ message: "Username already exists" });
  }

  users.push({ username, password });
  res.status(201).json({ message: "User registered successfully" });
});

// User login
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  if (!authenticatedUser(username, password)) {
    return res.status(401).json({ message: "Invalid username or password" });
  }

  const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '1h' });
  res.status(200).json({ message: "Login successful", token });
});

// Middleware for JWT verification
regd_users.use((req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ message: "Access token required" });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid or expired token" });
    req.username = user.username;
    next();
  });
});

// Add or modify a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params;
  const { review } = req.query;
  const username = req.username;

  if (!review) return res.status(400).json({ message: "Review text is required" });
  if (!books[isbn]) return res.status(404).json({ message: "Book not found" });

  books[isbn].reviews[username] = review;

  res.status(200).json({ message: "Review added/updated successfully", reviews: books[isbn].reviews });
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params;
  const username = req.username; // Get the username from the request (from the token)

  // Check if the book exists
  if (!books[isbn]) return res.status(404).json({ message: "Book not found" });

  // Check if the user has a review for this book
  if (!books[isbn].reviews[username]) return res.status(404).json({ message: "Review not found for this user" });

  // Delete the review
  delete books[isbn].reviews[username];

  // Respond with success message
  res.status(200).json({ message: "Review deleted successfully", reviews: books[isbn].reviews });
});



module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
