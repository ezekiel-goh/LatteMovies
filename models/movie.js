//-- Movies.js
const { query } = require('../database');

const {
    DUPLICATE_ENTRY_ERROR,
    EMPTY_RESULT_ERROR,
    MYSQL_ERROR_CODE,
    TABLE_ALREADY_EXISTS_ERROR,
} = require('../errors');


//-- Create API Movies into LatteMovies DB
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

//-- Retrieve Movies from LatteMovies DB
const getMovies = function () {
    const sql = 'SELECT title, poster_path, id FROM Movies'
    return query(sql).then(function (response) {
        console.log(response[0]);
        const rows = response[0];
        return rows;
    })
}

//-- Retrieve Movies from LatteMovies DB by ID
const getMovieDetailsById = function (id) {
    const sql = 'SELECT * FROM Movies WHERE id = ?'
    return query(sql, [id]).then(function (result) {
        console.log(result[0]);
        const rows = result[0];
        return rows;
    })
}

const deleteMovieDetailsById = function (id) {
    const sql = 'DELETE FROM Movies WHERE id = ?'
    return query(sql, [id])
        .catch(function (error) {
            throw error
        })
}

const updateMoviePriceById = function (price, id) {
    const sql = 'UPDATE Movies SET Price = ? WHERE id = ?;'
    return query(sql, [price, id])
        .catch(function (error) {
            throw error
        })
}

module.exports = {
    postMovies,
    getMovies,
    getMovieDetailsById,
    deleteMovieDetailsById,
    updateMoviePriceById
}