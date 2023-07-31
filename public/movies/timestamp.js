// import { insertData } from 'models/histogram.js';

// import axios from 'axios';

const moviePlayer = document.getElementById('moviePlayer');

function getMovieIDFromURL() {
  var urlParams = new URLSearchParams(window.location.search);
  var movieID = urlParams.get('id');
  console.log('Movie ID from URL:', movieID);
  return movieID;
}

// For testing purposes
var currentUserID = 1;
// const movieID = 1;
var movieID = getMovieIDFromURL(); // getting movieid from url

let lastTimestamp = -1;

function handleTimeChange() {
  console.log('timestamp change');
  const currentTime = Math.floor(moviePlayer.currentTime);

  if (currentTime !== lastTimestamp) {
    insertData(currentUserID, movieID, currentTime);
    lastTimestamp = currentTime;
  }
}

// function sendData(userID, movieID, timestamp) {
//   const url = 'http://localhost:3000/insertData'; // Replace with your server endpoint URL
//   const data = {
//     userID: userID,
//     movieID: movieID,
//     timestamp: timestamp
//   };

//   axios.post(url, data)
//     .then(response => {
//       console.log('Timestamp data sent successfully');
//     })
//     .catch(error => {
//       console.error('Error sending timestamp data:', error);
//     });
// }

moviePlayer.addEventListener('seeked', handleTimeChange);