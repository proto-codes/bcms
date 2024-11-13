import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';

const ClubCreate = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    goals: '',
    membershipCriteria: '', // New field for membership criteria
    isPrivate: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Club Data:', formData);
  };

  return (
    <div className="mt-4">
      <h3 className="mb-4">Create a New Club</h3>
      <Form onSubmit={handleSubmit} style={{ maxWidth: '100%' }}>
        
        {/* Club Name */}
        <Form.Group controlId="name" className="mb-3">
          <Form.Label>Club Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter club name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </Form.Group>

        {/* Description */}
        <Form.Group controlId="description" className="mb-3">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            placeholder="Briefly describe the club"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </Form.Group>

        {/* Goals */}
        <Form.Group controlId="goals" className="mb-3">
          <Form.Label>Goals</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            placeholder="State the club's goals or mission"
            name="goals"
            value={formData.goals}
            onChange={handleChange}
          />
        </Form.Group>

        {/* Membership Criteria */}
        <Form.Group controlId="membershipCriteria" className="mb-3">
          <Form.Label>Membership Criteria</Form.Label>
          <Form.Control
            as="textarea"
            rows={2}
            placeholder="Specify any criteria for joining (e.g., skills, experience)"
            name="membershipCriteria"
            value={formData.membershipCriteria}
            onChange={handleChange}
          />
        </Form.Group>

        {/* Privacy Setting */}
        <Form.Group controlId="isPrivate" className="mb-4">
          <Form.Check
            type="checkbox"
            label="Private Club (only approved members can join)"
            name="isPrivate"
            checked={formData.isPrivate}
            onChange={handleChange}
          />
        </Form.Group>

        {/* Submit Button */}
        <Button variant="primary" type="submit">
          Create Club
        </Button>
      </Form>
    </div>
  );
};

export default ClubCreate;
