/* 
-- Movies JS
-- Ezekiel Goh
-- This part of the models folder contains the backend of the file 
*/

const API_KEY = '?api_key=ca7e7fc5b26b0852a4e3acda4d0c7bc5';
const BASE_URL = 'https://api.themoviedb.org';
const IMG_URL = 'https://image.tmdb.org/t/p/w500/';
const API_URL = BASE_URL + '/3/movie/top_rated' + API_KEY;

//https://api.themoviedb.org/3/discover/movie?api_key=ca7e7fc5b26b0852a4e3acda4d0c7bc5

const main = document.getElementById('main')
// const form = document.getElementById('form') 

//https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=1cf50e6248dc270629e802686245c2c8&with_genres=10751
getMovies(API_URL + '&with_genres=' + 10751, 36);

function getMovies(url) {

  fetch(url).then(res => res.json())
    //-- converts to response to json
    .then(data => {
      showMovies(data.results);
      console.log(data.results)
      showMovies(data.results)
    })
}




function showMovies(data) {
  main.innerHTML = '';
  //-- removes every HTML content in main

  data.forEach(movie => {
    const {title, poster_path } = movie;
    const movieEl = document.createElement('div');
    // const Titles = data.results;
    // console.log(Titles);
    // console.log(data)
    movieEl.classList.add('col-4')
    movieEl.innerHTML = `

    <div class="col-12 col-sm-4 my-3">
          <div class="card" style="width: 18rem">
          <img class="bd-placeholder-img" src="${IMG_URL + poster_path}"><text x="50%" y="50%" fill="#eceeef" dy=".3em">Thumbnail</text></img>          
              <div class="d-flex justify-content-between align-items-center">
                <div class="btn-group">
                  <button type="button" class="btn btn-sm btn-outline-dark">View</button>
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
module.exports = movies;

{/* <div class="col"-12 col-sm-4 my-3>
<div class="card rounded-4">
  <img class="bd-placeholder-img" src="${IMG_URL+poster_path}"><text x="50%" y="50%" fill="#eceeef" dy=".3em">Thumbnail</text></img>
  <div class="card-body">
    <p class="card-text">This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p>
    <div class="d-flex justify-content-between align-items-center">
      <div class="btn-group">
        <button type="button" class="btn btn-sm btn-outline-secondary">View</button>
        <button type="button" class="btn btn-sm btn-outline-secondary">Edit</button>
      </div>
      <small class="text-body-secondary">9 mins</small>
    </div>
  </div>
</div>
</div> */}
