//API KEYS
const weatherApiKey = '6627c4ea662f482e8d542843231607'; 
const nasaApiKey = 'eJrxMfuUCBlR4AONaH2qLH1B3omdD8CaWfksRWQi';

// Astronomy API credentials
const applicationId = '7763bed4-51a4-4e07-aee2-c47662434094';
const applicationSecret = 'c3dd81bf0406ecd6225c16fa820b4e99876b91cb405354f50f1f0b108ef413e27c8c01b450c7e0d4b7fb9388b884cb4dbcb2760724531c732736b05728ed56dcd7928452733bb6b035baea3152b02af3d1555d2df69d59423a8b94b474e1007a94a55d8912b70f0ed65f2c926a8a8fd0';
const authString = btoa(`${applicationId}:${applicationSecret}`);

// Initial variables for storing current day and time
var today = dayjs().format('YYYY-MM-DD');
var hour = dayjs().format('HH');
var minute = dayjs().format('mm');
var second = dayjs().format('ss');

// Initial object that stores user information for Astronomy API
var userStats = {
  longitude: "",
  latitude: "",
  elevation: "1",
  from_date: today,
  to_date: today,
  time: `${hour}%3A${minute}%3A${second}`
};

// Initial variable to interact with modal to be used later
var cloudyModal = document.getElementById("too-cloudy");

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
      // Filter the images to select a larger image (e.g., image with "large" in the description)
      const filteredImages = data.collection.items.filter(item => item.data[0].description.includes('2003'));
      if (filteredImages.length > 0) {
        var imageUrl = filteredImages[0].links[0].href;
        starPhoto.setAttribute('src', imageUrl);
      } else {
        // If no larger image found, fallback to the first image
        var imageUrl = data.collection.items[0].links[0].href;
        starPhoto.setAttribute('src', imageUrl);
      }
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
    userStats.longitude = data.location.lon.toString();
    userStats.latitude = data.location.lat.toString();
    console.log(userStats);

    // Check if the weather condition is "cloudy"
    if (currentWeather.condition.text.toLowerCase().includes('overcast')) {
      cloudyModal.classList.add('is-active');
      throw new Error('It is currently cloudy. Please try again later.');
    }

    // Continue with other actions if needed
  })
  .catch(error => {
    console.error(error);
    // Display an error message to the user or perform other actions
  });

// Makes a request to the Astronomy API using the details inserted below and the credentials above
console.log(userStats);
// var astronomyApi = "https://api.astronomyapi.com/api/v2/bodies/positions?longitude=" + userStats.longitude + "&latitude=" + userStats.latitude + "&elevation=1&from_date=" + userStats.from_date + "&to_date=" + userStats.to_date + "&time=" + userStats.time;
// console.log(astronomyApi);

fetch(astronomyApi, {
  method: "GET",
  headers: {
    "Authorization": "Basic " + authString
  }
  })
  .then(response => {
    if (!response.ok) {
      throw new Error("Request failed");
    }
    return response.json();
  })
  .then(data => {
    console.log(data);
  })
  .catch(error => {
    console.error(error);
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

// This sets up the functionality to allow the user to interact with modals.
document.addEventListener('DOMContentLoaded', () => {
  // Functions to open and close a modal
  function openModal($el) {
    $el.classList.add('is-active');
  }

  function closeModal($el) {
    $el.classList.remove('is-active');
  }

  function closeAllModals() {
    (document.querySelectorAll('.modal') || []).forEach(($modal) => {
      closeModal($modal);
    });
  }

  // Add a click event on various child elements to close the parent modal
  (document.querySelectorAll('.modal-background, .modal-close, .modal-card-head .delete, .modal-card-foot .button') || []).forEach(($close) => {
    const $target = $close.closest('.modal');

    $close.addEventListener('click', () => {
      closeModal($target);
    });
  });
});