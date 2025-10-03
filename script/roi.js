function initializeRoiCalculator(container) {
  // Find elements with the "Modal" suffix IDs
  const buyInput = container.querySelector("#buyPriceModal");
  const sellInput = container.querySelector("#sellPriceModal");
  const qtyInput = container.querySelector("#quantityModal");
  const useTaxCheckbox = container.querySelector("#useTaxModal");
  const calculateBtn = container.querySelector("#calculateRoiBtnModal");
  const resultDiv = container.querySelector("#roiResultModal");

  if (!calculateBtn || !buyInput) {
    return; // Silently exit if elements aren't found
  }

  const calculateRoi = () => {
    const buy = parseFloat(buyInput.value) || 0;
    const sell = parseFloat(sellInput.value) || 0;
    const qty = parseInt(qtyInput.value) || 0;

    resultDiv.classList.remove("reveal");
    resultDiv.innerHTML = '';

    if (buy <= 0 || sell <= 0 || qty <= 0) {
      // Don't show an error, just clear the result area
      return;
    }

    const useTax = useTaxCheckbox.checked;

    function calculateTaxInBlocks(quantity, pricePerItem) {
      const blockSize = 9999;
      let totalTax = 0;
      const blocks = Math.floor(quantity / blockSize);
      const remainder = quantity % blockSize;
      for (let i = 0; i < blocks; i++) {
        totalTax += (pricePerItem * blockSize) * 0.1;
      }
      if (remainder > 0) {
        totalTax += (pricePerItem * remainder) * 0.1;
      }
      return totalTax;
    }

    const grossRevenue = sell * qty;
    const cost = buy * qty;
    let taxAmount = useTax ? calculateTaxInBlocks(qty, sell) : 0;
    const netRevenue = grossRevenue - taxAmount;
    const totalProfit = netRevenue - cost;
    const roi = cost === 0 ? 0 : ((totalProfit / cost) * 100);

    const profitColor = totalProfit >= 0 ? "#50fa7b" : "#ff5555";
    const roiColor = roi >= 0 ? "#50fa7b" : "#ff5555";

    resultDiv.innerHTML = `
      <div class="result-line">
        <span class="result-label">💰 Gross Revenue</span>
        <span class="result-value">${grossRevenue.toLocaleString('en-US')}</span>
      </div>
      ${useTax ? `
      <div class="result-line">
        <span class="result-label">🧾 Tax (10%)</span>
        <span class="result-value">${taxAmount.toLocaleString('en-US', {maximumFractionDigits: 1})}</span>
      </div>` : ''}
      <div class="result-line">
        <span class="result-label">💸 Net Revenue</span>
        <span class="result-value" style="color: ${profitColor};">${netRevenue.toLocaleString('en-US', {maximumFractionDigits: 1})}</span>
      </div>
      <div class="result-line">
        <span class="result-label">📦 Total Profit</span>
        <span class="result-value" style="color: ${profitColor};">${totalProfit.toLocaleString('en-US', {maximumFractionDigits: 1})}</span>
      </div>
      <div class="result-line final-result">
        <span class="result-label">📈 ROI</span>
        <span class="result-value" style="color: ${roiColor};">${roi.toFixed(2)}%</span>
      </div>
    `;
    
    resultDiv.classList.add("reveal");
  };

  // Replace button to clear any old listeners
  const oldBtn = calculateBtn;
  const newBtn = oldBtn.cloneNode(true);
  oldBtn.parentNode.replaceChild(newBtn, oldBtn);
  
  // Add listeners to the new, clean elements
  newBtn.addEventListener("click", calculateRoi);

  [buyInput, sellInput, qtyInput].forEach(element => {
    element.addEventListener("keyup", event => {
      if (event.key === "Enter") newBtn.click();
    });
  });

  useTaxCheckbox.addEventListener('change', calculateRoi);

} // THIS CLOSING BRACE WAS THE CULPRIT!