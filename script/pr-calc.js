// --- Persistent State (lives outside the function) ---
const gemCache = {
  water: { emp: 0, lesser1: 0, lesser2: 0 },
  air: { emp: 0, lesser1: 0, lesser2: 0 },
  fire: { emp: 0, lesser1: 0, lesser2: 0 },
  cosmic: { emp: 0, lesser1: 0, lesser2: 0 }
};
let selectedDragons = [];

function initializePowerRankCalculator(container) {
    // --- Constant Data ---
    const empoweredPRLevels={15:2011,16:2053,17:2095,18:2137,19:2179,20:2284,21:2326,22:2368,23:2410,24:2452,25:2557,26:2599,27:2641,28:2683,29:2725,30:2830};
    const lesserPRLevels={15:1731,16:1773,17:1815,18:1857,19:1899,20:2004,21:2046,22:2088,23:2130,24:2172,25:2277,26:2319,27:2361,28:2403,29:2445,30:2550};
    const gemLevels = [0, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30];

    // --- Element Selection ---
    // Main Calculator Elements (inside the container)
    const calculateBtn = container.querySelector("#calculatePrBtnModal");
    const resultDiv = container.querySelector("#pr_resultModal");
    if (!calculateBtn) return;
    
    // Nested Gem Modal Elements (global)
    const gemModal = document.getElementById('gemSelectModal');
    const gemModalCloseBtn = document.getElementById('gemModalCloseBtn');
    const saveGemLevelsBtn = document.getElementById('saveGemLevelsBtn');
    const gemModalTitle = document.getElementById('gemModalTitle');
    const currentGemTypeInput = document.getElementById('currentGemType');
    const empContainer = document.getElementById('emp_gem_levels');
    const lesser1Container = document.getElementById('lesser_gem1_levels');
    const lesser2Container = document.getElementById('lesser_gem2_levels');

    // --- Gem Modal Logic ---
    function createLevelButtons(btnContainer) {
        btnContainer.innerHTML = ''; // Clear previous
        gemLevels.forEach(level => {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'level-btn';
            btn.dataset.level = level;
            btn.textContent = level === 0 ? 'None' : `${level}`;
            btnContainer.appendChild(btn);
        });
    }
    [empContainer, lesser1Container, lesser2Container].forEach(createLevelButtons);

    function selectLevel(btnContainer, level) {
        btnContainer.querySelectorAll('button').forEach(btn => btn.classList.toggle('selected', btn.dataset.level == level));
    }

    [empContainer, lesser1Container, lesser2Container].forEach(btnContainer => {
        btnContainer.addEventListener('click', e => {
            if (e.target.tagName === 'BUTTON') selectLevel(btnContainer, e.target.dataset.level);
        });
    });

    const openGemModal = (gemType) => {
        currentGemTypeInput.value = gemType;
        gemModalTitle.textContent = `Edit ${gemType.charAt(0).toUpperCase() + gemType.slice(1)} Gem Levels`;
        const { emp, lesser1, lesser2 } = gemCache[gemType];
        selectLevel(empContainer, emp);
        selectLevel(lesser1Container, lesser1);
        selectLevel(lesser2Container, lesser2);
        gemModal.classList.add('active');
    };

    const closeGemModal = () => gemModal.classList.remove('active');

    const saveGemLevels = () => {
        const gemType = currentGemTypeInput.value;
        if (!gemType) return;
        gemCache[gemType] = {
            emp: parseInt(empContainer.querySelector('button.selected')?.dataset.level || 0),
            lesser1: parseInt(lesser1Container.querySelector('button.selected')?.dataset.level || 0),
            lesser2: parseInt(lesser2Container.querySelector('button.selected')?.dataset.level || 0)
        };
        closeGemModal();
        calculateBtn.click(); // Trigger recalculation
    };

    // --- Main Calculation Logic ---
    const calculatePr = () => {
        let total = 0;
        const getVal = (id) => parseInt(container.querySelector(id).value) || 0;
        const isChecked = (id) => container.querySelector(id).checked;

        if (isChecked("#level30Modal")) total += 450;
        if (isChecked("#subclassModal")) total += 90;
        if (isChecked("#emblemsModal")) total += 150;
        total += getVal("#torchModal") + getVal("#ringModal") + getVal("#allyModal");
        
        Object.keys(gemCache).forEach(type => {
            const { emp, lesser1, lesser2 } = gemCache[type];
            let basePR = (empoweredPRLevels[emp] || 0) + (lesserPRLevels[lesser1] || 0) + (lesserPRLevels[lesser2] || 0);
            if (selectedDragons.includes(type) && basePR > 0) {
                basePR += Math.min(Math.floor(basePR * 0.10), 793);
            }
            total += basePR;
        });

        const mastery = getVal("#masteryModal");
        total += mastery <= 500 ? mastery * 4 : 2000 + (mastery - 500);
        total += Math.min(getVal("#geodeModal"), 100) * 5;
        total += getVal("#dragonsModal") * 30;
        total += getVal("#gear_faceModal") + getVal("#gear_weaponModal") + getVal("#gear_hatModal");

        resultDiv.innerHTML = `<div class="result-line final-result"><span class="result-label">Total Power Rank</span><span class="result-value">${total.toLocaleString()}</span></div>`;
        resultDiv.classList.add('reveal');
    };

    // --- Event Binding ---
    container.querySelectorAll('.gem-icon-pr').forEach(icon => icon.addEventListener('click', () => openGemModal(icon.dataset.type)));
    container.querySelectorAll('.dragon-btn-pr').forEach(btn => {
        // Restore visual state from persistent array
        if(selectedDragons.includes(btn.dataset.type)) btn.classList.add('selected');
        
        btn.addEventListener('click', () => {
            const type = btn.dataset.type;
            if (selectedDragons.includes(type)) {
                selectedDragons = selectedDragons.filter(t => t !== type);
                btn.classList.remove('selected');
            } else {
                selectedDragons.push(type);
                btn.classList.add('selected');
            }
            calculateBtn.click(); // Recalculate on dragon change
        });
    });

    gemModalCloseBtn.addEventListener('click', closeGemModal);
    saveGemLevelsBtn.addEventListener('click', saveGemLevels);
    gemModal.addEventListener('click', e => { if (e.target === gemModal) closeGemModal(); });

    const oldBtn = calculateBtn;
    const newBtn = oldBtn.cloneNode(true);
    oldBtn.parentNode.replaceChild(newBtn, oldBtn);
    newBtn.addEventListener("click", calculatePr);
    
    // Initial calculation
    calculatePr();
}