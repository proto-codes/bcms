import React, { useState, useEffect } from 'react';
import { Card, Container, Button, Form, ListGroup, Modal } from 'react-bootstrap';

const Clubs = () => {
  const [clubs, setClubs] = useState([]); // List of clubs
  const [selectedClub, setSelectedClub] = useState(null); // Current club for messaging
  const [newMessage, setNewMessage] = useState(''); // Message input
  const [showMessageModal, setShowMessageModal] = useState(false); // Message modal visibility
  const [events, setEvents] = useState([]); // Events for the selected club

  useEffect(() => {
    // Hardcoded sample clubs data
    const sampleClubs = [
      { id: 1, name: 'Tech Enthusiasts' },
      { id: 2, name: 'Art Lovers' },
      { id: 3, name: 'Fitness Freaks' },
      { id: 4, name: 'Music Masters' },
    ];
    setClubs(sampleClubs); // Set hardcoded clubs
  }, []);

  const fetchEvents = async (clubId) => {
    // Hardcoded sample events data
    const sampleEvents = [
      { id: 1, title: 'Weekly Meetup', description: 'Discuss the latest tech trends.' },
      { id: 2, title: 'Hackathon', description: '24-hour coding competition.' },
    ];
    setEvents(sampleEvents); // Set hardcoded events for demonstration
  };

  const handleMessageSubmit = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    // For now, we won't be making a real API request
    setNewMessage('');
    setShowMessageModal(false);
  };

  const handleClubClick = (club) => {
    setSelectedClub(club.id);
    fetchEvents(club.id); // Fetch events for the selected club
    setShowMessageModal(true); // Open the messaging modal
  };

  return (
    <Container className="my-5">
      <h2 className="text-center mb-4">Clubs</h2>
      
      {clubs.length > 0 ? ( // Check if clubs are available
        <ListGroup>
          {clubs.map((club) => (
            <ListGroup.Item key={club.id} className="d-flex justify-content-between align-items-center">
              <span>{club.name}</span>
              <Button variant="primary" onClick={() => handleClubClick(club)}>
                Join
              </Button>
            </ListGroup.Item>
          ))}
        </ListGroup>
      ) : (
        <p className="text-center text-muted">No clubs available. Please check back later.</p> // Message when no clubs
      )}

      <Modal show={showMessageModal} onHide={() => setShowMessageModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Messages for Club {selectedClub}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h5>Events</h5>
          <ListGroup>
            {events.length > 0 ? (
              events.map((event) => (
                <ListGroup.Item key={event.id}>
                  <strong>{event.title}</strong>
                  <p>{event.description}</p>
                </ListGroup.Item>
              ))
            ) : (
              <p>No events available for this club.</p> // Message when no events
            )}
          </ListGroup>
          
          <h5 className="mt-4">Send a Message</h5>
          <Form onSubmit={handleMessageSubmit}>
            <Form.Group>
              <Form.Control
                type="text"
                placeholder="Type your message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="mt-2">
              Send Message
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default Clubs;
