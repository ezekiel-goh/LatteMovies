//-- Movies.js
// -- Ezekiel Goh

const { query } = require('../database');

const {
    DUPLICATE_ENTRY_ERROR,
    EMPTY_RESULT_ERROR,
    MYSQL_ERROR_CODE,
    TABLE_ALREADY_EXISTS_ERROR,
} = require('../errors');


//-- Create API Movies into LatteMovies DB
const postLiked = function (details) {
    const { id, userID } = details;
    const sql = "INSERT INTO Favourites(userID, id) VALUES (?, ?)";
    return query(sql, [userID, id]) 
      .catch(function (error) {
        if (error.errno === MYSQL_ERROR_CODE.DUPLICATE_ENTRY) {
          console.log(`Movie with movie id: ${id} already exists in database`);
          throw new DUPLICATE_ENTRY_ERROR(`Movie with id: ${id} already exists in database`);
        } else {
          throw error;
        }
      });
  };

//-- Retrieve Movies from LatteMovies DB
const getLiked = function () {
    const sql = 'SELECT title, userID, id FROM Favourites'
    return query(sql).then(function (response) {
        console.log(response[0]);
        const rows = response[0];
        return rows;
    })
}


module.exports = {
    postLiked,
    getLiked
}