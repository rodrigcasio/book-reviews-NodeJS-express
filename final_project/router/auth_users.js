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

// Add a book review  // 9.
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (!book) {
    return res.status(400).json({ message: `Could not find book. Please try again` });
  }

  let review = req.query.review;
  let username = req.session.authorization.username;

  if (!review) {
    return res.status(400).json({ message: 'Missing review. Please place a review' });
  }

  book.reviews = [{ user: username, review: review }]; // placing two properites within an array of review objects

  res.status(200).json({
    user: username,
    review: review
  });
});


regd_users.delete('/auth/review/:isbn', (req, res) => {
  const isbn = req.params.isbn;
  const book = books[isbn];
  
  if (!book) {
    return res.status(400).json({ message: `Could not find book. Please try again.`});
  }

  let username = req.session.authorization.username;
  let reviews = book.reviews;

  if (reviews.length < 0) {
    return res.status(200).json({ message: `There are no reviews published.` });
  }

  reviews = reviews.filter((user) => user.username !== username);
  return res.status(200).json({ message: `Review has been deleted successfully.` });
  
});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
