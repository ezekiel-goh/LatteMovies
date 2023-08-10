require("dotenv").config();
const app = require("./controller/app.js");
const express = require("express");
const path = require('path');
app.use(express.static("public", { 'Content-Type': 'text/javascript'}));


//-- Homepage (Retrieving from API)
app.get("/", (req, res) => {
  res.sendFile("/public/movies/homepage.html", { root: __dirname });
});

//-- Import from API page
app.get("/importMovies", (req, res) => {
  res.sendFile("/public/movies/movies.html", { root: __dirname });
});

// Reviews
app.get("/reviews", (req, res) => {
  res.sendFile("/public/Reviews/Reviews.html", { root: __dirname });
});

// MovieDetails page
app.get("/movieDetails", (req, res) => {
  res.sendFile("/public/movies/movieDetails.html", { root: __dirname });
});

// Favorites page
app.get("/favorites", (req, res) => {
  res.sendFile("/public/movies/favorites.html", { root: __dirname });
});

// Reviews
app.get("/reviews", (req, res) => {
  res.sendFile("/public/reviews/reviews.html", { root: __dirname });
});

app.get("/movieDetails", (req, res) => {
  res.sendFile("/public/movieDetails.html", { root: __dirname });
});

app.get("/login", (req, res) => {
  res.sendFile("/public/login.html", { root: __dirname });
});

app.get("/Views/", (req, res) => {
  res.sendFile("/public/histogram/histogram.html", { root: __dirname });
});

app.get('/histogram.js', (req, res) => {
  try {
    const filePath = path.join(__dirname, 'models/histogram.js');
    res.sendFile(filePath);
  } catch (error) {
    console.error('Error serving histogram.js:', error);
    res.status(500).send('Internal Server Error');
  }
});


app.get('/moviePublisher', (req, res) => {
  if (req.session.role == 'Publisher') {
    res.sendFile('/public/moviePublisher/moviePublisher.html', { root: __dirname });
  } else {
    res.redirect('/');
  }
  res.sendFile('/public/moviePublisher/moviePublisher.html', { root: __dirname });
});

app.get('/userpage', (req, res) => {
  if (req.session.role == 'Customer') {
    res.sendFile('/public/user/user.html', { root: __dirname });
  } else {
    res.redirect('/');
  }
});

app.get("/register", (req, res) => {
  res.sendFile("/public/register.html", { root: __dirname });
});


const port = process.env.PORT || 3001;
app.listen(port, function () {
  // eslint-disable-next-line no-console
  console.log(`App listening on port ${port}`);
});