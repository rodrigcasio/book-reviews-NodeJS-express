const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const axios = require('axios');

const public_users = express.Router();

// helper function for `/author/:author & /title/:title`
const findBookByProperty = (object, property, propertyValue) => { // obtains the book and the key that holds the book (isbn)
  for (const key in object) {
    if(object.hasOwnProperty(key)) {
      let book = object[key];

      if (book[property] && book[property] === propertyValue) {
        return { // returning an object
          isbn: key,
          book: book
        };
      }
    }
  }
  
  return null; // if not book found
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

const getAllBooks = (books) => {  // for '/' endpoint.
  return new Promise((resolve, reject) => {
    let allBooks = books;
    setTimeout(() => {
      if (allBooks) {
        console.log(`Books database fetched`);
        resolve(allBooks);
      } else {
        reject(new Error(`There are no books available at the moment`));
      }
    }, 500);
  });
}

// Get the book list available in the shop    // 4. 10. Implementing async/await with custom Promise 
public_users.get('/', async (req, res) => {
  const booksdb = books;

  try {
    const fetchedBooks = await getAllBooks(booksdb);

    if (fetchedBooks) {
      res.status(200).json(fetchedBooks);
    } else {
      res.status(404).json({ message: `Could not find available books.` });
    }

  } catch (err) {
    console.error(`Error fetching data: ${err.message}.`);
    res.status(500).json({ message: `Internal Server Error while fetching books. Please try again` });
  }
});

// Get book details based on ISBN         // 5. | 11. implementing async/await with Axios
public_users.get('/isbn/:isbn', async (req, res) => {
  const isbn = req.params.isbn;
  
  let booksUrl = `http://localhost:5000/`;
  
  try {
    const response = await axios.get(booksUrl);
    let allBooks = response.data;

    let bookDetails = allBooks[isbn];

    if (bookDetails) {
      console.log(`Book successfully fetched by using ISBN ${isbn}.`);
      res.status(200).json({
        ISBN: isbn,
        Author: bookDetails.author,
        Title: bookDetails.title,
        Reviews: bookDetails.reviews
      });

    } else {
      res.status(404).json({ message: `Could not find book with ISBN: '${isbn}'. Please try again` });
    }
  } catch (err) {
    console.error(`Error fetching data: ${err.message}`);
    res.status(500).json({ message: `Internal Server Error while fetching book data. Please try again` });
  }
});

public_users.get('/author/:author', async (req, res) => {   // Get book details based on author 6.  | 12. implementing async/await with Axios
  const author = req.params.author;

  const booksUrl = `http://localhost:5000/`;
  
  try {
    const response = await axios.get(booksUrl);
    let allBooks = response.data;

    let foundBook = findBookByProperty(allBooks, "author", author);
    if (foundBook) {
      console.log(`Book successfully fetched by using author named: ${author}`);
      res.status(200).json({
        ISBN: foundBook.isbn,
        Author: foundBook.book.author,
        Title: foundBook.book.title,
        Reviews: foundBook.book.reviews
      });

    } else {
      res.status(404).json({ message: `Could not find book with Author named '${author}'. Please try again` });
    }
  
  } catch (err) {
    console.log(`Error fetching data: ${err.message}.`);
    res.status(500).json({ message: `Internal Server Error while fetching book data. Please try again` });
  }
});


public_users.get('/title/:title', async (req, res) => {  // Get all books based on title 7. |  13. implementing async/await with Axios
  const title = req.params.title;

  const booksUrl = `http://localhost:5000/`

  try {
    const response = await axios.get(booksUrl);
    let allBooks = response.data;

    const bookFound = findBookByProperty(allBooks, "title", title);
    if (bookFound) {
      console.log(`Book successfully fetched by using book title: ${title}`);
      res.status(200).json({
        ISBN: bookFound.isbn,
        Author: bookFound.book.author,
        Title: bookFound.book.title,
        Reviews: bookFound.book.reviews
      });
    } else {
      res.status(404).json({ message: `Could not find book with title: ${title}. Please try again` });
    }
  } catch (err) {
    console.error(`Error fetching data: ${err.message}`);
    res.status(500).json({ message: `Internal Server Error while fetching book data. Please try again` });
  }
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


/*  
 *  Approaches worth mentioning
 
  Using custom Promise to fetch by ISBN

// async function for (11)
const findBookIsbn = (isbn) => {
  return new Promise((reject, resolve) => {
    let book = books[isbn];
    setTimeout(() => {  // for practice 
      if (book) {
        console.log(`Fetched book with ISBN: ${isbn} successfully.`);
        resolve(book);
      } else {
        reject(new Error(`Could not find book with ISBN: ${isbn}. Please try again`));
      }
    }, 500);
  });
}

// Get book details based on ISBN         // 5. | 11. implementing custom Promise
public_users.get('/isbn/:isbn', async (req, res) => {
  const isbn = req.params.isbn;
  
  try {
    const bookDetails = await findBookIsbn(isbn);
    res.status(200).json({
      ISBN: bookDetals,
      Author: bookDetails.author,
      Title: bookDetails.title,
      Reviews: bookDetails.reviews
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});


 */
