import React, { useState, useEffect } from 'react';
import { Alert, Button, ListGroup, Card, Spinner } from 'react-bootstrap';
import { useParams } from 'react-router-dom';

const ClubOverview = () => {
  const { clubId } = useParams(); // Assuming clubId is passed as a URL param
  const [clubData, setClubData] = useState(null);
  const [members, setMembers] = useState([]);
  const [events, setEvents] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  // Fetch club data, members, and events
  useEffect(() => {
    const fetchData = async () => {
      try {
        const clubResponse = await fetch(`/api/clubs/${clubId}`);
        const membersResponse = await fetch(`/api/clubs/${clubId}/members`);
        const eventsResponse = await fetch(`/api/clubs/${clubId}/events`);

        if (!clubResponse.ok || !membersResponse.ok || !eventsResponse.ok) {
          throw new Error('Failed to fetch data');
        }

        const club = await clubResponse.json();
        const clubMembers = await membersResponse.json();
        const clubEvents = await eventsResponse.json();

        setClubData(club);
        setMembers(clubMembers);
        setEvents(clubEvents);
      } catch (error) {
        setErrorMessage('Failed to fetch club overview. Please try again later.');
      }
    };

    fetchData();
  }, [clubId]);

  if (errorMessage) {
    return <Alert variant="danger">{errorMessage}</Alert>;
  }

  if (!clubData) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h3>{clubData.name} - Overview</h3>
      
      {/* Club Description */}
      <Card className="mb-4">
        <Card.Body>
          <Card.Title>Description</Card.Title>
          <Card.Text>{clubData.description}</Card.Text>
          <Card.Title>Goals</Card.Title>
          <Card.Text>{clubData.goals}</Card.Text>
        </Card.Body>
      </Card>

      {/* Members List */}
      <h4>Members</h4>
      {members.length > 0 ? (
        <ListGroup className="mb-4">
          {members.map((member) => (
            <ListGroup.Item key={member.id}>{member.name}</ListGroup.Item>
          ))}
        </ListGroup>
      ) : (
        <p>No members yet. Be the first to join!</p>
      )}

      {/* Events List */}
      <h4>Upcoming Events</h4>
      {events.length > 0 ? (
        <ListGroup>
          {events.map((event) => (
            <ListGroup.Item key={event.id}>
              <strong>{event.name}</strong> - {event.date}
            </ListGroup.Item>
          ))}
        </ListGroup>
      ) : (
        <p>No upcoming events.</p>
      )}

      <Button variant="primary" className="mt-4">Join Club</Button>
    </div>
  );
};

export default ClubOverview;
