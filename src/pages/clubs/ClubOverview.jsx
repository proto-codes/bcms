import React, { useState, useEffect } from 'react';
import { Card, Button, ListGroup, Modal, Spinner, Form, FloatingLabel, Dropdown } from 'react-bootstrap';
import { MdEdit, MdDelete, MdArrowBack, MdSettings } from 'react-icons/md';
import { IoPersonRemove } from "react-icons/io5";
import { GrUpdate } from "react-icons/gr";
import { toast } from 'react-toastify';
import { Link, useParams } from 'react-router-dom';
import Events from '../../components/Events';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

const ClubOverview = () => {
  const { clubId } = useParams();  
  const { userId: loggedInUserId } = useAuth();
  const [clubData, setClubData] = useState(null);
  const [formData, setFormData] = useState({
    img: '',
    name: '',
    description: '',
    goals: '',
    membershipCriteria: '',
    isPrivate: false,
  });
  const [newDiscussion, setNewDiscussion] = useState({
    title: '',
    content: '',
  }); 
  const [newMember, setNewMember] = useState({
    name: '',
    role: 'member',
  });  
  const [members, setMembers] = useState([]);
  const [discussions, setDiscussions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newClubImage, setNewClubImage] = useState(null);
  const [showEditClubModal, setShowEditClubModal] = useState(false);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [showCreateDiscussionModal, setShowCreateDiscussionModal] = useState(false);
  const [editDiscussion, setEditDiscussion] = useState(null);
  const [showEditDiscussionModal, setShowEditDiscussionModal] = useState(false);

  const MAX_IMG_SIZE = 16 * 1024 * 1024; // 16MB in bytes

  const fetchClubData = async () => {
    setLoading(true);
    try {
      const { data: { club, members, discussions } } = await api.get(`/clubs/${clubId}`);
      setClubData(club);
      setMembers(members);
      setDiscussions(discussions);
    } catch (err) {
      setError('Failed to fetch club data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClubData();
  }, [clubId]);

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
        setNewClubImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditClub = () => {
    setFormData({
      img: newClubImage || '',
      name: clubData?.name || '',
      description: clubData?.description || '',
      goals: clubData?.goals || '',
      membershipCriteria: clubData?.membership_criteria || '',
      isPrivate: clubData?.is_private || false,
    });
    setNewClubImage(null);
    setShowEditClubModal(true);
  };

  const handleSaveClub = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.put(`/clubs/${clubId}`, formData);
      toast.success(response.data.message);
      fetchClubData();
      setShowEditClubModal(false);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to update club.');
    } finally {
      setLoading(false);
    }
  };

  const imagePreview = newClubImage
    ? newClubImage
    : clubData?.img
    ? `data:image/png;base64,${clubData.img}`
    : null;

  const handleJoinClub = async () => {
    setLoading(true);
    try {
      const response = await api.post(`/clubs/${clubId}/join`);
      toast.success(response.data.message);
      fetchClubData();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to join the club.');
    } finally {
      setLoading(false);
    }
  };

  const handleLeaveClub = async () => {
    setLoading(true);
    try {
      const response = await api.post(`/clubs/${clubId}/leave`);
      toast.success(response.data.message);
      fetchClubData();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to leave the club.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClub = async () => {
    setLoading(true);
    try {
      await api.delete(`/clubs/${clubId}`);
      toast.success('Club deleted successfully.');
      window.location.href = '/clubs';
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to delete club.');
    } finally {
      setLoading(false);
    }
  };

  const handleDiscussionInputChange = (e) => {
    const { name, value } = e.target;
    setNewDiscussion((prevDiscussion) => ({
      ...prevDiscussion,
      [name]: value,
    }));
  };

  const handleEditDiscussionInputChange = (e) => {
    const { name, value } = e.target;
    setEditDiscussion((prev) => ({
      ...prev,
      [name]: value,
    }));
  };  

  const handleCreateDiscussionSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post(`/clubs/${clubId}/discussions`, newDiscussion);
      toast.success(response.data.message);
      setShowCreateDiscussionModal(false);
      fetchClubData(); // Refresh the discussions after creating a new one
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to create discussion. Please try again.');
    }
  };  

  const handleSaveEditedDiscussion = async (e) => {
    e.preventDefault();
    try {
      const response = await api.put(`/clubs/${clubId}/discussions/${editDiscussion.id}`, editDiscussion);
      toast.success(response.data.message);
      fetchClubData(); // Refresh the discussions
      setShowEditDiscussionModal(false);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to update discussion.');
    }
  };  

  const handleDeleteDiscussion = async (discussionId) => {
    if (window.confirm('Are you sure you want to delete this discussion?')) {
      try {
        const response = await api.delete(`/clubs/${clubId}/discussions/${discussionId}`);
        toast.success(response.data.message);
        fetchClubData(); // Refresh the discussions
      } catch (err) {
        toast.error(err.response?.data?.error || 'Failed to delete discussion.');
      }
    }
  };

  const handleAddMemberInputChange = (e) => {
    const { name, value } = e.target;
    setNewMember((prevMember) => ({
      ...prevMember,
      [name]: value,
    }));
  };

  const handleAddMemberSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  try {
    const response = await api.post(`/clubs/${clubId}/add-member`, newMember);
    toast.success(response.data.message);
    fetchClubData();
    setShowAddMemberModal(false);
  } catch (err) {
    toast.error(err.response?.data?.error || 'Failed to add member.');
  } finally {
    setLoading(false);
  }
};

  if (loading) return <div className="text-center mt-4"><Spinner animation="border" role="status"><span className="visually-hidden">Loading...</span></Spinner><p>Loading club...</p></div>;

  if (error) return <div className="text-danger text-center mt-4">{error}</div>;

  return (
    <div className="container-fluid my-4">
      <Button variant="outline-dark" className="mb-3" as={Link} to="/clubs">
        <MdArrowBack size={20} />
      </Button>

      {clubData && (
        <Card className="mb-4">
          <Card.Body>
            <div className="d-flex gap-2 mb-3">
              <img src={imagePreview || '/club-placeholder.png'} alt={clubData.name} className="rounded-circle" style={{ width: 100, height: 100 }} />
              <div className="d-flex flex-column justify-content-center">
                <h3 className="mb-0">{clubData.name}</h3>
                <small className="text-muted">{clubData.is_private ? 'Private' : 'Public'}</small>
              </div>
            </div>
            {clubData.description && (
              <>
                <Card.Title>Description</Card.Title>
                <Card.Text>{clubData.description}</Card.Text>
              </>
            )}
            {clubData.goals && (
              <>
                <Card.Title>Goals</Card.Title>
                <Card.Text>{clubData.goals}</Card.Text>
              </>
            )}
            {clubData.membership_criteria && (
              <>
                <Card.Title>Membership Criteria</Card.Title>
                <Card.Text>{clubData.membership_criteria}</Card.Text>
              </>
            )}
            {loggedInUserId === clubData.created_by ? (
              <>
                <Button variant="outline-dark" className="me-2" onClick={handleEditClub}>Edit Club</Button>
                <Button variant="outline-danger" onClick={handleDeleteClub}>Delete Club</Button>
              </>
            ) : members.some(member => member.id === loggedInUserId) ? (
              members.filter(member => member.id === loggedInUserId).map(member =>
                member.status === 'approved' ? (
                  <Button key={member.id} variant="outline-danger" onClick={handleLeaveClub}>Leave</Button>
                ) : member.status === 'pending' ? (
                  <Button key={member.id} variant="outline-danger" onClick={handleLeaveClub}>Cancel Request</Button>
                ) : null
              )
            ) : (
              <Button variant="outline-gold" onClick={handleJoinClub}>{clubData.is_private ? 'Request to Join' : 'Join'}</Button>
            )}
          </Card.Body>
        </Card>
      )}

      {clubData && members.some(member => member.id === loggedInUserId && member.status === 'approved') && (
        <>
          <ListGroup className="mb-4">
            <ListGroup.Item className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Discussions</h5>
              {loggedInUserId === clubData.created_by && (
                <Button variant="outline-dark" size='sm' onClick={() => { setNewDiscussion({ title: '', content: '' });setEditDiscussion(null);setShowCreateDiscussionModal(true);}}>Create Discussion</Button>
              )}
            </ListGroup.Item>
            {discussions.map((discussion) => (
              <ListGroup.Item key={discussion.id} className="d-flex justify-content-between align-items-center gap-2">
                <div>
                  <h6>{discussion.title}</h6>
                  <p className="mb-0">{discussion.content}</p>
                </div>
                <div className='d-flex align-items-center gap-2'>
                  {(loggedInUserId === discussion.created_by) && (
                    <Dropdown align="end">
                      <Dropdown.Toggle variant="outline-dark" size="sm" id="dropdown-custom-components">
                        <MdSettings size={20} />
                      </Dropdown.Toggle>

                      <Dropdown.Menu>
                        <Dropdown.Item as="button" className='d-flex align-items-center gap-2' onClick={() => { setEditDiscussion(discussion); setShowEditDiscussionModal(true);}} title="Edit discussion">
                          <MdEdit size={20} /> Edit
                        </Dropdown.Item>
                        <Dropdown.Item as="button" className='text-danger d-flex align-items-center gap-2' onClick={() => handleDeleteDiscussion(discussion.id)} title="Delete discussion">
                          <MdDelete size={20} /> Delete
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  )}
                  <Button variant="outline-purple" size='sm' as={Link} to={`/discussion/${discussion.id}`}>View</Button>
                </div>
              </ListGroup.Item>
            ))}
          </ListGroup>

          <ListGroup className="mb-4">
            <ListGroup.Item className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Members</h5>
              {loggedInUserId === clubData.created_by && (
                <Button variant="outline-dark" size="sm" onClick={() => {setNewMember({name: '', role: 'member'}); setShowAddMemberModal(true)}}>
                  Add Member
                </Button>
              )}
            </ListGroup.Item>
            {members
              .map((member) => ({
                ...member,
                priority: member.id === clubData.created_by
                  ? 0 // Super admin has the highest priority
                  : member.role === 'admin'
                  ? 1
                  : member.role === 'club leader'
                  ? 2
                  : 3, // Members have the lowest priority
              }))
              .sort((a, b) => a.priority - b.priority) // Sort by priority
              .map((member) => (
                <ListGroup.Item key={member.id} className="d-flex justify-content-between align-items-center">
                  <div>
                    {member.name} - <strong>
                      {member.id === clubData.created_by
                        ? 'Super admin'
                        : member.role.charAt(0).toUpperCase() + member.role.slice(1)}
                    </strong>
                  </div>

                  {member.id !== clubData.created_by && (
                    <div>
                      {(loggedInUserId === clubData.created_by) && (
                        <Dropdown align="end">
                          <Dropdown.Toggle variant="outline-dark" size="sm" id="dropdown-custom-components">
                            <MdSettings size={20} />
                          </Dropdown.Toggle>

                          <Dropdown.Menu>
                            <Dropdown.Item as="button" className='d-flex align-items-center gap-2' onClick={() => handleEditMember(member.id)} title="Change role">
                              <GrUpdate size={20} /> Change role
                            </Dropdown.Item>
                            <Dropdown.Item as="button" className='text-danger d-flex align-items-center gap-2' onClick={() => handleRemoveMember(member.id)} title="Remove member">
                              <IoPersonRemove size={20} /> Remove member
                            </Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                      )}
                    </div>
                  )}
                </ListGroup.Item>
              ))}
          </ListGroup>

          <Events clubId={clubId} loggedInUserId={loggedInUserId} />
        </>
      )}

      <Modal show={showEditClubModal} onHide={() => setShowEditClubModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Club</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSaveClub}>
            <Form.Group controlId="image" className="mb-3">
              <Form.Label>Upload Image</Form.Label>
              <Form.Control type="file" onChange={handleImageChange} accept="image/*" />
              {imagePreview && <img src={imagePreview} alt="Preview" className="mt-2 object-fit-cover" style={{ width: '100%', maxHeight: '200px' }} />}
            </Form.Group>
            <FloatingLabel controlId="name" label="Club Name" className="mb-3">
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </FloatingLabel>
            <FloatingLabel controlId="description" label="Description" className="mb-3">
              <Form.Control
                as="textarea"
                name="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
              />
            </FloatingLabel>
            <FloatingLabel controlId="goals" label="Goals" className="mb-3">
              <Form.Control
                as="textarea"
                name="goals"
                value={formData.goals}
                onChange={(e) => setFormData({ ...formData, goals: e.target.value })}
              />
            </FloatingLabel>
            <FloatingLabel controlId="membershipCriteria" label="Membership Criteria" className="mb-3">
              <Form.Control
                as="textarea"
                name="membershipCriteria"
                value={formData.membershipCriteria}
                onChange={(e) => setFormData({ ...formData, membershipCriteria: e.target.value })}
              />
            </FloatingLabel>
            <Form.Group controlId="isPrivate" className="mb-3">
              <Form.Check
                type="checkbox"
                label="Private Club"
                checked={formData.isPrivate}
                onChange={() => setFormData({ ...formData, isPrivate: !formData.isPrivate })}
              />
            </Form.Group>
            <Button variant="outline-gold" type="submit">Save</Button>
          </Form>
        </Modal.Body>
      </Modal>

      <Modal show={showCreateDiscussionModal || showEditDiscussionModal} onHide={() => { setShowCreateDiscussionModal(false); setShowEditDiscussionModal(false); }}>
        <Modal.Header closeButton>
          <Modal.Title>{editDiscussion ? 'Edit Discussion' : 'Create New Discussion'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={editDiscussion ? handleSaveEditedDiscussion : handleCreateDiscussionSubmit}>
            <FloatingLabel controlId="discussionTitle" label="Title" className="mb-3">
              <Form.Control
                type="text"
                name="title"
                value={editDiscussion ? editDiscussion.title : newDiscussion.title}
                onChange={editDiscussion ? handleEditDiscussionInputChange : handleDiscussionInputChange}
                required
              />
            </FloatingLabel>
            <FloatingLabel controlId="discussionContent" label="Content" className="mb-3">
              <Form.Control
                as="textarea"
                name="content"
                value={editDiscussion ? editDiscussion.content : newDiscussion.content}
                onChange={editDiscussion ? handleEditDiscussionInputChange : handleDiscussionInputChange}
                required
              />
            </FloatingLabel>
            <Button variant="outline-gold" type="submit">{editDiscussion ? 'Save Changes' : 'Create Discussion'}</Button>
          </Form>
        </Modal.Body>
      </Modal>

      <Modal show={showAddMemberModal} onHide={() => setShowAddMemberModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Member</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleAddMemberSubmit}>
            <FloatingLabel controlId="name" label="Member name" className="mb-3">
              <Form.Control
                type="name"
                name="name"
                value={newMember.name}
                onChange={handleAddMemberInputChange}
                required
              />
            </FloatingLabel>
            <Form.Group controlId="role" className="mb-3">
              <Form.Label>Role</Form.Label>
              <Form.Control
                as="select"
                name="role"
                value={newMember.role}
                onChange={handleAddMemberInputChange}
                required
              >
                <option value="member">Member</option>
                <option value="club leader">Club Leader</option>
                <option value="admin">Admin</option>
              </Form.Control>
            </Form.Group>
            <Button variant="outline-gold" type="submit" disabled={loading}>
              {loading ? 'Adding...' : 'Add Member'}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default ClubOverview;
