import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { eventAPI } from '../services/api';
import './EventDetails.css';

function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [attendees, setAttendees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [inviteUserId, setInviteUserId] = useState('');
  const [inviteRole, setInviteRole] = useState('attendee');
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [taskDueDate, setTaskDueDate] = useState('');
  const [taskAssigneeId, setTaskAssigneeId] = useState('');
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [showTaskForm, setShowTaskForm] = useState(false);

  useEffect(() => {
    loadAttendees();
  }, [id]);

  const loadAttendees = async () => {
    setLoading(true);
    setError('');

    const result = await eventAPI.getAttendees(id);
    if (result.success) {
      setAttendees(result.data || []);
    } else {
      setError(result.error);
    }

    setLoading(false);
  };

  const handleInvite = async (e) => {
    e.preventDefault();
    setError('');

    const result = await eventAPI.invite(id, parseInt(inviteUserId), inviteRole);
    if (result.success) {
      setInviteUserId('');
      setInviteRole('attendee');
      setShowInviteForm(false);
      loadAttendees();
    } else {
      setError(result.error);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    setError('');

    const dueDate = taskDueDate ? new Date(taskDueDate).toISOString() : null;
    const assigneeId = taskAssigneeId ? parseInt(taskAssigneeId) : null;

    const result = await eventAPI.createTask(
      id,
      taskTitle,
      taskDescription,
      dueDate,
      assigneeId
    );

    if (result.success) {
      setTaskTitle('');
      setTaskDescription('');
      setTaskDueDate('');
      setTaskAssigneeId('');
      setShowTaskForm(false);
      alert('Task created successfully!');
    } else {
      setError(result.error);
    }
  };

  const getStatusBadge = (attendance) => {
    // Handle null/undefined attendance
    const status = attendance || 'pending';
    const statusClasses = {
      going: 'status-going',
      maybe: 'status-maybe',
      not_going: 'status-not-going',
      pending: 'status-pending',
    };
    
    // Format the display text
    const displayText = status === 'not_going' ? 'Not Going' : 
                       status.charAt(0).toUpperCase() + status.slice(1);
    
    return (
      <span className={`status-badge ${statusClasses[status] || 'status-pending'}`}>
        {displayText}
      </span>
    );
  };

  const getRoleBadge = (role) => {
    const roleClasses = {
      organizer: 'role-organizer',
      attendee: 'role-attendee',
      collaborator: 'role-collaborator',
    };
    return (
      <span className={`role-badge ${roleClasses[role] || ''}`}>
        {role}
      </span>
    );
  };

  if (loading) {
    return <div className="loading">Loading event details...</div>;
  }

  return (
    <div className="event-details-container">
      <div className="header">
        <h2>Event Attendees</h2>
        <button onClick={() => navigate('/events')} className="btn-back">
          Back to Events
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="actions-bar">
        <button
          onClick={() => setShowInviteForm(!showInviteForm)}
          className="btn btn-primary"
        >
          {showInviteForm ? 'Cancel Invite' : 'Invite User'}
        </button>
        <button
          onClick={() => setShowTaskForm(!showTaskForm)}
          className="btn btn-secondary"
        >
          {showTaskForm ? 'Cancel Task' : 'Create Task'}
        </button>
      </div>

      {showInviteForm && (
        <form onSubmit={handleInvite} className="invite-form">
          <h3>Invite User to Event</h3>
          <div className="form-row">
            <div className="form-group">
              <label>User ID:</label>
              <input
                type="number"
                value={inviteUserId}
                onChange={(e) => setInviteUserId(e.target.value)}
                required
                min="1"
              />
            </div>
            <div className="form-group">
              <label>Role:</label>
              <select
                value={inviteRole}
                onChange={(e) => setInviteRole(e.target.value)}
              >
                <option value="attendee">Attendee</option>
                <option value="collaborator">Collaborator</option>
                <option value="organizer">Organizer</option>
              </select>
            </div>
          </div>
          <button type="submit" className="btn btn-primary">
            Send Invitation
          </button>
        </form>
      )}

      {showTaskForm && (
        <form onSubmit={handleCreateTask} className="task-form">
          <h3>Create Task</h3>
          <div className="form-group">
            <label>Task Title:</label>
            <input
              type="text"
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Description:</label>
            <textarea
              value={taskDescription}
              onChange={(e) => setTaskDescription(e.target.value)}
              rows="3"
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Due Date:</label>
              <input
                type="datetime-local"
                value={taskDueDate}
                onChange={(e) => setTaskDueDate(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Assignee ID:</label>
              <input
                type="number"
                value={taskAssigneeId}
                onChange={(e) => setTaskAssigneeId(e.target.value)}
                min="1"
              />
            </div>
          </div>
          <button type="submit" className="btn btn-primary">
            Create Task
          </button>
        </form>
      )}

      <div className="attendees-list">
        <h3>Attendees ({attendees.length})</h3>
        {attendees.length > 0 ? (
          <table className="attendees-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {attendees.map((attendee) => (
                <tr key={attendee.userId}>
                  <td>{attendee.userName}</td>
                  <td>{attendee.userEmail}</td>
                  <td>{getRoleBadge(attendee.role)}</td>
                  <td>{getStatusBadge(attendee.attendance)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="no-attendees">No attendees yet.</p>
        )}
      </div>
    </div>
  );
}

export default EventDetails;
