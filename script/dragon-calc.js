function initializeDragonCoinCalculator(container) {
    // --- Element Selection ---
    const h2cInputs = container.querySelector("#hoursToCoinsInputsModal");
    const c2hInputs = container.querySelector("#coinsToHoursInputsModal");
    const resultDiv = container.querySelector("#resultModal");
    const detailsDiv = container.querySelector("#detailsModal");
    const toggleBtn = container.querySelector("#toggleModeBtnModal");
    const manualInputs = container.querySelector("#manualInputsModal");
    const averageHoursInput = container.querySelector("#averageHoursModal");

    if (!h2cInputs) return; // Exit if calculator not found

    // --- Mode Switching ---
    container.querySelectorAll('input[name="calcModeModal"]').forEach(radio => {
        radio.addEventListener("change", () => {
            const isH2C = radio.value === 'hoursToCoins';
            h2cInputs.style.display = isH2C ? 'block' : 'none';
            c2hInputs.style.display = isH2C ? 'none' : 'block';
            resultDiv.innerHTML = "";
            detailsDiv.innerHTML = "";
            resultDiv.classList.remove("reveal");
            detailsDiv.classList.remove("reveal");
        });
    });

    // --- Manual Input Toggle ---
    toggleBtn.addEventListener("click", () => {
        if (manualInputs.style.display === "none") {
            manualInputs.style.display = "block";
            averageHoursInput.value = "";
            toggleBtn.textContent = "Switch to average input";
        } else {
            manualInputs.style.display = "none";
            toggleBtn.textContent = "Switch to manual input";
        }
    });

    // --- Calculation Logic 1: Hours to Coins ---
    const calculateH2C = () => {
        const days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
        let hoursPerDay = [];
        if (averageHoursInput.value) {
            hoursPerDay = Array(7).fill(parseFloat(averageHoursInput.value) || 0);
        } else {
            hoursPerDay = days.map(day => parseFloat(container.querySelector(`#${day}Modal`).value) || 0);
        }

        const tome1 = container.querySelector("#tome1Modal").checked ? 15 : 0;
        const tome2 = container.querySelector("#tome2Modal").checked ? 25 : 0;
        const bench = container.querySelector("#benchModal").checked ? 15 : 0;
        const patron = container.querySelector("#patronModal").checked;

        let totalCoins = 0, totalCaches = 0;
        hoursPerDay.forEach((hours, index) => {
            if (hours <= 0) return;
            const challenges = Math.floor(hours);
            let dailyBonus = challenges * 2;
            let cacheCount = challenges * 2;
            let firstBonus = (hours > 0) ? 5 : 0;
            if (index === 4) { // Friday
                const multiplier = patron ? 3 : 2;
                dailyBonus *= multiplier;
                cacheCount *= multiplier;
                firstBonus *= multiplier;
            }
            totalCoins += dailyBonus + firstBonus;
            totalCaches += cacheCount;
        });

        const cacheBonus = totalCaches;
        const karmaBonus = Math.floor(totalCaches / 35) * 25;
        totalCoins += cacheBonus + tome1 + tome2 + bench + karmaBonus;

        resultDiv.innerHTML = `<div class="result-line final-result"><span class="result-label">Estimated Dragon Coins</span><span class="result-value">${Math.floor(totalCoins)}</span></div>`;
        detailsDiv.innerHTML = `Base Coins (Challenges + Daily): ${Math.floor(totalCoins - tome1 - tome2 - bench - karmaBonus - cacheBonus)}\nFrom Caches: +${cacheBonus} Coins\nTomes & Bench: +${tome1 + tome2 + bench}\nKarma Bonus: +${karmaBonus}`;
        resultDiv.classList.add("reveal");
        detailsDiv.classList.add("reveal");
    };

    // --- Calculation Logic 2: Coins to Hours ---
    const calculateC2H = () => {
        const desired = parseFloat(container.querySelector("#desiredCoinsModal").value) || 0;
        const tome1 = container.querySelector("#tome1_bModal").checked ? 15 : 0;
        const tome2 = container.querySelector("#tome2_bModal").checked ? 25 : 0;
        const bench = container.querySelector("#bench_bModal").checked ? 15 : 0;
        const patron = container.querySelector("#patron_bModal").checked;

        const bonus = tome1 + tome2 + bench;
        let remaining = desired - bonus;
        if (remaining <= 0) {
            resultDiv.innerHTML = `<div class="result-line final-result"><span class="result-value">No gameplay time needed.</span></div>`;
            detailsDiv.innerHTML = `Bonus coins (+${bonus}) cover the entire goal.`;
            resultDiv.classList.add("reveal");
            detailsDiv.classList.add("reveal");
            return;
        }

        const avgMultiplier = (6 * 1 + (patron ? 3 : 2)) / 7;
        const coinsPerHour = (2 * avgMultiplier) + (2 * avgMultiplier) + ((5 / 24) * avgMultiplier);
        let hours = remaining / coinsPerHour;
        let caches = hours * (2 * avgMultiplier);
        let karma = Math.floor(caches / 35) * 25;
        remaining -= karma;
        hours = remaining / coinsPerHour;
        caches = hours * (2 * avgMultiplier);

        resultDiv.innerHTML = `<div class="result-line final-result"><span class="result-label">Estimated Hours Needed</span><span class="result-value">${Math.ceil(hours)}</span></div>`;
        detailsDiv.innerHTML = `Target: ${desired}\nBonuses: -${bonus}\nKarma: -${karma}\nAdjusted Target: ${Math.floor(remaining)}`;
        resultDiv.classList.add("reveal");
        detailsDiv.classList.add("reveal");
    };

    // --- Event Binding ---
    const btn1 = container.querySelector("#calculateBtnModal");
    const newBtn1 = btn1.cloneNode(true);
    btn1.parentNode.replaceChild(newBtn1, btn1);
    newBtn1.addEventListener("click", calculateH2C);

    const btn2 = container.querySelector("#calculateBtn_bModal");
    const newBtn2 = btn2.cloneNode(true);
    btn2.parentNode.replaceChild(newBtn2, btn2);
    newBtn2.addEventListener("click", calculateC2H);
}