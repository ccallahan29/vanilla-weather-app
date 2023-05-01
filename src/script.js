function formatDate(timestamp) {
  let date = new Date(timestamp);
  let hours = date.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  let minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let day = days[date.getDay()];
  return `${day} ${hours}:${minutes}`;
}

function fixDate(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return days[day];
}

let hour = new Date().getHours();
let backgroundImageContainer = document.querySelector(".background-image");

if (hour > 19 || hour < 5) {
  backgroundImageContainer.style.backgroundImage =
    'url("/src/img/cozy_night.jpg")';
}

function displayForecast(response) {
  let forecast = response.data.daily;
  let forecastElement = document.querySelector("#forecast");
  let forecastHTML = `<div class="row">`;
  forecast.forEach(function (forecastDay, index) {
    if (index < 6) {
      forecastHTML =
        forecastHTML +
        `<div class="col-2">
              <span class="forecast-day">${fixDate(forecastDay.time)}</span>
            
              <img 
                src= "http://shecodes-assets.s3.amazonaws.com/api/weather/icons/${
                  forecastDay.condition.icon
                }.png" 
                alt="icon" 
                width="65" />
              <span class="forecast-temperature-max">${Math.round(
                forecastDay.temperature.maximum
              )}° | </span>
              <span class= "foreecast-temperature-min">${Math.round(
                forecastDay.temperature.minimum
              )}°</span>
            </div>`;
    }
  });
  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

function getForecast(coordinates) {
  let apiKey = `303c103b672ao77tf0b47afa0937b5c6`;
  let apiUrl = `https://api.shecodes.io/weather/v1/forecast?lon=${coordinates.longitude}&lat=${coordinates.latitude}&key=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayForecast);
}

function showTemp(response) {
  let cityElement = document.querySelector("#current-city");
  let temperatureElement = document.querySelector("#temperature");
  let descriptionElement = document.querySelector("#weather-description");
  let humidityElement = document.querySelector("#humidity");
  let windElement = document.querySelector("#wind-speed");
  let dateElement = document.querySelector("#current-date");
  let iconElement = document.querySelector("#weather-icon");

  celsiusTemp = response.data.temperature.current;
  cityElement.innerHTML = response.data.city;
  temperatureElement.innerHTML = Math.round(celsiusTemp);
  descriptionElement.innerHTML = response.data.condition.description;
  humidityElement.innerHTML = response.data.temperature.humidity;
  windElement.innerHTML = Math.round(response.data.wind.speed);
  dateElement.innerHTML = formatDate(response.data.time * 1000);
  iconElement.setAttribute(
    "src",
    `http://shecodes-assets.s3.amazonaws.com/api/weather/icons/${response.data.condition.icon}.png`
  );
  iconElement.setAttribute("alt", response.data.condition.description);

  getForecast(response.data.coordinates);
}

function search(city) {
  let apiKey = "303c103b672ao77tf0b47afa0937b5c6";
  let units = "metric";
  let apiUrl = `https://api.shecodes.io/weather/v1/current?query=${city}&key=${apiKey}&${units}`;
  axios.get(apiUrl).then(showTemp);
}

function searchCity(event) {
  event.preventDefault();
  let cityInputElement = document.querySelector("#input-city");
  search(cityInputElement.value);
}

function showFahrenheit(event) {
  event.preventDefault();
  let temperatureElement = document.querySelector("#temperature");
  celsiusLink.classList.remove("active");
  fahrenheitLink.classList.add("active");
  let fahrenheitTemp = (celsiusTemp * 9) / 5 + 32;
  temperatureElement.innerHTML = Math.round(fahrenheitTemp);
}

function showCelsius(event) {
  event.preventDefault();
  let temperatureElement = document.querySelector("#temperature");
  fahrenheitLink.classList.remove("active");
  celsiusLink.classList.add("active");
  temperatureElement.innerHTML = Math.round(celsiusTemp);
}

function showLocation(position) {
  let apiKey = "303c103b672ao77tf0b47afa0937b5c6";
  let lat = position.coords.latitude;
  let long = position.coords.longitude;
  let apiUrl = `https://api.shecodes.io/weather/v1/current?lon=${long}&lat=${lat}&key=${apiKey}`;
  axios.get(apiUrl).then(showTemp);
}

function findMyLocation(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(showLocation);
}

let celsiusTemp = null;

let form = document.querySelector("#search-form");
form.addEventListener("submit", searchCity);

let fahrenheitLink = document.querySelector("#fahrenheit");
fahrenheitLink.addEventListener("click", showFahrenheit);

let celsiusLink = document.querySelector("#celsius");
celsiusLink.addEventListener("click", showCelsius);

let findMe = document.querySelector("#current-location");
findMe.addEventListener("click", findMyLocation);

search("Berlin");
