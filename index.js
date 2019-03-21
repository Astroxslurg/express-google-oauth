const express = require("express");
const session = require("express-session");
const passport = require("passport");

require("dotenv").config();
const oauth = require("./oauth");

const app = express();

app.set("etag", false);
app.set("trust proxy", true);

// [START session]
// Configure the session and session storage.
const sessionConfig = {
  resave: false,
  saveUninitialized: false,
  secret: process.env.SECRET,
  signed: true
};

app.use(session(sessionConfig));
// [END session]

// OAuth2
app.use(passport.initialize());
app.use(passport.session());
app.use(oauth.router);

// // Books
// app.use('/books', require('./books/crud'));
// app.use('/api/books', require('./books/api'));
//
// // Redirect root to /books
// app.get('/', (req, res) => {
//   res.redirect('/books');
// });

app.get("/", (req, res) =>
  res.send("<html><body><h1>Hello and welcome!</h1></body></html>")
);
app.get("/auth/privacy.html", (req, res) =>
  res.send(
    "<html><body>\
Your profile information will only be used for authenticating in this project, and will not be stored.\
</body></html>"
  )
);

app.use(oauth.required);

app.get("/restricted", (req, res) =>
  res.send(
    "<html><body style='background-color: #371212; color: #edd'><h1>Welcome to the restricted area!</h1></body></html>"
  )
);

// Basic 404 handler
app.use((req, res) => {
  res.status(404).send("Not Found");
});

// Basic error handler
app.use((err, req, res) => {
  /* jshint unused:false */
  console.error(err);
  // If our routes specified a specific response, then send that. Otherwise,
  // send a generic message so as not to leak anything.
  res.status(500).send(err.response || "Something broke!");
});

const port = +(process.env.PORT || 3000);

app.listen(port, err => {
  if (err) {
    throw err;
  } else {
    console.log(`> Environment = ${process.env.NODE_ENV || "development"}`);
    console.log(`> Ready on http://localhost:${port}`);
  }
});
