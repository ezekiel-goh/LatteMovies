//-- Movies.js
const { query } = require('../database');

const {
    DUPLICATE_ENTRY_ERROR,
    EMPTY_RESULT_ERROR,
    MYSQL_ERROR_CODE,
    TABLE_ALREADY_EXISTS_ERROR,
} = require('../errors');


const postMovies = function (movieDetails) {
    const { id, title, poster_path, overview, release_date, runtime } = movieDetails
    const sql = "INSERT INTO Movies(id, title, poster_path, overview, release_date, runtime) VALUES (?, ?, ?, ?, ?, ?)";
    return query(sql, [id, title, poster_path, overview, release_date, runtime])
        .catch(function (error) {
            if (error.errno === MYSQL_ERROR_CODE.DUPLICATE_ENTRY) {
                console.log(`Movie with movie id: ${id} already exists in database`)
                throw new DUPLICATE_ENTRY_ERROR(`Movie with id: ${id} already exists in database`);
            } else {
                throw error;
            }
        })


}


const getMovies = function () {
    const sql = 'SELECT title, poster_path, id FROM Movies'
    return query(sql).then(function (response) {
        console.log(response[0]);
        const rows = response[0];
        return rows;
    })
}





module.exports = {
    postMovies,
    getMovies
}