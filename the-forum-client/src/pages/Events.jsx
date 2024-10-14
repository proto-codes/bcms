import React, { useState } from 'react';

const Events = () => {
  // Hardcoded dummy data for events
  const dummyEvents = [
    { id: 1, title: 'Tech Meetup', date: '2024-10-25', location: 'Online', description: 'Join us for a discussion on the latest in tech.', rsvp: false },
    { id: 2, title: 'Book Club Gathering', date: '2024-10-30', location: 'Local Library', description: 'Discuss this month\'s book selection with fellow readers.', rsvp: false },
    { id: 3, title: 'Outdoor Adventure', date: '2024-11-05', location: 'Central Park', description: 'A day of hiking and exploring.', rsvp: false },
    { id: 4, title: 'Photography Workshop', date: '2024-11-10', location: 'Community Center', description: 'Learn photography skills from the pros.', rsvp: false },
  ];

  const [events, setEvents] = useState(dummyEvents);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredEvents = events.filter(event => 
    event.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const rsvpForEvent = (eventId) => {
    alert(`You have RSVP'd for: ${eventId}!`);
  };

  return (
    <div className="container my-4">
      <h2 className="mb-4 text-gold-dark">Upcoming Events</h2>

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

      {/* Display events */}
      <div className="row">
        {filteredEvents.length > 0 ? (
          filteredEvents.map(event => (
            <div key={event.id} className="col-md-4 mb-4">
              <div className="card h-100">
                <div className="card-body">
                  <h5 className="card-title">{event.title}</h5>
                  <p className="card-text"><strong>Date:</strong> {event.date}</p>
                  <p className="card-text"><strong>Location:</strong> {event.location}</p>
                  <p className="card-text">{event.description}</p>
                  
                  {/* RSVP button */}
                  <button className="btn btn-gold-dark" onClick={() => rsvpForEvent(event.id)}>RSVP</button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No events available.</p>
        )}
      </div>
    </div>
  );
};

export default Events;
