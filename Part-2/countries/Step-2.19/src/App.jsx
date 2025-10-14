import { useState, useEffect } from 'react';
import './index.css';


function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [countryList, setCountryList] = useState([]);
  const [activeCountry, setActiveCountry] = useState(null);

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
        </div>
      ) : null}
    </div>
  );
}

export default App;