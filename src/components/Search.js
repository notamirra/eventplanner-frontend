import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { searchAPI, eventAPI } from '../services/api';
import './Search.css';

function Search() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [role, setRole] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) {
      setError('Please enter a search query');
      return;
    }
    
    setLoading(true);
    setError('');

    const filters = {};
    if (fromDate) filters.from = fromDate;
    if (toDate) filters.to = toDate;
    if (role) filters.role = role;
    const result = await searchAPI.search(query, filters);
    if (result.success) {
      setResults(result.data);
    } else {
      setError(result.error);
    }

    setLoading(false);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const [successMessage, setSuccessMessage] = useState('');
  const [selectedAttendance, setSelectedAttendance] = useState({});

  const handleAttendance = async (eventId, status) => {
    const result = await eventAPI.setAttendance(eventId, status);
    if (result.success) {
      setSelectedAttendance({ ...selectedAttendance, [eventId]: status });
      setSuccessMessage(`Attendance updated to "${status.replace('_', ' ')}"`);
      setTimeout(() => setSuccessMessage(''), 3000);
      // Refresh search results
      const filters = {};
      if (fromDate) filters.from = fromDate;
      if (toDate) filters.to = toDate;
      if (role) filters.role = role;
      const searchResult = await searchAPI.search(query, filters);
      if (searchResult.success) {
        setResults(searchResult.data);
      }
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="search-container">
      <h2>Search Events and Tasks</h2>

      <form onSubmit={handleSearch} className="search-form">
        <div className="search-input-group">
          <input
            type="text"
            placeholder="Search by keywords..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="btn-search" disabled={loading}>
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>

        <div className="filters">
          <div className="filter-group">
            <label>From Date:</label>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
            />
          </div>
          <div className="filter-group">
            <label>To Date:</label>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
            />
          </div>
          <div className="filter-group">
            <label>Role:</label>
            <select value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="">All Roles</option>
              <option value="organizer">Organizer</option>
              <option value="attendee">Attendee</option>
              <option value="collaborator">Collaborator</option>
            </select>
          </div>
        </div>
      </form>

      {error && <div className="error-message">{error}</div>}
      {successMessage && <div className="success-message">{successMessage}</div>}

      {results && (
        <div className="results-container">
          <h3>Search Results</h3>

          {results.events && results.events.length > 0 && (
            <div className="results-section">
              <h4>Events ({results.events.length})</h4>
              <div className="results-grid">
                {results.events.map((event) => {
                  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
                  const isOrganizer = event.organizerId === currentUser.id;
                  const currentStatus = selectedAttendance[event.id];
                  
                  return (
                    <div key={event.id} className="result-card">
                      <h5>{event.title}</h5>
                      <p className="description">{event.description}</p>
                      <div className="details">
                        <p><strong>Location:</strong> {event.location}</p>
                        <p><strong>Start:</strong> {formatDate(event.startTime)}</p>
                        <p><strong>Role:</strong> {isOrganizer ? 'Organizer' : 'Attendee'}</p>
                        {currentStatus && (
                          <p className="attendance-status">
                            <strong>Your Status:</strong> <span className={`status-badge status-${currentStatus}`}>
                              {currentStatus.replace('_', ' ')}
                            </span>
                          </p>
                        )}
                      </div>
                      <div className="result-actions">
                        {isOrganizer ? (
                          <button onClick={() => navigate(`/events/${event.id}`)} className="btn-view">
                            View Details
                          </button>
                        ) : (
                          <>
                            <button 
                              onClick={() => handleAttendance(event.id, 'going')} 
                              className={`btn-going ${currentStatus === 'going' ? 'selected' : ''}`}
                            >
                              {currentStatus === 'going' ? '✓ ' : ''}Going
                            </button>
                            <button 
                              onClick={() => handleAttendance(event.id, 'maybe')} 
                              className={`btn-maybe ${currentStatus === 'maybe' ? 'selected' : ''}`}
                            >
                              {currentStatus === 'maybe' ? '✓ ' : ''}Maybe
                            </button>
                            <button 
                              onClick={() => handleAttendance(event.id, 'not_going')} 
                              className={`btn-not-going ${currentStatus === 'not_going' ? 'selected' : ''}`}
                            >
                              {currentStatus === 'not_going' ? '✓ ' : ''}Not Going
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {results.tasks && results.tasks.length > 0 && (
            <div className="results-section">
              <h4>Tasks ({results.tasks.length})</h4>
              <div className="results-grid">
                {results.tasks.map((task) => (
                  <div key={task.id} className="result-card">
                    <h5>{task.title}</h5>
                    <p className="description">{task.description}</p>
                    <div className="details">
                      <p><strong>Event:</strong> {task.eventTitle}</p>
                      {task.dueDate && (
                        <p><strong>Due:</strong> {formatDate(task.dueDate)}</p>
                      )}
                      <p><strong>Status:</strong> {task.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {(!results.events || results.events.length === 0) &&
           (!results.tasks || results.tasks.length === 0) && (
            <p className="no-results">No results found for your search.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default Search;
