const key = 'cb48d909cf74b142fdd832755fa133c7'; // API Key

//API URL
let URL = `https://api.openweathermap.org/data/2.5/weather?appid=${key}`
        + `&units=imperial&`;

// When the window loads, ask for location service to gain the user's
// address to give their location's weather information.
window.addEventListener('load', () => {

    // If user enables location service, then
    if (navigator.geolocation) {
        // get user's location: longitude and latitude
        navigator.geolocation.getCurrentPosition(pos => {
            // fetch data and output the location weather information
            // with the use of the location
            fetch(URL + "lat=" + pos.coords.latitude + "&lon="
            + pos.coords.longitude)
                .then(response => response.json())
                .then(data => {
                    checkWeather(data);
                })
                .catch(error => console.log("Rejected Location Service"))
        })
    }
    // Otherwise, if location services are disabled, default to Seattle
    // weather information
    else {
        let city = "Seattle"; 
        fetchAPI(city);
    }
})

// Collects user input for which city to use for weather search info
let enter = document.querySelector('.submit');
enter.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        let city = document.querySelector("input").value;
        fetchAPI(city);
    }
})

/**
 * checkWeather: this adds in the information given by the API
 * to the HTML for view.
 * PRE: fetch data to work
 * POST: prints out the information
 * @param {Object} data: API JSON object that contains the data.
 */
function checkWeather(data) {
    let result = document.querySelector('.result');

    // capitalizes first letter of weather description
    let desc = data.weather[0].description;
    desc = desc.charAt(0).toUpperCase() + desc.slice(1);

    // input the data from API to HTML
    result.innerHTML =
        `
        <p class="city"><b class="key">City:</b> ${data.name}</p>
        <p class="temp"><b class="key">Temperature:</b> ${data.main.temp}  &#176 F</p>
        <p class="desc"><b class="key">Description:</b> ${desc}</p>
        <p class="date"><b class="key">Date:</b> ${new Date()}</p> 
        
    `
    let inputField = document.querySelector('input');
    inputField.value = ""; // clear input search text after search
}

/**
 * fetchAPI: fetches weather data using city name and then checks weather
 * PRE: requires city name
 * POST: checks the weather
 * @param {string} city: city name
 */
function fetchAPI(city) {
    // fetch URL, then get access to API JSON object
    fetch(URL + "q=" + city)
    .then(response => response.json())
    .then(data => {
        checkWeather(data);
    })
    .catch(error => alert("Invalid City"))
}

/*
Website API Call Instructions: https://openweathermap.org/current
API: https://api.openweathermap.org/data/2.5/weather?q=London&appid=cb48d909cf74b142fdd832755fa133c7
*/