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

var celestialBodies = ['Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto', "Andromeda", "Antlia", "Apus", "Aquarius", "Aquila", "Auriga", "Boötes", "Cancer", "Canis Major", "Capricornus", "Cassiopeia", "Cygnus", "Gemini", "Leo", "Libra", "Lyra", "Orion", "Pegasus", "Perseus", "Pisces", "Sagittarius", "Scorpius", "Taurus", "Ursa Major", "Virgo"];

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

document.getElementById('searchButton').addEventListener('click', searchWikipedia);

function searchWikipedia() {
  const starInput = document.getElementById('starList').value;
  const apiUrl = `https://en.wikipedia.org/w/api.php?action=query&origin=*&format=json&list=search&srsearch=${encodeURIComponent(starInput)}`;

  fetch(apiUrl)
    .then(response => {
      if (!response.ok) {
        throw new Error('Request failed');
      }
      return response.json();
    })
    .then(data => {
      const pages = data.query.search;
      if (pages.length > 0) {
        const firstPage = pages[0];
        const pageTitle = firstPage.title;
        return fetchPageContent(pageTitle);
      } else {
        throw new Error('No results found.');
      }
    })
    .then(pageContent => {
      const pageTitle = pageContent.title;
      const limitedExtract = extractLimitedContent(pageContent.extract, 3); // Limit to 3 sentences
      updateWikiResults([{ pageTitle, limitedExtract, pageId: pageContent.pageid }]);
    })
    .catch(error => {
      console.error(error);
      // Display an error message to the user or perform other actions
    });
}

function fetchPageContent(pageTitle) {
  const pageUrl = `https://en.wikipedia.org/w/api.php?action=query&origin=*&format=json&prop=extracts&exintro=true&titles=${encodeURIComponent(pageTitle)}`;
  return fetch(pageUrl)
    .then(response => {
      if (!response.ok) {
        throw new Error('Request failed');
      }
      return response.json();
    })
    .then(data => {
      const pageId = Object.keys(data.query.pages)[0];
      const pageData = data.query.pages[pageId];
      const title = pageData.title;
      const extract = pageData.extract;
      return { title, extract, pageId };
    });
}

function extractLimitedContent(text, limit) {
  const sentences = text.split('.');
  const limitedSentences = sentences.slice(0, limit);
  const withoutTags = limitedSentences.map(sentence => sentence.replace(/<[^>]+>/g, '')).join('. ');
  return withoutTags.trim();
}

function updateWikiResults(results) {
  const resultsContainer = document.querySelector('#resultsArea .notification.has-text-black');

  // Clear previous results
  resultsContainer.innerHTML = '';

  results.forEach(result => {
    const titleElement = document.createElement('h2');
    titleElement.textContent = result.title;

    const extractElement = document.createElement('p');
    extractElement.textContent = result.limitedExtract;

    const linkElement = document.createElement('a');
    linkElement.href = `https://en.wikipedia.org/?curid=${result.pageId}`;
    linkElement.textContent = 'Read More';

    resultsContainer.appendChild(titleElement);
    resultsContainer.appendChild(extractElement);
    resultsContainer.appendChild(linkElement);
  });
}