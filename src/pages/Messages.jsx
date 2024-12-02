import React, { useState, useEffect, useRef } from 'react';
import { Button } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { MdCreate, MdArrowBack, MdDone, MdDoneAll, MdSend } from 'react-icons/md';
import { format } from 'date-fns';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const Messages = () => {
  const { userId: loggedInUserId, userName: loggedInUserName } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingMessage, setEditingMessage] = useState(null);
  const [editedMessageText, setEditedMessageText] = useState('');
  const messageEndRef = useRef(null);

  // Use location to get the query parameters from the URL
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const receiverId = queryParams.get('receiver');

  // Fetch initial conversations
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await api.get('/messages');
        setConversations(response.data.messages || []);
      } catch (error) {
        console.error('Error fetching conversations:', error);
      }
    };

    fetchMessages();
  }, []);

  // Fetch messages based on receiverId (if available)
  useEffect(() => {
    if (receiverId) {
      const fetchConversationMessages = async () => {
        try {
          const response = await api.get(`/messages/receiver?receiverId=${receiverId}`);
          const existingConversation = conversations.find(c => c.id === receiverId);

          if (existingConversation) {
            setConversations(prevConversations =>
              prevConversations.map(conversation =>
                conversation.id === receiverId
                  ? { ...conversation, messages: response.data.messages || [] }
                  : conversation
              )
            );
          } else {
            // Add a new conversation with receiver info and empty messages
            const newConversation = {
              id: receiverId,
              name: response.data.receiver_name,
              img: response.data.receiver_profile_pics || '',
              messages: response.data.messages || []
            };
            setConversations(prevConversations => [...prevConversations, newConversation]);
          }
        } catch (error) {
          console.error('Error fetching conversation messages:', error);
        }
      };

      fetchConversationMessages();
    }
  }, []);

  const sendMessage = async () => {
    if (!newMessage.trim() || selectedConversation === null) return;
    try {
      const response = await api.post(`/messages?receiverId=${receiverId}`, { message: newMessage, senderId: loggedInUserId });
      setConversations(prevConversations =>
        prevConversations.map(conversation =>
          conversation.id === selectedConversation
            ? {
                ...conversation,
                messages: [
                  ...conversation.messages,
                  { sender: loggedInUserName, message: newMessage, created_at: new Date(), is_read: false }
                ]
              }
            : conversation
        )
      );
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const deleteMessage = async (conversationId, messageIndex) => {
    const messageId = conversations[conversationId].messages[messageIndex].id;
    try {
      await api.delete(`/messages/${messageId}/delete`);
      setConversations(prevConversations =>
        prevConversations.map(conversation =>
          conversation.id === conversationId
            ? {
                ...conversation,
                messages: conversation.messages.filter((_, index) => index !== messageIndex)
              }
            : conversation
        )
      );
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  };

  const editMessage = (conversationId, messageIndex) => {
    const message = conversations.find(c => c.id === conversationId).messages[messageIndex];
    setEditingMessage({ conversationId, messageIndex });
    setEditedMessageText(message.message);
  };

  const saveEditedMessage = async () => {
    if (!editedMessageText.trim() || editingMessage === null) return;
    const { conversationId, messageIndex } = editingMessage;
    const messageId = conversations[conversationId].messages[messageIndex].id;
    try {
      await api.put(`/messages/${messageId}/edit`, { newMessage: editedMessageText });
      setConversations(prevConversations =>
        prevConversations.map(conversation =>
          conversation.id === conversationId
            ? {
                ...conversation,
                messages: conversation.messages.map((msg, index) =>
                  index === messageIndex ? { ...msg, message: editedMessageText } : msg
                )
              }
            : conversation
        )
      );
      setEditingMessage(null);
      setEditedMessageText('');
    } catch (error) {
      console.error('Error editing message:', error);
    }
  };

  useEffect(() => {
    if (messageEndRef.current) messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [conversations, selectedConversation]);

  const filteredConversations = conversations.filter(conversation =>
    conversation.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const handleKeyPress = e => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="container my-4 d-flex flex-column">
      <h2 className="mb-4 text-gold">Messages</h2>
      <div className="row flex-grow-1">
        <div className={`col-md-4 mb-4 ${selectedConversation !== null ? 'd-none d-md-flex' : ''} d-flex flex-column`}>
          <div className="d-flex align-items-center justify-content-between p-1">
            <h5 className="mb-0">Conversations</h5>
            <Button variant="outline-secondary" size="sm" as={Link} to="/search" title="Create new message"><MdCreate size={18} /></Button>
          </div>
          <input type="text" className="form-control mb-3" placeholder="Search for users..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
          <ul className="msg-height list-group flex-grow-1 overflow-auto">
            {filteredConversations.length > 0 ? filteredConversations.map(conversation => {
              const lastMessage = conversation.messages[conversation.messages.length - 1];
              return (
                <li key={conversation.id} className={`list-group-item msg ${selectedConversation === conversation.id ? 'active' : ''}`} onClick={() => setSelectedConversation(conversation.id)} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }} title={lastMessage ? `${lastMessage.message.slice(0, 30)}...` : 'No messages'}>
                  <img src={conversation.img} alt={conversation.name} style={{ width: '40px', height: '40px', borderRadius: '50%' }} />
                  <div className="flex-grow-1">
                    <strong>{conversation.name}</strong>
                    <div>{lastMessage.is_read ? <MdDoneAll className="me-1" /> : <MdDone className="me-1" />}{lastMessage ? `${lastMessage.message.slice(0, 30)}...` : 'No messages'}</div>
                    {lastMessage && <div className="small fw-light">{format(new Date(lastMessage.created_at), 'PPP')}</div>}
                  </div>
                </li>
              );
            }) : <li className="list-group-item">No users found</li>}
          </ul>
        </div>
        <div className="col-md-8 d-flex flex-column">
          {selectedConversation !== null ? (
            <>
              <div className="d-md-none mb-2">
                <button className="btn btn-outline-secondary icon" onClick={() => setSelectedConversation(null)}><MdArrowBack size={20} /> Back</button>
              </div>
              <h5>Chat with {conversations.find(c => c.id === selectedConversation)?.name}</h5>
              <div className="msg-height border p-3 mb-3 flex-grow-1">
              {conversations
                .find(conversation => conversation.id === selectedConversation)
                ?.messages?.map((message, index) => (
                  <div key={index} className={`mb-2 d-flex ${message.sender === loggedInUserName ? 'justify-content-end' : 'justify-content-start'}`}>
                    <div className="p-2 rounded position-relative" style={{ maxWidth: '60%', backgroundColor: message.sender === loggedInUserName ? '#D1C4E9' : '#f1f1f1', color: 'black' }}>
                      <strong>{message.sender}:</strong> {message.message}
                      <div className="small text-muted">{format(new Date(message.created_at), 'PPPpp')}</div>
                      {message.is_read ? (
                        <MdDoneAll color="#4B0082" size={18} />
                      ) : (
                        <MdDone color="#4B0082" size={18} />
                      )}
                      {message.sender === loggedInUserName && (
                        <button className="btn btn-sm btn-link text-purple text-decoration-none" onClick={() => editMessage(selectedConversation, index)} title="Edit message">Edit</button>
                      )}
                      <button className="btn btn-sm btn-link text-danger text-decoration-none" onClick={() => deleteMessage(selectedConversation, index)} title="Delete message">Delete</button>
                    </div>
                  </div>
                )) || <div>No messages</div>}
                <div ref={messageEndRef} />
              </div>
              {editingMessage ? (
                <div className="mb-3">
                  <textarea className="form-control" rows="1" style={{ resize: 'none' }} value={editedMessageText} onChange={e => setEditedMessageText(e.target.value)} />
                  <button className="btn btn-outline-purple mt-2" onClick={saveEditedMessage}>Save Changes</button>
                  <button className="btn btn-outline-secondary mt-2 ms-2" onClick={() => setEditingMessage(null)}>Cancel</button>
                </div>
              ) : (
                <form onSubmit={e => { e.preventDefault(); sendMessage(); }}>
                  <div className="input-group mb-3 d-flex align-items-start">
                    <textarea className="form-control" rows="1" style={{ resize: 'none' }} placeholder="Type a message..." value={newMessage} onChange={e => setNewMessage(e.target.value)} onKeyDown={handleKeyPress} />
                    <button className="btn btn-outline-purple ms-2" type="submit"><MdSend size={20} /></button>
                  </div>
                </form>
              )}
            </>
          ) : (
            <p>Select a conversation to start messaging.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Messages;
