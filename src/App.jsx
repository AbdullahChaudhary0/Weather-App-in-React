import React, { useState } from 'react';

const WeatherApp = () => {
  const [location, setLocation] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const API_KEY = "83a944035ddf4e86adb50057242410";

  // Weather condition categories and their corresponding styles
  const weatherStyles = {
    clear: {
      background: 'linear-gradient(to bottom right, #4a90e2, #87ceeb)',
      color: '#fff',
      icon: '☀️'
    },
    sunny: {
      background: 'linear-gradient(to bottom right, #f7b733, #fc4a1a)',
      color: '#fff',
      icon: '☀️'
    },
    cloudy: {
      background: 'linear-gradient(to bottom right, #606c88, #3f4c6b)',
      color: '#fff',
      icon: '☁️'
    },
    partlyCloudy: {
      background: 'linear-gradient(to bottom right, #7474BF, #348AC7)',
      color: '#fff',
      icon: '⛅'
    },
    rain: {
      background: 'linear-gradient(to bottom right, #373B44, #4286f4)',
      color: '#fff',
      icon: '🌧️'
    },
    snow: {
      background: 'linear-gradient(to bottom right, #E0EAFC, #CFDEF3)',
      color: '#333',
      icon: '❄️'
    },
    thunder: {
      background: 'linear-gradient(to bottom right, #283E51, #0A2342)',
      color: '#fff',
      icon: '⛈️'
    },
    mist: {
      background: 'linear-gradient(to bottom right, #757F9A, #D7DDE8)',
      color: '#333',
      icon: '🌫️'
    },
    default: {
      background: 'linear-gradient(to bottom right, #4a90e2, #87ceeb)',
      color: '#fff',
      icon: '🌡️'
    }
  };

  const getWeatherStyle = (condition) => {
    const lowercaseCondition = condition?.toLowerCase() || '';
    
    if (lowercaseCondition.includes('clear')) return weatherStyles.clear;
    if (lowercaseCondition.includes('sunny')) return weatherStyles.sunny;
    if (lowercaseCondition.includes('cloudy') && lowercaseCondition.includes('partly')) 
      return weatherStyles.partlyCloudy;
    if (lowercaseCondition.includes('cloudy')) return weatherStyles.cloudy;
    if (lowercaseCondition.includes('rain')) return weatherStyles.rain;
    if (lowercaseCondition.includes('snow')) return weatherStyles.snow;
    if (lowercaseCondition.includes('thunder')) return weatherStyles.thunder;
    if (lowercaseCondition.includes('mist') || lowercaseCondition.includes('fog')) 
      return weatherStyles.mist;
    
    return weatherStyles.default;
  };

  const fetchWeather = async () => {
    if (!location.trim()) {
      setError('Please enter a location.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(
        `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${encodeURIComponent(location)}`
      );
      
      if (!response.ok) {
        throw new Error('Location not found or API error');
      }

      const data = await response.json();
      setWeatherData(data);
    } catch (err) {
      setError('Location not found or API error. Please try again.');
      setWeatherData(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      fetchWeather();
    }
  };

  const currentStyle = weatherData 
    ? getWeatherStyle(weatherData.current.condition.text)
    : weatherStyles.default;

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f0f2f5',
      padding: '20px',
      display: 'flex',
      marginLeft: '500px',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'background-color 0.3s ease'
    }}>
      <div style={{
        background: weatherData ? currentStyle.background : 'white',
        color: weatherData ? currentStyle.color : '#333',
        borderRadius: '12px',
        padding: '25px',
        width: '100%',
        maxWidth: '500px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        transition: 'all 0.3s ease'
      }}>
        <h1 style={{
          textAlign: 'center',
          marginBottom: '25px',
          fontSize: '28px'
        }}>Weather App</h1>

        <div style={{
          display: 'flex',
          gap: '10px',
          marginBottom: '20px',
        }}>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Enter location"
            style={{
              flex: 1,
              padding: '12px',
              borderRadius: '6px',
              border: '1px solid #ddd',
              fontSize: '16px',
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
            }}
          />
          <button
            onClick={fetchWeather}
            disabled={isLoading}
            style={{
              padding: '12px 24px',
              backgroundColor: weatherData ? 'rgba(255, 255, 255, 0.2)' : '#007bff',
              color: weatherData ? currentStyle.color : 'white',
              border: weatherData ? `1px solid ${currentStyle.color}` : 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '16px',
              transition: 'all 0.3s ease',
              backdropFilter: 'blur(5px)',
            }}
          >
            {isLoading ? 'Searching...' : 'Search'}
          </button>
        </div>

        {error && (
          <div style={{
            padding: '12px',
            backgroundColor: 'rgba(255, 235, 238, 0.9)',
            color: '#c62828',
            borderRadius: '6px',
            marginBottom: '20px',
          }}>
            {error}
          </div>
        )}

        {weatherData && (
          <div style={{
            padding: '20px',
            borderRadius: '8px',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(5px)',
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '20px',
            }}>
              <span style={{ fontSize: '64px', marginRight: '15px' }}>
                {currentStyle.icon}
              </span>
              <div>
                <h3 style={{ fontSize: '24px', marginBottom: '5px' }}>
                  {weatherData.location.name}, {weatherData.location.country}
                </h3>
                <p style={{ fontSize: '18px', opacity: 0.9 }}>
                  {weatherData.current.condition.text}
                </p>
              </div>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '20px',
              textAlign: 'center',
            }}>
              <div style={{
                padding: '15px',
                borderRadius: '8px',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
              }}>
                <p style={{ fontSize: '14px', opacity: 0.9 }}>Temperature</p>
                <p style={{ fontSize: '28px', fontWeight: 'bold' }}>
                  {weatherData.current.temp_c}°C
                </p>
              </div>
              <div style={{
                padding: '15px',
                borderRadius: '8px',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
              }}>
                <p style={{ fontSize: '14px', opacity: 0.9 }}>Feels Like</p>
                <p style={{ fontSize: '28px', fontWeight: 'bold' }}>
                  {weatherData.current.feelslike_c}°C
                </p>
              </div>
              <div style={{
                padding: '15px',
                borderRadius: '8px',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
              }}>
                <p style={{ fontSize: '14px', opacity: 0.9 }}>Humidity</p>
                <p style={{ fontSize: '24px', fontWeight: '500' }}>
                  {weatherData.current.humidity}%
                </p>
              </div>
              <div style={{
                padding: '15px',
                borderRadius: '8px',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
              }}>
                <p style={{ fontSize: '14px', opacity: 0.9 }}>Wind</p>
                <p style={{ fontSize: '24px', fontWeight: '500' }}>
                  {weatherData.current.wind_kph} km/h
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WeatherApp;