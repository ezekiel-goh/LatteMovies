const { query } = require('../database');

const {
    DUPLICATE_ENTRY_ERROR,
    EMPTY_RESULT_ERROR,
    MYSQL_ERROR_CODE,
    TABLE_ALREADY_EXISTS_ERROR,
} = require('../errors');

function postReview(Review) {
    var Review = document.getElementById('Review').value
    const sql = "INSERT INTO Reviews(review) VALUES (?)";
    return query(sql, [Review])
        .catch(function (error) {
            if (error.errno === MYSQL_ERROR_CODE.DUPLICATE_ENTRY) {
                throw new DUPLICATE_ENTRY_ERROR(`Movie with id: ${id} already exists in database`);
            } else {
                throw error;
            }
        })
}

module.exports = {
    postReview
}