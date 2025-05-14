import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function HomeScreen() {
  const [sensorOn, setSensorOn] = useState(true);
  const [systemStatus, setSystemStatus] = useState('Safe');
  const [ppm, setPpm] = useState(150);
  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate();

  const toggleSensor = async () => {
    const newSensorState = !sensorOn;
    setSensorOn(newSensorState);

    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch('https://alertfi-web.onrender.com/api/sensor/toggle/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ sensor_on: newSensorState })
      });

      if (!response.ok) {
        throw new Error('Failed to toggle sensor');
      }
    } catch (err) {
      console.error('Error toggling sensor:', err);
    }
  };

  const toggleDarkMode = () => setDarkMode(!darkMode);

  useEffect(() => {
    const fetchSensorData = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const response = await fetch('https://alertfi-web.onrender.com/api/sensor/latest/', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const data = await response.json();
        if (response.ok) {
          setPpm(data.ppm);
          setSystemStatus(data.status); 
          setSensorOn(data.sensor_on); // update from backend
        }
      } catch (err) {
        console.error('Failed to fetch sensor data', err);
      }
    };

    fetchSensorData();
    const interval = setInterval(fetchSensorData, 5000);
    return () => clearInterval(interval);
  }, []);

  const cardBackground = darkMode ? '#444' : '#ffffff';
  const cardTextColor = darkMode ? '#fff' : '#333';

  return (
    <div style={darkMode ? styles.containerDark : styles.containerLight}>
      <h1 style={{ ...styles.title, color: darkMode ? '#fff' : '#333' }}>🔥 AlertFi Dashboard</h1>

      <div style={styles.toggleButtonContainer}>
        <button onClick={toggleDarkMode} style={styles.toggleButton}>
          {darkMode ? '🌙' : '🌞'}
        </button>
      </div>

      <div style={styles.mainRow}>
        <div style={{ ...styles.cardLarge, backgroundColor: cardBackground, color: cardTextColor }}>
          <h2 style={{ ...styles.cardTitle, color: systemStatus === 'Danger' ? '#F44336' : cardTextColor }}>
            System Status
          </h2>
          <SemiCircleGauge value={ppm} darkMode={darkMode} />
        </div>

        <div style={styles.column}>
          <div style={{ ...styles.cardMedium, backgroundColor: cardBackground, color: cardTextColor }}>
            <h3 style={{ ...styles.cardTitle, color: cardTextColor }}>Sensor</h3>
            <div style={styles.switchContainer}>
              <div
                style={{
                  ...styles.switch,
                  backgroundColor: sensorOn ? '#4CAF50' : '#D32F2F',
                }}
                onClick={toggleSensor}
              >
                <div
                  style={{
                    ...styles.switchThumb,
                    transform: sensorOn ? 'translateX(28px)' : 'translateX(0px)',
                  }}
                />
              </div>
              <p style={{ ...styles.switchLabel, color: cardTextColor }}>{sensorOn ? '🟢 ON' : '🔴 OFF'}</p>
            </div>
          </div>

          <div style={{ ...styles.cardMedium, backgroundColor: cardBackground, color: cardTextColor }}>
            <h3 style={{ ...styles.cardTitle, color: cardTextColor }}>Battery</h3>
            <div style={styles.batteryEmoji}>🔋</div>
            <p style={{ ...styles.batteryText, color: cardTextColor }}>Health: 85%</p>
            <div style={styles.batteryBarContainer}>
              <div style={{ ...styles.batteryBarFill, width: '85%' }} />
            </div>
          </div>
        </div>
      </div>

      <button onClick={() => navigate('/history')} style={styles.navigateButton}>
        📄 View Alert History
      </button>
    </div>
  );
}

function SemiCircleGauge({ value, max = 1200, darkMode }) {
  const percentage = Math.min(value / max, 1);
  const angle = percentage * 180;

  const getColor = () => {
    if (value > 1000) return '#F44336';
    if (value >= 600) return '#FFEB3B';
    return '#4CAF50';
  };

  const strokeWidth = 20;

  return (
    <div style={styles.gaugeContainer}>
      <svg width="300" height="150" viewBox="0 0 250 125">
        <path
          d="M20,125 A105,105 0 0,1 230,125"
          fill="none"
          stroke="#ddd"
          strokeWidth={strokeWidth}
        />
        <path
          d="M20,125 A105,105 0 0,1 230,125"
          fill="none"
          stroke={getColor()}
          strokeWidth={strokeWidth}
          strokeDasharray={`${angle * 3.14 * 105 / 180},999`}
        />
        <line
          x1="125"
          y1="125"
          x2={125 + 100 * Math.cos(Math.PI * (1 - percentage))}
          y2={125 - 100 * Math.sin(Math.PI * (1 - percentage))}
          stroke="#000"
          strokeWidth="3"
        />
      </svg>
      <div style={{ ...styles.gaugeLabel, color: darkMode ? '#fff' : '#000' }}>
        <p style={{ fontSize: 18 }}>PPM: {value}</p>
        <p style={{ fontWeight: 'bold', fontSize: 22 }}>
          Status: {value > 1000 ? 'Danger' : value >= 600 ? 'Warning' : 'Safe'}
        </p>
      </div>
    </div>
  );
}



const styles = {
  containerLight: {
    minHeight: '100vh',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#FFF8DC',
    padding: '20px 30px',
    boxSizing: 'border-box',
    alignItems: 'center',
  },
  containerDark: {
    minHeight: '100vh',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#333',
    padding: '20px 30px',
    boxSizing: 'border-box',
    alignItems: 'center',
    color: '#fff',
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 30,
  },
  toggleButtonContainer: {
    position: 'absolute',
    top: 20,
    right: 20,
  },
  toggleButton: {
    backgroundColor: 'transparent',
    border: '1px solid #FF5733',
    color: '#fff',
    padding: '8px 12px',
    borderRadius: '20px',
    fontSize: 18,
    cursor: 'pointer',
  },
  mainRow: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
    maxWidth: '1000px',
    marginBottom: 10,
  },
  column: {
    display: 'flex',
    flexDirection: 'column',
    gap: 20,
    width: '35%',
  },
  cardLarge: {
    borderRadius: 12,
    padding: 20,
    width: '55%',
    boxShadow: '0 6px 15px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
  },
  cardMedium: {
    borderRadius: 12,
    padding: 20,
    boxShadow: '0 6px 15px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
  },
  cardTitle: {
    fontSize: 24,
    marginBottom: 15,
  },
  switchContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  switch: {
    width: 60,
    height: 30,
    backgroundColor: '#D32F2F',
    borderRadius: 50,
    position: 'relative',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
  switchThumb: {
    width: 24,
    height: 24,
    borderRadius: '50%',
    backgroundColor: '#fff',
    position: 'absolute',
    top: '10%',
    left: 4,
    transform: 'translateY(-50%)',
    transition: 'transform 0.3s ease',
  },
  switchLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  batteryEmoji: {
    fontSize: 50,
    marginBottom: 8,
  },
  batteryText: {
    fontSize: 16,
    marginBottom: 8,
  },
  batteryBarContainer: {
    height: 10,
    backgroundColor: '#ddd',
    borderRadius: 6,
    overflow: 'hidden',
  },
  batteryBarFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
  },
  navigateButton: {
    backgroundColor: '#FF5733',
    color: '#fff',
    padding: '12px 30px',
    border: 'none',
    borderRadius: 8,
    fontSize: 16,
    cursor: 'pointer',
    marginTop: 20,
    transition: 'background-color 0.3s ease',
  },
  gaugeContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  gaugeLabel: {
    marginTop: 8,
    textAlign: 'center',
  },
};
