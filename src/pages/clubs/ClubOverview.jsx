import React, { useState } from 'react';
import { Card, Button, Form, ListGroup, Modal } from 'react-bootstrap';
import { MdArrowBack, MdEdit, MdDelete } from 'react-icons/md';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import Events from '../../components/Events'

const ClubOverview = () => {
  const [isDescriptionVisible, setIsDescriptionVisible] = useState(true);
  const [showDiscussionModal, setShowDiscussionModal] = useState(false);
  const [discussionTitle, setDiscussionTitle] = useState('');
  const [discussionContent, setDiscussionContent] = useState('');
  const [currentDiscussionId, setCurrentDiscussionId] = useState(null);

  // Dummy data for club info, members, discussions, and events
  const clubData = {
    name: 'Photography Club',
    description: 'A club for photography enthusiasts to share tips and collaborate on photo projects.',
    goals: 'To create a community of passionate photographers who share their knowledge and art.',
  };

  const members = [
    { id: 1, name: 'John Doe', role: 'Admin' },
    { id: 2, name: 'Jane Smith', role: 'Club Leader' },
    { id: 3, name: 'Sam Wilson', role: 'Member' },
  ];

  const [discussions, setDiscussions] = useState([
    { id: 1, title: 'Best Camera for Beginners?', content: 'Let’s discuss the best cameras for beginners in photography.' },
    { id: 2, title: 'Editing Tips and Tricks', content: 'What are your favorite editing techniques?' },
  ]);

  // Toggle between description and chat (discussion area)
  const toggleDescription = () => {
    setIsDescriptionVisible(!isDescriptionVisible);
  };

  // Create or Edit discussion (triggered by Admin/Club Leader)
  const handleCreateOrEditDiscussion = (e) => {
    e.preventDefault();
    if (discussionTitle.trim() === '' || discussionContent.trim() === '') {
      toast.error('Title and content are required to create or edit a discussion');
      return;
    }

    if (currentDiscussionId) {
      // Edit existing discussion
      const updatedDiscussions = discussions.map((discussion) =>
        discussion.id === currentDiscussionId
          ? { ...discussion, title: discussionTitle, content: discussionContent }
          : discussion
      );
      setDiscussions(updatedDiscussions);
      toast.success('Discussion updated successfully');
    } else {
      // Create new discussion
      setDiscussions([
        ...discussions,
        { id: discussions.length + 1, title: discussionTitle, content: discussionContent },
      ]);
      toast.success('Discussion created successfully');
    }

    setDiscussionTitle('');
    setDiscussionContent('');
    setShowDiscussionModal(false);
    setCurrentDiscussionId(null); // Reset editing state
  };

  // Delete discussion
  const handleDeleteDiscussion = (id) => {
    const updatedDiscussions = discussions.filter((discussion) => discussion.id !== id);
    setDiscussions(updatedDiscussions);
    toast.success('Discussion deleted successfully');
  };

  return (
    <div className="position-relative mt-4">
      <h3 className="mb-4">{clubData.name} - Overview</h3>

      {/* Club Description */}
      {isDescriptionVisible ? (
        <Card className="mb-4">
          <Card.Body>
            <Card.Title>Description</Card.Title>
            <Card.Text>{clubData.description}</Card.Text>
            <Card.Title>Goals</Card.Title>
            <Card.Text>{clubData.goals}</Card.Text>
        
            {/* Toggle to Discussions */}
            <Button variant="outline-dark" onClick={toggleDescription}>
              View discussion
            </Button>
          </Card.Body>
        </Card>
      ) : (
        <div>
          {/* Discussion Area */}
          <ListGroup className="mb-4">
            <ListGroup.Item className="d-flex gap-2 align-items-center">
              <Button variant="outline-dark" onClick={toggleDescription} size="sm" title="Back to Description">
                <MdArrowBack size={20} />
              </Button>
              <h5 className="mb-0">Discussions</h5>
            </ListGroup.Item>
            {discussions.map((discussion) => (
              <ListGroup.Item key={discussion.id} className="d-flex justify-content-between align-items-center">
                <div>
                  <h6>{discussion.title}</h6>
                  <p className='mb-0'>{discussion.content}</p>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <Button
                    variant="outline-dark"
                    size="sm"
                    title="Edit discussion"
                    onClick={() => {
                      setDiscussionTitle(discussion.title);
                      setDiscussionContent(discussion.content);
                      setCurrentDiscussionId(discussion.id);
                      setShowDiscussionModal(true);
                    }}
                  >
                    <MdEdit size={20} />
                  </Button>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    title="Delete discussion"
                    onClick={() => handleDeleteDiscussion(discussion.id)}
                  >
                    <MdDelete size={20} />
                  </Button>
                  <Button variant="outline-gold" as={Link} to={`/discussion/${discussion.id}`} size="sm" title="View discussion">
                    View
                  </Button>
                </div>
              </ListGroup.Item>
            ))}

            {/* Only show the Create/Edit button to Admin/Club Leader */}
            {(members[0].role === 'Admin' || members[1].role === 'Club Leader') && (
              <ListGroup.Item>
                <Button variant="outline-dark" onClick={() => setShowDiscussionModal(true)} size="sm" title="Create discussion">
                  Create discussion
                </Button>
              </ListGroup.Item>
            )}
          </ListGroup>
        </div>
      )}

      {/* Member List with Roles */}
      <ListGroup className="mb-4">
        <ListGroup.Item className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Members</h5>
          <Button variant="outline-dark" size="sm" title="Add new member">
            Add member
          </Button>
        </ListGroup.Item>
        {members.map((member) => (
          <ListGroup.Item key={member.id} className="d-flex justify-content-between align-items-center">
            <div>
              {member.name} - <strong>{member.role}</strong>
            </div>
            {/* Conditionally render the Remove button for non-admin members */}
            {member.role !== 'Admin' && (
              <Button
                variant="outline-danger"
                size="sm"
                onClick={() => handleRemoveMember(member.id)}
                title="Remove member"
              >
                <MdDelete size={20} />
              </Button>
            )}
          </ListGroup.Item>
        ))}
      </ListGroup>

      {/* Events */}
      <Events />

      {/* Modal for Creating or Editing Discussions */}
      <Modal show={showDiscussionModal} onHide={() => setShowDiscussionModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{currentDiscussionId ? 'Edit discussion' : 'Create discussion'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleCreateOrEditDiscussion}>
            <div className="form-floating mb-3">
              <Form.Control
                type="text"
                id="discussionTitle"
                placeholder="Enter discussion title"
                value={discussionTitle}
                onChange={(e) => setDiscussionTitle(e.target.value)}
                required
              />
              <label htmlFor="discussionTitle">Title</label>
            </div>
            <div className="form-floating mb-3">
              <Form.Control
                as="textarea"
                id="discussionContent"
                rows={3}
                placeholder="Enter discussion content"
                value={discussionContent}
                onChange={(e) => setDiscussionContent(e.target.value)}
                required
              />
              <label htmlFor="discussionContent">Content</label>
            </div>
            <Button variant="primary" type="submit" className="mt-3">
              {currentDiscussionId ? 'Update' : 'Create'}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default ClubOverview;
