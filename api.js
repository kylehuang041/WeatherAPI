/*
Website API Call Instructions: https://openweathermap.org/current
API: https://api.openweathermap.org/data/2.5/weather?q=London&appid=cb48d909cf74b142fdd832755fa133c7
*/

const key = 'cb48d909cf74b142fdd832755fa133c7'; // API Key
const status = document.querySelector('#status');

//API URL
let URL = `https://api.openweathermap.org/data/2.5/weather?appid=${key}`
        + `&units=imperial&`;

let nav = false;

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
                    status.innerHTML = "";
                    checkWeather(data);
                })
                .catch(error => {
                    result.style.marginTop = 0;
                    status.innerHTML = "&#9888; Incorrect City Name";
                })
        })
        nav = true;
    }

    //If local storage isn't empty, then use its data to search
    if (localStorage.getItem("cityName") !== null) {
        console.log("load: local storage");
        let city = localStorage.getItem("cityName");
        fetchAPI(city);
    }

    // Otherwise, if location services are disabled, default to Seattle
    // weather information
    else if (localStorage.getItem("cityName") === null) {
        console.log("load: Seattle");
        let city = "Seattle";
        fetchAPI(city);
    }
});

// Collects user input for which city to use for weather search info
// when 'Enter' key is pressed
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
        <p class="city"><b class="key">Location:</b> ${data.name}, ${data.sys.country}</p>
        <p class="temp"><b class="key">Temperature:</b> ${data.main.temp}  &#176 F</p>
        <p class="desc"><b class="key">Description:</b> ${desc}</p>
    `

    const inputField = document.querySelector('input');

    // If navigation is enabled
    if (nav == true) {
        // set local storage of your destination
        localStorage.setItem("cityName", data.name);
    }

    // If that's not the case and input search isn't empty
    else if (inputField.value !== null) {
        // set local storage to input search value
        localStorage.setItem("cityName", inputField.value);
    }

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
    if (city == null || city == undefined || city === "<empty string>") city = "Seattle";
    fetch(URL + "q=" + city)
    .then(response => response.json())
    .then(data => {
        status.innerHTML = "";
        checkWeather(data);
    })
    .catch(error => {
        const result = document.querySelector('.result');
        result.style.marginTop = 0;
        status.innerHTML = "&#9888; Incorrect City Name";
    })
}