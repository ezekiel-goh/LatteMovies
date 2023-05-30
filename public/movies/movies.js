/* 
-- Movies JS
-- Ezekiel Goh
-- This part of the models folder contains the backend of the file 
*/
 
const API_KEY = 'api_key=ca7e7fc5b26b0852a4e3acda4d0c7bc5';
const BASE_URL = 'https://api.themoviedb.org';
const IMG_URL = 'https://image.tmdb.org/t/p/w500/';
const API_URL = BASE_URL + '/3/discover/movie?sort_by=popularity.desc&' + API_KEY;
const CREDIT_URL = BASE_URL + '/3/movie/{movie_id}/credits' + API_KEY;


const main = document.getElementById('main')
getMovies(API_URL + '&with_genres=' + '10751, 36');


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

    <div class="col-12 col-sm-4 my-3">
          <div class="card" style="width: 18rem">
          <img class="bd-placeholder-img" src="${IMG_URL + poster_path}"><text x="50%" y="50%" fill="#eceeef" dy=".3em">'&nbsp'</text></img>          
              <div class="d-flex justify-content-between align-items-center">
                <div class="btn-group">
                <input type="checkbox" class="movie-checkbox btn btn-sm btn-outline-dark" id="${id}">
                <label for="${id}" style="color:red">Add</label><br>
                </div> 
                <text class="text-dark">${title}</text>
              </div>
             </div>
          </div>
    </div>
    `

    main.appendChild(movieEl);

  })
}







