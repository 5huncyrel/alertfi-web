import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !password) {
      alert('Please fill in all fields');
      return;
    }

    try {
      const response = await fetch('https://alertfi-web.onrender.com/api/login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('accessToken', data.access);
        alert('Logged in successfully');
        navigate('/home', { replace: true });
      } else {
        alert(data.error || 'Login failed');
      }
    } catch (err) {
      alert('Server error');
      console.error(err); 
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Login</h1>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        style={styles.input}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        style={styles.input}
      />

      <button onClick={handleLogin} style={styles.button}>
        Login
      </button>

      <p style={styles.link} onClick={() => navigate('/register')}>
        Don't have an account?{' '}
        <span style={{ color: 'blue', cursor: 'pointer' }}>Register</span>
      </p>
    </div>
  );
}


const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: 20,
    maxWidth: 400,
    margin: '0 auto',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    border: '1px solid #ccc',
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#FF5733',
    color: '#fff',
    padding: 12,
    border: 'none',
    borderRadius: 5,
    fontSize: 16,
    cursor: 'pointer',
  },
  link: {
    marginTop: 15,
    textAlign: 'center',
    fontSize: 14,
  },
};
