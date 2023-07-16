//CODE TO CALL THE WEATHER API AND CONSOLE LOG IT IDK WHY THE API KEY HATES ME THO 

const weatherApiKey = '6627c4ea662f482e8d542843231607'; 
const apiUrl = 'https://api.open-meteo.com/v1/forecast?latitude=29.7633&longitude=-95.3633&hourly=cloudcover';

document.getElementById('searchButton').addEventListener('click', () => {
  const cityInput = document.getElementById('cityInput').value;
  const url = "${apiUrl}?key=${weatherApiKey}&q=${cityInput}&aqi=no";

  fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error('Request failed');
      }
      return response.json();
    })
    .then(data => {
      const currentWeather = data.current;
      updateResults(currentWeather);
    })
    .catch(error => {
      console.error(error);
      // Display an error message to the user or perform other actions
    });
});

function updateResults(weatherData) {
  const imageElement = document.querySelector('#resultsArea .image');
  const paragraphElement = document.querySelector('#resultsArea .notification');
  
  // Update the image source and paragraph content with the weatherData
  imageElement.src = weatherData.imageSrc;
  paragraphElement.textContent = weatherData.description;
} 

var celestialBodies = ['Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto'];

for (i = 0; i < celestialBodies.length; i++) {
    var optionEl = document.createElement("option");
    optionEl.value = celestialBodies[i];
    var datalistEl = document.querySelector("datalist");
    datalistEl.appendChild(optionEl);
};

