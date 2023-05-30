// App.js
const express = require("express");
const createHttpError = require('http-errors');

const { EMPTY_RESULT_ERROR, DUPLICATE_ENTRY_ERROR, TABLE_ALREADY_EXISTS_ERROR } = require('../errors');

const app = express();
app.use(express.json()); // to process JSON in request body

app.use(express.static('public'));

// import models
// const histogram = require("../models/histogram");
// const moviePublisher = require("../models/moviePublisher");
// const Movies = require("../models/movie");
// const user = require("../models/user");
// const review = require("../models/review");



//import the body-parser middleware
const bodyParser = require("body-parser");
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


//-- Get Movie Titles from DB
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

//inserting views data
app.post('/insertData', async (req, res, next) => {
  try {
    const data = req.body;
    await histogram.insertData(pool, data); // Call the insertData function from histogram.js
    res.sendStatus(200);
  } catch (error) {
    console.error('Error inserting data:', error);
    next(error);
  }
});
//views getting data for histogram
app.get('/histogramData', async (req, res, next) => {
  try {
    histogram.generateHistogramData(pool, (histogramData) => { // Call the generateHistogramData function from histogram.js
      res.json(histogramData);
    });
  } catch (error) {
    console.error('Error retrieving data:', error);
    next(error);
  }
});
//   function (err, result) {
//   if (!err) {
//     console.log("no errors");
//     res.type("json");
//     res.status(201).send({ id: +result });
//   } else {
//     res.status(500).send({ error_msg: "Internal server error" });
//   }
// }

// -- Review Details

//-- Get Movie by ID
app.get('/movieDetails/:id', function (req, res) {  
const id = req.params.id

  Movies.getMovieDetailsById(id)
    .then((movieDetails) => {
      res.json(movieDetails); 
    })
    .catch(error => {
      console.error('Failed to retrieve movie(s)', error);
      res.sendStatus(500);
    });
});

//-- Delete Movie by  ID
app.delete('/movieDetails/:id', function (req, res) {  
  const id = req.params.id
  
    Movies.deleteMovieDetailsById(id)
      .then(() => {
        res.sendStatus(200); 
      })
      .catch(error => {
        console.error('Failed to delete movie', error);
        res.sendStatus(500);
      });
  });

  //-- Update Movie Price by ID
  app.put('/movieDetails/:id', function(req, res) {  
    const price = req.body.price
    const id = req.params.id
    
      Movies.updateMoviePriceById(price, id)
        .then(() => {
          res.sendStatus(200); 
        })
        .catch(error => {
          console.error('Failed to update movie price', error);
          res.sendStatus(500);
        });
    });

module.exports = app;
