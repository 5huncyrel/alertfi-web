import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [first_name, setFirstName] = useState('');
  const [last_name, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const navigate = useNavigate();

  const handleRegister = async () => {
    if (!email || !first_name || !last_name || !password || !confirm) {
      alert('Please fill in all fields');
      return;
    }

    if (password !== confirm) {
      alert('Passwords do not match');
      return;
    }

    try {
      const response = await fetch('https://alertfi-web.onrender.com/api/register/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, first_name, last_name, password })
      });

      const data = await response.json();

      if (response.ok) {
        alert('Account created. Please check your email to verify.');
        navigate('/login', { replace: true });
      } else {
        alert(data.error || JSON.stringify(data));
      }
    } catch (err) {
      alert('Server error');
      console.error(err);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Register</h1>

      <input
        type="text"
        placeholder="First Name"
        value={first_name}
        onChange={e => setFirstName(e.target.value)}
        style={styles.input}
      />

      <input
        type="text"
        placeholder="Last Name"
        value={last_name}
        onChange={e => setLastName(e.target.value)}
        style={styles.input}
      />

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

      <input
        type="password"
        placeholder="Confirm Password"
        value={confirm}
        onChange={e => setConfirm(e.target.value)}
        style={styles.input}
      />

      <button onClick={handleRegister} style={styles.button}>
        Register
      </button>

      <p style={styles.link} onClick={() => navigate('/login')}>
        Already have an account?{' '}
        <span style={{ color: 'blue', cursor: 'pointer' }}>Login</span>
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
