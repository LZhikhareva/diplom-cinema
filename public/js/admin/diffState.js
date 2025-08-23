document.addEventListener("DOMContentLoaded", () => {
  if (window.updateButtonsState) window.updateButtonsState();
  const hallsOriginal = JSON.parse(document.querySelector(".data-halls").value);
  const seancesOriginal = JSON.parse(document.querySelector(".data-seances").value);

  const toNum = v => (v === "" || v === null || v === undefined ? NaN : Number(v));

  const normalizeSeatArray = (seat, need) => {
    let arr = Array.isArray(seat) ? seat.slice() : [];
    arr = arr.map(s => {
      if (typeof s === "string") return s;
      if (s && typeof s === "object" && "type_seat" in s) return s.type_seat || "st";
      return "st";
    });
    if (Number.isFinite(need)) {
      if (arr.length < need) arr = arr.concat(Array(need - arr.length).fill("st"));
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
    const radios = [...document.getElementsByName("chairs-hall")];
    return radios.findIndex(r => r.checked);
  };

  function normalizeSeances(arr) {
    if (!Array.isArray(arr)) return [];
    return arr
      .map(s => ({
        id: Number(s.id ?? 0),
        hall_id: Number(s.hall_id ?? 0),
        movie_id: Number(s.movie_id ?? 0),
        start: String(s.start ?? "")
      }))
      .sort((a, b) =>
        a.hall_id - b.hall_id ||
        a.start.localeCompare(b.start) ||
        a.movie_id - b.movie_id ||
        a.id - b.id
      );
  }

  function isSeancesEqual() {
    const cur = normalizeSeances(window.seancesData);
    const orig = normalizeSeances(seancesOriginal);
    return JSON.stringify(cur) === JSON.stringify(orig);
  }

  function isHallConfigEqual(idx) {
    if (!Array.isArray(window.hallsData)) return true;
    if (!Array.isArray(hallsOriginal)) return true;
    if (idx < 0 || idx >= window.hallsData.length || idx >= hallsOriginal.length) return true;

    const orig = hallsOriginal[idx];
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
    if (!Array.isArray(window.hallsData)) return true;
    if (!Array.isArray(hallsOriginal)) return true;
    if (idx < 0 || idx >= window.hallsData.length || idx >= hallsOriginal.length) return true;

    const orig = hallsOriginal[idx];
    const cur = window.hallsData[idx];
    if (!orig || !cur) return true;

    return toNum(orig.price) === toNum(cur.price) &&
      toNum(orig.price_vip) === toNum(cur.price_vip);
  }

  function setDisabled(el, disabled) {
    if (!el) return;
    el.disabled = !!disabled;
    el.setAttribute("aria-disabled", disabled ? "true" : "false");
  }

  function updateButtonsState() {
    if (!Array.isArray(window.hallsData)) return;
    const idx = getChoosenHallIndex();
    if (idx < 0) return;

    const hallCancelBtn = document.querySelector('button.cancel[data-section="hall"]');
    const hallSaveBtn = hallCancelBtn?.closest("fieldset")?.querySelector('input[type="submit"]');
    const priceCancelBtn = document.querySelector('button.cancel[data-section="price"]');
    const priceSaveBtn = priceCancelBtn?.closest("fieldset")?.querySelector('input[type="submit"]');

    const equalHall = isHallConfigEqual(idx);
    const equalPrice = isPriceEqual(idx);

    setDisabled(hallCancelBtn, equalHall);
    setDisabled(hallSaveBtn, equalHall);
    setDisabled(priceCancelBtn, equalPrice);
    setDisabled(priceSaveBtn, equalPrice);
    const seanceCancelBtn = document.querySelector('button.cancel[data-section="seance"]');
    const seanceSaveBtn = seanceCancelBtn?.closest("fieldset")?.querySelector('input[type="submit"]');

    const equalSeances = isSeancesEqual();
    setDisabled(seanceCancelBtn, equalSeances);
    setDisabled(seanceSaveBtn, equalSeances);
  }

  window.updateButtonsState = updateButtonsState;
  window.refreshHallsOriginal = function (newHalls) {
    hallsOriginal.length = 0;
    Array.prototype.push.apply(hallsOriginal, JSON.parse(JSON.stringify(newHalls)));
  };

  window.refreshSeancesOriginal = function (newSeances) {
    seancesOriginal.length = 0;
    Array.prototype.push.apply(seancesOriginal, JSON.parse(JSON.stringify(newSeances)));
  };

  function ready() {
    return Array.isArray(window.hallsData);
  }

  function initBindings() {
    document.querySelectorAll('input[name="chairs-hall"]').forEach(r => {
      r.addEventListener("change", updateButtonsState);
    });

    const rowsInput = document.querySelector(".conf-step__input.rows");
    const colsInput = document.querySelector(".conf-step__input.cols");
    rowsInput && rowsInput.addEventListener("input", () => {
      const idx = getChoosenHallIndex();
      if (idx >= 0 && window.hallsData[idx]) window.hallsData[idx].rows = toNum(rowsInput.value);
      updateButtonsState();
    });
    colsInput && colsInput.addEventListener("input", () => {
      const idx = getChoosenHallIndex();
      if (idx >= 0 && window.hallsData[idx]) window.hallsData[idx].cols = toNum(colsInput.value);
      updateButtonsState();
    });

    document.addEventListener("click", (e) => {
      if (e.target && e.target.classList && e.target.classList.contains("seat")) {
        setTimeout(updateButtonsState, 0);
      }
    });

    const priceInput = document.querySelector(".conf-step__input.price");
    const vipInput = document.querySelector(".conf-step__input.vip_price");
    priceInput && priceInput.addEventListener("input", () => {
      const idx = getChoosenHallIndex();
      if (idx >= 0 && window.hallsData[idx]) window.hallsData[idx].price = toNum(priceInput.value);
      updateButtonsState();
    });
    vipInput && vipInput.addEventListener("input", () => {
      const idx = getChoosenHallIndex();
      if (idx >= 0 && window.hallsData[idx]) window.hallsData[idx].price_vip = toNum(vipInput.value);
      updateButtonsState();
    });

    updateButtonsState();
  }

  if (ready()) {
    initBindings();
  } else {
    const timer = setInterval(() => {
      if (ready()) {
        clearInterval(timer);
        initBindings();
      }
    }, 50);
  }
});