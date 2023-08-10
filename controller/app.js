// App.js
const express = require("express");
const session = require('express-session');
const createHttpError = require('http-errors');
const cors = require("cors")

const { EMPTY_RESULT_ERROR, DUPLICATE_ENTRY_ERROR, TABLE_ALREADY_EXISTS_ERROR, NOT_FOUND_ERROR } = require('../errors');

const app = express();
app.use(cors())
app.use(express.json()); // to process JSON in request body
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));

// import models

// const moviePublisher = require("../models/moviePublisher");
const Movies = require("../models/movie");
// const user = require("../models/user");
const histogram = require("../models/histogram");
const moviePublisher = require("../models/moviePublisher");
const { getUserInfo, addUser, updateUserInfo, addCustomer, addPublisher,
  deleteUserCustomer, deleteUserPublisher, login,
  buyMovie, getPurchase, getReviewByUser, getFavouriteByUser } = require('../models/user.js');
const review = require("../models/review");



//import the body-parser middleware
const bodyParser = require("body-parser");
//use the middleware
app.use(bodyParser.json());



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
  const { userID, movieID, timestamp } = req.body;
  histogram.insertData(userID, movieID, timestamp)
    .then(() => {
      res.sendStatus(204);
    })
    .catch(error => {
      console.error('Failed to insert data:', error);
      res.sendStatus(500);
    });
});

//views getting data for histogram
app.get('/movieHistogram/:id', function (req, res) {
  const movieID = req.params.id;
  histogram.generateHistogramData(movieID)
    .then((histogramData) => {
      res.json(histogramData);
    })
    .catch(function (error) {
      console.error('Error fetching histogram data:', error);
      res.status(500).json({ error: 'Error fetching histogram data' });
    });
});


//-- Get Movie Details (for Recommendations)
app.get('/allMovieDetails/', function (req, res) {

  Movies.getMovieDetails()
    .then((movieDetails) => {
      res.json(movieDetails);
    })
    .catch(error => {
      console.error('Failed to retrieve movie(s)', error);
      res.sendStatus(500);
    });
});

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
app.put('/movieDetails/:id', function (req, res) {
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

//-- Favorite Movies (INSERT)
app.post('/likedMovies', function (req, res) {
  const { id, userID } = req.body;

  favorite.postLiked({ id, userID })
    .then(() => {
      res.sendStatus(201);
    })
    .catch(error => {
      console.error('Error posting liked movie:', error);
      res.sendStatus(500);
    });
});


//-- Submit Review
app.post('/reviews', function (req, res) {
  const Comments = req.body.Comments
  const MovieID = req.body.MovieID
  const Rating = req.body.Rating
  console.log(req.body)

  review.postReview(MovieID, Comments, Rating)
    .then(() => {
      res.sendStatus(201); // Return a success status code
    })
    .catch(error => {
      console.error('Failed to retrieve review(s)', error);
      res.sendStatus(500);
    });
});

// -- Update Review
app.put('/reviews', function (req, res) {
  const ReviewID = req.body.ReviewID
  const Rating = req.body.Rating
  const Comments = req.body.Comments

  review.editReview(Rating, Comments, ReviewID)
    .then((response) => {
      console.log(response[0])
      res.sendStatus(201); // Return a success status code
    })
    .catch(error => {
      console.error('Failed to update review(s)', error);
      res.sendStatus(500);
    });
})

//Delete review by ID
app.delete('/reviews/:id', function (req, res) {
  const ReviewID = req.params.id
  console.log(req.body.ReviewID)
  review.deleteReview(ReviewID)
    .then(() => {
      res.sendStatus(201); // Return a success status code
    })
    .catch(error => {
      console.error('Failed to delete review(s)', error);
      res.sendStatus(500);
    });
})

//Delete all reviews
app.delete('/reviews', function (req, res) {
  console.log(req.body.MovieID)
  const MovieID = req.body.MovieID
  review.deleteAllReview(MovieID)
    .then(() => {
      res.sendStatus(201); // Return a success status code
    })
    .catch(error => {
      console.error('Failed to delete review(s)', error);
      res.sendStatus(500);
    });
})

// -- Get Review
app.get('/reviews/data/:MovieID', function (req, res) {
  console.log(req.params.MovieID)
  MovieID = req.params.MovieID
  Promise.all([(review.retrieveReview(MovieID)), (review.getAvgRating(MovieID))])
    .then((response) => {
      // console.log(JSON.stringify(response))
      res.json(response);
      // console.log(response)
      return response
    })
    .catch(error => {
      console.error('Failed to retrieve review(s)', error);
      res.sendStatus(500);
    });
})

app.get('/reviews/sort/:MovieID', function (req, res) {

  MovieID = req.params.MovieID
  review.sortReviewByID(MovieID)
    .then((response) => {
      res.json(response);
      console.log(response[0])
    })
    .catch(error => {
      res.sendStatus(500);
    })
})

app.get('/reviews/sort2/:MovieID', function (req, res) {

  MovieID = req.params.MovieID
  review.sortReviewByRating(MovieID)
    .then((response) => {
      res.json(response);
      console.log(response[0])
    })
    .catch(error => {
      res.sendStatus(500);
    })
})

app.get('/reviews/best', function (req, res) {

  review.getReview()
    .then((review) => {
      res.json(review);
      console.log(review)
    })
    .catch(error => {
      console.error('Failed to get review', error)
      // res.sendStatus(500);
    })
})


//-- Delete Movie by ID
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
app.put('/movieDetails/:id', function (req, res) {
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
app.get('/reviews/data/:userid', async (req, res) => {
  const userID = req.params.userid;
  const userInfo = await getReviewByUser(userID);
  res.status(200).json(userInfo[0]);
  console.log(userInfo[0]);
});

app.get('/purchase/:userid', async (req, res) => {
  const userID = req.params.userid;
  const userInfo = await getPurchase(userID);
  res.status(200).json(userInfo[0]);
  console.log(userInfo[0]);
});

app.get('/favourites/:userid', async (req, res) => {
  const userID = req.params.userid;
  const userInfo = await getFavouriteByUser(userID);
  res.status(200).json(userInfo[0]);
  console.log(userInfo[0]);
});

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

app.post('/user/buymovie', async (req, res) => {
  try {
    const CustomerID = req.body.CustomerID;
    const MovieID = req.body.MovieID;
    await buyMovie(MovieID, CustomerID);
    res.status(200).send();
  } catch (error) {
    console.log(error);
  }
});

/*-----------------
  publisher stuff
-----------------*/

// general login function
app.post('/auth', (req, res) => {
  let username = req.body.username;
  let password = req.body.password;
  let UserID = req.body.UserID;

  login(username, password, UserID)
    .then((user) => {
      if (!user) {
        res.redirect('/login');
      } else {
        req.session.isLoggedIn = true;
        req.session.username = user.Username;
        req.session.role = user.Role;
        req.session.UserID = user.UserID
        res.redirect('/');
      }
    });
});

app.get('/auth/userDetails', (req, res, next) => {
  console.log(req.session);
  const role = req.session.role;
  const UserID = req.session.UserID;
  res.json({role, UserID})
});

app.get('/api/moviePublisher', (req, res, next) => {
  const publisher_id = req.session.username;
  moviePublisher.getAllMovies(publisher_id)
    .then(function (movies) {
      return res.json({ data: movies });
    })
    .catch(function (error) {
      next(error);
    });
});

// currently unused
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

app.post('/api/moviePublisher', (req, res, next) => {
  const movieId = req.body.movieId;
  const title = req.body.title;
  const posterPath = req.body.posterPath;
  const overview = req.body.overview;
  const releaseDate = req.body.releaseDate;
  const runtime = req.body.runtime;
  const publisherId = req.session.username;
  moviePublisher.addMovie(movieId, title, posterPath, overview, releaseDate, runtime, publisherId)
    .then(() => {
      return res.sendStatus(201);
    })
    .catch((error) => {
      if (error instanceof DUPLICATE_ENTRY_ERROR) {
        next(createHttpError(400, error.message));
      } else {
        next(error);
      }
    });
});

app.put('/api/moviePublisher/:movieId', (req, res, next) => {
  const movieId = req.params.movieId;
  const updatedMovieId = req.body.movieId;
  const title = req.body.title;
  const posterPath = req.body.posterPath;
  const overview = req.body.overview;
  const releaseDate = req.body.releaseDate;
  const runtime = req.body.runtime;
  moviePublisher.updateMovie(movieId, updatedMovieId, title, posterPath, overview, releaseDate, runtime)
    .then(() => {
      return res.sendStatus(200);
    })
    .catch((error) => {
      if (error instanceof NOT_FOUND_ERROR) {
        next(createHttpError(404, error.message));
      } else {
        next(error);
      }
    });
});

app.delete('/api/moviePublisher/:movieId', (req, res, next) => {
  const movieId = req.params.movieId;
  moviePublisher.deleteMovie(movieId)
    .then(function () {
      return res.sendStatus(200);
    })
    .catch((error) => {
      if (error instanceof NOT_FOUND_ERROR) {
        next(createHttpError(404, error.message));
      } else {
        next(error);
      }
    });
});

module.exports = app;
