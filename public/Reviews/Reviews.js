// window.addEventListener('DOMContentLoaded', function () {
//     const form = document.querySelector('#reviewForm'); 
//     form.onsubmit = function (e) {
//         e.preventDefault(); // prevent using the default submit behavior
//         const ratingValue = document.getElementById("rating").value;
//         const reviewValue = document.getElementById("review").value;

//         return fetch('/reviews', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({
//                 Comments: reviewValue,
//                 Rating: ratingValue
//             }),
//         })
//             .then(function (response) {
//                 // If not successful (i.e. there's error)
//                 if (response.status !== 201) return response.json(); // parse body as JSON string

//                 alert(`Module "${Comments}" created!`);
//                 // Success response has no body, hence next .then() will be null
//                 console.log(response)

//                 return null;
//             })
//             .then(function (body) {
//                 if (!body) return; // If successfully created, body will be empty
//                 alert(body.error); // else there's an error
//             })
//             .finally(function () {
//                 // Enable inputs
//                 allInput.forEach((input) => {
//                     input.disabled = false;
//                 });
//             });
//     };
// });

// This works as well
// deleteBtn.addEventListener("click", (event) => {
//     var fish = document.getElementById("deleteID").value
//     console.log(fish)
// })