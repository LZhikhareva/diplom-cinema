export default function createMovieSection(movie, halls, seances, selectedDate, currentTimeMinutes) {
    const section = document.createElement('section');
    section.classList.add('movie');

    // Информация о фильме
    const movieInfo = document.createElement('div');
    movieInfo.classList.add('movie__info');

    const posterDiv = document.createElement('div');
    posterDiv.classList.add('movie__poster');
    const img = document.createElement('img');
    img.classList.add('movie__poster-image');
    img.alt = 'Постер';
    img.src = movie.poster_path ? `/storage/${movie.poster_path}` : '/i/poster.png';
    posterDiv.appendChild(img);

    const descriptionDiv = document.createElement('div');
    descriptionDiv.classList.add('movie__description');

    const h2 = document.createElement('h2');
    h2.classList.add('movie__title');
    h2.textContent = movie.title;

    const pSynopsis = document.createElement('p');
    pSynopsis.classList.add('movie__synopsis');
    pSynopsis.textContent = movie.description;

    const pData = document.createElement('p');
    pData.classList.add('movie__data');

    const spanDuration = document.createElement('span');
    spanDuration.classList.add('movie__data-duration');
    spanDuration.textContent = movie.duration;

    const spanCountry = document.createElement('span');
    spanCountry.classList.add('movie__data-origin');
    spanCountry.textContent = movie.country;

    pData.appendChild(spanDuration);
    pData.appendChild(spanCountry);

    descriptionDiv.appendChild(h2);
    descriptionDiv.appendChild(pSynopsis);
    descriptionDiv.appendChild(pData);

    movieInfo.appendChild(posterDiv);
    movieInfo.appendChild(descriptionDiv);

    section.appendChild(movieInfo);

    // Сеансы по залам
    halls.forEach(hall => {
        const hallDiv = document.createElement('div');
        hallDiv.classList.add('movie-seances__hall');

        const hallTitle = document.createElement('h3');
        hallTitle.classList.add('movie-seances__hall-title');
        hallTitle.textContent = hall.name;

        const ul = document.createElement('ul');
        ul.classList.add('movie-seances__list');

        let sessionsForHall = seances.filter(s => s.hall_id === hall.id && s.movie_id === movie.id);
        sessionsForHall = sessionsForHall.filter(s => typeof s.start === 'string' && /^\d{1,2}:\d{2}$/.test(s.start));

        sessionsForHall.forEach(seance => {
            const seanceMinutes = timeStrToMinutes(seance.start);
            if (!Number.isFinite(seanceMinutes)) return;
            const todayStr = (new Date()).toISOString().slice(0, 10);

            let isDisabled = false;
            if (selectedDate === todayStr) {
                isDisabled = seanceMinutes < currentTimeMinutes;
            } else if (selectedDate > todayStr) {
                isDisabled = false;
            } else {
                isDisabled = true;
            }

            const li = document.createElement('li');
            li.classList.add('movie-seances__time-block');

            const a = document.createElement('a');
            a.classList.add('movie-seances__time');
            if (isDisabled) a.classList.add('disabled');

            a.textContent = seance.start;
            a.href = isDisabled ? '#' : `/client/hall/${seance.id}`;

            li.appendChild(a);
            ul.appendChild(li);
        });

        if (ul.childElementCount > 0) {
            hallDiv.appendChild(hallTitle);
            hallDiv.appendChild(ul);
            section.appendChild(hallDiv);
        }
    });

    return section;
}

function timeStrToMinutes(timeStr) {
    if (typeof timeStr !== 'string' || !/^\d{1,2}:\d{2}$/.test(timeStr)) return NaN;
    const [h, m] = timeStr.split(':').map(Number);
    return h * 60 + m;
}