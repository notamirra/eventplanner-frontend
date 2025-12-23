import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import './Auth.css';

function Signup({ setUser }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');

  if (formData.password !== formData.confirmPassword) {
    setError("Passwords don't match!");
    return;
  }

  setLoading(true);

  try {
    // SIGNUP
    const signupResult = await authAPI.signup(
      formData.name,
      formData.email,
      formData.password
    );

    if (!signupResult.success) {
      setError(signupResult.error);
      return;
    }

    // 🔥 AUTO-LOGIN AFTER SIGNUP
    const loginResult = await authAPI.login(formData.email, formData.password);

    if (!loginResult.success) {
      setError("Signup success but login failed. Please login manually.");
      return;
    }

    // Save token & user
   // Build user data (same format as Login.js)
const userData = {
  id: loginResult.data.id,
  name: loginResult.data.name,
  email: loginResult.data.email,
};

// Save token
localStorage.setItem("token", loginResult.data.token);

// Save user
localStorage.setItem("user", JSON.stringify(userData));

// Update state
setUser(userData);

    // Redirect to homepage
    navigate('/');
  } catch (err) {
    console.error(err);
    setError('An unexpected error occurred. Please try again.');
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="auth-container">
      <h2>Sign Up</h2>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            minLength="6"
          />
        </div>
        <div className="form-group">
          <label>Confirm Password:</label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            minLength="6"
          />
        </div>
        <button type="submit" className="btn" disabled={loading}>
          {loading ? 'Creating Account...' : 'Sign Up'}
        </button>
      </form>
      <p>
        Already have an account? <a href="/login">Login here</a>
      </p>
    </div>
  );
}

export default Signup;
