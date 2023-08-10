const { query } = require('../database');
const { MYSQL_ERROR_CODE, DUPLICATE_ENTRY_ERROR, NOT_FOUND_ERROR } = require('../errors.js');

module.exports.getAllMovies = function getAllMovies(publisher_id) {
    return query('SELECT * FROM Movies WHERE publisher_id = ?', [publisher_id]).then((movies) => {
        return movies;
    });
};

module.exports.getMovie = function getMovie(id) {
    return query('SELECT * FROM Movies WHERE id = ?', [id]).then((movie) => {
        if (!movie) throw new NotFoundError(`Movie ${id}`);
        return movie;
    });
};

module.exports.addMovie = function addMovie(id, title, poster_path, overview, release_date, runtime, publisher_id) {
    return query(
        'INSERT INTO Movies (id, title, poster_path, overview, release_date, runtime, publisher_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [id, title, poster_path, overview, release_date, runtime, publisher_id]
    )
        .then(() => {
            return;
        })
        .catch((error) => {
            if (error.errno === SqlLiteErrorCodes.SQLITE_CONSTRAINT) throw new DUPLICATE_ENTRY_ERROR(`Movie ${id}`);
        });
};

module.exports.updateMovie = function updateMovie(id, updatedId, title, poster_path, overview, release_date, runtime) {
    return query(
        'UPDATE Movies SET id = ?, title = ?, poster_path = ?, overview = ?, release_date = ?, runtime = ? WHERE id = ?',
        [updatedId, title, poster_path, overview, release_date, runtime, id]
    )
        .then((response) => {
            if (!response.changes) throw new NOT_FOUND_ERROR(`Movie ${id}`);
            return;
        });
};

module.exports.deleteMovie = function deleteMovie(id) {
    return query('DELETE FROM Movies WHERE id = ?', [id]).then((response) => {
        if (!response.changes) throw new NOT_FOUND_ERROR(`Movie ${id}`);
        return;
    });
};

// retrieve private movie data
