import React, { useState, useEffect, useRef } from 'react';
import { Button, Form, Card, Spinner } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { MdArrowBack, MdSend } from 'react-icons/md';
import { format } from 'date-fns';
import api from '../../api/axios';

const Discussion = () => {
  const { discussionId } = useParams();
  const { userName: loggedInUserName } = useAuth();
  const navigate = useNavigate();
  const [discussion, setDiscussion] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef(null);

  const handleGoBack = () => navigate(-1);

  const fetchDiscussion = async () => {
    try {
      setIsLoading(true);
      const response = await api.get(`/discussion/${discussionId}`);
      const { discussionDetails, messages } = response.data;
      setDiscussion(discussionDetails || {});
      setMessages(messages || []);
    } catch (error) {
      console.error('Error fetching discussion data:', error);
      toast.error(error.response?.data?.error || 'Failed to load discussion');
      setDiscussion(null);
      setMessages([]);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchDiscussion();
  }, [discussionId]);

  useEffect(() => scrollToBottom(), [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (newMessage.trim() === '') {
      toast.error('Message cannot be empty');
      return;
    }
    try {
      const response = await api.post(`/discussion/${discussionId}`, { content: newMessage });
      setMessages((prevMessages) => [...prevMessages, response.data.message]);
      setNewMessage('');
      scrollToBottom();
      toast.success(response.data.message);
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error(error.response?.data?.error || 'Failed to send message');
    }
  };

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });

  if (isLoading) {
    return (
      <div className="text-center mt-4">
        <Spinner animation="border" variant="outline-gold" />
        <p>Loading discussion...</p>
      </div>
    );
  }

  const handleKeyPress = (e) => {
    // Check if the pressed key is Enter (keyCode 13)
    if (e.key === 'Enter' && !e.shiftKey) {
      handleSendMessage(e);
    }
  };

  return (
    <div className="h-100 container-fluid position-relative py-4">
      <Button variant="outline-dark" onClick={handleGoBack} className="mb-3"><MdArrowBack size={20} /></Button>

      {discussion && (
        <Card className="mb-3">
          <Card.Body>
            <Card.Title>{discussion?.title || 'Untitled Discussion'}</Card.Title>
            <Card.Text>{discussion?.content || 'No content available.'}</Card.Text>
          </Card.Body>
        </Card>
      )}

      <div className="overflow-y-auto" style={{ maxHeight: '55%' }}>
        {messages.length > 0 ? (
          messages.map((message) => (
            <div key={message.id} style={{ display: 'flex', flexDirection: message.sender_name === loggedInUserName ? 'row-reverse' : 'row', marginBottom: '10px' }}>
              <div className="message-bubble" style={{ backgroundColor: message.sender_name === loggedInUserName ? '#D1C4E9' : '#f1f1f1', padding: '10px 15px', borderRadius: '20px', maxWidth: '70%', wordBreak: 'break-word' }}>
                <strong>{message.sender_name || 'Anonymous'}</strong>: {message.content}
                <div style={{ fontSize: '0.8em', color: '#888' }}>{message.timestamp ? format(new Date(message.timestamp), 'PPPpp') : 'Invalid date'}</div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-muted text-center mt-3">No messages yet.</p>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="position-absolute bottom-0 start-0 end-0 bg-body z-3">
        <Card className="mb-0">
          <Card.Body>
            <Form onSubmit={handleSendMessage} className="d-flex align-items-center">
              <Form.Group controlId="newMessage" style={{ flex: 1 }}>
                <Form.Control as="textarea" rows={1} value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder="Type your message here" required style={{ resize: 'none', minHeight: '40px', maxHeight: '120px', overflowY: 'auto' }} onKeyDown={handleKeyPress} />
              </Form.Group>
              <Button variant="outline-purple" type="submit" className="d-flex align-items-center" style={{ marginLeft: '10px', height: '40px' }}><MdSend size={20} /></Button>
            </Form>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

export default Discussion;
