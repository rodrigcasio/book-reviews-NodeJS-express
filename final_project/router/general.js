const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// helper function 

const findBook = (object, property) => {
  for (const key in object) {
    
  }
}

public_users.post('/register', (req, res) => {   // 1.1
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {

    if (!isValid(username)) {
      users.push({ "username": username, "password": password });   // adding new user to `users db`
      return res.status(200).json({ message: `User successfully registered. Now you can Log in.`});
    } else {

      res.status(400).json({ message: `User already exists. Please try again.` });
    }

  } else {
    res.status(400).json({ messsage: `Unable to register user. Please try again.`});
  }
});

// Get the book list available in the shop    // 4.
public_users.get('/', (req, res) => {
  if (!books) {
    return res.status(400).json({ message: `No books available` });
  }
  
  res.status(200).send(JSON.stringify(books, null, 2));
});

// Get book details based on ISBN         // 5.
public_users.get('/isbn/:isbn', (req, res) => {
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (!isbn) {
    return res.status(400).json({ message: `Invalid ISBN. Please try again` });
  }

  if (!book) {
    return res.status(400).json({ message: `Could not find book with ISBN: '${isbn}'.`});
  }

  //returning valid isbn
  res.status(200).json({
    ISBN: isbn,
    Author: book.author,
    Title: book.title,
    Reviews: book.reviews
  });
 });
  
// Get book details based on author
public_users.get('/author/:author', (req, res) => {
  const author = req.params.author;
  
  for(const key in books) {
    for(const isbn in key) {
      if(isbn["author"] === author){
        return res.status(200).json({
          ISBN: isbn,
          Author: author,
          Title: isbn.title,
          Reviews: isbn.reviews
        });
      } else {
        res.status(400).json({ message: 'No book available'});
      }
    }
  }

});



// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
