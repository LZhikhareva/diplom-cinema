import viewCalendar from "./calendar.js";
import sortSeances from "./sortSeances.js";

let s = 1;
const date = new Date();

viewCalendar(s, date);

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

//--- Выбор сеанса
const seanceBtn = [...document.querySelectorAll('.movie-seances__time')];
for (let i = 0; i < seanceBtn.length; i++) {
    seanceBtn[i].addEventListener('click', (e) => {
        seanceBtn[i].href = `/client/hall/${orderedSeances[i].id}`;
    })
}
