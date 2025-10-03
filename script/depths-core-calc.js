function initializeDepthsCoreCalculator(container) {
    // --- Element Selection ---
    const calculateBtn = container.querySelector("#calculateDepthsBtnModal");
    const resultDiv = container.querySelector("#depthsResultModal");
    const desiredCoresInput = container.querySelector("#desiredCoresModal");
    const sparkKeysInput = container.querySelector("#sparkKeysModal");

    if (!calculateBtn) return; // Exit if calculator not found

    // --- Calculation Logic ---
    const calculateDepths = () => {
        const desiredCores = parseInt(desiredCoresInput.value) || 0;
        let keys = parseInt(sparkKeysInput.value) || 0;
        if (keys < 0) keys = 0;

        resultDiv.classList.remove("reveal");
        resultDiv.innerHTML = '';

        if (desiredCores <= 0) {
            resultDiv.innerHTML = `<div class="result-error">Please enter a valid number of cores.</div>`;
            resultDiv.classList.add("reveal");
            return;
        }

        // Each key guarantees 3 cores.
        const maxKeysUsed = Math.min(keys, Math.floor(desiredCores / 3));
        const coresFromKeys = maxKeysUsed * 3;
        const remainingCores = Math.max(0, desiredCores - coresFromKeys);
        
        // Each normal run gives 1 core.
        const normalRuns = remainingCores;
        const totalRuns = maxKeysUsed + normalRuns;

        resultDiv.innerHTML = `
            <div class="result-line">
                <span class="result-label">Sparkling Keys Used</span>
                <span class="result-value">${maxKeysUsed}</span>
            </div>
            <div class="result-line">
                <span class="result-label">Cores from Keys</span>
                <span class="result-value">${coresFromKeys}</span>
            </div>
            <div class="result-line final-result">
                <span class="result-label">Total Dungeons Needed</span>
                <span class="result-value">${Math.ceil(totalRuns)}</span>
            </div>
        `;
        resultDiv.classList.add("reveal");
    };

    // --- Event Binding ---
    const oldBtn = calculateBtn;
    const newBtn = oldBtn.cloneNode(true);
    oldBtn.parentNode.replaceChild(newBtn, oldBtn);
    newBtn.addEventListener("click", calculateDepths);

    [desiredCoresInput, sparkKeysInput].forEach(input => {
        input.addEventListener("keyup", event => {
            if (event.key === "Enter") {
                newBtn.click();
            }
        });
    });
}