//-- films.js models

const { query } = require('../database');
const {
    DUPLICATE_ENTRY_ERROR,
    EMPTY_RESULT_ERROR,
    MYSQL_ERROR_CODE,
    TABLE_ALREADY_EXISTS_ERROR,
} = require('../errors');

module.exports.insertNewMovie = function insertNewMovie(code, name, credit) {
    const sql = `INSERT INTO modules_tab (code, name, credit) VALUES (?, ?, ?)`;
    return query(sql, [code, name, credit]).catch(function (error) {
        if (error.errno === MYSQL_ERROR_CODE.DUPLICATE_ENTRY) {
            throw new DUPLICATE_ENTRY_ERROR(`Module ${code} already exists`);
        }
        throw error;
    });
};

module.exports.retrieveDiscoverMovies = function retrieveDiscoverMovies(code) {
    const sql = `SELECT * FROM modules_tab WHERE code = ?`;
    return query(sql, [code]).then(function (result) {
        const rows = result[0];
        if (rows.length === 0) {
            throw new EMPTY_RESULT_ERROR(`Module ${code} not found!`);
        }
        return rows[0];
    });
};