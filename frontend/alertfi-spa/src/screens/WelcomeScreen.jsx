import React from 'react';
import { Link } from 'react-router-dom';

export default function WelcomeScreen() {
  return (
    <div style={styles.container}>
      <img src="/logo.png" alt="AlertFi Logo" style={styles.logo} />
      <h1 style={styles.title}>Welcome to AlertFi</h1>
      <p style={styles.subtitle}> Stay alert, Fire alert! </p>
      <div style={styles.buttonContainer}>
        <Link to="/register" style={styles.button}>
          Register
        </Link>
        <span style={styles.linkSeparator}>|</span>
        <Link to="/login" style={styles.button}>
          Login
        </Link>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    textAlign: 'center',
    backgroundImage: 'linear-gradient(to bottom, rgba(255, 200, 181, 0.8), rgba(218, 156, 62, 0.6), rgb(242, 145, 136))', // Smooth gradient from orange to light red
    color: '#333', // Dark gray text for readability
  },
  logo: {
    width: '150px', // Adjust the width as needed
    marginBottom: '20px', // Space between logo and title
  },
  title: {
    fontSize: '50px',
    fontWeight: 'bold',
    marginBottom: 20,
    textShadow: '2px 2px 10px rgba(0, 0, 0, 0.3)',
    color: '#fff', // White text for contrast against the background
  },
  subtitle: {
    fontSize: '24px',
    marginBottom: 40,
    fontWeight: 'light',
    textShadow: '1px 1px 6px rgba(0, 0, 0, 0.2)',
    color: '#fff', // White subtitle for better contrast
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 15,
  },
  button: {
    backgroundColor: '#FF7043', // Muted orange for the button
    color: '#fff',
    padding: '15px 30px',
    border: 'none',
    borderRadius: '30px',
    fontSize: '18px',
    fontWeight: 'bold',
    textDecoration: 'none',
    cursor: 'pointer',
    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
    transition: 'all 0.3s ease',
  },
  buttonHover: {
    backgroundColor: '#D84C1F', // Darker orange on hover
    color: '#fff',
    transform: 'scale(1.05)',
  },
  linkSeparator: {
    fontSize: '18px',
    fontWeight: 'normal',
    paddingTop: 8,
    color: '#fff', // White separator for better contrast
  },
};
