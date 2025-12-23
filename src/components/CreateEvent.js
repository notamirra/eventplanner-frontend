import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { eventAPI } from '../services/api';
import './CreateEvent.css';

function CreateEvent() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await eventAPI.create(
      formData.title,
      formData.description,
      formData.location,
      new Date().toISOString() // Use current time as default
    );

    if (result.success) {
      navigate('/events');
    } else {
      setError(result.error);
    }

    setLoading(false);
  };

  return (
    <div className="create-event-container">
      <h2>Create New Event</h2>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Title:</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Description:</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
          />
        </div>
        <div className="form-group">
          <label>Location:</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
          />
        </div>
        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Creating...' : 'Create Event'}
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate('/events')}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateEvent;
