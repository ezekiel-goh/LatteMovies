function populateMoviesBody(moviesBody, movies, reviews, purchases) {
    moviesBody.innerHTML = '';
    const template = document.getElementById('template');
    const IMG_URL = 'https://image.tmdb.org/t/p/w500/';
    
    // get average score for each movie
    const reviewTemp = new Map();
    for (const {MovieID, Rating} of reviews) {
        const entry = reviewTemp.get(MovieID);
        if (!entry) {
            reviewTemp.set(MovieID, {MovieID, count: 1, sum: parseInt(Rating)});
        } else {
            ++entry.count;
            entry.sum += parseInt(Rating);
        }
    }
    const averageScores = [...reviewTemp.values()].map(({MovieID, count, sum}) => ({MovieID, average: sum / count}));

    movies.forEach((movie) => {
        const node = template.content.firstElementChild.cloneNode(true);
        node.querySelector('.poster').innerHTML = `<img src=${IMG_URL}${movie.poster_path}></img>`;
        node.querySelector('.movie-id').value = movie.id;
        node.querySelector('.title').value = movie.title;
        node.querySelector('.poster-path').value = movie.poster_path;
        node.querySelector('.overview').value = movie.overview;
        node.querySelector('.release-date').value = movie.release_date.slice(0, 10); // temp workaround
        node.querySelector('.runtime').value = movie.runtime;

        const i = averageScores.findIndex(e => e.MovieID == movie.id);
        if (i > -1) {
            node.querySelector('.average-score').innerHTML = `${averageScores[i].average}/5`;
        } else {
            node.querySelector('.average-score').innerHTML = 'N/A';
        }

        const j = purchases.findIndex(e => e.MovieID == movie.id)
        if (j > -1) {
            node.querySelector('.revenue').innerHTML = `$${purchases[j].count * movie.Price}`;
        } else {
            node.querySelector('.revenue').innerHTML = '$0';
        }
        
        const updateButton = node.querySelector('.update');
        updateButton.onclick = () => {
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
        deleteButton.onclick = () => {
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

async function refreshMoviesBody(moviesBody) {
    const [movies, reviews, purchases] = await Promise.all([
        fetch('/api/moviePublisher').then((res) => res.json()),
        fetch('/reviews/data').then((res) => res.json()),
        fetch('/api/purchase').then((res) => res.json())
    ]);

    populateMoviesBody(moviesBody, movies.data[0], reviews[0], purchases[0]);
}

window.addEventListener('DOMContentLoaded', () => {
    const moviesBody = document.getElementById('movies-body');
    refreshMoviesBody(moviesBody);

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
