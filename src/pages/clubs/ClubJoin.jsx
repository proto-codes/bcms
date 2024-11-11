import React, { useState, useEffect } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';

const ClubJoin = () => {
  const [formData, setFormData] = useState({
    clubName: '',
  });
  const [clubs, setClubs] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Handle form data change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Simulate fetching clubs (replace with an API call)
  useEffect(() => {
    // Replace with actual API call to fetch clubs
    setClubs([
      { id: 1, name: 'Tech Innovators' },
      { id: 2, name: 'Creative Minds' },
      { id: 3, name: 'Sports Enthusiasts' },
    ]);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const selectedClub = clubs.find((club) => club.name.toLowerCase() === formData.clubName.toLowerCase());

    if (selectedClub) {
      setSuccessMessage(`You have successfully requested to join the club "${selectedClub.name}".`);
      setErrorMessage('');
      // Here you would trigger an actual request to the backend to join the club
    } else {
      setErrorMessage('Please select a valid club.');
      setSuccessMessage('');
    }
  };

  return (
    <div className="mt-4">
      <h3 className="mb-4">Join a Club</h3>

      {/* Display success message */}
      {successMessage && <Alert variant="success">{successMessage}</Alert>}

      {/* Display error message */}
      {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}

      <Form onSubmit={handleSubmit} style={{ maxWidth: '100%' }}>
        <Form.Group controlId="clubName" className="mb-3">
          <Form.Label>Select Club</Form.Label>
          <Form.Control
            as="select"
            name="clubName"
            value={formData.clubName}
            onChange={handleChange}
            required
          >
            <option value="">Select a Club</option>
            {clubs.map((club) => (
              <option key={club.id} value={club.name}>
                {club.name}
              </option>
            ))}
          </Form.Control>
        </Form.Group>

        <Button variant="gold" type="submit">
          Join Club
        </Button>
      </Form>
    </div>
  );
};

export default ClubJoin;
