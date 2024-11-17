import React, { useState, useEffect } from 'react';
import { Card, Button, ListGroup, Modal, Spinner, Form, FloatingLabel } from 'react-bootstrap';
import { MdEdit, MdArrowBack } from 'react-icons/md';
import { toast } from 'react-toastify';
import { Link, useParams } from 'react-router-dom';
import Events from '../../components/Events';
import api from '../../api/axios';

const ClubOverview = () => {
  const { clubId } = useParams();
  const [clubData, setClubData] = useState(null);
  const [members, setMembers] = useState([]);
  const [discussions, setDiscussions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editedClubData, setEditedClubData] = useState({
    name: '', description: '', goals: '', membershipCriteria: '', isPrivate: false
  });
  const [newClubImage, setNewClubImage] = useState(null);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [showDiscussionModal, setShowDiscussionModal] = useState(false);

  const fetchClubData = async () => {
    try {
      setLoading(true);
      const { data: { club, members, discussions } } = await api.get(`/clubs/${clubId}`);
      setClubData(club);
      setMembers(members);
      setDiscussions(discussions);
    } catch (err) {
      setError('Failed to fetch club data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchClubData(); }, [clubId]);

  const handleImageChange = (e) => setNewClubImage(e.target.files[0]);

  const handleSaveClub = async () => {
    const formData = new FormData();
    Object.keys(editedClubData).forEach(key => formData.append(key, editedClubData[key]));
    if (newClubImage) formData.append('image', newClubImage);

    try {
      await api.put(`/clubs/${clubId}`, formData);
      fetchClubData();
      toast.success('Club updated successfully');
    } catch {
      toast.error('Failed to update club');
    }
  };

  const handleEditClub = () => {
    setEditedClubData({
      name: clubData.name || '',
      description: clubData.description || '',
      goals: clubData.goals || '',
      membershipCriteria: clubData.membershipCriteria || '',
      isPrivate: clubData.isPrivate || false,
    });
    setNewClubImage(null); // Reset the image input
    setShowDiscussionModal(true);
  };

  const imagePreview = newClubImage 
  ? URL.createObjectURL(newClubImage) 
  : clubData?.img 
  ? `data:image/png;base64,${clubData.img}` 
  : null;
  
  const handleJoinClub = async () => {
    try {
      await api.post(`/clubs/${clubId}/join`);
      fetchClubData(); // Refresh the club data
      toast.success('Joined the club successfully');
    } catch {
      toast.error('Failed to join the club');
    }
  };
  
  const handleLeaveClub = async () => {
    try {
      await api.post(`/clubs/${clubId}/leave`);
      fetchClubData(); // Refresh the club data
      toast.success('Left the club successfully');
    } catch {
      toast.error('Failed to leave the club');
    }
  };
  
  const handleDeleteClub = async () => {
    try {
      await api.delete(`/clubs/${clubId}`);
      toast.success('Club deleted successfully');
      // Redirect to a different page after deletion
      window.location.href = '/manage';
    } catch {
      toast.error('Failed to delete club');
    }
  }; 

  if (loading) return <Spinner animation="border" role="status"><span className="visually-hidden">Loading...</span></Spinner>;
  if (error) return <div className="text-danger">{error}</div>;

  return (
    <div className="container-fluid my-4">
    {/* Back Button */}
    <Button variant="outline-dark" className="mb-3" as={Link} to='/manage'>
      <MdArrowBack size={20} />
    </Button>

      {clubData && (
        <Card className="mb-4">
          <Card.Body>
            <div className="d-flex gap-2 mb-3">
              <img src={clubData.img ? `data:image/png;base64,${clubData.img}` : '/club-placeholder.png'} alt={clubData.name} className="rounded-circle" style={{ width: 100, height: 100 }} />
              <div className="d-flex flex-column justify-content-center">
                <h3 className="mb-0">{clubData.name}</h3>
                <small className="text-muted">{clubData.isPrivate ? 'Private' : 'Public'}</small>
              </div>
            </div>
            <Card.Title>Description</Card.Title>
            <Card.Text>{clubData.description}</Card.Text>
            <Card.Title>Goals</Card.Title>
            <Card.Text>{clubData.goals}</Card.Text>
            <Card.Title>Membership Criteria</Card.Title>
            <Card.Text>{clubData.membershipCriteria}</Card.Text>
            <Button variant="outline-dark" className="me-2" onClick={handleEditClub}>Edit Club</Button>
            <Button variant="outline-danger" className="me-2" onClick={handleDeleteClub} disabled={loading}>Delete club</Button>
            {clubData.members === 'approved' ? (
              <Button variant="outline-danger" onClick={handleLeaveClub} disabled={loading}>Leave</Button>
            ) : clubData.members === 'pending' ? (
              <Button variant="outline-danger" onClick={handleLeaveClub} disabled={loading}>Cancel</Button>
            ) : (
              <Button variant="outline-gold" onClick={handleJoinClub} disabled={loading}>{clubData.isPrivate ? 'Request to Join' : 'Join'}</Button>
            )}
          </Card.Body>
        </Card>
      )}

      <ListGroup className="mb-4">
        <ListGroup.Item className="d-flex justify-content-between align-items-center"><h5 className="mb-0">Discussions</h5><Button variant="outline-dark" size="sm">Create discussion</Button></ListGroup.Item>
        {discussions.map(d => (
          <ListGroup.Item key={d.id}>
            <h6>{d.title}</h6>
            <p>{d.content}</p>
            <div className="d-flex gap-2">
              <Button variant="outline-dark" onClick={() => setShowDiscussionModal(true)}><MdEdit /></Button>
              <Button variant="outline-danger" onClick={() => toast.success('Discussion deleted')}>Delete</Button>
              <Button variant="outline-info" as={Link} to={`/discussion/${d.id}`}>View</Button>
            </div>
          </ListGroup.Item>
        ))}
      </ListGroup>

      <ListGroup className="mb-4">
        <ListGroup.Item className="d-flex justify-content-between align-items-center"><h5 className="mb-0">Members</h5><Button variant="outline-dark" size="sm" onClick={() => setShowAddMemberModal(true)}>Add member</Button></ListGroup.Item>
        {members.map(m => <ListGroup.Item key={m.id}>{m.name} - <strong>{m.role}</strong></ListGroup.Item>)}
      </ListGroup>

      <Events />

      <Modal show={showAddMemberModal} onHide={() => setShowAddMemberModal(false)}>
        <Modal.Header closeButton><Modal.Title>Add New Member</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form onSubmit={(e) => e.preventDefault()}>
            <Form.Control placeholder="Name" className="mb-3" />
            <Form.Control as="select" defaultValue="Member" className="mb-3">
              <option value="Member">Member</option>
              <option value="Leader">Leader</option>
              <option value="Admin">Admin</option>
            </Form.Control>
            <Button variant="outline-gold" type="submit">Add Member</Button>
          </Form>
        </Modal.Body>
      </Modal>

      <Modal show={showDiscussionModal} onHide={() => setShowDiscussionModal(false)}>
        <Modal.Header closeButton><Modal.Title>Edit Club</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form onSubmit={(e) => { e.preventDefault(); handleSaveClub(); }}>
            <Form.Group controlId="image" className="mb-3">
              <Form.Label>Upload Image</Form.Label>
              <Form.Control type="file" onChange={handleImageChange} accept="image/*" />
              {imagePreview && <img src={imagePreview} alt="Preview" className="mt-2 object-fit-cover" style={{ width: '100%', maxHeight: '200px' }} />}
            </Form.Group>
            <FloatingLabel controlId="name" label="Club Name" className="mb-3">
              <Form.Control type="text" value={editedClubData.name} onChange={(e) => setEditedClubData({ ...editedClubData, name: e.target.value })} required />
            </FloatingLabel>
            <FloatingLabel controlId="description" label="Description" className="mb-3">
              <Form.Control as="textarea" rows={3} value={editedClubData.description} onChange={(e) => setEditedClubData({ ...editedClubData, description: e.target.value })} required />
            </FloatingLabel>
            <FloatingLabel controlId="goals" label="Goals" className="mb-3">
              <Form.Control as="textarea" rows={2} value={editedClubData.goals} onChange={(e) => setEditedClubData({ ...editedClubData, goals: e.target.value })} />
            </FloatingLabel>
            <FloatingLabel controlId="membershipCriteria" label="Membership Criteria" className="mb-3">
              <Form.Control as="textarea" rows={2} value={editedClubData.membershipCriteria} onChange={(e) => setEditedClubData({ ...editedClubData, membershipCriteria: e.target.value })} />
            </FloatingLabel>
            <Form.Check type="checkbox" label="Private Club" className="mb-3" checked={editedClubData.isPrivate} onChange={(e) => setEditedClubData({ ...editedClubData, isPrivate: e.target.checked })} />
            <Button variant="outline-gold" type="submit">Save Changes</Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default ClubOverview;
