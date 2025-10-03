function initializeDepthsSoulsCalculator(container) {
  const modeRadios = container.querySelectorAll('input[name="soulsModeModal"]');
  const customDepthInputWrapper = container.querySelector("#customDepthInputModal");
  const resultDiv = container.querySelector("#soulsResultModal");
  const calculateBtn = container.querySelector("#calculateSoulsBtnModal");
  
  if (!calculateBtn) return;

  modeRadios.forEach(radio => {
    radio.addEventListener("change", () => {
      customDepthInputWrapper.style.display = (radio.value === "custom") ? "block" : "none";
      resultDiv.innerHTML = "";
      resultDiv.classList.remove("reveal");
    });
  });

  const calculateSouls = () => {
    const desired = parseInt(container.querySelector("#desiredSoulsModal").value) || 0;
    const sparkling = parseInt(container.querySelector("#sparklingKeysModal").value) || 0;
    const isMonday = container.querySelector("#isMondayModal").checked;
    const isPatron = container.querySelector("#patronStatusModal").checked;
    
    resultDiv.classList.remove("reveal");
    resultDiv.innerHTML = '';

    if (desired <= 0) {
      resultDiv.innerHTML = `<div class="result-error">Please enter a valid desired value.</div>`;
      resultDiv.classList.add("reveal");
      return;
    }

    let chestsPerRun = 3;
    const selectedMode = container.querySelector('input[name="soulsModeModal"]:checked').value;
    if (selectedMode === "custom") {
      const depth = parseInt(container.querySelector("#customDepthModal").value);
      if (!depth || depth < 170) {
        resultDiv.innerHTML = `<div class="result-error">Please enter a valid depth (170+).</div>`;
        resultDiv.classList.add("reveal");
        return;
      }
      chestsPerRun = Math.floor((depth - 170) / 3);
      if (chestsPerRun < 1) {
        resultDiv.innerHTML = `<div class="result-error">No chests available at that depth.</div>`;
        resultDiv.classList.add("reveal");
        return;
      }
    }

    const sparkleAvg = isMonday ? (isPatron ? 5 : 3.33) : 2.5;
    const regularAvg = isMonday ? (isPatron ? 3 : 2) : 1;
    const soulsFromSparkle = sparkling * sparkleAvg;
    const remainingSouls = desired - soulsFromSparkle;
    const chestsNeededRegular = remainingSouls > 0 ? remainingSouls / regularAvg : 0;
    const totalChests = sparkling + Math.ceil(chestsNeededRegular);
    const estimatedRuns = Math.ceil(totalChests / chestsPerRun);

    resultDiv.innerHTML = `
      <div class="result-line">
        <span class="result-label">Souls from Keys</span>
        <span class="result-value">~${soulsFromSparkle.toFixed(1)}</span>
      </div>
      <div class="result-line">
        <span class="result-label">Souls from Chests</span>
        <span class="result-value">${Math.max(0, Math.ceil(remainingSouls))}</span>
      </div>
      <div class="result-line final-result">
        <span class="result-label">Estimated Runs</span>
        <span class="result-value">${estimatedRuns}</span>
      </div>
    `;
    resultDiv.classList.add("reveal");
  };

  const oldBtn = calculateBtn;
  const newBtn = oldBtn.cloneNode(true);
  oldBtn.parentNode.replaceChild(newBtn, oldBtn);
  newBtn.addEventListener("click", calculateSouls);
}