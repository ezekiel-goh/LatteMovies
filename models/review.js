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
const { query } = require("../database");

const {
  DUPLICATE_ENTRY_ERROR,
  EMPTY_RESULT_ERROR,
  MYSQL_ERROR_CODE,
  TABLE_ALREADY_EXISTS_ERROR,
} = require("../errors");

// const button = document.getElementById("post");
// button.addEventListener("click", (event) => {
//   event.preventDefault(); // Prevent the default form submission
//   var reviewValue = document.getElementById("Review").value;
// })

function postReview(Comments, Rating) {
  const sql = `INSERT INTO Reviews (MovieID, UserID, Comments, Rating) VALUES (6, 9, ?, ?)`;
  return query(sql, [Comments, Rating]).catch(function (error) {
    if (error.errno === MYSQL_ERROR_CODE.DUPLICATE_ENTRY) {
      throw new DUPLICATE_ENTRY_ERROR(
        `review already exists in the database`
      );
    } else {
      throw error;
    }
  });
}

function editReview(ReviewID, Rating, Comments) {
  const sql = `UPDATE Reviews SET Rating = ?, Comments = ? WHERE ReviewID = ?;`
  return query(sql, [ReviewID, Rating, Comments]).catch(function (error) {
    if (error.errno === MYSQL_ERROR_CODE.DUPLICATE_ENTRY) {
      throw new DUPLICATE_ENTRY_ERROR(
        `review already exists in the database`
      );
    } else {
      throw error;
    }
  });
}

function deleteReview(ReviewID) {
  const sql = `DELETE FROM Reviews WHERE ReviewID = ?;`
  return query(sql, [ReviewID]).catch(function (error) {
    if (error.errno === MYSQL_ERROR_CODE.DUPLICATE_ENTRY) {
      throw new DUPLICATE_ENTRY_ERROR(
        `review already exists in the database`
      );
    } else {
      throw error;
    }
  });
}
function retrieveReview() {
  const sql = `SELECT UserID, Rating, Comments FROM Reviews`
  return query(sql)
    .then((response) => {
      console.log(response[0]);
      const rows = response[0];
      return rows
    })
    .catch(function (error) {
      console.log(error)
    })
}




module.exports = {
  postReview,
  editReview,
  deleteReview,
  retrieveReview
};

module.exports = {
    postReview
}