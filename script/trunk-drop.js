document.addEventListener("DOMContentLoaded", () => {
  const calculateBtn = document.getElementById("calculateTrunkBtn");
  const resultElem = document.getElementById("trunkResult");

  // change of class 'active' by click
  document.querySelectorAll('.resource-button').forEach(btn => {
    btn.addEventListener('click', () => {
      btn.classList.toggle('active');
    });
  });

  // get activated resources
  function getSelectedResources() {
    const buttons = document.querySelectorAll(".resource-button.active");
    return Array.from(buttons).map(btn => btn.dataset.value);
  }

	// MAGIC GOES BRRRR
  function phiInv(p) {
    if (p <= 0 || p >= 1) throw new Error("Invalid input for phiInv");
    const a1 = -39.6968302866538, a2 = 220.946098424521, a3 = -275.928510446969,
      a4 = 138.357751867269, a5 = -30.6647980661472, a6 = 2.50662827745924;
    const b1 = -54.4760987982241, b2 = 161.585836858041, b3 = -155.698979859887,
      b4 = 66.8013118877197, b5 = -13.2806815528857;
    const c1 = -0.00778489400243029, c2 = -0.322396458041136, c3 = -2.40075827716184,
      c4 = -2.54973253934373, c5 = 4.37466414146497, c6 = 2.93816398269878;
    const d1 = 0.00778469570904146, d2 = 0.32246712907004, d3 = 2.445134137143,
      d4 = 3.75440866190742;
    const p_low = 0.02425, p_high = 1 - p_low;
    let q, r, retVal;

    if (p < p_low) {
      q = Math.sqrt(-2 * Math.log(p));
      retVal = (((((c1 * q + c2) * q + c3) * q + c4) * q + c5) * q + c6) /
        ((((d1 * q + d2) * q + d3) * q + d4) * q + 1);
    } else if (p <= p_high) {
      q = p - 0.5;
      r = q * q;
      retVal = (((((a1 * r + a2) * r + a3) * r + a4) * r + a5) * r + a6) * q /
        (((((b1 * r + b2) * r + b3) * r + b4) * r + b5) * r + 1);
    } else {
      q = Math.sqrt(-2 * Math.log(1 - p));
      retVal = -(((((c1 * q + c2) * q + c3) * q + c4) * q + c5) * q + c6) /
        ((((d1 * q + d2) * q + d3) * q + d4) * q + 1);
    }

    return retVal;
  }

  function calculateTrunksNeeded(amount, p, confidence) {
    const q = 1 - confidence;
    const Z = phiInv(q);
    const A = p;
    const B = amount;
    const C = 1 - p;
    const D = Z * Z;

    const a = A * A;
    const b = -(2 * A * B + D * A * C);
    const c = B * B;

    const discriminant = b * b - 4 * a * c;

    if (discriminant < 0) return null;

    const sqrtD = Math.sqrt(discriminant);
    const n1 = (-b + sqrtD) / (2 * a);
    const n2 = (-b - sqrtD) / (2 * a);
    const n = Math.max(n1, n2);

    return n > 0 ? Math.ceil(n) : null;
  }

  // Calculate event
  calculateBtn.addEventListener("click", () => {
    const selected = getSelectedResources();
    if (selected.length === 0) {
      alert("Please select at least one resource.");
      return;
    }

    const trunkInputElem = document.getElementById("trunkInput");
    const confidenceElem = document.getElementById("trunkConfidence");
    const calcMode = document.querySelector('input[name="calcMode"]:checked');

    if (!trunkInputElem || !confidenceElem || !calcMode) {
      alert("Please make sure all inputs are filled correctly.");
      return;
    }

    const inputVal = parseFloat(trunkInputElem.value);
    const confidenceVal = parseFloat(confidenceElem.value);

    if (isNaN(inputVal) || inputVal <= 0) {
      alert("Please enter a positive number for the amount!");
      return;
    }
    if (isNaN(confidenceVal) || confidenceVal < 50 || confidenceVal > 99.9) {
      alert("Confidence must be between 50 and 99.9%");
      return;
    }

    const dropRates = {
      souls: 2.86 / 100,
      core: 6.57 / 100,
      fishBone: 5.69 / 100,
      runicEssence: 9.32 / 100,
      depthsSand: 5.93 / 100,
      zephyrEssence: 8.53 / 100,
      pyricEssence: 9.64 / 100,
      abyssalEssence: 10.43 / 100,
      inkBladder: 5.14 / 100
    };

    const resourceNames = {
      souls: "Depths Souls",
      core: "Depths Core",
      fishBone: "Fish Bone",
      runicEssence: "Runic Essence",
      depthsSand: "Depths Sand",
      zephyrEssence: "Zephyr Essence",
      pyricEssence: "Pyric Essence",
      abyssalEssence: "Abyssal Essence",
      inkBladder: "Ink Bladder"
    };

    const resourceIcons = {
      souls: "img/depths.png",
      core: "img/core.png",
      fishBone: "img/fishbone.png",
      runicEssence: "img/runic.png",
      depthsSand: "img/sand.png",
      zephyrEssence: "img/zephyr.png",
      pyricEssence: "img/pyric.png",
      abyssalEssence: "img/abyssal.png",
      inkBladder: "img/ink.png"
    };

    const confidence = confidenceVal / 100;
    let outputs = [];

    selected.forEach(resKey => {
      const p = dropRates[resKey];
      const resName = resourceNames[resKey] || resKey;
      const icon = resourceIcons[resKey] || "";
      const iconHTML = icon ? `<img src="${icon}" alt="${resName}" style="width: 40px; vertical-align: middle; margin-right: 6px;">` : "";

      if (!p) {
        outputs.push(`Unknown resource type: ${resKey}`);
        return;
      }

      if (calcMode.value === "itemsExpected") {
        const expected = inputVal * p;
        outputs.push(`<fieldset class="trunkdropfield">${iconHTML}<b>${resName}:<br></b> From <b>${inputVal.toLocaleString()}</b> trunks you can expect about <b>${expected.toFixed(2)}</b>.</fieldset>`);
      } else if (calcMode.value === "trunksNeeded") {
        const trunksNeeded = calculateTrunksNeeded(inputVal, p, confidence);
        if (trunksNeeded === null) {
          outputs.push(`${iconHTML}<b>${resName}</b>: No solution found with given parameters.`);
        } else {
          outputs.push(`<fieldset class="trunkdropfield">${iconHTML}<b>${resName}</b>: You need to open approximately <b>${trunksNeeded.toLocaleString()} Trunks</b></fieldset>`);
        }
      } else {
        outputs.push("Unknown calculation mode selected.");
      }
    });

    resultElem.innerHTML = outputs.join("<br><br>");
  });
});
