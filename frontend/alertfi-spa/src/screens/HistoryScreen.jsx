import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const HistoryScreen = () => {
  const [alerts, setAlerts] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const response = await fetch('https://alertfi-web.onrender.com/api/sensor/history/', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to load alert history');
        }

        const data = await response.json();
        setAlerts(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchHistory();
  }, []);

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Alert History</h2>

      <button onClick={() => navigate(-1)} style={styles.backButton}>
        ⬅ Back
      </button>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {alerts.length === 0 ? (
        <p style={styles.noHistory}>No alert history available</p>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.tableHeader}>Date</th>
              <th style={styles.tableHeader}>Time</th>
              <th style={styles.tableHeader}>Status</th>
              <th style={styles.tableHeader}>Reading</th>
            </tr>
          </thead>
          <tbody>
            {alerts.map((alert) => {
              const date = new Date(alert.timestamp);
              const formattedDate = date.toISOString().slice(0, 10);
              const formattedTime = date.toISOString().slice(11, 19);
              
              return (
                <tr key={alert.id}>
                  <td style={styles.tableCell}>{formattedDate}</td>
                  <td style={styles.tableCell}>{formattedTime}</td>
                  <td style={{ ...styles.tableCell, color: getStatusColor(alert.status) }}>
                    {alert.status}
                  </td>
                  <td style={styles.tableCell}>{alert.reading}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );

  function getStatusColor(status) {
    if (status === 'Smoke Detected') return '#FFEB3B'; // Yellow (warning)
    if (status === 'Gas Detected') return '#F44336'; // Red (danger)
    return '#4CAF50'; // Green (safe)
  }
};

const styles = {
  container: {
    minHeight: '100vh',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    padding: '20px 30px',
    boxSizing: 'border-box',
    alignItems: 'center',
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#333',
  },
  backButton: {
    backgroundColor: '#4CAF50',
    color: '#fff',
    padding: '10px 20px',
    border: 'none',
    borderRadius: 8,
    fontSize: 16,
    cursor: 'pointer',
    marginBottom: 20,
    transition: 'background-color 0.3s ease',
  },
  noHistory: {
    fontSize: 18,
    color: '#777',
  },
  table: {
    width: '80%',
    borderCollapse: 'collapse',
    marginTop: 20,
  },
  tableHeader: {
    padding: '12px 20px',
    textAlign: 'left',
    fontSize: 18,
    fontWeight: 'bold',
    backgroundColor: '#4CAF50',
    color: '#fff',
  },
  tableCell: {
    padding: '12px 20px',
    textAlign: 'left',
    fontSize: 16,
    backgroundColor: '#fff',
    borderBottom: '1px solid #ddd',
  },
};

export default HistoryScreen;
