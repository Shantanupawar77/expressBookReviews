const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  // return res.status(300).json({message: "Yet to be implemented"});

  const { username, password } = req.body;

  // Check if username and password are provided
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  // Check if the username already exists
  if (users[username]) {
    return res.status(400).json({ message: "Username already exists" });
  }

  // Add the new user
  users[username] = { password }; // Store user credentials (In real applications, you should hash the password)

  res.status(201).json({ message: "User registered successfully" });
  
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  // return res.status(300).json({message: "Yet to be implemented"});
  res.status(200).json(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const { isbn } = req.params; // Retrieve ISBN from request parameters
  const book = books[isbn]; // Access the book using ISBN as a key

  if (book) {
    res.status(200).json(book); // Send book details as JSON response
  } else {
    res.status(404).json({ message: "Book not found" }); // Handle case where book is not found
  }

 });

  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  // return res.status(300).json({message: "Yet to be implemented"});
  const { author } = req.params; // Retrieve author from request parameters
  const booksByAuthor = [];

  // Iterate through the books object
  for (const key in books) {
    if (books[key].author.toLowerCase() === author.toLowerCase()) {
      booksByAuthor.push(books[key]); // Collect books matching the author
    }
  }

  if (booksByAuthor.length > 0) {
    res.status(200).json(booksByAuthor); // Send the list of books by the author
  } else {
    res.status(404).json({ message: "No books found by this author" }); // Handle case where no books are found
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  // return res.status(300).json({message: "Yet to be implemented"});
  const { title } = req.params; // Retrieve author from request parameters
  const titleBook = [];

  // Iterate through the books object
  for (const key in books) {
    if (books[key].title.toLowerCase() === title.toLowerCase()) {
      titleBook.push(books[key]); // Collect books matching the author
    }
  }

  if (titleBook.length > 0) {
    res.status(200).json(titleBook); // Send the list of books by the author
  } else {
    res.status(404).json({ message: "No books found with this title" }); // Handle case where no books are found
  }

});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  // return res.status(300).json({message: "Yet to be implemented"});
  const { isbn } = req.params; // Retrieve ISBN from request parameters
  const book = books[isbn]; // Access the book using ISBN as a key

  if (book) {
    const reviews = book.reviews; // Access the reviews of the book
    if (Object.keys(reviews).length > 0) {
      res.status(200).json(reviews); // Send reviews as JSON response
    } else {
      res.status(404).json({ message: "No reviews found for this book" }); // Handle case where no reviews are found
    }
  } else {
    res.status(404).json({ message: "Book not found" }); // Handle case where book is not found
  }

});

module.exports.general = public_users;
