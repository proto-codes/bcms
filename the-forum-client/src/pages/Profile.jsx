import React, { useState, useEffect } from 'react';
import { Form, Button, Card, Container, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import { FaUpload, FaTrash } from 'react-icons/fa';

const Profile = () => {
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    bio: '',
    avatar: '',
    address: '',
    phone: '',
    dob: '',
  });

  const [editing, setEditing] = useState(false);
  const [file, setFile] = useState(null);

  // Fetch user data when component mounts
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = {
          name: 'John Doe',
          email: 'john@example.com',
          bio: 'Software Developer & Design Enthusiast',
          avatar: 'https://via.placeholder.com/150',
          address: '123 Main St, City, Country',
          phone: '+1234567890',
          dob: '1990-01-01',
        };
        setUserData(response);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Handle file change for profile picture
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Handle delete profile picture
  const handleDeleteAvatar = () => {
    setUserData((prevState) => ({
      ...prevState,
      avatar: 'https://via.placeholder.com/150', // Reset to default placeholder
    }));
  };

  // Handle form submission to update user data
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', userData.name);
    formData.append('email', userData.email);
    formData.append('bio', userData.bio);
    formData.append('address', userData.address);
    formData.append('phone', userData.phone);
    formData.append('dob', userData.dob);
    if (file) {
      formData.append('avatar', file);
    }

    try {
      await axios.put('http://localhost:8000/api/profile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setEditing(false);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  return (
    <Container className="my-4">
      <Card className="shadow-lg border-0">
        <Card.Body>
          <div className="d-flex align-items-center mb-4">
            <img
              src={userData.avatar}
              alt="User Avatar"
              className="rounded-circle me-3"
              style={{ width: '150px', height: '150px', objectFit: 'cover', border: '5px solid #052c65' }}
            />
            <div className="flex-grow-1">
              <h2 style={{ color: '#052c65', fontWeight: '600' }}>{userData.name}</h2>
              <p className="text-muted">{userData.email}</p>
              {editing && (
                <div className="mt-2">
                  <label htmlFor="file-upload" className="me-2" style={{ cursor: 'pointer' }}>
                    <FaUpload size={24} color="#052c65" />
                    <input
                      id="file-upload"
                      type="file"
                      onChange={handleFileChange}
                      style={{ display: 'none' }}
                      accept="image/*"
                    />
                  </label>
                  <Button variant="danger" onClick={handleDeleteAvatar}>
                    <FaTrash />
                  </Button>
                </div>
              )}
            </div>
          </div>
          <hr />
          {!editing ? (
            <div>
              <p><strong>Bio:</strong> {userData.bio}</p>
              <p><strong>Address:</strong> {userData.address}</p>
              <p><strong>Phone:</strong> {userData.phone}</p>
              <p><strong>Date of Birth:</strong> {userData.dob}</p>
              <Button variant="blue" onClick={() => setEditing(true)}>Edit Profile</Button>
            </div>
          ) : (
            <Form onSubmit={handleFormSubmit}>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      value={userData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={userData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Phone Number</Form.Label>
                    <Form.Control
                      type="text"
                      name="phone"
                      value={userData.phone}
                      onChange={handleInputChange}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Date of Birth</Form.Label>
                    <Form.Control
                      type="date"
                      name="dob"
                      value={userData.dob}
                      onChange={handleInputChange}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Label>Address</Form.Label>
                <Form.Control
                  type="text"
                  name="address"
                  value={userData.address}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Bio</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="bio"
                  value={userData.bio}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>

              <div className="d-flex justify-content-between">
                <Button variant="success" type="submit">
                  Save Changes
                </Button>
                <Button variant="secondary" onClick={() => setEditing(false)}>
                  Cancel
                </Button>
              </div>
            </Form>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Profile;
