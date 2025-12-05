/* User Sign-In and Registration Component with Role Selection */
import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';

const REGISTER_USER = gql`
  mutation Register($username: String!, $email: String!, $password: String!, $role: String!) {
    register(username: $username, email: $email, password: $password, role: $role) {
      token
      user {
        id
        username
        email
        role
      }
    }
  }
`;

const LOGIN_USER = gql`
  mutation Login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      token
      user {
        id
        username
        email
        role
      }
    }
  }
`;

const AuthComponents = () => {
  const [isRegistering, setIsRegistering] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'resident'
  });

  const [register] = useMutation(REGISTER_USER);
  const [login] = useMutation(LOGIN_USER);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isRegistering) {
        const { data } = await register({ variables: formData });
        console.log('Registered:', data.register);
        alert(`Welcome ${data.register.user.username}!`);
      } else {
        const { data } = await login({
          variables: {
            username: formData.username,
            password: formData.password
          }
        });
        console.log('Logged In:', data.login);
        alert(`Logged in as ${data.login.user.username}`);
      }
    } catch (error) {
      console.error('Auth Error:', error);
      alert(error.message);
    }
  };

  return (
    <div style={styles.container}>
      <h2>{isRegistering ? 'Create Account' : 'Log In'}</h2>

      <form onSubmit={handleSubmit} style={styles.form}>
        {/* Username */}
        <input
          style={styles.input}
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          required
        />

        {/* Email (Register only) */}
        {isRegistering && (
          <input
            style={styles.input}
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        )}

        {/* Password */}
        <input
          style={styles.input}
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        {/* Role dropdown (Register only) */}
        {isRegistering && (
          <select
            style={styles.input}
            name="role"
            value={formData.role}
            onChange={handleChange}
          >
            <option value="resident">Resident</option>
            <option value="admin">Admin</option>
            <option value="caregiver">Caregiver</option>
          </select>
        )}

        <button type="submit" style={styles.button}>
          {isRegistering ? 'Register' : 'Login'}
        </button>
      </form>

      <button
        onClick={() => setIsRegistering(prev => !prev)}
        style={styles.switchButton}
      >
        {isRegistering ? 'Already have an account? Log in' : 'Create an account'}
      </button>
    </div>
  );
};

// Simple inline styling
const styles = {
  container: {
    maxWidth: '350px',
    margin: '20px auto',
    padding: '20px',
    borderRadius: '12px',
    border: '1px solid #ddd',
    background: '#fefefe',
    textAlign: 'center'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  input: {
    padding: '10px',
    fontSize: '16px',
    borderRadius: '6px',
    border: '1px solid #ccc'
  },
  button: {
    padding: '10px',
    background: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '16px'
  },
  switchButton: {
    marginTop: '15px',
    background: 'transparent',
    border: 'none',
    color: '#007bff',
    cursor: 'pointer',
    fontSize: '14px'
  }
};

export default AuthComponents;