import React, { useState, useEffect } from 'react';
import { Form, Button, ListGroup, FloatingLabel, Modal } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

const ClubManage = () => {
  const [formData, setFormData] = useState({
    img: '',
    name: '',
    description: '',
    isPrivate: false,
  });
  const { userId: loggedInUserId } = useAuth();
  const [imagePreview, setImagePreview] = useState(null);
  const [clubs, setClubs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const MAX_IMG_SIZE = 16 * 1024 * 1024; // 16MB in bytes

  const fetchClubs = async () => {
    setLoading(true);
    try {
      const response = await api.get('/clubs');
      const sortedClubs = response.data
        .map((club) => ({
          ...club,
          img: club.img ? `data:image/png;base64,${club.img}` : '/club-placeholder.png',
        }))
        .sort((a, b) => (a.created_by === loggedInUserId ? -1 : b.created_by === loggedInUserId ? 1 : 0)); // Sort owned clubs to top
  
      setClubs(sortedClubs);
    } catch (error) {
      toast.error(error.response?.data?.error || 'Error fetching clubs!');
    } finally {
      setLoading(false);
    }
  };  

  useEffect(() => {
    fetchClubs();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > MAX_IMG_SIZE) {
        toast.error('Image size should be less than 16MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result.split(',')[1];
        setFormData((prevData) => ({
          ...prevData,
          img: base64String,
        }));
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.post('/clubs', formData);
      fetchClubs();
      toast.success(response.data.message);
      setShowModal(false);
      setFormData({ img: '', name: '', description: '', isPrivate: false });
      setImagePreview(null);
    } catch (error) {
      toast.error(error.response?.data?.error || 'Error saving club data!');
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = async (clubId, isPrivate) => {
    setLoading(true);
    try {
      const response = await api.post(`/clubs/${clubId}/join`);
      toast.success(response.data.message);
      fetchClubs();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Error joining club!');
    } finally {
      setLoading(false);
    }
  };

  const handleLeaveClub = async (clubId) => {
    setLoading(true);
    try {
      const response = await api.post(`/clubs/${clubId}/leave`);
      toast.info(response.data.message);
      fetchClubs();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Error leaving club!');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateClub = () => {
    setShowModal(true);
  };

  const filteredClubs = clubs.filter((club) => club.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="container-fluid my-4">
      <Button variant="outline-gold" onClick={handleCreateClub} className="mb-4">Create a New Club</Button>
      <div>
        <h5>Available Clubs</h5>
        <Form.Group controlId="search" className="mb-3">
          <Form.Control type="text" placeholder="Search for a club..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </Form.Group>

        {loading ? (
          <p>
            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
            Loading clubs...
          </p>
        ) : (
          <ListGroup>
            {filteredClubs.length > 0 ? (
              filteredClubs.map((club) => (
                <ListGroup.Item key={club.id} className="mb-3 p-3 d-flex justify-content-between align-items-center border rounded">
                  <div className="d-flex align-items-center">
                    <img src={club.img} alt={club.name} className="rounded-circle" style={{ width: '80px', height: '80px' }} />
                    <div className="ms-3">
                      <h6 className='mb-0'>{club.name}</h6>
                      <p className='mb-0'>{club.description}</p>
                      <small>{club.is_private ? 'Private' : 'Public'}</small>
                    </div>
                  </div>
                  <div>
                    <Button variant="outline-purple" as={Link} to={`/${club.id}/${club.name.toLowerCase()}/overview`}>View</Button>
                  </div>
                </ListGroup.Item>
              ))
            ) : (
              <p>No clubs match your search.</p>
            )}
          </ListGroup>
        )}
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Create New Club</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>            
            <Form.Group controlId="image" className="mb-3">
              <Form.Label>Upload Image</Form.Label>
              <Form.Control type="file" onChange={handleImageChange} accept="image/*" />
              {imagePreview && <img src={imagePreview} alt="Preview" className="mt-2 object-fit-cover" style={{ width: '100%', maxHeight: '200px' }} />}
            </Form.Group>
            <Form.Group controlId="name" className="mb-3">
              <FloatingLabel label="Club Name">
                <Form.Control type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Enter club name" required />
              </FloatingLabel>
            </Form.Group>
            <Form.Group controlId="description" className="mb-3">
              <FloatingLabel label="Description">
                <Form.Control as="textarea" name="description" value={formData.description} onChange={handleChange} placeholder="Enter description" required />
              </FloatingLabel>
            </Form.Group>
            <Form.Group controlId="isPrivate" className="mb-3">
              <Form.Check type="checkbox" name="isPrivate" label="Private" checked={formData.isPrivate} onChange={handleChange} />
            </Form.Group>
            <Button type="submit" variant="gold" disabled={loading}>{loading ? 'Creating...' : 'Create Club'}</Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default ClubManage;
