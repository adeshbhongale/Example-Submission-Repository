import { useState, useEffect } from 'react';
import './index.css';

// Use the environment variable for the API key
const OPENWEATHER_API_KEY = '29e80a202c5b39dff413fcd5a4f128ca';

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [countryList, setCountryList] = useState([]);
  const [activeCountry, setActiveCountry] = useState(null);

  const [weatherData, setWeatherData] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [weatherError, setWeatherError] = useState(null);

  const [fetchError, setFetchError] = useState(null);

  // 1) Fetch countries when query changes
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setCountryList([]);
      setActiveCountry(null);
      setFetchError(null);
      return;
    }

    fetch(`https://restcountries.com/v3.1/name/${searchTerm}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Country not found');
        }
        return response.json();
      })
      .then(data => {
        setCountryList(data);
        setFetchError(null);
        setActiveCountry(null);
      })
      .catch(() => {
        setCountryList([]);
        setFetchError('Country not found');
        setActiveCountry(null);
      });
  }, [searchTerm]);

  // 2) Fetch weather when selectedCountry changes
  useEffect(() => {
    if (!activeCountry || !activeCountry.capital?.[0]) {
      setWeatherData(null);
      setWeatherError(null);
      setWeatherLoading(false);
      return;
    }

    const capital = activeCountry.capital[0];

    setWeatherLoading(true);
    setWeatherError(null);

    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${capital}&units=metric&appid=${OPENWEATHER_API_KEY}`;

    fetch(weatherUrl)
      .then(res => {
        if (!res.ok) {
          throw new Error('Weather fetch failed');
        }
        return res.json();
      })
      .then(data => {
        setWeatherData(data);
        setWeatherLoading(false);
      })
      .catch(() => {
        setWeatherData(null);
        setWeatherError('Could not fetch weather data');
        setWeatherLoading(false);
      });
  }, [activeCountry]);

  // Handle input change
  const handleChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle show button click
  const handleShow = (country) => {
    setActiveCountry(country);
  };

  // All rendering logic is now in the return statement below
  return (
    <div style={{ padding: 20, margin: 20 }}>
      <div style={{ padding: 20, margin: 20 }}>
        <h2>Country with the Weather</h2>
        <div>
          Find countries: <input value={searchTerm} onChange={handleChange} />
        </div>
      </div>
      {/* Render country list or details */}
      {fetchError ? (
        <div>{fetchError}</div>
      ) : countryList.length > 10 ? (
        <div>Too many matches, specify another filter</div>
      ) : activeCountry ? (
        <div style={{ padding: 20, margin: 20 }}>
          <h2>{activeCountry.name.common}</h2>
          <p><strong>Capital:</strong> {activeCountry.capital?.join(', ') || 'N/A'}</p>
          <p><strong>Area:</strong> {activeCountry.area} km²</p>
          <h4>Languages:</h4>
          <ul>
            {Object.values(activeCountry.languages || {}).map(lang => (
              <li key={lang}>{lang}</li>
            ))}
          </ul>
          <img
            src={activeCountry.flags?.png}
            alt={`Flag of ${activeCountry.name.common}`}
            className="flag-img"
            style={{ border: '2px solid black', borderRadius: '4px', width: '200px' }}
          />
          {/* Weather Section */}
          {weatherLoading && <p>Loading weather...</p>}
          {weatherError && <p style={{ color: 'red' }}>{weatherError}</p>}
          {weatherData && !weatherLoading && !weatherError && (
            <div style={{ marginTop: '20px' }}>
              <h4>Weather in {activeCountry.capital[0]}</h4>
              <p><strong>Temperature:</strong> {weatherData.main.temp} °C</p>
              <p><strong>Weather:</strong> {weatherData.weather[0].description}</p>
              <img
                src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
                alt={weatherData.weather[0].description}
                className="weather-icon"
                style={{ width: '80px', height: '80px' }}
              />
              <p><strong>Wind:</strong> {weatherData.wind.speed} m/s</p>
            </div>
          )}
        </div>
      ) : countryList.length > 1 ? (
        <ul>
          {countryList.map(country => (
            <li key={country.ccn3 || country.cca3}>
              {country.name.common}
              <button
                onClick={() => handleShow(country)}
                style={{ marginLeft: '10px' }}
              >
                Show
              </button>
            </li>
          ))}
        </ul>
      ) : countryList.length === 1 ? (
        <div style={{ padding: 20, margin: 20 }}>
          <h2>{countryList[0].name.common}</h2>
          <p><strong>Capital:</strong> {countryList[0].capital?.join(', ') || 'N/A'}</p>
          <p><strong>Area:</strong> {countryList[0].area} km²</p>
          <h4>Languages:</h4>
          <ul>
            {Object.values(countryList[0].languages || {}).map(lang => (
              <li key={lang}>{lang}</li>
            ))}
          </ul>
          <img
            src={countryList[0].flags?.png}
            alt={`Flag of ${countryList[0].name.common}`}
            className="flag-img"
            style={{ border: '2px solid black', borderRadius: '4px', width: '200px' }}
          />
          {/* Weather Section */}
          {weatherLoading && <p>Loading weather...</p>}
          {weatherError && <p style={{ color: 'red' }}>{weatherError}</p>}
          {weatherData && !weatherLoading && !weatherError && (
            <div style={{ marginTop: '20px' }}>
              <h4>Weather in {countryList[0].capital[0]}</h4>
              <p><strong>Temperature:</strong> {weatherData.main.temp} °C</p>
              <p><strong>Weather:</strong> {weatherData.weather[0].description}</p>
              <img
                src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
                alt={weatherData.weather[0].description}
                className="weather-icon"
                style={{ width: '80px', height: '80px' }}
              />
              <p><strong>Wind:</strong> {weatherData.wind.speed} m/s</p>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}

export default App;