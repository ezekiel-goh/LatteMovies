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

function postReview(Comments,Rating) {
  const sql = `INSERT INTO Reviews (MovieID, UserID, Comments, Rating) VALUES (6, 9, ?, ?)`;
  return query(sql, [Comments, Rating]).catch(function (error) {
    if (error.errno === MYSQL_ERROR_CODE.DUPLICATE_ENTRY) {
      throw new DUPLICATE_ENTRY_ERROR(
        `Movie with id: ${id} already exists in the database`
      );
    } else {
      throw error;
    }
  });
}



// function postReview(Review) {
//   const sql = "INSERT INTO Reviews(Comments) VALUES (?)";
//   return query(sql, [Review]).catch(function (error) {
//     if (error.errno === MYSQL_ERROR_CODE.DUPLICATE_ENTRY) {
//       throw new DUPLICATE_ENTRY_ERROR(
//         `Movie with id: ${id} already exists in the database`
//       );
//     } else {
//       throw error;
//     }
//   });
// }



module.exports = {
  postReview,
};
