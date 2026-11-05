import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FaCloudSun,
  FaTemperatureHigh,
  FaTint,
  FaWind,
  FaExclamationTriangle,
  FaCalendarAlt,
  FaSun,
  FaCloudRain,
  FaCloud,
  FaLeaf
} from 'react-icons/fa';

import { weatherAPI } from '../../services/api';
import toast from 'react-hot-toast';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const WeatherAdvisory = () => {

  const [loading, setLoading] = useState(true);
  const [weatherData, setWeatherData] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [selectedDay, setSelectedDay] = useState(null);

  useEffect(() => {
    fetchWeatherData();
  }, []);

  const fetchWeatherData = async () => {

    setLoading(true);

    try {

      const [adviceResponse, alertsResponse] = await Promise.all([
        weatherAPI.getAdvice(),
        weatherAPI.getAlerts()
      ]);

      setWeatherData(adviceResponse?.data || null);

      setAlerts(alertsResponse?.data?.alerts || []);

    } catch (error) {

      console.error('Weather fetch error:', error);

      toast.error('Failed to load weather data');

    } finally {

      setLoading(false);

    }

  };

  const getWeatherIcon = (description = '') => {

    const text = description.toLowerCase();

    if (text.includes('rain')) return FaCloudRain;
    if (text.includes('cloud')) return FaCloud;

    return FaSun;

  };

  if (loading) {

    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
      </div>
    );

  }

  const chartData = {

    labels:
      weatherData?.forecast?.map(f =>
        new Date(f.date).toLocaleDateString('en-US', { weekday: 'short' })
      ) || [],

    datasets: [
      {
        label: 'Temperature (°C)',
        data: weatherData?.forecast?.map(f => f.temperature) || [],
        borderColor: 'rgb(34,197,94)',
        backgroundColor: 'rgba(34,197,94,0.1)',
        tension: 0.4,
        fill: true
      }
    ]

  };

  const chartOptions = {

    responsive: true,
    maintainAspectRatio: false,

    plugins: {
      legend: { display: false }
    }

  };

  return (

    <div className="max-w-6xl mx-auto px-4 py-8">

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center mb-10"
      >
        <h1 className="text-4xl font-bold mb-2">Weather Advisory</h1>
        <p className="text-gray-600">
          AI powered weather insights for farmers
        </p>
      </motion.div>

      {/* ALERTS */}

      {alerts.length > 0 && (

        <div className="mb-8">

          <h2 className="text-xl font-semibold flex items-center mb-4">
            <FaExclamationTriangle className="mr-2 text-yellow-500"/>
            Weather Alerts
          </h2>

          {alerts.map((alert,index)=>(
            <div key={index} className="bg-yellow-50 border p-4 rounded mb-2">

              <p className="font-semibold">{alert.type}</p>

              <p className="text-sm">{alert.message}</p>

            </div>
          ))}

        </div>

      )}

      {/* CURRENT WEATHER */}

      <div className="grid md:grid-cols-4 gap-6 mb-10">

        <div className="card">
          <FaTemperatureHigh className="text-3xl mb-2 text-red-500"/>
          <p className="text-sm">Temperature</p>
          <p className="text-2xl font-bold">
            {weatherData?.currentWeather?.temperature}°C
          </p>
        </div>

        <div className="card">
          <FaTint className="text-3xl mb-2 text-blue-500"/>
          <p className="text-sm">Humidity</p>
          <p className="text-2xl font-bold">
            {weatherData?.currentWeather?.humidity}%
          </p>
        </div>

        <div className="card">
          <FaWind className="text-3xl mb-2 text-purple-500"/>
          <p className="text-sm">Wind Speed</p>
          <p className="text-2xl font-bold">
            {weatherData?.currentWeather?.windSpeed} m/s
          </p>
        </div>

        <div className="card">
          <FaCloudSun className="text-3xl mb-2 text-orange-500"/>
          <p className="text-sm">Condition</p>
          <p className="text-lg font-semibold">
            {weatherData?.currentWeather?.description}
          </p>
        </div>

      </div>

      {/* FORECAST */}

      <div className="bg-white p-6 rounded-xl shadow mb-10">

        <h2 className="text-xl font-semibold mb-6 flex items-center">
          <FaCalendarAlt className="mr-2 text-green-600"/>
          5 Day Forecast
        </h2>

        <div className="h-64 mb-6">
          <Line data={chartData} options={chartOptions}/>
        </div>

        <div className="grid grid-cols-5 gap-3">

          {weatherData?.forecast?.map((day,index)=>{

            const Icon = getWeatherIcon(day.description);

            return (

              <button
                key={index}
                onClick={()=>setSelectedDay(index)}
                className="bg-gray-50 p-3 rounded"
              >

                <p className="text-xs">
                  {new Date(day.date).toLocaleDateString('en-US',{weekday:'short'})}
                </p>

                <Icon className="mx-auto text-2xl my-1"/>

                <p className="font-semibold">{Math.round(day.temperature)}°C</p>

              </button>

            )

          })}

        </div>

      </div>

      {/* AI ADVICE */}

      <div className="grid md:grid-cols-2 gap-6">

        <div className="card">

          <h3 className="font-semibold text-xl flex items-center mb-3">
            <FaLeaf className="mr-2 text-green-600"/>
            Planting Advice
          </h3>

          <p>
            {weatherData?.advice?.plantingAdvice}
          </p>

          <h4 className="mt-5 font-medium">Irrigation Needs</h4>

          <p>
            {weatherData?.advice?.irrigationNeeds}
          </p>

        </div>

        <div className="card">

          <h3 className="font-semibold mb-3">Suitable Crops</h3>

          <div className="flex flex-wrap gap-2 mb-4">

            {weatherData?.advice?.suitableCrops?.map((crop,index)=>(
              <span key={index} className="bg-green-100 px-3 py-1 rounded">
                {crop}
              </span>
            ))}

          </div>

          <h4 className="font-medium mb-2">Practical Tips</h4>

          <ul className="space-y-1">

            {weatherData?.advice?.practicalTips?.map((tip,index)=>(
              <li key={index}>• {tip}</li>
            ))}

          </ul>

          {weatherData?.advice?.weatherRisks?.length > 0 && (

            <div className="bg-yellow-50 p-4 mt-4 rounded">

              <h5 className="font-semibold mb-2 flex items-center">
                <FaExclamationTriangle className="mr-2 text-yellow-600"/>
                Weather Risks
              </h5>

              {weatherData?.advice?.weatherRisks?.map((risk,index)=>(
                <p key={index}>{risk}</p>
              ))}

            </div>

          )}

        </div>

      </div>

    </div>

  );

};

export default WeatherAdvisory;
