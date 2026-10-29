# ISM6427 – Weather App

**Author:** Holly Spitler
**Repository:** [github.com/Hollyspitler/ISM6427](https://github.com/Hollyspitler/ISM6427)

A simple, Apple-style glassmorphic weather app powered by the free [Open-Meteo API](https://open-meteo.com/) (no API key needed). It opens on Boca Raton, FL, and you can search for any other city.

## Features
- Current temperature, conditions, and today's high/low
- 24-hour hourly forecast and 7-day forecast
- Feels like, humidity, wind, and UV index
- City search (Open-Meteo Geocoding API)

## Files
- `index.html` – page layout
- `style.css` – glassmorphism styling
- `app.js` – fetches and displays Open-Meteo data
- `netlify.toml` – Netlify settings (no build step)

## Deploy to Netlify
1. In Netlify, choose **Add new site → Import an existing project** and pick this repo.
2. Leave the build command empty; the publish directory is the repo root (already set in `netlify.toml`).
3. Click **Deploy**.
