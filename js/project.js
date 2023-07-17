//API KEYS
const weatherApiKey = '6627c4ea662f482e8d542843231607'; 
const nasaApiKey = 'eJrxMfuUCBlR4AONaH2qLH1B3omdD8CaWfksRWQi';

// Heads-up: I (Jeff) moved the API links into the addEventListener section.

// This button will grab the user's inputs for location and what star/planet/constellation they're searching for.
document.getElementById('searchButton').addEventListener('click', () => {
  var cityInput = document.getElementById('cityInput').value;
  var starInput = document.getElementById('starList').value;
  var starPhoto = document.getElementById('starPhoto');

  // NASA API URL, which takes the name of the star/planet/constellation from the user
  var nasaApiUrl = 'https://images-api.nasa.gov/search?q=' + starInput + '&media_type=image';
  
  // Make a request to the NASA API
  fetch(nasaApiUrl)
    .then(response => {
      if (!response.ok) {
        throw new Error('Request to NASA API failed');
      }
      return response.json();
    })
    .then(data => {
      // Check if there are any images available in the response
      console.log(data);
      if (data.collection.items.length > 0) {
        var imageUrl = data.collection.items[0].links[0].href;
        starPhoto.setAttribute('src', imageUrl);
      } else {
        updateResults(''); // No image found
      }
    })
    .catch(error => {
      console.error(error);
      // Display an error message to the user or perform other actions
    });
  

  // Make a request to the weather API
  var weatherApiUrl = 'http://api.weatherapi.com/v1/current.json?key=6627c4ea662f482e8d542843231607&q=' + cityInput + '&aqi=no';
  console.log(weatherApiUrl);
  
  fetch(weatherApiUrl)
    .then(response => {
      if (!response.ok) {
        throw new Error('Request to weather API failed');
      }
      return response.json();
    })
    .then(data => {
      console.log(data);
      const currentWeather = data.current;
      console.log(currentWeather);
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

document.getElementById('starList').addEventListener('input', function() {
  var userInput = this.value;
  var datalistEl = document.querySelector("#celestialBodies");
  datalistEl.innerHTML = ""; 

  for (let i = 0; i < celestialBodies.length; i++) {
    if (celestialBodies[i].toLowerCase().startsWith(userInput.toLowerCase())) {
      var optionEl = document.createElement("option");
      optionEl.value = celestialBodies[i];
      datalistEl.appendChild(optionEl);
    }
  }
});
