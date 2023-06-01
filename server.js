require('dotenv').config();
const app = require('./controller/app.js');
const express = require("express");
app.use(express.static('public'));

app.get("/", (req, res) => {
  res.sendFile("/public/movies/homepage.html", { root: __dirname });
});

app.get("/importMovies", (req, res) => {
  res.sendFile("/public/movies/movies.html", { root: __dirname });
});


app.get("/movieDetails", (req, res) => {
  res.sendFile("/public/movieDetails.html", { root: __dirname });
});

app.get("/login/", (req, res) => {
  res.sendFile("/public/auth/login.html", { root: __dirname });
});

app.get("/addActor/", (req, res) => {
  res.sendFile("/public/addActor.html", { root: __dirname });
});

app.get("/moviePublisher", (req, res) => {
  res.sendFile("/public/moviePublisher/moviePublisher.html", { root: __dirname })
});

app.get('/userpage', (req, res) => {
  res.sendFile('/public/user/user.html', { root: __dirname })
});

const port = process.env.PORT || 3001;
app.listen(port, function () {
  // eslint-disable-next-line no-console
  console.log(`App listening on port ${port}`);
});
