import resizeHall from "./resizeHall.js";
import hallConfigurate from "./hallConfigurate.js";
import addSeance from "./addSeance.js";
import delSeance from "./delSeance.js";
import viewSeances from "./viewSeances.js";
import inputError from "./inputError.js";

//--- Сворачивание разделов
const headers = Array.from(document.querySelectorAll('.conf-step__header'));
headers.forEach(header => header.addEventListener('click', () => {
    header.classList.toggle('conf-step__header_closed');
    header.classList.toggle('conf-step__header_opened');
}));

const hallsTable = document.querySelector('.data-halls');
const hallsData = JSON.parse(hallsTable.value);
console.log(hallsData);
window.hallsData = hallsData;
window.hallsOriginal = JSON.parse(hallsTable.value);


hallsData.map(hall => {
    const arr = [];
    for (let i = 0; i < hall.seat.length; i++) {
        arr.push(hall.seat[i].type_seat);
    }
    hall.seat = arr;
})

//--- Установление выбранного зала для отображения
let choosenHall = 0;
if (hallsData.length > 0) hallConfigurate(hallsData, choosenHall);

const seatTable = document.querySelector('.data-seats');
const seatData = JSON.parse(seatTable.value);

const moviesTable = document.querySelector('.data-movies');
const moviesData = JSON.parse(moviesTable.value).data;
window.moviesData = moviesData;

const seancesTable = document.querySelector('.data-seances');
const seancesData = JSON.parse(seancesTable.value);
window.seancesData = seancesData;

//--- Кнопка открытия-закрытия продаж
const openSales = document.querySelector('#open_sales');

openSales.onclick = () => {
    const next = hallsData.some(h => !h.is_open);
    openSales.textContent = next ? 'Приостановить продажу билетов' : 'Открыть продажу билетов';
    setAllHallsOpen(next);
};

async function setAllHallsOpen(isOpen) {
    hallsData.forEach(h => { h.is_open = isOpen; });

    const token = document.querySelector('meta[name="csrf-token"]').content;

    try {
        await Promise.all(
            hallsData.map(h => {
                const hallPayload = JSON.parse(JSON.stringify(h));
                delete hallPayload.seat;
                return fetch(`/api/halls/${h.id}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': token },
                    body: JSON.stringify(hallPayload),
                });
            })
        );

        window.hallsData = hallsData;
        const hiddenHalls = document.querySelector('.data-halls');
        if (hiddenHalls) hiddenHalls.value = JSON.stringify(window.hallsData);
        if (window.refreshHallsOriginal) window.refreshHallsOriginal(window.hallsData);
        if (window.updateButtonsState) window.updateButtonsState();
    } catch (err) {
        console.error('Save halls failed:', err);
        alert('Ошибка сохранения залов');
    }
}

async function saveHall() {
    const token = document.querySelector('meta[name="csrf-token"]').content;
    const hallId = hallsData[choosenHall].id;

    const hallPayload = JSON.parse(JSON.stringify(hallsData[choosenHall]));
    delete hallPayload.seat;

    try {
        const res = await fetch(`/api/halls/${hallId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': token },
            body: JSON.stringify(hallPayload)
        });
        if (!res.ok) throw new Error(res.status);

        if (window.refreshHallsOriginal) window.refreshHallsOriginal(window.hallsData);
        const hiddenHalls = document.querySelector('.data-halls');
        if (hiddenHalls) hiddenHalls.value = JSON.stringify(window.hallsData);
        if (window.updateButtonsState) window.updateButtonsState();
    } catch (err) {
        console.error('Save hall failed:', err);
        alert('Ошибка сохранения зала');
    }
}

//--- Проверка правильности ввода данных
inputError(moviesData, hallsData);

const abort = [...document.querySelectorAll('.abort')];
const dismiss = [...document.querySelectorAll('.popup__dismiss')];
const alert = [...document.querySelectorAll('.alert')];

for (let i = 0; i < abort.length; i++) {
    abort[i].addEventListener('click', close);
}

for (let i = 0; i < dismiss.length; i++) {
    dismiss[i].addEventListener('click', close);
}

function close(e) {
    e.preventDefault();
    const popup = [...document.querySelectorAll('.popup')];
    for (let i = 0; i < alert.length; i++) {
        alert[i].textContent = null;
    }
    for (let i = 0; i < popup.length; i++) {
        if (popup[i].classList.contains('active')) {
            popup[i].classList.remove('active');
        }
    }
}

//--- Выбор зала
const hallsList = [...document.getElementsByName('chairs-hall')];
const hallsList1 = [...document.getElementsByName('chairs-hall1')];

for (let i = 0; i < hallsList.length; i++) {
    hallsList1[i].addEventListener('input', function () {
        choosenHall = i;
        hallsList[i].checked = true;
        hallConfigurate(hallsData, choosenHall);
    })

    hallsList[i].addEventListener('input', function () {
        choosenHall = i;
        hallsList1[i].checked = true;
        hallConfigurate(hallsData, choosenHall);
    })
}
if (hallsList.length) {
    hallsList[0].checked = true;
    hallsList[0].dispatchEvent(new Event('input', { bubbles: true }));
} else if (hallsList1.length) {
    hallsList1[0].checked = true;
    hallsList1[0].dispatchEvent(new Event('input', { bubbles: true }));
}
if (window.updateButtonsState) window.updateButtonsState();

//--- Количество рядов и мест
document.querySelector('.rows').onchange = (e) => {
    resizeHall(hallsData, choosenHall, 'rows', parseInt(e.target.value));
}

document.querySelector('.cols').onchange = (e) => {
    resizeHall(hallsData, choosenHall, 'cols', parseInt(e.target.value));
}

//--- Установка цен
document.querySelector('.price').onchange = (e) => {
    const value = parseInt(e.target.value);
    if (!Number.isInteger(value) || value <= 0) {
        document.querySelector('.price').value = hallsData[choosenHall].price;
        return null;
    }
    hallsData[choosenHall].price = e.target.value;
}

document.querySelector('.vip_price').onchange = (e) => {
    const value = parseInt(e.target.value);
    if (!Number.isInteger(value) || value <= 0) {
        document.querySelector('.vip_price').value = hallsData[choosenHall].price_vip;
        return null
    }
    hallsData[choosenHall].price_vip = e.target.value;
}

//--- Сохранение hall_update
const formUpdate = document.getElementById('hall_update');
formUpdate.onsubmit = async function (e) {
    e.preventDefault();

    const hallId = hallsData[choosenHall].id;

    const seatsArr1 = (hallsData[choosenHall].seat || []).map(type => ({
        hall_id: hallId,
        type_seat: type
    }));

    const hallPayload = JSON.parse(JSON.stringify(hallsData[choosenHall]));
    delete hallPayload.seat;

    const token = document.querySelector('meta[name="csrf-token"]').content;

    try {
        const [resHall, resSeats] = await Promise.all([
            fetch(`/api/halls/${hallId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': token },
                body: JSON.stringify(hallPayload)
            }),
            fetch(`/api/seats/${hallId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': token },
                body: JSON.stringify(seatsArr1)
            })
        ]);

        if (!resHall.ok) throw new Error(`halls ${resHall.status}`);
        if (!resSeats.ok) throw new Error(`seats ${resSeats.status}`);

        if (window.refreshHallsOriginal) window.refreshHallsOriginal(window.hallsData);
        const hiddenHalls = document.querySelector('.data-halls');
        if (hiddenHalls) hiddenHalls.value = JSON.stringify(window.hallsData);

        if (window.updateButtonsState) window.updateButtonsState();
    } catch (err) {
        console.error('Save hall/seats failed:', err);
        alert('Ошибка сохранения зала или схемы мест');
    }
};

//--- Добавление фильма
const wrapperMovies = document.querySelector(".conf-step__movies");
let addMovie = "";

for (let i = 0; i < moviesData.length; i++) {
    const posterSrc = moviesData[i].poster_path
        ? `/storage/${moviesData[i].poster_path}`
        : '/i/poster.png';

    addMovie += `
        <div class="conf-step__movie">
            <img class="conf-step__movie-poster" alt="poster" src="${posterSrc}">
            <h3 class="conf-step__movie-title">${moviesData[i].title}</h3>
            <p class="conf-step__movie-duration">${moviesData[i].duration} минут</p>
            <input class="movie_id" type="hidden" value=${moviesData[i].id} />
            <button class="conf-step__button conf-step__button-trash trash_movie" onclick="deleteMovie(event)"></button>
        </div>
    `;
}

wrapperMovies.innerHTML = addMovie;

//--- Добавление и удаление сеанса
addSeance(hallsData, moviesData, seancesData);
delSeance(hallsData, moviesData, seancesData);


//--- Отображение сеанса
viewSeances(hallsData, moviesData, seancesData);

//--- Сохранение сеансов
const formSeance = document.getElementById('seance_update');
formSeance.onsubmit = async function (e) {
    e.preventDefault();

    const token = document.querySelector('meta[name="csrf-token"]').content;

    const payload = (window.seancesData || []).map(({ movie, ...rest }) => rest);

    try {
        const res = await fetch(`/api/seances`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': token },
            body: JSON.stringify(payload)
        });
        if (!res.ok) throw new Error(res.status);

        if (window.refreshSeancesOriginal) window.refreshSeancesOriginal(window.seancesData);
        const hidden = document.querySelector('.data-seances');
        if (hidden) hidden.value = JSON.stringify(window.seancesData);

        if (window.updateButtonsState) window.updateButtonsState();
    } catch (err) {
        console.error('Save seances failed:', err);
        alert('Ошибка сохранения сеансов');
    }
};

(function () {
    const toNum = v => (v === '' || v === null || v === undefined ? NaN : Number(v));

    const normalizeSeatArray = (seat, need) => {
        let arr = Array.isArray(seat) ? seat.slice() : [];
        arr = arr.map(s => {
            if (typeof s === 'string') return s;
            if (s && typeof s === 'object' && 'type_seat' in s) return s.type_seat || 'st';
            return 'st';
        });
        if (Number.isFinite(need)) {
            if (arr.length < need) arr = arr.concat(Array(need - arr.length).fill('st'));
            else if (arr.length > need) arr = arr.slice(0, need);
        }
        return arr;
    };

    const arraysEqual = (a, b) => {
        if (!Array.isArray(a) || !Array.isArray(b)) return false;
        if (a.length !== b.length) return false;
        for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return false;
        return true;
    };

    const getChoosenHallIndex = () => {
        const radios = Array.from(document.getElementsByName('chairs-hall'));
        return radios.findIndex(r => r.checked);
    };

    function isHallConfigEqual(idx) {
        const orig = window.hallsOriginal[idx];
        const cur = window.hallsData[idx];
        if (!orig || !cur) return true;

        const oRows = toNum(orig.rows), oCols = toNum(orig.cols);
        const cRows = toNum(cur.rows), cCols = toNum(cur.cols);

        const needO = (oRows || 0) * (oCols || 0);
        const needC = (cRows || 0) * (cCols || 0);

        const oSeat = normalizeSeatArray(orig.seat, needO);
        const cSeat = normalizeSeatArray(cur.seat, needC);

        return oRows === cRows && oCols === cCols && arraysEqual(oSeat, cSeat);
    }

    function isPriceEqual(idx) {
        const orig = window.hallsOriginal[idx];
        const cur = window.hallsData[idx];
        if (!orig || !cur) return true;
        return toNum(orig.price) === toNum(cur.price) && toNum(orig.price_vip) === toNum(cur.price_vip);
    }

    function setDisabled(el, disabled) {
        if (!el) return;
        el.disabled = !!disabled;
        el.setAttribute('aria-disabled', disabled ? 'true' : 'false');
    }

    function updateButtonsState() {
        const idx = getChoosenHallIndex();
        if (idx < 0) return;

        const hallCancelBtn = document.querySelector('button.cancel[data-section="hall"]');
        const hallSaveBtn = hallCancelBtn?.closest('fieldset')?.querySelector('input[type="submit"]');

        const priceCancelBtn = document.querySelector('button.cancel[data-section="price"]');
        const priceSaveBtn = priceCancelBtn?.closest('fieldset')?.querySelector('input[type="submit"]');

        const equalHall = isHallConfigEqual(idx);
        const equalPrice = isPriceEqual(idx);

        setDisabled(hallCancelBtn, equalHall);
        setDisabled(hallSaveBtn, equalHall);
        setDisabled(priceCancelBtn, equalPrice);
        setDisabled(priceSaveBtn, equalPrice);
    }

    window.updateButtonsState = updateButtonsState;

    document.querySelectorAll('input[name="chairs-hall"]').forEach(r => {
        r.addEventListener('change', updateButtonsState);
    });

    const rowsInput = document.querySelector('.conf-step__input.rows');
    const colsInput = document.querySelector('.conf-step__input.cols');
    rowsInput && rowsInput.addEventListener('input', () => {
        const idx = getChoosenHallIndex();
        if (idx >= 0) window.hallsData[idx].rows = toNum(rowsInput.value);
        updateButtonsState();
    });
    colsInput && colsInput.addEventListener('input', () => {
        const idx = getChoosenHallIndex();
        if (idx >= 0) window.hallsData[idx].cols = toNum(colsInput.value);
        updateButtonsState();
    });

    document.addEventListener('click', (e) => {
        if (e.target && e.target.classList && e.target.classList.contains('seat')) {
            setTimeout(updateButtonsState, 0);
        }
    });

    const priceInput = document.querySelector('.conf-step__input.price');
    const vipInput = document.querySelector('.conf-step__input.vip_price');
    priceInput && priceInput.addEventListener('input', () => {
        const idx = getChoosenHallIndex();
        if (idx >= 0) window.hallsData[idx].price = toNum(priceInput.value);
        updateButtonsState();
    });
    vipInput && vipInput.addEventListener('input', () => {
        const idx = getChoosenHallIndex();
        if (idx >= 0) window.hallsData[idx].price_vip = toNum(vipInput.value);
        updateButtonsState();
    });

    setTimeout(updateButtonsState, 0);
})();

// Автовыбор первого зала на старте
function autoSelectFirstHall() {
    if (!Array.isArray(window.hallsData) || window.hallsData.length === 0) return;

    if (typeof window.choosenHall === 'number') return;

    window.choosenHall = 0;

    const hallRadios = document.querySelectorAll('input[type="radio"][name*="hall"]');
    if (hallRadios.length) {
        hallRadios[0].checked = true;
        hallRadios[0].dispatchEvent(new Event('change', { bubbles: true }));
    }

    const hallSelect =
        document.querySelector('select[name*="hall"]') ||
        document.querySelector('select#hall') ||
        document.querySelector('select#seance_hall') ||
        document.querySelector('select[name="hall_id"]');
    if (hallSelect) {
        hallSelect.selectedIndex = 0;
        hallSelect.dispatchEvent(new Event('change', { bubbles: true }));
    }

    const hallClickable =
        document.querySelector('[data-hall-index]') ||
        document.querySelector('.hall-list [data-id]') ||
        document.querySelector('.hall-list [data-index]');
    if (hallClickable && typeof hallClickable.click === 'function') {
        hallClickable.click();
    }

    if (window.updateButtonsState) window.updateButtonsState();
}

document.addEventListener('DOMContentLoaded', autoSelectFirstHall);