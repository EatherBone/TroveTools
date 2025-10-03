function initializeGemAugmentCalculator(container) {
    const calculateBtn = container.querySelector("#calculate-augment-modal");
    const resultDiv = container.querySelector("#augment-result-modal");
    const statGroups = container.querySelectorAll(".stat-group");
    const augmentTypeSelect = container.querySelector("#augment-type-modal");

    if (!calculateBtn) return;

    const boosts = { 1: 0, 2: 0, 3: 0 };

    function updateBoostVisual(statNum) {
        const group = container.querySelector(`.stat-group[data-stat="${statNum}"]`);
        const circles = group.querySelectorAll(".boost-circle");
        circles.forEach(circle => {
            const boostNum = Number(circle.getAttribute("data-boost"));
            circle.classList.toggle("selected", boostNum <= boosts[statNum]);
        });
    }

    statGroups.forEach(group => {
        const statNum = Number(group.getAttribute("data-stat"));
        group.querySelectorAll(".boost-circle").forEach(circle => {
            // No need for .style.cursor, it's handled by CSS now
            circle.addEventListener("click", () => {
                const clickedBoost = Number(circle.getAttribute("data-boost"));
                boosts[statNum] = (boosts[statNum] === clickedBoost) ? clickedBoost - 1 : clickedBoost;
                updateBoostVisual(statNum);
            });
        });
        updateBoostVisual(statNum); // Initial visual setup
    });

    const calculateAugments = () => {
        resultDiv.classList.remove("reveal");
        resultDiv.innerHTML = "";

        const statPercents = Array.from(statGroups).map(g => {
            const val = parseFloat(g.querySelector(".stat-percent").value) || 0;
            return Math.min(100, Math.max(0, val)); // Clamp between 0 and 100
        });
        
        let totalCompletion = 0, totalMultiplier = 0;
        statPercents.forEach((percent, idx) => {
            const multiplier = boosts[idx + 1] + 1;
            totalCompletion += percent * multiplier;
            totalMultiplier += multiplier;
        });

        const maxCompletion = totalMultiplier * 100;
        const completionPercent = maxCompletion > 0 ? (totalCompletion / maxCompletion) * 100 : 0;
        const augmentType = augmentTypeSelect.value;
        const selectedOptionText = augmentTypeSelect.options[augmentTypeSelect.selectedIndex].text;
        const totalAugments = { rough: 240, precise: 120, superior: 48 }[augmentType];
        const remainingPercent = 100 - completionPercent;
        const neededAugments = Math.ceil(totalAugments * (Math.max(0, remainingPercent) / 100));

        resultDiv.innerHTML = `
            <div class="result-line">
                <span class="result-label">Total Gem Completion</span>
                <span class="result-value">${completionPercent.toFixed(2)}%</span>
            </div>
            <div class="result-line final-result">
                <span class="result-label">Needed ${selectedOptionText}</span>
                <span class="result-value">≈ ${neededAugments}</span>
            </div>
        `;
        resultDiv.classList.add("reveal");
    };
    
    // Replace button to clear old listeners
    const oldBtn = calculateBtn;
    const newBtn = oldBtn.cloneNode(true);
    oldBtn.parentNode.replaceChild(newBtn, oldBtn);
    newBtn.addEventListener("click", calculateAugments);
}