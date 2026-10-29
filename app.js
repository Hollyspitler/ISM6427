const DEFAULT_LOCATION = { name: "Boca Raton", lat: 26.3587, lon: -80.0831 };

// WMO weather codes -> [description, icon]
const WEATHER = {
  0: ["Clear", "☀️"], 1: ["Mostly Clear", "🌤️"], 2: ["Partly Cloudy", "⛅"], 3: ["Cloudy", "☁️"],
  45: ["Fog", "🌫️"], 48: ["Fog", "🌫️"],
  51: ["Drizzle", "🌦️"], 53: ["Drizzle", "🌦️"], 55: ["Drizzle", "🌦️"],
  56: ["Freezing Drizzle", "🌧️"], 57: ["Freezing Drizzle", "🌧️"],
  61: ["Light Rain", "🌧️"], 63: ["Rain", "🌧️"], 65: ["Heavy Rain", "🌧️"],
  66: ["Freezing Rain", "🌧️"], 67: ["Freezing Rain", "🌧️"],
  71: ["Light Snow", "🌨️"], 73: ["Snow", "🌨️"], 75: ["Heavy Snow", "❄️"], 77: ["Snow Grains", "🌨️"],
  80: ["Showers", "🌦️"], 81: ["Showers", "🌦️"], 82: ["Heavy Showers", "⛈️"],
  85: ["Snow Showers", "🌨️"], 86: ["Snow Showers", "🌨️"],
  95: ["Thunderstorm", "⛈️"], 96: ["Thunderstorm", "⛈️"], 99: ["Thunderstorm", "⛈️"],
};
const describe = (code) => WEATHER[code] || ["Unknown", "🌡️"];
const $ = (id) => document.getElementById(id);

async function loadWeather({ name, lat, lon }) {
  const url =
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
    "&current=temperature_2m,apparent_temperature,relative_humidity_2m,weather_code,wind_speed_10m" +
    "&hourly=temperature_2m,weather_code" +
    "&daily=weather_code,temperature_2m_max,temperature_2m_min,uv_index_max" +
    "&temperature_unit=fahrenheit&wind_speed_unit=mph&timezone=auto&forecast_days=7";

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error("Weather request failed");
    render(name, await res.json());
    $("error").hidden = true;
  } catch (err) {
    showError(err.message);
  }
}

function render(name, data) {
  const { current, hourly, daily } = data;
  const [desc] = describe(current.weather_code);

  $("location").textContent = name;
  $("temp").textContent = `${Math.round(current.temperature_2m)}°`;
  $("condition").textContent = desc;
  $("hilo").textContent =
    `H:${Math.round(daily.temperature_2m_max[0])}°  L:${Math.round(daily.temperature_2m_min[0])}°`;
  $("feels").textContent = `${Math.round(current.apparent_temperature)}°`;
  $("humidity").textContent = `${current.relative_humidity_2m}%`;
  $("wind").textContent = `${Math.round(current.wind_speed_10m)} mph`;
  $("uv").textContent = Math.round(daily.uv_index_max[0]);

  // Next 24 hours, starting from the current hour
  const start = Math.max(0, hourly.time.findIndex((t) => t >= current.time.slice(0, 13)));
  $("hourly").innerHTML = hourly.time.slice(start, start + 24).map((t, i) => {
    const idx = start + i;
    const hour = i === 0 ? "Now" : new Date(t).toLocaleTimeString([], { hour: "numeric" });
    return `<div class="hour">
      <span>${hour}</span>
      <span class="icon">${describe(hourly.weather_code[idx])[1]}</span>
      <span>${Math.round(hourly.temperature_2m[idx])}°</span>
    </div>`;
  }).join("");

  $("daily").innerHTML = daily.time.map((d, i) => {
    const day = i === 0 ? "Today" : new Date(d + "T00:00").toLocaleDateString([], { weekday: "short" });
    return `<li>
      <span>${day}</span>
      <span class="icon">${describe(daily.weather_code[i])[1]}</span>
      <span class="range">
        <span class="lo">${Math.round(daily.temperature_2m_min[i])}°</span>
        <span>${Math.round(daily.temperature_2m_max[i])}°</span>
      </span>
    </li>`;
  }).join("");
}

function showError(msg) {
  $("error").textContent = msg;
  $("error").hidden = false;
}

$("search").addEventListener("submit", async (e) => {
  e.preventDefault();
  const query = $("city").value.trim();
  if (!query) return;

  try {
    const res = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=1`
    );
    const data = await res.json();
    if (!data.results?.length) throw new Error(`No results for "${query}"`);
    const { name, latitude, longitude } = data.results[0];
    $("city").value = "";
    loadWeather({ name, lat: latitude, lon: longitude });
  } catch (err) {
    showError(err.message);
  }
});

loadWeather(DEFAULT_LOCATION);
