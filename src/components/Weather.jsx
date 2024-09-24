import React, { useEffect, useRef, useState } from 'react'
import './Weather.css'
import search_icon from '../assets/search.png'
import clear_icon from '../assets/clear.png'
import cloud_icon from '../assets/cloud.png'
import drizzle_icon from '../assets/drizzle.png'
import humidity_icon from '../assets/humidity.png'
import rain_icon from '../assets/rain.png'
import wind_icon from '../assets/wind.png'
import snow_icon from '../assets/snow.png'

const Weather = () => {
  const inputRef=useRef()
  const [weatherData,setWeatherData]=useState(false);
  const [forecastData,setForecastData]=useState([]);
  const allIcons={
    "01d":clear_icon,
    "01n":clear_icon,
    "03d":cloud_icon,
    "03n":cloud_icon,
    "04d":drizzle_icon,
    "04n":drizzle_icon,
    "09d":rain_icon,
    "09n":rain_icon,
    "10d":rain_icon,
    "10n":rain_icon,
    "13d":snow_icon,
    "13n":snow_icon,
  }
  const search = async (city) => {
    if (city===""){
      alert("Enter city name")
      return
    }
    try {
      const apiKey = import.meta.env.VITE_APP_ID;
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
      const response = await fetch(url);
      const data = await response.json();
      if(!response.ok){
        alert(data.message);
        return
      }
      console.log(data);


      const lat=data.coord.lat
      const lon=data.coord.lon
      const forecastUrl = `https://ai-weather-by-meteosource.p.rapidapi.com/daily?lat=${lat}&lon=${lon}&language=en&units=auto`;
      const options = {
        method: 'GET',
        headers: {
          'x-rapidapi-key': '4bdc841730msh34b2022a50415cep1b36e8jsne9b7478b1d28',
          'x-rapidapi-host': 'ai-weather-by-meteosource.p.rapidapi.com'
        }
      };

      try {
        const forecastResponse = await fetch(forecastUrl, options);
        const forecastData = await forecastResponse.json();
        setForecastData(forecastData.daily.data.slice(0,7));
        console.log(forecastData);
      } catch (error) {
        console.error(error);
      }

      const icon=allIcons[data.weather[0].icon] || clear_icon;
      setWeatherData({
        humidity:data.main.humidity,
        windSpeed:data.wind.speed,
        temperature:Math.floor(data.main.temp),
        location:data.name,
        icon:icon
      })
    } catch (error) {
      setWeatherData(false)
      console.error("Error in fetching data")
    }
  }


  return (
    <div className='weather'>
      <div className='search-bar'>
        <input ref={inputRef} type="text" placeholder='Search' />
        <img src={search_icon} alt="" onClick={()=>search(inputRef.current.value)} />
      </div>
      {weatherData?<><img src={weatherData.icon} alt="" className='weather-icon' />
      <p className='temperature'>{weatherData.temperature}°C</p>
      <p className='location'>{weatherData.location}</p>
      <div className='weather-data'>
        <div className="col">
          <img src={humidity_icon} alt="" />
          <div>
            <p>{weatherData.humidity} %</p>
            <span>Humidity</span>
          </div>
        </div>
        <div className="col">
          <img src={wind_icon} alt="" />
          <div>
            <p>{weatherData.windSpeed} km/h</p>
            <span>Wind Speed</span>
          </div>
        </div>
      </div>
      </>:<></>}
      {forecastData.length>0 && (
      <div className="forecast">
        <h2>7-Day Forecast</h2>
        <div className="forecast-grid">
          {forecastData.map((day, index) => (
            <div key={index} className="forecast-day">
              <h4>{new Date(day.day).toLocaleDateString('en-US', { weekday: 'long' })}</h4>
              <p>{new Date(day.day).toLocaleDateString()}</p>
              <p>Max Temp: {day.temperature_max}°C</p>
              <p>Min Temp: {day.temperature_min}°C</p>
              <p>Humidity: {day.humidity} %</p>
              <p>Wind Speed: {day.wind.speed} km/h</p>
            </div>
          ))}
        </div>
      </div>

        )}
    </div>
  );
}

export default Weather;
