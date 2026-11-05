const axios = require("axios");

const STORMGLASS_URL =
"https://api.stormglass.io/v2/weather/point";

const buildFallbackWeather = () => ({
  temperature: 32,
  humidity: 28,
  windSpeed: 4,
  rainfall: 0,
  description: "Estimated Turkana weather"
});

const buildFallbackForecast = () =>
  Array.from({ length: 5 }, (_, index) => ({
    date: new Date(Date.now() + index * 24 * 60 * 60 * 1000).toISOString(),
    temperature: 32 + index,
    humidity: Math.max(20, 30 - index),
    rainfall: index === 2 ? 4 : 0,
    windSpeed: 4 + index * 0.4
  }));


const getWeatherData = async (lat, lng) => {

  try {

    const response = await axios.get(STORMGLASS_URL, {

      params: {
        lat,
        lng,
        params: "airTemperature,humidity,windSpeed,precipitation",
        source: "noaa",
        hours: 1
      },

      headers: {
        Authorization: process.env.STORMGLASS_API_KEY
      }

    });

    const weather = response.data.hours[0];

    return {

      temperature: weather.airTemperature?.noaa || 30,
      humidity: weather.humidity?.noaa || 30,
      windSpeed: weather.windSpeed?.noaa || 3,
      rainfall: weather.precipitation?.noaa || 0,
      description: "Stormglass weather"

    };

  } catch (error) {

    console.error("Stormglass error:", error.message);
    if (error.response?.status === 402) {
      console.warn("Stormglass quota/payment limit reached. Using fallback weather data.");
    }

    return buildFallbackWeather();

  }

};



const getForecast = async (lat, lng) => {

  try {

    const response = await axios.get(STORMGLASS_URL, {

      params: {
        lat,
        lng,
        params: "airTemperature,humidity,windSpeed,precipitation",
        source: "noaa",
        hours: 24
      },

      headers: {
        Authorization: process.env.STORMGLASS_API_KEY
      }

    });

    return response.data.hours.slice(0, 5).map(hour => ({

      date: hour.time,
      temperature: hour.airTemperature?.noaa || 30,
      humidity: hour.humidity?.noaa || 30,
      rainfall: hour.precipitation?.noaa || 0,
      windSpeed: hour.windSpeed?.noaa || 3

    }));

  } catch (error) {

    console.error("Forecast error:", error.message);
    if (error.response?.status === 402) {
      console.warn("Stormglass quota/payment limit reached. Using fallback forecast data.");
    }

    return buildFallbackForecast();

  }

};


module.exports = { getWeatherData, getForecast };
