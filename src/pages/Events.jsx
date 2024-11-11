import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext'; // Assuming you have AuthContext to get the logged-in user

const Events = () => {
  const { userId } = useAuth(); // Get logged-in user ID from AuthContext
  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [formVisible, setFormVisible] = useState(false);
  const [newEvent, setNewEvent] = useState({
    id: null,
    title: '',
    date: '',
    location: '',
    description: '',
  });

  // Format date to readable format (MM/DD/YYYY)
  const formatDate = (date) => {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Fetch events from the server
  const fetchEvents = async () => {
    try {
      const response = await api.get('/events');
      setEvents(response.data); // Set the events from the server response
    } catch (error) {
      toast.error('Failed to load events.');
    }
  };

  // Fetch events when the component mounts
  useEffect(() => {
    fetchEvents();
  }, []);

  // Filter events based on search term
  const filteredEvents = events.filter((event) =>
    event.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort events: Place the owner's event at the top
  const sortedEvents = [...filteredEvents].sort((a, b) => {
    if (a.ownerId === userId && b.ownerId !== userId) return -1; // Owner's event comes first
    if (a.ownerId !== userId && b.ownerId === userId) return 1; // Owner's event comes first
    return 0; // No change if both or neither are owned by the user
  });

  // Handle RSVP toggle
  const handleRSVP = async (eventId) => {
    try {
      const response = await api.put(`/events/rsvp/${eventId}`);
      toast.success(response.data.message);

      // Update RSVP status in the local state without re-fetching
      setEvents((prevEvents) =>
        prevEvents.map((event) =>
          event.id === eventId ? { ...event, user_rsvp: !event.user_rsvp } : event
        )
      );
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to update RSVP status.';
      toast.error(errorMessage);
    }
  };

 // Handle input changes for creating/editing events
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === "date") {
      // When the date field changes, ensure the value is in YYYY-MM-DD format
      const formattedDate = new Date(value).toISOString().split('T')[0];
      setNewEvent((prevState) => ({ ...prevState, [name]: formattedDate }));
    } else {
      setNewEvent((prevState) => ({ ...prevState, [name]: value }));
    }
  };

  // Handle event form submission
  const handleCreateOrEditEvent = async (e) => {
    e.preventDefault();

    // Validation
    if (!newEvent.title || !newEvent.date || !newEvent.location || !newEvent.description) {
      toast.error('All fields are required!');
      return;
    }

    try {
      let response;
      if (newEvent.id === null) {
        // Create new event
        response = await api.post('/events', newEvent);
      } else {
        // Update existing event
        response = await api.put(`/events/${newEvent.id}`, newEvent);
      }
      toast.success(response.data.message || 'Event saved successfully!');
      setNewEvent({ id: null, title: '', date: '', location: '', description: '' });
      setFormVisible(false);
      fetchEvents(); // Refresh the events list
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to save event!';
      toast.error(errorMessage);
    }
  };

  // Handle event deletion
  const handleDeleteEvent = async (eventId) => {
    try {
      const response = await api.delete(`/events/${eventId}`);
      toast.success(response.data.message || 'Event deleted successfully!');
      fetchEvents(); // Refresh the event list
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to delete event!';
      toast.error(errorMessage);
    }
  };

  return (
    <div className="container my-4">
      <h3 className="mb-4 text-gold">Events</h3>

      {/* Search bar */}
      <div className="input-group mb-4">
        <input
          type="text"
          className="form-control"
          placeholder="Search for events..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Toggle form visibility for creating new events */}
      <button
        className="btn btn-success mb-4"
        onClick={() => setFormVisible(!formVisible)}
      >
        {formVisible ? 'Cancel' : 'Create New Event'}
      </button>

      {/* Event creation/edit form */}
      {formVisible && (
        <form onSubmit={handleCreateOrEditEvent} className="mb-4">
          <div className="mb-3">
            <label className="form-label">Event Title</label>
            <input
              type="text"
              className="form-control"
              name="title"
              value={newEvent.title}
              onChange={handleInputChange}
              placeholder="Enter event title"
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Event Date</label>
            <input
              type="date"
              className="form-control"
              name="date"
              value={newEvent.date}
              onChange={handleInputChange}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Location</label>
            <input
              type="text"
              className="form-control"
              name="location"
              value={newEvent.location}
              onChange={handleInputChange}
              placeholder="Enter location"
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Description</label>
            <textarea
              className="form-control"
              name="description"
              value={newEvent.description}
              onChange={handleInputChange}
              placeholder="Enter event description"
            />
          </div>
          <button type="submit" className="btn btn-primary">
            {newEvent.id ? 'Update Event' : 'Create Event'}
          </button>
        </form>
      )}

      {/* Events list */}
      <div className="row">
        {sortedEvents.length > 0 ? (
          sortedEvents.map((event) => {
            return (
              <div key={event.id} className="col-12 col-md-6 mb-4">
                <div className="p-3 border rounded">
                  <h5>{event.title}</h5>
                  <p><strong>Date:</strong> {formatDate(event.date)}</p> {/* Display readable date */}
                  <p><strong>Location:</strong> {event.location}</p>
                  <p>{event.description}</p>

                  {/* RSVP Button (Visible for non-owners) */}
                  {userId && event.ownerId !== userId && (
                    <button
                      className={`btn btn-sm ${event.user_rsvp ? 'btn-secondary' : 'btn-primary'}`}
                      onClick={() => handleRSVP(event.id)}
                    >
                      {event.user_rsvp ? 'Cancel RSVP' : 'RSVP'}
                    </button>
                  )}

                  {/* Edit and Delete Buttons (Visible for owners) */}
                  {userId && event.ownerId === userId && (
                    <div className="d-flex gap-2 mt-2">
                      <button
                        className="btn btn-warning btn-sm"
                        onClick={() => {
                          const formattedDate = new Date(event.date).toISOString().split('T')[0];
                          setNewEvent({ ...event, date: formattedDate });
                          setFormVisible(true);
                        }}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDeleteEvent(event.id)}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
                <hr />
              </div>
            );
          })
        ) : (
          <p>No events available.</p>
        )}
      </div>
    </div>
  );
};

export default Events;
