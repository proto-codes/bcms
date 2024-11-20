import React, { useState, useEffect } from 'react';
import { MdArrowBack } from 'react-icons/md';
import axios from 'axios';

const Messages = () => {
  const [conversations, setConversations] = useState([]); // Initialize as an empty array
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const currentUser = 'Me'; // Adjust this according to your user context

  // Fetch conversations from the API
  const fetchConversations = async () => {
    try {
      const response = await axios.get('/api/conversations'); // Your API endpoint here
      setConversations(response.data || []); // Ensure it's an array
    } catch (error) {
      console.error("Error fetching conversations:", error);
      setConversations([]); // Set to empty array on error
    }
  };

  // Send a new message to the API
  const sendMessage = async () => {
    if (newMessage.trim() && selectedConversation) {
      const messageData = {
        text: newMessage,
        sender: currentUser,
        conversationId: selectedConversation,
        date: new Date().toLocaleString(),
      };

      try {
        await axios.post('/api/messages', messageData); // Your API endpoint here
        setNewMessage(""); // Clear input after sending
        fetchConversations(); // Refresh conversations
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  };

  useEffect(() => {
    fetchConversations(); // Fetch conversations on component mount
  }, []);

  const handleConversationSelect = (id) => {
    setSelectedConversation(id);
  };

  // Filter conversations based on search term
  const filteredConversations = Array.isArray(conversations)
    ? conversations.filter((conversation) =>
        conversation.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : []; // Default to an empty array if not an array

  return (
    <div className="container my-4 d-flex flex-column">
      <h2 className="mb-4 text-gold">Messages</h2>

      <div className="row flex-grow-1">
        {/* Conversations List */}
        <div className={`col-md-4 mb-4 ${selectedConversation !== null ? 'd-none d-md-flex' : ''} d-flex flex-column`}>
          <h5>Conversations</h5>
          <input
            type="text"
            className="form-control mb-3"
            placeholder="Search for users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <ul className="msg-height list-group flex-grow-1 overflow-auto">
            {filteredConversations.length > 0 ? (
              filteredConversations.map((conversation) => (
                <li
                  key={conversation.id}
                  className={`list-group-item ${selectedConversation === conversation.id ? 'active' : ''}`}
                  onClick={() => handleConversationSelect(conversation.id)}
                  style={{ cursor: 'pointer' }}
                >
                  {conversation.name}
                </li>
              ))
            ) : (
              <li className="list-group-item">No users found</li>
            )}
          </ul>
        </div>

        {/* Messages Display */}
        <div className="col-md-8 d-flex flex-column">
          {selectedConversation !== null ? (
            <>
              <div className="d-md-none mb-2">
                <button
                  className="btn btn-secondary icon"
                  onClick={() => setSelectedConversation(null)}
                  style={{ display: 'flex', alignItems: 'center' }}
                >
                  <MdArrowBack size={20} style={{ marginRight: '8px' }} /> Back
                </button>
              </div>

              <h5>Chat with {conversations.find((c) => c.id === selectedConversation)?.name}</h5>
              <div className="msg-area-height border p-3 mb-3 flex-grow-1">
                {conversations.find((c) => c.id === selectedConversation)?.messages?.map((message, index) => (
                  <div key={index} className={`mb-2 d-flex ${message.sender === currentUser ? 'justify-content-end' : 'justify-content-start'}`}>
                    <div className={`p-2 rounded ${message.sender === currentUser ? 'bg-gold text-white' : 'bg-light text-dark'}`} style={{ maxWidth: '60%' }}>
                      <strong>{message.sender}:</strong> {message.text}
                      <div className="small">{message.date}</div>
                    </div>
                  </div>
                )) || <div>No messages</div>}
              </div>

              <form onSubmit={(e) => { e.preventDefault(); sendMessage(); }}>
                <div className="input-group mb-3">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                  />
                  <button className="btn btn-outline-gold" type="submit">
                    Send
                  </button>
                </div>
              </form>
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
