import React, { useState, useEffect } from 'react';
import { Form, Button, Card, Container, Row, Col, Spinner } from 'react-bootstrap';
import { FaUpload, FaTrash } from 'react-icons/fa';
import { format } from 'date-fns';
import api from '../api/axios';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const Profile = () => {
  const { userId } = useParams();
  const { userId: loggedInUserId } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    bio: '',
    profile_pics: null,
    phone_number: '',
    birthday: '',
    address: ''
  });
  const [editing, setEditing] = useState(false);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  
  const fetchUserData = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/profile/${userId}`);
      setFormData({
        ...data,
        profile_pics: data.profile_pics || null
      });
      setPreview(null);
    } catch (error) {
      toast.error('Failed to fetch user data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [userId]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return isNaN(date) ? '' : format(date, "do MMMM, yyyy");
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const reader = new FileReader();

      // FileReader will convert the image into base64 when done
      reader.onloadend = () => {
        const base64String = reader.result.split(',')[1];
        setFormData((prevData) => ({
          ...prevData,
          profile_pics: base64String,
        }));
        setPreview(reader.result);
      };

      // Read the file as a data URL (base64 string)
      reader.readAsDataURL(selectedFile);
    } else {
      setPreview(null);
      setFormData((prevData) => ({
        ...prevData,
        profile_pics: null,
      }));
    }
  };

  const handleDeleteProfilePicture = () => {
    setFormData((prevData) => ({ ...prevData, profile_pics: null }));
    setPreview(null);
  };

  const validateForm = () => {
    const requiredFields = ['name', 'email', 'phone_number', 'birthday', 'address', 'bio'];
    const newErrors = requiredFields.reduce((acc, field) => {
      if (!formData[field]) acc[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required.`;
      return acc;
    }, {});
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);

    try {
      const feedback = await api.put(`/profile/${userId}`, formData, {
        headers: { 'Content-Type': 'application/json' }
      });
      setEditing(false);
      toast.success(feedback.data.message);
      fetchUserData();
      window.location.reload();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  const profileImg = formData.profile_pics ? `data:image/png;base64,${formData.profile_pics}` : '/profile-placeholder.png';

  return (
    <Container className="my-4">
      {loading ? (
        <div className="d-flex justify-content-center">
          <Spinner animation="border" variant="gold" />
        </div>
      ) : (
        <Card className="shadow-lg border-0">
          <Card.Body>
            <div className="d-flex align-items-center mb-4">
              <img
                src={preview || profileImg}
                alt="User Profile Picture"
                className="rounded-circle me-3 object-fit-cover"
                style={{ width: '150px', height: '150px', border: '5px solid #4B0082' }}
              />
              <div className="flex-grow-1">
                <h2 className='text-purple'>{formData.name}</h2>
                <p className="text-muted text-truncate w-75">{formData.email}</p>
                {editing && (
                  <div className="mt-2">
                    <label htmlFor="file-upload" className="me-2" style={{ cursor: 'pointer' }}>
                      <FaUpload size={24} color="#052c65" />
                      <input id="file-upload" type="file" onChange={handleFileChange} style={{ display: 'none' }} accept="image/*" />
                    </label>
                    <Button variant="outline-danger" onClick={handleDeleteProfilePicture}>
                      <FaTrash />
                    </Button>
                  </div>
                )}
              </div>
            </div>
            <hr />
            {!editing ? (
              <div>
                {formData.bio && <p><strong>Bio:</strong> {formData.bio}</p>}
                {formData.address && <p><strong>Address:</strong> {formData.address}</p>}
                {formData.phone_number && <p><strong>Phone Number:</strong> {formData.phone_number}</p>}
                {formData.birthday && <p><strong>Date of Birth:</strong> {formatDate(formData.birthday)}</p>}
                {String(userId) === String(loggedInUserId) ? (
                  <Button variant="outline-gold" onClick={() => setEditing(true)}>Edit Profile</Button>
                ) : (
                  <Button variant="gold" onClick={() => {/* handle send message logic */}}>Send Message</Button>
                )}
              </div>
            ) : (
              <Form onSubmit={handleFormSubmit}>
                <Row>
                  {['name', 'email', 'phone_number', 'birthday', 'address', 'bio'].map((field, idx) => (
                    <Col md={6} key={idx}>
                      <Form.Group className="mb-3">
                        <Form.Label>{field.charAt(0).toUpperCase() + field.slice(1)}</Form.Label>
                        <Form.Control
                          type={field === 'birthday' ? 'date' : field === 'email' ? 'email' : 'text'}
                          name={field}
                          value={
                            field === 'birthday'
                              ? formData[field] 
                                ? format(new Date(formData[field]), 'yyyy-MM-dd') : ''
                              : formData[field] || ''
                          }
                          onChange={handleInputChange}
                          isInvalid={!!errors[field]}
                        />
                        <Form.Control.Feedback type="invalid">{errors[field]}</Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  ))}
                </Row>
                <Button type="submit" variant="outline-purple" className="me-2">Save Changes</Button>
                <Button variant="outline-secondary" onClick={() => { setEditing(false); setPreview(null); }}>Cancel</Button>
              </Form>
            )}
          </Card.Body>
        </Card>
      )}
    </Container>
  );
};

export default Profile;
