function deleteMovie(event) {
    event.preventDefault();
    event.stopPropagation();
    const deleteMoviePopup = document.getElementById('delMoviePopup');
    deleteMoviePopup.classList.add('active');
    const formMovie = document.getElementById('delete_movie');
    const movieTitle = event.target.closest('div').querySelector('h3').textContent;
    formMovie.querySelector('span').textContent = movieTitle;
    formMovie.action = '/admin/delete-movie/' + event.target.closest('div').querySelector('input').value;
}