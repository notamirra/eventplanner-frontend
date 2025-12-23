import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { eventAPI } from '../services/api';
import './EventList.css';

function EventList() {
  const navigate = useNavigate();
  const [organizedEvents, setOrganizedEvents] = useState([]);
  const [invitedEvents, setInvitedEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('organized');

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    setLoading(true);
    setError('');

    const [organizedResult, invitedResult] = await Promise.all([
      eventAPI.getOrganized(),
      eventAPI.getInvited(),
    ]);

    if (organizedResult.success) {
      setOrganizedEvents(organizedResult.data || []);
    } else {
      setError(organizedResult.error);
    }

    if (invitedResult.success) {
      setInvitedEvents(invitedResult.data || []);
    }

    setLoading(false);
  };

  const handleDelete = async (eventId) => {
    if (!window.confirm('Are you sure you want to delete this event?')) {
      return;
    }

    const result = await eventAPI.delete(eventId);
    if (result.success) {
      loadEvents();
    } else {
      setError(result.error);
    }
  };

  const [successMessage, setSuccessMessage] = useState('');
  const [selectedAttendance, setSelectedAttendance] = useState({});

  const handleAttendance = async (eventId, status) => {
    const result = await eventAPI.setAttendance(eventId, status);
    if (result.success) {
      setSelectedAttendance({ ...selectedAttendance, [eventId]: status });
      setSuccessMessage(`Attendance updated to "${status.replace('_', ' ')}"`);
      setTimeout(() => setSuccessMessage(''), 3000);
      loadEvents();
    } else {
      setError(result.error);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const renderEvent = (event, isOrganizer) => {
    const currentStatus = selectedAttendance[event.id];
    
    return (
      <div key={event.id} className="event-card">
        <h3>{event.title}</h3>
        <p className="event-description">{event.description}</p>
        <div className="event-details">
          <p><strong>Location:</strong> {event.location}</p>
          <p><strong>Start Time:</strong> {formatDate(event.startTime)}</p>
          <p><strong>Role:</strong> {isOrganizer ? 'Organizer' : 'Attendee'}</p>
          {currentStatus && (
            <p className="attendance-status">
              <strong>Your Status:</strong> <span className={`status-badge status-${currentStatus}`}>
                {currentStatus.replace('_', ' ')}
              </span>
            </p>
          )}
        </div>
        <div className="event-actions">
          {isOrganizer ? (
            <>
              <button onClick={() => navigate(`/events/${event.id}`)} className="btn-view">
                View Details
              </button>
              <button onClick={() => handleDelete(event.id)} className="btn-delete">
                Delete
              </button>
            </>
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
  };

  if (loading) {
    return <div className="loading">Loading events...</div>;
  }

  return (
    <div className="event-list-container">
      <h2>My Events</h2>
      {error && <div className="error-message">{error}</div>}
      {successMessage && <div className="success-message">{successMessage}</div>}

      <div className="tabs">
        <button
          className={activeTab === 'organized' ? 'tab active' : 'tab'}
          onClick={() => setActiveTab('organized')}
        >
          Organized ({organizedEvents.length})
        </button>
        <button
          className={activeTab === 'invited' ? 'tab active' : 'tab'}
          onClick={() => setActiveTab('invited')}
        >
          Invited ({invitedEvents.length})
        </button>
      </div>

      <div className="events-grid">
        {activeTab === 'organized' ? (
          organizedEvents.length > 0 ? (
            organizedEvents.map((event) => renderEvent(event, true))
          ) : (
            <p className="no-events">No organized events yet. Create your first event!</p>
          )
        ) : (
          invitedEvents.length > 0 ? (
            invitedEvents.map((event) => renderEvent(event, false))
          ) : (
            <p className="no-events">No invitations yet.</p>
          )
        )}
      </div>
    </div>
  );
}

export default EventList;
