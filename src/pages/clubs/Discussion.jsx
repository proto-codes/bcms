import React, { useState, useEffect, useRef } from 'react';
import { Button, Form, Card, Spinner } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useParams, useNavigate } from 'react-router-dom';
import { MdArrowBack, MdSend } from 'react-icons/md';

const Discussion = () => {
  const { discussionId } = useParams();
  const navigate = useNavigate();
  const [discussion, setDiscussion] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const fetchDiscussion = () => {
      const discussionData = {
        id: discussionId,
        title: 'Best Camera for Beginners?',
        content: 'Let’s discuss the best cameras for beginners in photography.',
      };
      setDiscussion(discussionData);
      setMessages([
        { id: 1, sender: 'John Doe', content: 'I think the Nikon D3500 is a great option for beginners.', timestamp: '12:30 PM' },
        { id: 2, sender: 'Jane Smith', content: 'I prefer the Canon EOS Rebel T7 for its ease of use.', timestamp: '12:32 PM' },
      ]);
      setIsLoading(false);
    };
    fetchDiscussion();
  }, [discussionId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() === '') {
      toast.error('Message cannot be empty');
      return;
    }
    const newMsg = { sender: 'User', content: newMessage, timestamp: new Date().toLocaleTimeString() };
    setMessages((prevMessages) => [...prevMessages, newMsg]);
    setNewMessage('');
    toast.success('Message sent!');
  };

  const handleBackToClub = () => {
    navigate('/clubs/overview');
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  if (isLoading) {
    return (
      <div className="text-center mt-4">
        <Spinner animation="border" variant="primary" />
        <p>Loading discussion...</p>
      </div>
    );
  }

  return (
    <div className="h-100 container position-relative py-4">
      {/* Back Button */}
      <Button
        variant="outline-dark"
        onClick={handleBackToClub}
        className="mb-3 d-flex align-items-center gap-2"
      >
        <MdArrowBack size={20} /> Back to Club Overview
      </Button>

      {/* Discussion Title & Content */}
      <Card className="mb-3">
        <Card.Body>
          <Card.Title>{discussion?.title}</Card.Title>
          <Card.Text>{discussion?.content}</Card.Text>
        </Card.Body>
      </Card>

      {/* Messages Section */}
      <div className="overflow-y-auto" style={{ maxHeight: '55%' }}>
        {messages.map((message, index) => (
          <div
            key={message.id}
            style={{
              display: 'flex',
              flexDirection: message.sender === 'User' ? 'row-reverse' : 'row',
              marginBottom: '10px',
            }}
          >
            <div
              className="message-bubble"
              style={{
                backgroundColor: message.sender === 'User' ? '#dcf8c6' : '#f1f1f1',
                padding: '10px 15px',
                borderRadius: '20px',
                maxWidth: '70%',
                wordBreak: 'break-word',
              }}
            >
              <strong>{message.sender}</strong>: {message.content}
              <div style={{ fontSize: '0.8em', color: '#888' }}>{message.timestamp}</div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} /> {/* Scroll to the latest message */}
      </div>

      {/* New Message Input */}
      <div className="position-absolute bottom-0 start-0 end-0 bg-body z-3">
        <Card className="mb-0">
          <Card.Body>
            <Form onSubmit={handleSendMessage} className="d-flex align-items-center">
              <Form.Group controlId="newMessage" style={{ flex: 1 }}>
                <Form.Control
                  as="textarea"
                  rows={1}
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message here"
                  required
                  style={{
                    resize: 'none',
                    minHeight: '40px',
                    maxHeight: '120px',
                    overflowY: 'auto',
                  }}
                />
              </Form.Group>
              <Button
                variant="primary"
                type="submit"
                className="d-flex align-items-center"
                style={{ marginLeft: '10px', height: '40px' }}
              >
                <MdSend size={20} />
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

export default Discussion;
