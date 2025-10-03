function initializeSpinner(container) {
    const wheel = container.querySelector("#wheelModal");
    const resultElement = container.querySelector("#challengeResultModal");
    const spinBtn = container.querySelector("#spinChallengeBtnModal");
    
    if (!spinBtn || !wheel) return;

    const challenges = [
        { text: "Give something useful for a new player", difficulty: "easy" },
        { text: "Open all of a random stack of boxes", difficulty: "medium" },
        { text: "You are saved, try again later", difficulty: "hard" },
        { text: "Complete 10 adventure quests in 15 min", difficulty: "medium" },
        { text: "Solo 3 Depths floors", difficulty: "hard" },
        { text: "Find one ship in Sundered Uplands", difficulty: "easy" },
        { text: "Grind for a specific rare drop for 1 hr", difficulty: "impossible" },
        { text: "Fish 10 times in any biome", difficulty: "easy" },
        { text: "Say in club chat that bard dps > boomer", difficulty: "medium" },
        { text: "Give 1 million flux to Glyba", difficulty: "unreal" }
    ];

    const colors = {
        easy: "#4caf50", medium: "#ffeb3b", hard: "#f44336",
        impossible: "#9c27b0", unreal: "#212121"
    };

    let isSpinning = false;
    let currentRotation = 0;

    function createWheel() {
        wheel.innerHTML = ''; // Clear previous wheel sectors
        const numSegments = challenges.length;
        const cx = 250, cy = 250, r = 240;

        for (let i = 0; i < numSegments; i++) {
            const angle1 = (2 * Math.PI * i) / numSegments;
            const angle2 = (2 * Math.PI * (i + 1)) / numSegments;

            const x1 = cx + r * Math.cos(angle1);
            const y1 = cy + r * Math.sin(angle1);
            const x2 = cx + r * Math.cos(angle2);
            const y2 = cy + r * Math.sin(angle2);

            const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
            path.setAttribute("d", `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${numSegments > 1 ? 0 : 1} 1 ${x2} ${y2} Z`);
            path.setAttribute("fill", colors[challenges[i].difficulty]);
            path.setAttribute("stroke", "#141424");
            path.setAttribute("stroke-width", "4");
            wheel.appendChild(path);
        }
    }

    function spinWheel() {
        if (isSpinning) return;
        isSpinning = true;
        resultElement.classList.remove("reveal");
        resultElement.innerHTML = '';

        const spins = 5 + Math.floor(Math.random() * 5);
        const extraDegrees = Math.floor(Math.random() * 360);
        
        currentRotation += spins * 360 + extraDegrees;

        wheel.style.transition = "transform 5s cubic-bezier(0.25, 1, 0.5, 1)";
        wheel.style.transform = `rotate(${currentRotation}deg)`;

        setTimeout(() => {
            const numSegments = challenges.length;
            const segmentAngle = 360 / numSegments;
            const pointerAngle = 270;
            const effectiveAngle = (360 - (currentRotation % 360) + pointerAngle) % 360;
            const index = Math.floor(effectiveAngle / segmentAngle);

            const result = challenges[index];
            resultElement.innerHTML = `<div class="result-line final-result" style="justify-content: center; text-transform: uppercase; font-size: 1rem;">${result.text}</div>`;
            resultElement.classList.add("reveal");
            isSpinning = false;
        }, 5000); // Match transition duration
    }
    
    const oldBtn = spinBtn;
    const newBtn = oldBtn.cloneNode(true);
    oldBtn.parentNode.replaceChild(newBtn, oldBtn);
    newBtn.addEventListener("click", spinWheel);

    createWheel();
}