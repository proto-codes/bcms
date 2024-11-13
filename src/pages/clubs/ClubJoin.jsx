import React, { useState } from 'react';
import { Button, ListGroup, Form } from 'react-bootstrap';
import { toast } from 'react-toastify';

const ClubJoin = () => {
  const clubs = [
    { id: 1, name: 'Photography Club', description: 'A club for photography enthusiasts', isPrivate: false },
    { id: 2, name: 'Literature Club', description: 'Discuss and analyze great books', isPrivate: true },
    { id: 3, name: 'Chess Club', description: 'Sharpen your chess skills', isPrivate: false },
    { id: 4, name: 'Science Club', description: 'Explore the wonders of science', isPrivate: true },
  ];

  const [searchTerm, setSearchTerm] = useState('');
  const [joinRequests, setJoinRequests] = useState({});
  const [joinedClubs, setJoinedClubs] = useState([]);

  const handleJoin = (clubId, isPrivate) => {
    if (isPrivate) {
      setJoinRequests((prevRequests) => ({
        ...prevRequests,
        [clubId]: 'Pending Approval',
      }));
      toast.info("Join request sent and awaiting approval.");
    } else {
      setJoinedClubs((prevJoinedClubs) => [...prevJoinedClubs, clubId]);
      toast.success("You have successfully joined the club!");
    }
  };

  const handleCancelRequest = (clubId) => {
    setJoinRequests((prevRequests) => {
      const updatedRequests = { ...prevRequests };
      delete updatedRequests[clubId];
      return updatedRequests;
    });
    toast.warning("Join request canceled.");
  };

  const handleLeaveClub = (clubId) => {
    setJoinedClubs((prevJoinedClubs) =>
      prevJoinedClubs.filter((id) => id !== clubId)
    );
    toast.info("You have left the club.");
  };

  const filteredClubs = clubs.filter((club) =>
    club.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="mt-4">
      <h3 className="mb-4">Available Clubs</h3>

      <Form.Group controlId="search" className="mb-3">
        <Form.Control
          type="text"
          placeholder="Search for a club..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Form.Group>

      <ListGroup>
        {filteredClubs.length > 0 ? (
          filteredClubs.map((club) => (
            <ListGroup.Item key={club.id} className="mb-3 p-3" style={{ border: '1px solid #ddd', borderRadius: '8px' }}>
              <h5>{club.name}</h5>
              <p>{club.description}</p>

              {joinedClubs.includes(club.id) ? (
                <Button variant="danger" onClick={() => handleLeaveClub(club.id)}>
                  Leave Club
                </Button>
              ) : joinRequests[club.id] === 'Pending Approval' ? (
                <Button variant="secondary" onClick={() => handleCancelRequest(club.id)}>
                  Cancel Request
                </Button>
              ) : (
                <Button variant="primary" onClick={() => handleJoin(club.id, club.isPrivate)}>
                  {club.isPrivate ? 'Request to Join' : 'Join Club'}
                </Button>
              )}
            </ListGroup.Item>
          ))
        ) : (
          <p>No clubs match your search.</p>
        )}
      </ListGroup>
    </div>
  );
};

export default ClubJoin;
