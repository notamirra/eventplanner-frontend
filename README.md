# EventPlanner Frontend

A modern, React-based frontend for the EventPlanner application with a clean UI powered by Tailwind CSS.

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Backend API running on `http://localhost:8080`

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm start
```

The app will open at `http://localhost:3000`

### Build for Production

```bash
# Create optimized production build
npm run build
```

## Features

### Authentication
- User signup with email and password
- User login
- Session persistence using localStorage
- Protected routes (redirects to login if not authenticated)

### Event Management
- **Create Events**: Organizers can create new events with title, description, location, and start time
- **View Events**: 
  - View all events you've organized
  - View all events you're invited to
  - Tabbed interface to switch between organized and invited events
- **Delete Events**: Organizers can delete events they created
- **Invite Users**: Organizers can invite users to events with different roles (organizer, attendee, collaborator)
- **View Attendees**: Organizers can see the list of attendees and their statuses for each event

### Response Management
- **Attendance Status**: Attendees can indicate their attendance (Going, Maybe, Not Going)
- **Status Tracking**: Visual badges show attendance status for each attendee
- **Role Display**: Clear role indicators (Organizer, Attendee, Collaborator)

### Task Management
- **Create Tasks**: Organizers and collaborators can create tasks for events
- **Assign Tasks**: Tasks can be assigned to specific users
- **Due Dates**: Set due dates for tasks

### Search and Filtering
- **Advanced Search**: Search across events and tasks by keywords
- **Date Filters**: Filter results by date range (from/to)
- **Role Filters**: Filter by user role (organizer, attendee, collaborator)
- **Separate Results**: Events and tasks displayed in separate sections

## Pages

- `/login` - User login
- `/signup` - User registration
- `/events` - View organized and invited events
- `/create-event` - Create a new event
- `/events/:id` - View event details, attendees, invite users, create tasks
- `/search` - Advanced search for events and tasks



