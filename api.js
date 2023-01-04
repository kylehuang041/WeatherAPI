/**
 * Name: Kyle Huang
 * Website API: https://openweathermap.org
 * 
 * This is the api.js where it handles the fetch and data process of weather API.
 * It utilizes local storage for default load and search for weather data.
 */

"use strict";
(function() {
	// When the window loads, ask for location service to gain the user's
	// address to give their location's weather information.
	window.addEventListener('load', init);
	const key = 'cb48d909cf74b142fdd832755fa133c7'; // API Key
	let API_URL = `https://api.openweathermap.org/data/2.5/weather?appid=${key}&units=imperial&`;

	// MAIN BLOCK
	function init() {
		let city = localStorage.getItem("cityName");
		let searchInput = document.querySelector("#search");
		searchInput.value = "";

		if (city) fetchWeatherInfo(city); // get weather info from local storage		
		useNavigation();// Ask user for location to get weather info

		// Get city name from search input to get weather info
		document.querySelector('#search').addEventListener('keypress', (e) => {
			if (e.key === 'Enter' && e.target.value) {
				let city = document.querySelector("input").value;
				fetchWeatherInfo(city);
			}
		});
	}

	/**
	 * Get user's location te fetch weather information
	 */
	function useNavigation() {
		// If user enables location service, then
		if (navigator.geolocation) {
			// get user's location: longitude and latitude
			navigator.geolocation.getCurrentPosition(pos => {
				// fetch data and output the location weather information
				// with the use of the location
				fetch(API_URL + "lat=" + pos.coords.latitude + "&lon="
					+ pos.coords.longitude)
					.then(response => response.json())
					.then(data => {
						status.innerHTML = "";
						processWeatherInfo(data);
					})
					.catch(error => {
						let status = document.querySelector('#status');
						let weatherInfo = document.querySelector('#weather-info');
						weatherInfo.classList.add("hidden");
						status.classList.remove("hidden");
					})
			});
		}
	}

	/**
	 * Adds in the information given by the API to the HTML for view
	 * PRE: fetch data to work
	 * POST: prints out the information
	 * @param {Object} data: API JSON object that contains the data
	 */
	function processWeatherInfo(data) {
		let searchInput = document.querySelector("#search");
		let weatherInfo = document.querySelector('#weather-info');
		let desc = data.weather[0].description;
		desc = desc.charAt(0).toUpperCase() + desc.slice(1);
		weatherInfo.classList.remove("hidden");

		// write weather info to HTML page
		weatherInfo.innerHTML =
			`
				<p class="city"><b>Location:</b> ${data.name}, ${data.sys.country}</p>
				<p class="temp"><b>Temperature:</b> ${data.main.temp}</p>
				<p class="desc"><b>Description:</b> ${desc}</p>
			`;

		// save city name into local storage
		localStorage.setItem("cityName", data.name);

		searchInput.value = "";
	}

	/**
	 * Fetches weather data using city name and then checks weather
	 * PRE: requires city name
	 * POST: checks the weather
	 * @param {string} city: city name
	 */
	function fetchWeatherInfo(city) {
		fetch(API_URL + "q=" + city)
			.then(response => response.json())
			.then(data => {
				processWeatherInfo(data);
			})
			.catch(error => {
				let status = document.querySelector('#status');
				let weatherInfo = document.querySelector('#weather-info');
				weatherInfo.classList.add("hidden");
				status.classList.remove("hidden");
			});
	}
}());