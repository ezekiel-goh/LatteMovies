// App.js
const express = require("express");
const createHttpError = require('http-errors');

const { EMPTY_RESULT_ERROR, DUPLICATE_ENTRY_ERROR, TABLE_ALREADY_EXISTS_ERROR, NOT_FOUND_ERROR } = require('../errors');

const app = express();
app.use(express.json()); // to process JSON in request body

app.use(express.static('public'));

// import models

const histogram = require("../models/histogram");
// const moviePublisher = require("../models/moviePublisher");
const Movies = require("../models/movie");
// const user = require("../models/user");
// const histogram = require("../models/histogram");
const moviePublisher = require("../models/moviePublisher");
// const Movies = require("../models/movie");
const { getUserInfo, addUser, updateUserInfo, addCustomer, addPublisher,
  deleteUserCustomer, deleteUserPublisher } = require('../models/user.js');
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
app.post('/insertData', function (req, res) {
  const { viewsData } = req.body;
  histogram.insertData(req, res); // Pass the req and res objects to the insertData function
});

//views getting data for histogram
app.get('/generateHistogramData', function(req, res) {
  histogram.generateHistogramData(req, res); // Call the generateHistogramData function from histogram.js
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

    /**
     * User C.R.U.D.
     */
    app.get('/user/:userid', async (req, res) => {
      const userID = req.params.userid;
      const userInfo = await getUserInfo(userID);
      if (userInfo[0] === null || userInfo[0] === undefined || userID === undefined || userID === null || !userID) {
        console.error('Error retrieving data');
        res.status(500).send();
      }
      res.status(200).json(userInfo[0]);
      console.log(userInfo[0]);
    });
    
    app.post('/user', async (req, res) => {
      try {
        const Username = req.body.Username;
        const Password = req.body.Password;
        const Role = req.body.Role;
        await addUser(Username, Password, Role);
    
        if (Role === 'Customer') {
          await addCustomer(Username);
          res.status(201).send('User Customer created');
        }
    
        if (Role === 'Publisher') {
          await addPublisher(Username);
          res.status(201).send('User Publisher created');
        }
      } catch (error) {
        console.error('Error inserting record:', error);
        res.status(500).send('Error inserting record');
      }
    });
    
    app.put('/user/:userid', async (req, res) => {
      try {
        const UserID = parseInt(req.params.userid);
        const Password = req.body.Password;
        await updateUserInfo(UserID, Password);
        res.status(200).send('User updated');
      } catch (error) {
        console.error('Error updating record:', error);
        res.status(500).send('Error updating record!');
      }
    });
    
    app.delete('/user/:userid', async (req, res) => {
      try {
        const UserID = req.params.userid;
    
        Promise.all([deleteUserCustomer(UserID), deleteUserPublisher(UserID)]).then(() => {
          res.status(200).send('User deleted');
        });
      } catch (error) {
        console.error('Error deleting record:', error);
        res.status(500).send('Error deleting record');
      }
    });


/*-----------------
  publisher stuff
-----------------*/

// implement some login verification later

app.get('/api/moviePublisher', (req, res, next) => {
  moviePublisher.getAllMovies()
    .then(function (movies) {
      return res.json({ data: movies });
    })
    .catch(function (error) {
      next(error);
    });
});

app.get('/api/moviePublisher/:id', (req, res, next) => {
  const movieId = req.params.movieId;
  moviePublisher.getMovie(movieId)
    .then(function (movie) {
      return res.json({ data: movie });
    })
    .catch(function (error) {
      if (error instanceof NOT_FOUND_ERROR) {
        next(createHttpError(404, error.message));
      } else {
        next(error);
      }
    });
});

app.post('/api/moviePublisher', function (req, res, next) {
  const movieId = req.body.movieId;
  const title = req.body.title;
  const posterPath = req.body.posterPath;
  const overview = req.body.overview;
  const releaseDate = req.body.releaseDate;
  const runtime = req.body.runtime;
  moviePublisher.addMovie(movieId, title, posterPath, overview, releaseDate, runtime)
    .then(function () {
      return res.sendStatus(201);
    })
    .catch(function (error) {
      if (error instanceof DUPLICATE_ENTRY_ERROR) {
        next(createHttpError(400, error.message));
      } else {
        next(error);
      }
    });
});

app.put('/api/moviePublisher/:movieId', function (req, res, next) {
  const movieId = req.params.movieId;
  const updatedMovieId = req.body.movieId;
  const title = req.body.title;
  const posterPath = req.body.posterPath;
  const overview = req.body.overview;
  const releaseDate = req.body.releaseDate;
  const runtime = req.body.runtime;
  moviePublisher.updateMovie(movieId, updatedMovieId, title, posterPath, overview, releaseDate, runtime)
    .then(function () {
      return res.sendStatus(200);
    })
    .catch(function (error) {
      if (error instanceof NOT_FOUND_ERROR) {
        next(createHttpError(404, error.message));
      } else {
        next(error);
      }
    });
});

app.delete('/api/moviePublisher/:movieId', function (req, res, next) {
  const movieId = req.params.movieId;
  moviePublisher.deleteMovie(movieId)
    .then(function () {
      return res.sendStatus(200);
    })
    .catch(function (error) {
      if (error instanceof NOT_FOUND_ERROR) {
        next(createHttpError(404, error.message));
      } else {
        next(error);
      }
    });
});

module.exports = app;
