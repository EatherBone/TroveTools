document.addEventListener("DOMContentLoaded", () => {
  particlesJS('particles-js', {
    "particles": {
      "number": {
        "value": 60,
        "density": {
          "enable": true,
          "value_area": 800
        }
      },
      "color": { "value": "#ff4dd2" },
      "shape": { "type": "circle" },
      "opacity": {
        "value": 1,
        "random": true
      },
      "size": {
        "value": 3,
        "random": true
      },
      "move": {
        "enable": true,
        "speed": 2,
        "direction": "none",
        "out_mode": "bounce"
      }
    },
    "interactivity": {
      "events": {
        "onhover": { "enable": true, "mode": "repulse" },
        "onclick": { "enable": true, "mode": "push" }
      },
      "modes": {
        "repulse": { "distance": 100 },
        "push": { "particles_nb": 4 }
      }
    },
    "retina_detect": true
  });
});