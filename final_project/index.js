// # steps 
const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer",session({
  secret:"fingerprint_customer",
  resave: true, 
  saveUninitialized: true
}));

app.use("/customer/auth/*", (req, res, next) => { // 3. verifying JWT
  if (req.session.authorization) {
    let token = req.session.authorization['accessToken'];

    jwt.verify(token, 'access', (err, decoded) => {
      if (err) {
        console.log(`JWT verification failed (invalid or expired token: ${err.message}`);
        return res.status(403).json({ message: `User is not authenticated` });
      }

      req.user = decoded
      next();
    });

  } else {
    res.status(403).json({ message: `User not logged in. Please log in first` });
  }
});
 
const PORT = 5000;

app.use("/customer", customer_routes);  // for /login
app.use("/", genl_routes);


app.listen(PORT, () => {
  console.log(`Server Running in http://localhost:${PORT}`);
});

