export default function hallConfigurate(hallsData, choosenHall) {
    const hall = hallsData[choosenHall];

    const need = (parseInt(hall.rows) || 0) * (parseInt(hall.cols) || 0);

    if (!Array.isArray(hall.seat)) {
        hall.seat = [];
    }

    hall.seat = hall.seat.map(s => {
        if (typeof s === 'string') return s;
        if (s && typeof s === 'object' && 'type_seat' in s) return s.type_seat || 'st';
        return 'st';
    });

    if (hall.seat.length < need) {
        hall.seat = hall.seat.concat(Array(need - hall.seat.length).fill('st'));
    } else if (hall.seat.length > need) {
        hall.seat = hall.seat.slice(0, need);
    }

    document.querySelector(".price").value = hall.price;
    document.querySelector(".vip_price").value = hall.price_vip;
    document.querySelector('.rows').value = hall.rows;
    document.querySelector('.cols').value = hall.cols;

    const openSales = document.querySelector('#open_sales');
    if (hall.is_open) {
        openSales.textContent = 'Приостановить продажу билетов';
    } else {
        openSales.textContent = 'Открыть продажу билетов';
    }

    const wrapper = document.querySelector('.conf-step__hall-wrapper');

    let type = 'conf-step__chair_standart';
    let i = 0;
    let addSeat = '';

    for (let row = 0; row < hall.rows; row++) {
        addSeat += '<div class="conf-step__row">';
        for (let col = 0; col < hall.cols; col++) {
            if (hall.seat[i] === 'vip') {
                type = 'conf-step__chair_vip';
            } else if (hall.seat[i] === 'disabled') {
                type = 'conf-step__chair_disabled';
            } else {
                type = 'conf-step__chair_standart';
            }
            addSeat += `<span class="seat conf-step__chair ${type}"></span>`;
            i++;
        }
        addSeat += '</div>';
    }

    wrapper.innerHTML = addSeat;
    if (window.updateButtonsState) window.updateButtonsState();

    //--- Изменение вида места
    const seats = [...document.getElementsByClassName('seat')];
    for (let i = 0; i < seats.length; i++) {
        seats[i].addEventListener('click', function () {
            if (hallsData[choosenHall].seat[i] == 'st') {
                seats[i].classList.toggle('conf-step__chair_standart');
                seats[i].classList.toggle('conf-step__chair_vip');
                hallsData[choosenHall].seat[i] = 'vip';
                if (window.updateButtonsState) window.updateButtonsState();
            } else if (hallsData[choosenHall].seat[i] == 'disabled') {
                seats[i].classList.toggle('conf-step__chair_disabled');
                seats[i].classList.toggle('conf-step__chair_standart');
                hallsData[choosenHall].seat[i] = 'st';
                if (window.updateButtonsState) window.updateButtonsState();
            } else if (hallsData[choosenHall].seat[i] == 'vip') {
                seats[i].classList.toggle('conf-step__chair_vip');
                seats[i].classList.toggle('conf-step__chair_disabled');
                hallsData[choosenHall].seat[i] = 'disabled';
                if (window.updateButtonsState) window.updateButtonsState();
            } else {
                seats[i].classList.add('conf-step__chair_standart');
                hallsData[choosenHall].seat[i] = 'st';
                if (window.updateButtonsState) window.updateButtonsState();
            }
        })
    }
}