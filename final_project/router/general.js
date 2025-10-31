const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// helper function

const findBook = (object, property, propertyValue) => {   // obtaining the book from given URL parameter
  for (const key in object) {
    if(object.hasOwnProperty(key)) {
      let book = object[key];

      if (book[property] && book[property] === propertyValue) {
        return book;
      }
    }
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
  let book = books[isbn];

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
  
public_users.get('/author/:author', (req, res) => {   // Get book details based on author 6.
  const author = req.params.author;

  if (!author || author.trim() === '') {
    return res.status(400).json({ message: `Invalid author. Please try again` });
  }

  let bookFound = findBook(books, "author", author);    // finding whole book with 'findBook function helper'
  if(!bookFound){
    return res.status(400).json({ message: `Book not available with named author: ${author}. Please try again.` });
  }

  res.status(200).json({
    Book: bookFound
  });
});


public_users.get('/title/:title', (req, res) => {  // Get all books based on title 7.
  const title = req.params.title;

  if (!title) {
    return res.status(400).json({ message: `Invalid title. Please try again` });
  }

  let bookFound = findBook(books, "title", title);
  if (!bookFound) {
    return res.status(400).json({ message: `Book not available with named title: ${title}. Please try again` });
  }
  
  res.status(200).json({
    Book: bookFound
  });
});

public_users.get('/review/:isbn', (req, res) => { //  Get book review 8.
  const isbn = req.params.isbn;
  let book = books[isbn];

  if (!isbn) {
    return res.status(400).json({ message: `Invalid title. Please try again` });
  }

  if (!book) {
    return res.status(200).json({ message: `Could not find book with ISBN: '${isbn}'.` });
  }

  res.status(200).json({
    Book: book.title,
    "Book Reviews": book.reviews
  });
});

module.exports.general = public_users;
