function initializeVenturineCalculator(container) {
    const calculateBtn = container.querySelector("#calculateVenturineBtnModal");
    const resultDiv = container.querySelector("#venturineResultModal");
    const modeRadios = container.querySelectorAll("input[name='venturineModeModal']");

    const blocks = {
        v2s: container.querySelector("#v2sBlockModal"),
        s2v: container.querySelector("#s2vBlockModal"),
        continue: container.querySelector("#continueBlockModal"),
        fromCost: container.querySelector("#fromCostBlockModal")
    };

    if (!calculateBtn) return;

    const switchMode = () => {
        const selectedMode = container.querySelector("input[name='venturineModeModal']:checked").value;
        for (const mode in blocks) {
            blocks[mode].style.display = (mode === selectedMode) ? "block" : "none";
        }
        resultDiv.innerHTML = '';
        resultDiv.classList.remove("reveal");
    };

    modeRadios.forEach(radio => radio.addEventListener("change", switchMode));

    const calculateVenturine = () => {
        const selectedMode = container.querySelector("input[name='venturineModeModal']:checked").value;
        resultDiv.classList.remove("reveal");
        resultDiv.innerHTML = "";

        try {
            let message = "";
            if (selectedMode === "v2s") {
                const v = parseInt(container.querySelector("#venturineInputModal").value);
                if (isNaN(v) || v < 0) throw new Error("Enter a valid amount of Venturine.");
                let cost = 0, i = 0;
                while (cost <= v) {
                    cost += 7 + Math.floor(i / 4);
                    if (cost > v) break;
                    i++;
                }
                message = `You can craft <strong>${i}</strong> Signets with <strong>${v.toLocaleString()}</strong> Venturine.`;
            } else if (selectedMode === "s2v") {
                const s = parseInt(container.querySelector("#signetInputModal").value);
                if (isNaN(s) || s < 0) throw new Error("Enter a valid number of Signets.");
                let total = 0;
                for (let i = 0; i < s; i++) total += 7 + Math.floor(i / 4);
                message = `You need <strong>${total.toLocaleString()}</strong> Venturine to craft <strong>${s}</strong> Signets.`;
            } else if (selectedMode === "continue") {
                const current = parseInt(container.querySelector("#currentCraftModal").value);
                const desired = parseInt(container.querySelector("#desiredSignetsModal").value);
                if (isNaN(current) || current < 0 || isNaN(desired) || desired < 1) throw new Error("Please enter valid values.");
                let total = 0;
                for (let i = current; i < current + desired; i++) total += 7 + Math.floor(i / 4);
                message = `You'll need <strong>${total.toLocaleString()}</strong> Venturine to craft <strong>${desired}</strong> more Signets.`;
            } else if (selectedMode === "fromCost") {
                const cost = parseInt(container.querySelector("#currentCostModal").value);
                const desired = parseInt(container.querySelector("#signetsFromCostModal").value);
                if (isNaN(cost) || cost < 7 || isNaN(desired) || desired < 1) throw new Error("Please enter valid values.");
                const tier = cost - 7;
                let currentCraft = tier * 4, needed = 0;
                for (let i = 0; i < desired; i++) needed += 7 + Math.floor((currentCraft + i) / 4);
                message = `To craft <strong>${desired}</strong> Signets you'll need: <strong>≈${needed.toLocaleString()}</strong> Venturine`;
            }
            // Используем НОВЫЙ класс вместо .result-line
            resultDiv.innerHTML = `<div class="venturine-result-text">${message}</div>`;
        } catch (e) {
            resultDiv.innerHTML = `<div class="result-error">${e.message}</div>`;
        } finally {
            resultDiv.classList.add("reveal");
        }
    };
    
    const oldBtn = calculateBtn;
    const newBtn = oldBtn.cloneNode(true);
    oldBtn.parentNode.replaceChild(newBtn, oldBtn);
    newBtn.addEventListener("click", calculateVenturine);

    switchMode(); // Set initial state
}