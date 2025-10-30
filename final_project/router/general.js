const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users('/register', (req, res) => {   // 1.1
  const username = req.body.username;
  const password = req.body.password;

  if (username, password) {

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

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
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
