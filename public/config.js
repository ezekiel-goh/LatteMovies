//TMDB Database

const API_KEY = '?api_key=ca7e7fc5b26b0852a4e3acda4d0c7bc5';
const BASE_URL = 'https://api.themoviedb.org';
//-- Get movie poster image
const IMG_URL = 'https://image.tmdb.org/t/p/w500/';

//-- List popular movies
const API_URL = BASE_URL + '/3/discover/movie' + API_KEY;

getMovies(API_URL);
module.exports = APIconnect;