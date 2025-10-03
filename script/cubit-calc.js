function initializeCubitCalculator(container) {
    // --- Element Selection ---
    const calculateBtn = container.querySelector("#calculateCubitBtnModal");
    const resultDiv = container.querySelector("#cubitResultModal");
    const modeRadios = container.querySelectorAll('input[name="cubitModeModal"]');
    const d2rInputs = container.querySelector("#daysToRewardsInputsModal");
    const r2dInputs = container.querySelector("#rewardsToDaysInputsModal");
    // **NEW**: Get the container for the checkbox
    const doubleStarWeekContainer = container.querySelector("#doubleStarWeekContainerModal");

    if (!calculateBtn) return;

    // --- Mode Switching (with hiding logic) ---
    const switchMode = () => {
        const isD2R = container.querySelector('input[name="cubitModeModal"]:checked').value === 'daysToRewards';
        d2rInputs.style.display = isD2R ? 'block' : 'none';
        r2dInputs.style.display = isD2R ? 'none' : 'block';
        
        // **NEW**: Show/hide the checkbox container based on the mode
        doubleStarWeekContainer.style.display = isD2R ? 'flex' : 'none';

        resultDiv.innerHTML = "";
        resultDiv.classList.remove("reveal");
    };
    modeRadios.forEach(radio => radio.addEventListener("change", switchMode));

    // --- Calculation Logic (Corrected) ---
    const calculateCubits = () => {
        const mode = container.querySelector('input[name="cubitModeModal"]:checked').value;
        const patron = container.querySelector("#patron_cubitModal").checked;
        const patronMultiplier = patron ? 3 : 1;

        // **CORRECTED**: The state of the bonus depends on the mode.
        // In "days to rewards", we check the box.
        // In "rewards to days", we assume the bonus is always active for a long-term forecast.
        const doubleStarBarEnabled = (mode === 'daysToRewards')
            ? container.querySelector("#doubleStarWeekModal").checked
            : true;

        const baseCubit = 900;
        const baseDragonite = 5;

        resultDiv.classList.remove("reveal");
        resultDiv.innerHTML = "";

        if (mode === "daysToRewards") {
            const days = parseInt(container.querySelector("#cubitDaysModal").value) || 0;
            if (days < 1) {
                resultDiv.innerHTML = `<div class="result-error">Please enter a valid number of days.</div>`;
                resultDiv.classList.add("reveal");
                return;
            }

            // **CORRECTED & CLARIFIED LOGIC**: Calculate bonus days based on "7 days per 30 day block" rule.
            const doubleBlocks = Math.floor(days / 30);
            const doubleDays = doubleStarBarEnabled ? doubleBlocks * 7 : 0;
            const normalDays = days - doubleDays;

            const totalCubit = (doubleDays * baseCubit * 2 + normalDays * baseCubit) * patronMultiplier;
            const totalDragonite = (doubleDays * baseDragonite * 2 + normalDays * baseDragonite) * patronMultiplier;

            resultDiv.innerHTML = `
                <div class="result-line">
                    <span class="result-label">Total Cubits</span>
                    <span class="result-value">${totalCubit.toLocaleString()}</span>
                </div>
                <div class="result-line">
                    <span class="result-label">Total Diamond Dragonite</span>
                    <span class="result-value">${totalDragonite.toLocaleString()}</span>
                </div>
            `;
        } else { // rewardsToDays
            const desiredCubit = parseInt(container.querySelector("#desiredCubitModal").value) || 0;
            const desiredDrag = parseInt(container.querySelector("#desiredDragoniteModal").value) || 0;
            if (desiredCubit <= 0 && desiredDrag <= 0) {
                 resultDiv.innerHTML = `<div class="result-error">Please enter a desired amount.</div>`;
                 resultDiv.classList.add("reveal");
                 return;
            }

            let days = 0;
            let currentCubit = 0;
            let currentDrag = 0;
            
            // Loop until both targets are met, with a safety break
            while ((currentCubit < desiredCubit || currentDrag < desiredDrag) && days < 10000) {
                days++;
                // **CORRECTED LOGIC**: Same calculation as above, but inside the loop
                const doubleBlocks = Math.floor(days / 30);
                const doubleDays = doubleStarBarEnabled ? doubleBlocks * 7 : 0;
                const normalDays = days - doubleDays;

                currentCubit = (doubleDays * baseCubit * 2 + normalDays * baseCubit) * patronMultiplier;
                currentDrag = (doubleDays * baseDragonite * 2 + normalDays * baseDragonite) * patronMultiplier;
            }
            resultDiv.innerHTML = `<div class="result-line final-result"><span class="result-label">Estimated Days Needed</span><span class="result-value">${days}</span></div>`;
        }
        resultDiv.classList.add("reveal");
    };

    // --- Event Binding ---
    const oldBtn = calculateBtn;
    const newBtn = oldBtn.cloneNode(true);
    oldBtn.parentNode.replaceChild(newBtn, oldBtn);
    newBtn.addEventListener("click", calculateCubits);
    
    // Initial setup
    switchMode();
}