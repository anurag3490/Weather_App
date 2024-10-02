import React, { useState, useEffect } from "react";
import axios from "axios";
import apiKeys from "./apiKeys";
import ReactAnimatedWeather from "react-animated-weather";

function Forecast() {
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");
  const [weather, setWeather] = useState({});
  const [icon, setIcon] = useState("");

  // Function to search weather data based on the city
  const search = (city) => {
    const searchCity = typeof city === 'object' ? query : city;

    axios
      .get(
        `${apiKeys.base}weather?q=${searchCity}&units=metric&APPID=${apiKeys.key}`
      )
      .then((response) => {
        setWeather(response.data);

        // Set icon based on the weather condition
        switch (response.data.weather[0].main) {
          case "Haze":
            setIcon("CLEAR_DAY");
            break;
          case "Clouds":
            setIcon("CLOUDY");
            break;
          case "Rain":
            setIcon("RAIN");
            break;
          case "Snow":
            setIcon("SNOW");
            break;
          case "Dust":
            setIcon("WIND");
            break;
          case "Drizzle":
            setIcon("SLEET");
            break;
          case "Fog":
          case "Smoke":
            setIcon("FOG");
            break;
          case "Tornado":
            setIcon("WIND");
            break;
          default:
            setIcon("CLEAR_DAY"); // Default icon
            break;
        }

        setQuery("");
        setError(""); // Clear any previous errors
      })
      .catch((error) => {
        setWeather({});
        setQuery("");
        setError({ message: "City not found", query: searchCity });
      });
  };

  // Default icon settings for weather animations
  const defaults = {
    color: "white",
    size: 112,
    animate: true,
  };

  // Run search on component mount for a default city (e.g., "Delhi")
  useEffect(() => {
    search("Delhi");
  },[] );

  return (
    <div className="forecast">
      <div className="forecast-icon">
        <ReactAnimatedWeather
          icon={icon}
          color={defaults.color}
          size={defaults.size}
          animate={defaults.animate}
        />
      </div>
      <div className="today-weather">
        <h3>{weather.weather ? weather.weather[0].main : ""}</h3>
        <div className="search-box">
          <input
            type="text"
            className="search-bar"
            placeholder="Search any city"
            onChange={(e) => setQuery(e.target.value)}
            value={query}
          />
          <div className="img-box">
            <img
              src="https://images.avishkaar.cc/workflow/newhp/search-white.png"
              alt="search"
              onClick={() => search(query)} // Trigger search on click
            />
          </div>
        </div>
        <ul>
          {typeof weather.main !== "undefined" ? (
            <div>
              <li className="cityHead">
                <p>
                  {weather.name}, {weather.sys.country}
                </p>
                <img
                  className="temp"
                  src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}.png`}
                  alt="weather-icon" // Added alt text for the weather icon
                />
              </li>
              <li>
                Temperature{" "}
                <span className="temp">
                  {Math.round(weather.main.temp)}°c ({weather.weather[0].main})
                </span>
              </li>
              <li>
                Humidity{" "}
                <span className="temp">
                  {Math.round(weather.main.humidity)}%
                </span>
              </li>
              <li>
                Visibility{" "}
                <span className="temp">
                  {Math.round(weather.visibility)} mi
                </span>
              </li>
              <li>
                Wind Speed{" "}
                <span className="temp">
                  {Math.round(weather.wind.speed)} Km/h
                </span>
              </li>
            </div>
          ) : (
            <li>
              {error.query ? `No results for "${error.query}". ${error.message}` : ""}
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}

export default Forecast;
