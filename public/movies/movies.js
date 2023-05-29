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

//https://api.themoviedb.org/3/discover/movie?api_key=ca7e7fc5b26b0852a4e3acda4d0c7bc5

const main = document.getElementById('main')
// const form = document.getElementById('form') 

//https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=1cf50e6248dc270629e802686245c2c8&with_genres=10751
getMovies(API_URL + '&with_genres=' + '10751, 36');


function getMovies(url) {

  fetch(url).then(res => res.json())
    //-- converts to response to json
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
    //-- title and poster path taken for each movie from an array
    const movieEl = document.createElement('div');
    // const Titles = data.results;
    // console.log(Titles);
    // console.log(data)
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


//--  overlay (deprecated)
// const overlayContent = document.getElementById('overlay-content')

// function openNav(movie) {
//   let id = movie.id;
//   fetch(BASE_URL + '/3/movie/' + id + '?' + API_KEY)
//   .then(res => res.json())
//   .then(movieData => {
//       // showMovieDetails(movieData.results)
//       const movieDetails = movieData
//       console.log(movieData)
//       console.log(movieData.title)
//       console.log(movieData.release_date)
//       console.log(movieData.runtime)
//       console.log(movieData.overview)
//       console.log(movieData.length)

//       if (movieDetails) {
//         document.getElementById("myNav").style.width = "100%";
//         if(movieDetails != null) {

//         // overlay.innerHTML = '';

//         movieData((movieDetail) => {
//           const { release_date, runtime, overview } = movieDetail;
//           const overlayContent = document.createElement('div');
//           // console.log(Titles);
//           // console.log(data)
//           // overlayContentDetails.classList.add('col-4')
//           const overlayDetails = `
//           <div class = "col-4">
//                 <div class="card-body ">
//                     <h1 class="text-white">Lorem</h1>
//                     <p class="text-light">
//                         <br> runtime: ${movieDetail.runtime}
//                         <br> release_date: ${movieDetail.release_date}
//                         <br> overview: ${movieDetail.overview}
//                     <p id="actorName" class="text-light"></p>
//                         </p>
//                 </div>
//                 <div>
//     `
//     overlayContent.appendChild(overlayDetails);

//   })
//       } else {
//         overlayContent.innerHTML = `<h1 class="no-results">No Results Found</h1>`
//       }}
//     }
//     )
// }

// function closeNav() {
//   document.getElementById("myNav").style.width = "0%";
// }

// axios.get(`${baseUrl}/filmDetails?film_id=${params.film_id}`)
//         .then((response) => {
//             const detail = response.data;
//             const Details = `

//                 <div class="card-body ">
//                     <h1 class="text-light">${detail[0].title}</h1>
//                     <p class="text-light">${detail[0].release_year}
//                         <br> ${detail[0].rating} 
//                         <br> Category: ${detail[0].category}
//                         <br> release_year: ${detail[0].release_year}
//                         <br> description: ${detail[0].description}
//                     <p id="actorName" class="text-light"></p>
//                         </p>
//                 </div>
//                         `;

//             $("#Details").append(Details);
//             for (var i = 0; i <= detail.length; i++) {
//                 const Actors = `<ul>${detail[i].first_name} ${detail[i].last_name}</ul>`
//                 $("#actorName").append(Actors);
//             }
//         })

//         .catch((error) => {
//             console.log(error);
//         });

function movieInfo(movie) {
  let id = movie.id
  fetch(BASE_URL + '/3/movie/' + id + '/videos' + API_KEY).then(res => res.json()).then(videoData => {
    console.log(videoData)
  })
}

// module.exports = movies;


