const Weather = ({ capital, weatherLoading, weatherError, weatherData }) => {
  if (!capital) return null;
  return (
    <div style={{ marginTop: '20px' }}>
      <h4>Weather in {capital}</h4>
      {weatherLoading && <p>Loading weather...</p>}
      {weatherError && <p style={{ color: 'red' }}>{weatherError}</p>}
      {weatherData && !weatherLoading && !weatherError && (
        <>
          <p><strong>Temperature:</strong> {weatherData.main.temp} °C</p>
          <p><strong>Weather:</strong> {weatherData.weather[0].description}</p>
          <img
            src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
            alt={weatherData.weather[0].description}
            className="weather-icon"
            style={{ width: '80px', height: '80px' }}
          />
          <p><strong>Wind:</strong> {weatherData.wind.speed} m/s</p>
        </>
      )}
    </div>
  );
};

export default Weather;
