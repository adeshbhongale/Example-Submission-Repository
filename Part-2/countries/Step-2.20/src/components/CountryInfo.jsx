import Weather from './Weather';

const CountryInfo = ({ country, weatherLoading, weatherError, weatherData }) => {
  if (!country) return null;
  return (
    <div style={{ padding: 20, margin: 20 }}>
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
      <Weather
        capital={country.capital?.[0]}
        weatherLoading={weatherLoading}
        weatherError={weatherError}
        weatherData={weatherData}
      />
    </div>
  );
};

export default CountryInfo;
