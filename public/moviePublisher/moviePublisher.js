function populateMoviesBody(moviesBody, movies) {
    moviesBody.innerHTML = '';
    const template = document.getElementById('template');
    movies[0].forEach((movie) => {
        const node = template.content.firstElementChild.cloneNode(true);
        // node.querySelector('.movie-id').textContent = movie.id;
        node.querySelector('.movie-id').value = movie.id;
        node.querySelector('.title').value = movie.title;
        node.querySelector('.poster-path').value = movie.poster_path;
        node.querySelector('.overview').value = movie.overview;
        node.querySelector('.release-date').value = movie.release_date.slice(0, 10); // temp workaround
        node.querySelector('.runtime').value = movie.runtime;

        const updateButton = node.querySelector('.update');
        updateButton.onclick = function () {
            const originalValue = updateButton.textContent;
            updateButton.textContent = 'loading...';
            updateButton.disabled = true;
            fetch(`/api/moviePublisher/${movie.id}`, {
                method: 'PUT',
                body: JSON.stringify({ 
                    movieId: node.querySelector('.movie-id').value,
                    title: node.querySelector('.title').value,
                    posterPath: node.querySelector('.poster-path').value,
                    overview: node.querySelector('.overview').value,
                    releaseDate: node.querySelector('.release-date').value,
                    runtime: node.querySelector('.runtime').value
                }),
                headers: { 'Content-Type': 'application/json' }
            })
                .then((response) => {
                    if (response.ok) return {};
                    return response.json();
                })
                .then((body) => {
                    if (body.error) {
                        alert(body.error);
                    } else alert('Success!');
                })
                .finally(() => {
                    updateButton.textContent = originalValue;
                    updateButton.disabled = false;
                    location.reload();
                });
        };

        const deleteButton = node.querySelector('.delete');
        deleteButton.onclick = function () {
            const originalValue = deleteButton.textContent;
            deleteButton.textContent = 'loading...';
            deleteButton.disabled = true;
            fetch(`/api/moviePublisher/${movie.id}`, {
                method: 'DELETE'
            })
                .then((response) => {
                    if (response.ok) return {};
                    return response.json();
                })
                .then((body) => {
                    if (body.error) {
                        alert(body.error);
                    } else {
                        moviesBody.removeChild(node);
                        alert('Success!');
                    }
                })
                .finally(() => {
                    deleteButton.textContent = originalValue;
                    deleteButton.disabled = false;
                    location.reload();
                });
        };

        moviesBody.appendChild(node);
    });
}

function refreshMoviesBody(moviesBody) {
    fetch('/api/moviePublisher')
        .then((res) => res.json())
        .then((body) => {
            const movies = body.data;
            populateMoviesBody(moviesBody, movies);
        });
}

window.addEventListener('DOMContentLoaded', function () {
    const moviesBody = document.getElementById('movies-body');
    refreshMoviesBody(moviesBody);

    // Add event listener to the form to submit a new module
    const movieForm = document.getElementById('movie-form');
    const movieFormFieldset = movieForm.querySelector('fieldset');
    movieForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const movieId = document.getElementById('movie-id').value;
        const title = document.getElementById('title').value;
        const posterPath = document.getElementById('poster-path').value;
        const overview = document.getElementById('overview').value;
        const releaseDate = document.getElementById('release-date').value;
        const runtime = document.getElementById('runtime').value;
        movieFormFieldset.disabled = true;
        fetch('/api/moviePublisher', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                movieId: movieId,
                title: title,
                posterPath: posterPath,
                overview: overview,
                releaseDate: releaseDate,
                runtime: runtime
            })
        })
            .then((response) => {
                if (response.ok) return {};
                return response.json();
            })
            .then((body) => {
                if (body.error) {
                    return alert(body.error);
                }
                return refreshMoviesBody(moviesBody);
            })
            .finally(() => {
                movieFormFieldset.disabled = false;
            });
    });
});
