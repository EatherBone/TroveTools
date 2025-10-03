function initializeTrunkDropCalculator(container) {
    const calculateBtn = container.querySelector("#calculateTrunkBtnModal");
    const resultElem = container.querySelector("#trunkResultModal");
    const resourceButtons = container.querySelectorAll('.resource-button');
    const modeRadios = container.querySelectorAll('input[name="calcModeTrunkModal"]');
    const trunkInputLabel = container.querySelector('#trunkInputLabelModal');
    const confidenceInputGroup = container.querySelector('#trunkConfidenceModal').parentElement;

    if (!calculateBtn) return;

    // --- Interactive Resource Buttons ---
    resourceButtons.forEach(btn => {
        btn.addEventListener('click', () => btn.classList.toggle('active'));
    });

    // --- Mode Switching Logic ---
    const switchMode = () => {
        const mode = container.querySelector('input[name="calcModeTrunkModal"]:checked').value;
        if (mode === 'itemsExpected') {
            trunkInputLabel.textContent = 'Enter Number of Trunks:';
            confidenceInputGroup.style.display = 'none';
        } else {
            trunkInputLabel.textContent = 'Enter Desired Amount:';
            confidenceInputGroup.style.display = 'block';
        }
    };
    modeRadios.forEach(radio => radio.addEventListener('change', switchMode));

    // --- Core Mathematical Functions (DO NOT EDIT) ---
    function phiInv(p) {
        if (p <= 0 || p >= 1) return 0;
        const a1=-39.6968302866538,a2=220.946098424521,a3=-275.928510446969,a4=138.357751867269,a5=-30.6647980661472,a6=2.50662827745924;
        const b1=-54.4760987982241,b2=161.585836858041,b3=-155.698979859887,b4=66.8013118877197,b5=-13.2806815528857;
        const c1=-.00778489400243029,c2=-.322396458041136,c3=-2.40075827716184,c4=-2.54973253934373,c5=4.37466414146497,c6=2.93816398269878;
        const d1=.00778469570904146,d2=.32246712907004,d3=2.445134137143,d4=3.75440866190742;
        const p_low=.02425,p_high=1-p_low;
        let q,r,retVal;
        if(p<p_low){q=Math.sqrt(-2*Math.log(p));retVal=(((((c1*q+c2)*q+c3)*q+c4)*q+c5)*q+c6)/((((d1*q+d2)*q+d3)*q+d4)*q+1)}
        else if(p<=p_high){q=p-0.5;r=q*q;retVal=(((((a1*r+a2)*r+a3)*r+a4)*r+a5)*r+a6)*q/(((((b1*r+b2)*r+b3)*r+b4)*r+b5)*r+1)}
        else{q=Math.sqrt(-2*Math.log(1-p));retVal=-(((((c1*q+c2)*q+c3)*q+c4)*q+c5)*q+c6)/((((d1*q+d2)*q+d3)*q+d4)*q+1)}
        return retVal
    }
    function calculateTrunksNeeded(amount, p, confidence) {
        const q=1-confidence,Z=phiInv(q),A=p,B=amount,C=1-p,D=Z*Z;
        const a=A*A,b=-(2*A*B+D*A*C),c=B*B;
        const discriminant=b*b-4*a*c;
        if(discriminant<0)return null;
        const n=Math.max((-b+Math.sqrt(discriminant))/(2*a),(-b-Math.sqrt(discriminant))/(2*a));
        return n>0?Math.ceil(n):null
    }
    
    // --- Main Calculation Logic ---
    const calculateTrunks = () => {
        const selected = Array.from(container.querySelectorAll(".resource-button.active")).map(btn => btn.dataset.value);
        resultElem.classList.remove("reveal");
        resultElem.innerHTML = "";

        if (selected.length === 0) {
            resultElem.innerHTML = `<div class="result-error">Please select at least one resource.</div>`;
            resultElem.classList.add("reveal");
            return;
        }

        const inputVal = parseFloat(container.querySelector("#trunkInputModal").value);
        if (isNaN(inputVal) || inputVal <= 0) {
            resultElem.innerHTML = `<div class="result-error">Please enter a positive amount.</div>`;
            resultElem.classList.add("reveal");
            return;
        }

        const confidenceVal = parseFloat(container.querySelector("#trunkConfidenceModal").value);
        const calcMode = container.querySelector('input[name="calcModeTrunkModal"]:checked').value;
        const dropRates={souls:5/100,core:6.57/100,fishBone:5.69/100,runicEssence:9.32/100,depthsSand:5.93/100,zephyrEssence:8.53/100,pyricEssence:9.64/100,abyssalEssence:10.43/100,inkBladder:5.14/100};
        const resourceNames={souls:"Depths Souls",core:"Depths Core",fishBone:"Fish Bone",runicEssence:"Runic Essence",depthsSand:"Depths Sand",zephyrEssence:"Zephyr Essence",pyricEssence:"Pyric Essence",abyssalEssence:"Abyssal Essence",inkBladder:"Ink Bladder"};

        let outputs = [];
        selected.forEach(resKey => {
            const p = dropRates[resKey];
            const resName = resourceNames[resKey] || resKey;
            if (!p) return;

            if (calcMode === "itemsExpected") {
                const expected = inputVal * p;
                outputs.push(`<div class="result-line"><span class="result-label">${resName}</span><span class="result-value">~${expected.toFixed(2)}</span></div>`);
            } else { // trunksNeeded
                const confidence = confidenceVal / 100;
                const trunksNeeded = calculateTrunksNeeded(inputVal, p, confidence);
                const resultText = (trunksNeeded === null) ? `No solution found` : `${trunksNeeded.toLocaleString()} Trunks`;
                outputs.push(`<div class="result-line"><span class="result-label">${resName}</span><span class="result-value">${resultText}</span></div>`);
            }
        });

        resultElem.innerHTML = outputs.join("");
        resultElem.classList.add("reveal");
    };

    const oldBtn = calculateBtn;
    const newBtn = oldBtn.cloneNode(true);
    oldBtn.parentNode.replaceChild(newBtn, oldBtn);
    newBtn.addEventListener("click", calculateTrunks);

    switchMode(); // Set initial state
}