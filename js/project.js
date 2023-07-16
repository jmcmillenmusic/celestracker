var celestialBodies = ['Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto'];

for (i = 0; i < celestialBodies.length; i++) {
    var optionEl = document.createElement("option");
    optionEl.value = celestialBodies[i];
    var datalistEl = document.querySelector("datalist");
    datalistEl.appendChild(optionEl);
};
