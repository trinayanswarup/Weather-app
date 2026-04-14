const weatherDescriptions = {
  0: 'Clear sky', 1: 'Mainly clear', 2: 'Partly cloudy', 3: 'Overcast',
  45: 'Foggy', 48: 'Icy fog',
  51: 'Light drizzle', 53: 'Drizzle', 55: 'Heavy drizzle',
  61: 'Light rain', 63: 'Rain', 65: 'Heavy rain',
  71: 'Light snow', 73: 'Snow', 75: 'Heavy snow',
  80: 'Light showers', 81: 'Showers', 82: 'Heavy showers',
  95: 'Thunderstorm', 96: 'Thunderstorm with hail', 99: 'Heavy thunderstorm'
};

document.getElementById('cityInput').addEventListener('keydown', e => {
  if (e.key === 'Enter') searchWeather();
});

async function searchWeather() {
  const city = document.getElementById('cityInput').value.trim();
  if (!city) return;

  const btn = document.getElementById('searchBtn');
  const errorEl = document.getElementById('errorMsg');
  const loadingEl = document.getElementById('loadingMsg');
  const card = document.getElementById('weatherCard');

  btn.disabled = true;
  errorEl.textContent = '';
  loadingEl.textContent = 'Fetching weather…';
  card.classList.remove('visible');

  try {
    const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`);
    const geoData = await geoRes.json();

    if (!geoData.results?.length) {
      errorEl.textContent = 'City not found. Try another name.';
      loadingEl.textContent = '';
      btn.disabled = false;
      return;
    }

    const { latitude, longitude, name, country } = geoData.results[0];
    const wRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,weather_code,uv_index`);
    const wData = await wRes.json();
    const c = wData.current;

    document.getElementById('cityName').textContent = `${name}, ${country}`;
    document.getElementById('condition').textContent = weatherDescriptions[c.weather_code] || 'Unknown';
    document.getElementById('temperature').textContent = Math.round(c.temperature_2m);
    document.getElementById('feelsLike').textContent = `${Math.round(c.apparent_temperature)}°`;
    document.getElementById('humidity').textContent = `${c.relative_humidity_2m}%`;
    document.getElementById('wind').textContent = `${Math.round(c.wind_speed_10m)} km/h`;
    document.getElementById('uvIndex').textContent = c.uv_index ?? '—';

    card.classList.add('visible');
  } catch {
    errorEl.textContent = 'Something went wrong. Check your connection.';
  }

  loadingEl.textContent = '';
  btn.disabled = false;
}