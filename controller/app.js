// App.js

const express = require("express");
const app = express();

// import models
const histogram = require("../models/histogram");
const moviePublisher = require("../models/moviePublisher");
const movies = require("../models/movies");
const user = require("../models/user");
const review = require("../models/review");



//import the body-parser middleware
const bodyParser = require("body-parser");
// var urlencodedParser = bodyParser.urlencoded({ extended: false });

//use the middleware
app.use(bodyParser.json());

const cors = require("cors");
app.use(cors());


// const jwt = require("jsonwebtoken");
// const JWT_SECRET = process.env.JWT_SECRET;
// const isLoggedInMiddleware = require("../isLoggedInMiddleware");


// -- Search By


// -- Movie Details
app.get("/movieDetails", function (req, res) {
  var id = req.query.film_id;
  Film.FilmDetails(film_id, (err, result) => {
    //-- you either get err or result
  
    if (!err) {
      console.log(result.length);
      if (result[0] === undefined) {
        //-- When id = undefined
        res.status(200).send([]);
      } else {
        res.status(200).send(result);
      }
    } else {
      res.status(500).send({ error_msg: "Internal server error" });
    }
  });
});


module.exports = app;
