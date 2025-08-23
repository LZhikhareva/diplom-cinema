export default function viewCalendar(s, date, onSelectDate) {
  const nameDay = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
  let add = "";
  if (s === 1) {
    add += `<a class="page-nav__day page-nav__day_today page-nav__day_chosen" href="#" data-date="${formatDate(date)}">
            <span class="page-nav__day-week">${nameDay[date.getDay()]}</span>
            <span class="page-nav__day-number">${date.getDate()}</span>
            </a>`;
  } else {
    add += '<a class="page-nav__day page-nav__day_prev" href="#"></a>';
  }

  let tempDate = new Date(date);
  for (let i = s; i < s + 5; i++) {
    tempDate.setDate(tempDate.getDate() + 1);
    add += `<a class="page-nav__day" href="#" data-date="${formatDate(tempDate)}">
                <span class="page-nav__day-week">${nameDay[tempDate.getDay()]}</span>
                <span class="page-nav__day-number">${tempDate.getDate()}</span>
            </a>`;
  }
  add += '<a class="page-nav__day page-nav__day_next" href="#"></a>';
  document.querySelector('.page-nav').innerHTML = add;

  const dayEl = [...document.querySelectorAll('.page-nav__day')];

  dayEl.forEach(item => item.onclick = (e) => {
    e.preventDefault();
    dayEl.forEach(d => d.classList.remove('page-nav__day_chosen'));
    item.classList.add('page-nav__day_chosen');
    const selectedDate = item.getAttribute('data-date');
    if (onSelectDate) onSelectDate(selectedDate);
  });

  document.querySelector('.page-nav__day_next').onclick = (e) => {
    e.preventDefault();
    s += 5;
    viewCalendar(s, tempDate, onSelectDate);
  }

  if (s > 1) {
    document.querySelector('.page-nav__day_prev').onclick = (e) => {
      e.preventDefault();
      s -= 5;
      tempDate.setDate(tempDate.getDate() - 10);
      viewCalendar(s, tempDate, onSelectDate);
    }
  }
}

function formatDate(date) {
  return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
}