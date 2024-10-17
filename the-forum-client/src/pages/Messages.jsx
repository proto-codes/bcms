import React, { useState } from 'react';
import { MdArrowBack } from 'react-icons/md'; // Importing the back arrow icon

const Messages = () => {
  const dummyConversations = [
    {
      id: 1,
      name: 'Alice',
      messages: [
        { text: 'Hey there!', date: '2024-10-12 10:30 AM', sender: 'Alice' },
        { text: 'How are you?', date: '2024-10-12 10:32 AM', sender: 'Me' },
      ],
    },
    {
      id: 2,
      name: 'Bob',
      messages: [
        { text: "Let's meet up!", date: '2024-10-11 02:15 PM', sender: 'Bob' },
        { text: 'Looking forward to it!', date: '2024-10-11 02:18 PM', sender: 'Me' },
      ],
    },
    {
      id: 3,
      name: 'Charlie',
      messages: [
        { text: 'Hi!', date: '2024-10-10 08:00 AM', sender: 'Charlie' },
        { text: 'Are you joining the event?', date: '2024-10-10 08:05 AM', sender: 'Me' },
      ],
    },
  ];

  const [conversations, setConversations] = useState(dummyConversations);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const currentUser = 'Me';

  const handleConversationSelect = (id) => {
    setSelectedConversation(id);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() && selectedConversation !== null) {
      const updatedConversations = conversations.map((conversation) => {
        if (conversation.id === selectedConversation) {
          const currentDateTime = new Date().toLocaleString();
          return {
            ...conversation,
            messages: [...conversation.messages, { text: newMessage, date: currentDateTime, sender: currentUser }],
          };
        }
        return conversation;
      });
      setConversations(updatedConversations);
      setNewMessage("");
    }
  };

  const filteredConversations = conversations.filter((conversation) =>
    conversation.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container my-4 d-flex flex-column">
      <h2 className="mb-4 text-gold-dark">Messages</h2>

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
              {/* Back button for mobile view */}
              <div className="d-md-none mb-2">
                <button className="btn btn-secondary icon" onClick={() => setSelectedConversation(null)} style={{ display: 'flex', alignItems: 'center' }}>
                  <MdArrowBack size={20} style={{ marginRight: '8px' }} /> Back
                </button>
              </div>

              <h5>Chat with {conversations.find((c) => c.id === selectedConversation).name}</h5>
              <div className="msg-area-height border p-3 mb-3 flex-grow-1">
                {conversations.find((c) => c.id === selectedConversation).messages.map((message, index) => (
                  <div key={index} className={`mb-2 d-flex ${message.sender === currentUser ? 'justify-content-end' : 'justify-content-start'}`}>
                    <div className={`p-2 rounded ${message.sender === currentUser ? 'bg-gold-dark text-white' : 'bg-light text-dark'}`} style={{ maxWidth: '60%' }}>
                      <strong>{message.sender}:</strong> {message.text}
                      <div className="small">{message.date}</div>
                    </div>
                  </div>
                ))}
              </div>

              <form onSubmit={handleSendMessage}>
                <div className="input-group mb-3">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                  />
                  <button className="btn btn-gold-dark" type="submit">
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
