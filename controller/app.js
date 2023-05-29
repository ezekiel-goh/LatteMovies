// App.js


const express = require("express");
const createHttpError = require('http-errors');


const { EMPTY_RESULT_ERROR, DUPLICATE_ENTRY_ERROR, TABLE_ALREADY_EXISTS_ERROR } = require('../errors');

const app = express();
app.use(express.json()); // to process JSON in request body

app.use(express.static('public'));
// import models
const histogram = require("../models/histogram");
const moviePublisher = require("../models/moviePublisher");
const Movies = require("../models/movie");
const user = require("../models/user");
const review = require("../models/review");


//import the body-parser middleware
const bodyParser = require("body-parser");
// var urlencodedParser = bodyParser.urlencoded({ extended: false });

//use the middleware
app.use(bodyParser.json());

const cors = require("cors");
app.use(cors());



// -- Movie Details
app.post('/importMovies', function (req, res) {
  const movieDetails = req.body

  Movies.postMovies(movieDetails)
    .then(() => {
      res.sendStatus(204); 
    })
    .catch(error => {
      console.error('Failed to insert movie details:', error);
      res.sendStatus(500);
    });
});


//-- Get movie titles from DB
app.get('/movies', function (req, res) {  

  Movies.getMovies()
    .then((movies) => {
      res.json(movies); 
    })
    .catch(error => {
      console.error('Failed to retrieve movie(s)', error);
      res.sendStatus(500);
    });
});

module.exports = app;
