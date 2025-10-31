const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => { // 1 for `/register`
  let userWithSameName = users.filter((user) => {
    return user.userName === username;
  });

  if (userWithSameName.length > 0) {
    return true; // if user with same name exists
  } else {
    return false;
  }
}

const authenticatedUser = (username, password) => { // 2. for `/login`
  const validUser = users.filter((user) => {
    return (user.username === username && user.password === password);    // returns array with existing user (needed for ''/login')
  });

  if (validUser.length > 0) {
    return true;  // if user exists 
  } else {
    return false;
  }
}

//only registered users can login within /customer/login
regd_users.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(400).json({ messsage: 'Error logging in. Please try again'});
  }

  if (authenticatedUser(username, password)) {

    let accessToken = jwt.sign({ data: password }, 'access', { expiresIn: '5m' });   // 'access' is the signature
    req.session.authorization = { accessToken, username };

    return res.status(200).json({ message: `User successfully logged in` });
  } else {

    return res.status(400).json({ message: `Unable to login. Please register first` });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
