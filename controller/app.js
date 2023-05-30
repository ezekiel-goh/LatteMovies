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
const review = require("../models/review");


//import the body-parser middleware
const bodyParser = require("body-parser");
// var urlencodedParser = bodyParser.urlencoded({ extended: false });

//use the middleware
app.use(bodyParser.json());

const cors = require("cors");
app.use(cors());



// -- Movie Details
// app.post('/', function (req, res) {
//   const movieDetails = req.body

//   Movies.postMovies(movieDetails)
//     .then(() => {
//       res.sendStatus(201); // Return a success status code
//     })
//     .catch(error => {
//       console.error('Failed to insert movie details:', error);
//       res.sendStatus(500); // Return an error status code
//     });
// });

// -- Review details

app.post('/reviews', function (req, res) {
  const Comments = req.body.Comments
  const Rating = req.body.Rating
  console.log(req.body)

  return review
    .postReview(Comments, Rating)
    .then(() => {
      res.sendStatus(201); // Return a success status code
    })
    .catch(error => {
      console.error('Failed to insert review:', error);
      res.sendStatus(500); // Return an error status code
    });
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
module.exports = app;
