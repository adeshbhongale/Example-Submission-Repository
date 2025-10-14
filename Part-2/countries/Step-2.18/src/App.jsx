import { useState, useEffect } from 'react';
import './index.css';

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [countryList, setCountryList] = useState([]);
  const [fetchError, setFetchError] = useState(null);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setCountryList([]);
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
      })
      .catch(() => {
        setCountryList([]);
        setFetchError('Country not found');
      });
  }, [searchTerm]);

  const handleChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div style={{ padding: 20, margin: 20 }}>
      <h2>Country with the Weather</h2>
      <div>
        Find countries: <input value={searchTerm} onChange={handleChange} />
      </div>
      {fetchError ? (
        <div>{fetchError}</div>
      ) : countryList.length > 10 ? (
        <div>Too many matches, specify another filter</div>
      ) : countryList.length > 0 ? (
        <div>
          {countryList.map(country => (
            <div key={country.ccn3 || country.cca3} style={{ padding: 20, margin: 20, border: '1px solid #ccc', borderRadius: 8, marginBottom: 16 }}>
              <h2>{country.name.common}</h2>
              <p><strong>Capital:</strong> {country.capital?.join(', ') || 'N/A'}</p>
              <p><strong>Area:</strong> {country.area} km²</p>
              <h4>Languages:</h4>
              <ul>
                {Object.values(country.languages || {}).map(lang => (
                  <li key={lang}>{lang}</li>
                ))}
              </ul>
              <img
                src={country.flags?.png}
                alt={`Flag of ${country.name.common}`}
                className="flag-img"
                style={{ border: '2px solid black', borderRadius: '4px', width: '200px' }}
              />
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export default App;
