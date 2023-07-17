//API KEYS
const weatherApiKey = '6627c4ea662f482e8d542843231607'; 
const nasaApiKey = 'eJrxMfuUCBlR4AONaH2qLH1B3omdD8CaWfksRWQi';

//API LINK
const nasaApiUrl = 'https://images-api.nasa.gov/search';
const apiUrl = 'http://api.weatherapi.com/v1/current.json';

document.getElementById('searchButton').addEventListener('click', () => {
  const cityInput = document.getElementById('cityInputField').value;
  const starInput = document.getElementById('starList').value;

  // Make a request to the NASA API
  const nasaUrl = "${nasaApiUrl}?q=${starInput}&media_type=image&api_key=${nasaApiKey}";
  
  fetch(nasaUrl)
    .then(response => {
      if (!response.ok) {
        throw new Error('Request to NASA API failed');
      }
      return response.json();
    })
    .then(data => {
      // Check if there are any images available in the response
      if (data.collection.items.length > 0) {
        const imageUrl = data.collection.items[0].links[0].href;
        updateResults(imageUrl);
      } else {
        updateResults(''); // No image found
      }
    })
    .catch(error => {
      console.error(error);
      // Display an error message to the user or perform other actions
    });
  
  // Make a request to the weather API
  const weatherUrl = "${apiUrl}?key=${weatherApiKey}&q=${cityInput}&aqi=no";
  
  fetch(weatherUrl)
    .then(response => {
      if (!response.ok) {
        throw new Error('Request to weather API failed');
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
  const imageElement = document.querySelector('#resultImage');
  const paragraphElement = document.querySelector('#resultDescription');
  
  // Update the image source and paragraph content with the weatherData
  imageElement.src = weatherData.imageSrc;
  paragraphElement.textContent = weatherData.description;
}

var celestialBodies = ['Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto'];

for (let i = 0; i < celestialBodies.length; i++) {
  var optionEl = document.createElement("option");
  optionEl.value = celestialBodies[i];
  var datalistEl = document.querySelector("#celestialBodies");
  datalistEl.appendChild(optionEl);
}