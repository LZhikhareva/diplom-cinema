import viewCalendar from "./calendar.js";
import sortSeances from "./sortSeances.js";
import createMovieSection from "./createMovieSection.js";

let s = 1;
const date = new Date();

const hallsTable = document.querySelector('.data-halls');
const hallsData = JSON.parse(hallsTable.value);

//--- Получение списка фильмов
const moviesTable = document.querySelector('.data-movies');
const moviesData = JSON.parse(moviesTable.value);

//--- Получение списка сеансов
const seancesTable = document.querySelector('.data-seances');
const seancesData = JSON.parse(seancesTable.value);

//--- Сеансы, отсортированные по фильмам и залам
const orderedSeances = sortSeances(moviesData, hallsData, seancesData);
console.log(seancesData);

//--- Выбор сеанса
const seanceBtn = [...document.querySelectorAll('.movie-seances__time')];
for (let i = 0; i < seanceBtn.length; i++) {
  seanceBtn[i].addEventListener('click', (e) => {
    seanceBtn[i].href = `/client/hall/${orderedSeances[i].id}`;
  })
}

viewCalendar(s, date, (selectedDate) => {
  const halls = JSON.parse(document.querySelector('.data-halls').value);
  const movies = JSON.parse(document.querySelector('.data-movies').value);
  const seances = JSON.parse(document.querySelector('.data-seances').value);

  const main = document.getElementById('movies-container');
  if (!main) return;

  main.innerHTML = '';

  const sales = JSON.parse(document.querySelector('.data-sales')?.value || '{"is_open":true}');
  if (!sales.is_open) {
    main.textContent = 'Извините, продажи временно приостановлены';
    return;
  }

  const now = new Date();
  const currentTimeMinutes = now.getHours() * 60 + now.getMinutes();

  movies.forEach(movie => {
    const section = createMovieSection(movie, halls, seances, selectedDate, currentTimeMinutes);
    if (section) main.appendChild(section);
  });
});

const today = new Date().toISOString().slice(0, 10);
(() => {
  const eventInit = new Event('init');
})();

(function autoSelectToday() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  const todayStr = `${yyyy}-${mm}-${dd}`;

  const tryClick = () => {
    const btn =
      document.querySelector(`[data-date="${todayStr}"]`) ||
      document.querySelector(`.calendar__day[data-date="${todayStr}"]`) ||
      document.querySelector(`.conf-step__seances-day[data-date="${todayStr}"]`);

    if (btn) {
      btn.click();
      return true;
    }
    return false;
  };

  if (tryClick()) return;
})();