import React, { useState, useEffect } from 'react';
import { Form, Button, Card, Container, Row, Col, Spinner } from 'react-bootstrap';
import { FaUpload, FaTrash } from 'react-icons/fa';
import ProfilePlaceholder from '../assets/img/the-forum-logo.jpeg';
import api from '../api/axios';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const Profile = () => {
  const { userId } = useParams();
  const { userId: loggedInUserId } = useAuth();
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    bio: '',
    profile_pics: '',
    address: '',
    phone_number: '',
    birthday: '',
  });
  const [editing, setEditing] = useState(false);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/profile/${userId}`);
        const data = response.data;

        const formattedBirthday = data.birthday ? new Date(data.birthday).toISOString().split('T')[0] : '';

        setUserData({
          name: data.name || '',
          email: data.email || '',
          bio: data.bio || '',
          profile_pics: data.profile_pics || '',
          address: data.address || '',
          phone_number: data.phone_number || '',
          birthday: formattedBirthday,
        });
        setPreview(data.profile_pics || '');
      } catch (error) {
        toast.error('Failed to fetch user data.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return '';
    }

    const day = date.getDate();
    const month = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(date);
    const year = date.getFullYear();
    const ordinalSuffix = (day) => {
      if (day > 3 && day < 21) return 'th';
      switch (day % 10) {
        case 1: return 'st';
        case 2: return 'nd';
        case 3: return 'rd';
        default: return 'th';
      }
    };

    return `${day}${ordinalSuffix(day)} ${month}, ${year}`;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleDeleteProfilePicture = () => {
    setUserData((prevState) => ({
      ...prevState,
      profile_pics: '',
    }));
    setFile(null);
    setPreview('');
  };

  const validateForm = () => {
    const newErrors = {};
    if (!userData.name) newErrors.name = 'Name is required.';
    if (!userData.email) newErrors.email = 'Email is required.';
    if (!userData.phone_number) newErrors.phone_number = 'Phone number is required.';
    if (!userData.birthday) newErrors.birthday = 'Date of birth is required.';
    if (!userData.address) newErrors.address = 'Address is required.';
    if (!userData.bio) newErrors.bio = 'Bio is required.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    const formData = new FormData();
    formData.append('name', userData.name);
    formData.append('email', userData.email);
    formData.append('bio', userData.bio);
    formData.append('address', userData.address);
    formData.append('phone_number', userData.phone_number);
    formData.append('birthday', userData.birthday);
    if (file) {
      formData.append('profile_pics', file);
    }

    try {
      const feedback = await api.put(`/profile/${userId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setEditing(false);
      toast.success(feedback.data.message);
      const response = await api.get(`/profile/${userId}`);
      setUserData(response.data);
      setPreview(response.data.profile_pics);
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Failed to update profile data. Please try again later.';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="my-4">
      {loading ? (
        <div className="d-flex justify-content-center">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : (
        <Card className="shadow-lg border-0">
          <Card.Body>
            <div className="d-flex align-items-center mb-4">
              <img
                src={preview || userData.profile_pics || ProfilePlaceholder}
                alt="User Profile Picture"
                className="rounded-circle me-3"
                style={{
                  minWidth: '150px',
                  width: '150px',
                  height: '150px',
                  objectFit: 'cover',
                  border: '5px solid #052c65',
                }}
              />
              <div className="flex-grow-1">
                <h2 style={{ color: '#052c65', fontWeight: '600' }}>{userData.name}</h2>
                <p className="text-muted text-truncate w-75">{userData.email}</p>
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
                    <Button variant="danger" onClick={handleDeleteProfilePicture}>
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
                <p><strong>Phone Number:</strong> {userData.phone_number}</p>
                <p><strong>Date of Birth:</strong> {formatDate(userData.birthday)}</p>
                {String(userId) === String(loggedInUserId) ? (
                  <Button variant="primary" onClick={() => setEditing(true)}>
                    Edit Profile
                  </Button>
                ) : (
                  <Button variant="gold" onClick={() => {/* handle send message logic */}}>
                    Send Message
                  </Button>
                )}
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
                        isInvalid={!!errors.name}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.name}
                      </Form.Control.Feedback>
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
                        isInvalid={!!errors.email}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.email}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Phone Number</Form.Label>
                      <Form.Control
                        type="tel"
                        name="phone_number"
                        value={userData.phone_number}
                        onChange={handleInputChange}
                        isInvalid={!!errors.phone_number}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.phone_number}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Date of Birth</Form.Label>
                      <Form.Control
                        type="date"
                        name="birthday"
                        value={userData.birthday}
                        onChange={handleInputChange}
                        isInvalid={!!errors.birthday}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.birthday}
                      </Form.Control.Feedback>
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
                    isInvalid={!!errors.address}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.address}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Bio</Form.Label>
                  <Form.Control
                    as="textarea"
                    name="bio"
                    value={userData.bio}
                    onChange={handleInputChange}
                    isInvalid={!!errors.bio}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.bio}
                  </Form.Control.Feedback>
                </Form.Group>
                <Button type="submit" variant="success" className="me-2">
                  Save Changes
                </Button>
                <Button variant="secondary" onClick={() => setEditing(false)}>
                  Cancel
                </Button>
              </Form>
            )}
          </Card.Body>
        </Card>
      )}
    </Container>
  );
};

export default Profile;
