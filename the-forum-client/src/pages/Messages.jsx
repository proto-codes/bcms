import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, ListGroup, Card } from 'react-bootstrap';

const Messages = () => {
  const [messages, setMessages] = useState([
    {
      from: 'John Doe',
      message: 'Hey! How are you?',
      timestamp: '2024-10-08T14:20:00Z',
      type: 'received',
      avatar: 'https://via.placeholder.com/50',
    },
    {
      from: 'You',
      message: 'I am good, thanks! How about you?',
      timestamp: '2024-10-08T14:21:00Z',
      type: 'sent',
      avatar: 'https://via.placeholder.com/50', // Add your avatar URL here
    },
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [selectedUser, setSelectedUser] = useState('John Doe');

  const contacts = [
    { name: 'John Doe', avatar: 'https://via.placeholder.com/50' },
    { name: 'Jane Smith', avatar: 'https://via.placeholder.com/50' },
    { name: 'Bob Johnson', avatar: 'https://via.placeholder.com/50' },
  ];

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      const timestamp = new Date().toISOString();
      setMessages([...messages, { from: 'You', message: newMessage, timestamp, type: 'sent', avatar: 'https://via.placeholder.com/50' }]);
      setNewMessage('');
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Container fluid className="my-4">
      <Row>
        {/* Sidebar for Contacts */}
        <Col md={3} className="border-end bg-light p-3">
          <h5>Contacts</h5>
          <ListGroup>
            {contacts.map((contact, index) => (
              <ListGroup.Item
                key={index}
                action
                onClick={() => setSelectedUser(contact.name)}
                active={contact.name === selectedUser}
              >
                <img src={contact.avatar} alt={contact.name} className="rounded-circle me-2" style={{ width: '40px', height: '40px' }} />
                {contact.name}
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Col>

        {/* Chat Area */}
        <Col md={9} className="d-flex flex-column" style={{ height: '80vh' }}>
          <div
            className="flex-grow-1 p-3"
            style={{
              overflowY: 'scroll',
              backgroundColor: '#f8f9fa',
              borderRadius: '5px',
              border: '1px solid #dee2e6',
            }}
          >
            <h6>Chat with {selectedUser}</h6>
            <div className="mt-4">
              {messages.map((msg, index) => (
                <div key={index} className={`d-flex mb-3 ${msg.type === 'sent' ? 'justify-content-end' : ''}`}>
                  {/* Message bubble with user avatar */}
                  <div className={`d-flex ${msg.type === 'sent' ? 'flex-row-reverse' : ''}`}>
                    <img
                      src={msg.avatar}
                      alt={msg.from}
                      className="rounded-circle me-2"
                      style={{ width: '40px', height: '40px', alignSelf: msg.type === 'sent' ? 'flex-end' : 'flex-start' }}
                    />
                    <Card className={`p-2 rounded text-white ${msg.type === 'sent' ? 'bg-blue' : 'bg-secondary'}`} style={{ maxWidth: '75%' }}>
                      <div>
                        <strong>{msg.from}</strong>{' '}
                        <span className="text-muted" style={{ fontSize: '0.8rem', color: '#e0e0e0' }}>
                          ({formatTimestamp(msg.timestamp)})
                        </span>
                      </div>
                      <div>{msg.message}</div>
                    </Card>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Message Input */}
          <Form onSubmit={handleSendMessage} className="mt-3 d-flex">
            <Form.Control
              type="text"
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="me-2"
              required
            />
            <Button type="submit" variant="blue">
              Send
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default Messages;
