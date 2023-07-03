/* 
-- Movies JS
-- Ezekiel Goh
-- Backend of movies.html
*/
 
const API_KEY = 'api_key=ca7e7fc5b26b0852a4e3acda4d0c7bc5';
const BASE_URL = 'https://api.themoviedb.org';
const IMG_URL = 'https://image.tmdb.org/t/p/w500/';
const API_URL = BASE_URL + '/3/discover/movie?sort_by=popularity.desc&' + API_KEY;
const CREDIT_URL = BASE_URL + '/3/movie/{movie_id}/credits' + API_KEY;


const main = document.getElementById('main')
getMovies(API_URL + '&with_genres=' + '10751');


function getMovies(url) {
  fetch(url).then(res => res.json())
    .then(data => {
      showMovies(data.results);
      console.log(data.results);
    })
}


function showMovies(data) {
  main.innerHTML = '';
  //-- removes every HTML content in main

  data.forEach(movie => {
    const { title, poster_path, id } = movie;
    const movieEl = document.createElement('div');
    movieEl.classList.add('col-4')
    movieEl.innerHTML = `

    <style>

    .form-group {
      position: relative;
      top: 55px;
      left: 135px;
    }

    .form-group input {
      padding: 0;
      height: initial;
      width: initial;
      margin-bottom: 0;
      display: none;
      cursor: pointer;
    }
    
    .form-group label {
      position: relative;
      cursor: pointer;
      bottom: 9px;
    }
    
    .form-group label:before {
      content:'';
      -webkit-appearance: none;
      background-color: #FFC107;
      border: 1px solid #FFC107;
      border-radius: 5px;    
      bottom: 3px;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05), inset 0px -15px 10px -12px rgba(0, 0, 0, 0.05);
      padding: 10px;
      display: inline-block;
      position: relative;
      vertical-align: middle;
      cursor: pointer;
      margin-right: 5px;
    }
    
    .form-group input:checked + label:after {
      content: '';
      display: block;
      position: absolute;
      top: 3px;
      left: 9px;
      width: 6px;
      height: 14px;
      border: solid #000;
      border-width: 0 2px 2px 0;
      transform: rotate(45deg);
    }
    
    .backgroundCB {
      border-radius: 15px;
      background: #000;
      border: 2px solid #000;
      padding: 20px; 
      width: 120px;
      height: 48px; 
    }

    </style>

    <div class="col">
    <div class="form-group">
    <div class="backgroundCB">
    <input type="checkbox" class="movie-checkbox btn btn-sm btn-outline-dark" id="${id}" ">
    <label class="tB" for="${id}">Select</label>
    </div>
    </div>
          <img src="${IMG_URL + poster_path}" class="card-img-top" alt="Movie Poster">
          <h5 class="card-title text-white mt-3">${title}</h5>
    </div>
    `

    main.appendChild(movieEl);

  })
}

{/* <div class="col">
<img src="${IMG_URL + poster_path}" class="card-img-top" alt="Movie Poster">
    <div class="d-flex justify-content-between align-items-center">
      <div class="btn-group">
      <input type="checkbox" class="movie-checkbox btn btn-sm btn-outline-dark" id="${id}">
      <label for="${id}" style="color:white">Add</label><br>
      </div> 
      <div class="card-content">
      <h2 class="card-title text-white">${title}</h2>
      </div>
    </div>
</div>
</div> */}







