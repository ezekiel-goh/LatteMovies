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


  // const button = document.getElementById("post");
  // button.addEventListener("click", (event) => {
  //   event.preventDefault(); // Prevent the default form submission
  //   var reviewValue = document.getElementById("Review").value;
  // })

  function postReview(MovieID, Comments, Rating) {
    const sql = `INSERT INTO Reviews (MovieID, UserID, Comments, Rating) VALUES (?, 9, ?, ?)`;
    return query(sql, [MovieID, Comments, Rating]).catch(function (error) {
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

  function deleteAllReview(MovieID) {
    const sql = 'DELETE FROM Reviews WHERE MovieID = ?'
    return query(sql, [MovieID]).catch(function (error) {
      if (error.errno === MYSQL_ERROR_CODE.DUPLICATE_ENTRY) {
        throw new DUPLICATE_ENTRY_ERROR(
          `review already exists in the database`
        );
      } else {
        throw error;
      }
    });
  }

  function retrieveReview(MovieID) {
    const sql = `SELECT ReviewID, MovieID, UserID, Rating, Comments FROM Reviews WHERE MovieID = ?`
    return query(sql, [MovieID])
      .then((response) => {
        // console.log(response);
        const rows = response[0];
        return rows
      })
      .catch(function (error) {
        console.log(error)
      })
  }

  function getReview() {
    const sql = `SELECT Rating, Comments FROM Reviews WHERE Rating = 5`
    return query(sql)
      .then((response) => {
        // console.log(response)
        return response

      })
    // .catch(function(error){
    //   console.log(error)
    // })
  }

  function sortReviewByID(MovieID) {
    const sql = `SELECT ReviewID, MovieID, UserID, Rating, Comments FROM Reviews WHERE MovieID = ? ORDER BY ReviewID desc`
    return query(sql, [MovieID])
      .then((response) => {
        // console.log(response[0])
        return response
      })
  }

  function sortReviewByRating(MovieID) {
    const sql = `SELECT ReviewID, MovieID, UserID, Rating, Comments FROM Reviews WHERE MovieID = ? ORDER BY Rating desc`
    return query(sql, [MovieID])
      .then((response) => {
        // console.log(response[0])
        return response
      })
  }

  function getAvgRating(MovieID) {
    const sql = `SELECT ROUND(AVG(Rating),1) AS average FROM Reviews WHERE MovieID = ?;`
    return query(sql, [MovieID])
      .then((response) => {
        // console.log(response[0])
        return response
      })
  }


  module.exports = {
    postReview,
    editReview,
    deleteReview,
    retrieveReview,
    getReview,
    deleteAllReview,
    sortReviewByID,
    sortReviewByRating,
    getAvgRating
  };
