import hallConfigurate from "./hallConfigurate.js";
import viewSeances from "./viewSeances.js";

document.addEventListener("DOMContentLoaded", () => {
    const hallsOriginal = JSON.parse(document.querySelector(".data-halls").value);
    const moviesOriginal = JSON.parse(document.querySelector(".data-movies").value);
    const seancesOriginal = JSON.parse(document.querySelector(".data-seances").value);

    const deepClone = obj => JSON.parse(JSON.stringify(obj));

    const getChoosenHallIndex = () => {
        const radios = [...document.getElementsByName("chairs-hall")];
        return radios.findIndex(r => r.checked);
    };

    const restorePricesFromHall = hall => {
        const priceInput = document.querySelector(".conf-step__input.price");
        const vipInput = document.querySelector(".conf-step__input.vip_price");
        if (priceInput) priceInput.value = hall.price ?? "";
        if (vipInput) vipInput.value = hall.price_vip ?? "";
    };

    document
        .querySelectorAll(".conf-step__button.conf-step__button-regular.cancel")
        .forEach(btn => {
            btn.addEventListener(
                "click",
                e => {
                    e.preventDefault();
                    e.stopImmediatePropagation();

                    const section = btn.dataset.section;
                    const hallIndex = getChoosenHallIndex();

                    try {
                        if (section === "hall") {
                            if (hallIndex < 0) return;
                            window.hallsData[hallIndex] = deepClone(hallsOriginal[hallIndex]);

                            const hall = window.hallsData[hallIndex];
                            const need = (parseInt(hall.rows) || 0) * (parseInt(hall.cols) || 0);

                            if (!Array.isArray(hall.seat)) hall.seat = [];
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

                            const rowsInput = document.querySelector(".conf-step__input.rows");
                            const colsInput = document.querySelector(".conf-step__input.cols");
                            if (rowsInput) rowsInput.value = hall.rows ?? "";
                            if (colsInput) colsInput.value = hall.cols ?? "";
                            const priceInput = document.querySelector(".conf-step__input.price");
                            const vipInput = document.querySelector(".conf-step__input.vip_price");
                            if (priceInput) priceInput.value = hall.price ?? "";
                            if (vipInput) vipInput.value = hall.price_vip ?? "";

                            hallConfigurate(window.hallsData, hallIndex);
                            console.log("Hall восстановлен и нормализован:", { rows: hall.rows, cols: hall.cols });
                        }

                        if (section === "price") {
                            if (hallIndex < 0) return;

                            window.hallsData[hallIndex].price = hallsOriginal[hallIndex].price;
                            window.hallsData[hallIndex].price_vip = hallsOriginal[hallIndex].price_vip;

                            restorePricesFromHall(window.hallsData[hallIndex]);

                            hallConfigurate(window.hallsData, hallIndex);
                            console.log("Price восстановлен и синхронизирован");
                        }

                        if (section === "seance") {
                            window.seancesData = deepClone(seancesOriginal);
                            viewSeances(window.hallsData, window.moviesData ?? moviesOriginal, window.seancesData);
                            console.log("Seance восстановлен из БД-снимка и синхронизирован");
                        }
                    } catch (err) {
                        console.error("Ошибка при отмене:", err);
                    }
                    if (window.updateButtonsState) window.updateButtonsState();
                },
                true
            );
        });
});