import { useState, useEffect } from 'react';
import './index.css';
import CountryInfo from './components/CountryInfo';

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
        <CountryInfo
          country={activeCountry}
          weatherLoading={weatherLoading}
          weatherError={weatherError}
          weatherData={weatherData}
        />
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
        <CountryInfo
          country={countryList[0]}
          weatherLoading={weatherLoading}
          weatherError={weatherError}
          weatherData={weatherData}
        />
      ) : null}
    </div>
  );
}

export default App;