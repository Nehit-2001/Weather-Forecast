const apiKey = "1a26c1c541dcb0e9bb78ed9d6b359183"; // 🔁

function getWeather() {
  const city = document.getElementById("cityInput").value.trim();
  if (!city) return alert("Please enter a city name.");
  fetchWeatherByCity(city);
}

function fetchWeatherByCity(city) {
  const currentURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  const forecastURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

  Promise.all([fetch(currentURL), fetch(forecastURL)])
    .then(async ([currentRes, forecastRes]) => {
      const current = await currentRes.json();
      const forecast = await forecastRes.json();
      displayCurrentWeather(current);
      displayForecast(forecast.list);
    })
    .catch(() => alert("Failed to fetch weather data."));
}

function getCurrentLocationWeather() {
  navigator.geolocation.getCurrentPosition(pos => {
    const { latitude, longitude } = pos.coords;
    const currentURL = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;
    const forecastURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;

    Promise.all([fetch(currentURL), fetch(forecastURL)])
      .then(async ([currentRes, forecastRes]) => {
        const current = await currentRes.json();
        const forecast = await forecastRes.json();
        displayCurrentWeather(current);
        displayForecast(forecast.list);
      })
      .catch(() => alert("Failed to fetch location weather."));
  });
}

function displayCurrentWeather(data) {
  const today = new Date().toISOString().split("T")[0];
  document.getElementById("locationDate").textContent = `${data.name} (${today})`;
  document.getElementById("temperature").textContent = `Temperature: ${data.main.temp.toFixed(1)}°C`;
  document.getElementById("wind").textContent = `Wind: ${data.wind.speed} m/s`;
  document.getElementById("humidity").textContent = `Humidity: ${data.main.humidity}%`;
  document.getElementById("condition").textContent = data.weather[0].description;
  document.getElementById("weatherIcon").src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
}

function displayForecast(list) {
  const container = document.getElementById("forecast");
  container.innerHTML = "";
  const filtered = list.filter(item => item.dt_txt.includes("12:00:00")).slice(0, 5);

  filtered.forEach(day => {
    const date = day.dt_txt.split(" ")[0];
    container.innerHTML += `
      <div class="bg-gray-700 text-white p-3 rounded text-center">
        <p class="font-bold">(${date})</p>
        <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}.png" class="mx-auto" />
        <p>Temp: ${day.main.temp.toFixed(1)}°C</p>
        <p>Wind: ${day.wind.speed} m/s</p>
        <p>Humidity: ${day.main.humidity}%</p>
      </div>
    `;
  });
}
