const seanceTable = document.querySelector('.data-seance');
const seance = JSON.parse(seanceTable.value);
const seatsTable = document.querySelector('.data-seats');
let seats = [];

if (!seance.seance_seats || seance.seance_seats.length === 0) {
    seats = JSON.parse(seatsTable.value);
} else {
    try {
        seats = typeof seance.seance_seats === "string"
            ? JSON.parse(seance.seance_seats)
            : seance.seance_seats;
    } catch (e) {
        console.error("Ошибка парсинга мест:", e);
        seats = JSON.parse(seatsTable.value);
    }
}

document.querySelector('.buying__info-title').textContent = seance.movie.title;
document.querySelector('.buying__info-start').textContent = `Начало сеанса: ${seance.start}`;
document.querySelector('.buying__info-hall').textContent = `Зал ${seance.hall.name}`;
document.querySelector('.st_chair').textContent = `${seance.hall.price}`;
document.querySelector('.vip_chair').textContent = `${seance.hall.price_vip}`;

//--- Отображение мест
let addSeats = '';
const classSeat = [
    'buying-scheme__chair_standart',
    'buying-scheme__chair_disabled',
    'buying-scheme__chair_vip',
    'buying-scheme__chair_taken',
    'buying-scheme__chair_selected'
];


let s = 0;
let typeSeat = classSeat[0];
for (let i = 0; i < seance.hall.rows; i++) {
    addSeats += '<div class="buying-scheme__row">';
    for (let j = 0; j < seance.hall.cols; j++) {
        if (seats[s].type_seat == 'st') {
            typeSeat = classSeat[0];
        } else if (seats[s].type_seat == 'disabled') {
            typeSeat = classSeat[1];
        } else if (seats[s].type_seat == 'vip') {
            typeSeat = classSeat[2];
        } else {
            typeSeat = classSeat[3];
        }
        addSeats += `<span class="buying-scheme__chair ${typeSeat}"></span>`;
        s++;
    }
    addSeats += '</div>';
}
document.querySelector('.buying-scheme__wrapper').innerHTML = addSeats;

//--- Выбор мест
const chosenChairs = [];
const rowAndSeat = [];
const chairs = [...document.querySelectorAll('.buying-scheme__chair')];
for (let i = 0; i < chairs.length; i++) {
    chairs[i].onclick = () => {
        if (chairs[i].classList.contains(classSeat[1]) || chairs[i].classList.contains(classSeat[3])) {
            return null;
        }

        if (chairs[i].classList.contains(classSeat[4])) {
            chairs[i].classList.remove(classSeat[4]);
            chairs[i].classList.add(seats[i].type_seat == 'vip' ? classSeat[2] : classSeat[0]);

            const index = chosenChairs.findIndex(seat => seat.id === seats[i].id);
            if (index !== -1) chosenChairs.splice(index, 1);

            const rowSeatIndex = rowAndSeat.findIndex(rs => rs.id === seats[i].id);
            if (rowSeatIndex !== -1) rowAndSeat.splice(rowSeatIndex, 1);

            return null;
        }

        // Выбор места
        if (chairs[i].classList.contains(classSeat[0]) || chairs[i].classList.contains(classSeat[2])) {
            chairs[i].classList.remove(classSeat[0]);
            chairs[i].classList.remove(classSeat[2]);
            chairs[i].classList.add(classSeat[4]);

            chosenChairs.push(seats[i]);
            rowAndSeat.push(seatInHall(i));

            return null;
        }
    }
}

document.querySelector('.acceptin-button').addEventListener('click', (e) => {
    e.preventDefault();
    if (chosenChairs.length < 1) return null;
    seats.forEach(seat => {
        for (let i = 0; i < chosenChairs.length; i++) {
            if (seat.id == chosenChairs[i].id) {
                seat.type_seat = 'taken';
            }
        }
    })
    seance.selected_seats = rowAndSeat;
    seance.seance_seats = seats;

    const token = document.querySelector('meta[name="csrf-token"]').content;

    const options = {
        method: "POST",
        body: JSON.stringify(seance),
        headers: { "Content-Type": "application/json", 'X-CSRF-TOKEN': `${token}` }
    }

    fetch(`/api/seances/${seance.id}`, options);

    location.href = `/client/payment/${seance.id}`;
})

// --- Перевести номер места в ряд и место в зале
function seatInHall(num) {
    const row = Math.floor(num / seance.hall.cols) + 1;
    const firstSeatOfRow = seance.hall.cols * (row - 1);
    const lastSeatOfRow = seance.hall.cols + firstSeatOfRow - 1;
    let s = 1;
    for (let i = lastSeatOfRow; i >= firstSeatOfRow; i--) {
        if (seats[i] !== 'disabled' && i > num) {
            s++;
        } else if (seats[i] === 'disabled') {
            continue;
        } else {
            break;
        }
    }
    return { id: seats[num].id, row: row, seat: s, type: seats[num].type_seat };
}
