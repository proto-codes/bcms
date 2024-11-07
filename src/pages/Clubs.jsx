import React, { useState } from 'react';
import { toast } from 'react-toastify';

const Clubs = () => {
  const initialClubs = [
    { id: 1, name: 'Tech Innovators', description: 'A club for tech enthusiasts to share ideas and collaborate.', privacy: 'public' },
    { id: 2, name: 'Book Lovers', description: 'Join us to discuss and share your favorite books.', privacy: 'public' },
    { id: 3, name: 'Outdoor Adventures', description: 'Explore the great outdoors and meet new friends.', privacy: 'private' },
    { id: 4, name: 'Photography Club', description: 'Capture the world through your lens.', privacy: 'public' },
    { id: 5, name: 'Fitness Fanatics', description: 'Stay fit and motivated together.', privacy: 'private' },
  ];

  const [clubs, setClubs] = useState(initialClubs);
  const [searchTerm, setSearchTerm] = useState('');
  const [joinedClubs, setJoinedClubs] = useState({});
  const [newClub, setNewClub] = useState({ name: '', description: '', privacy: 'public' });
  const [editingClub, setEditingClub] = useState(null); // Track the club being edited
  const [showForm, setShowForm] = useState(false); // To control form visibility

  const filteredClubs = clubs.filter(club =>
    club.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle Create Club
  const handleCreateClub = () => {
    if (!newClub.name || !newClub.description) {
      toast.error('Please fill out all fields');
      return;
    }

    const newClubData = { ...newClub, id: clubs.length + 1 };
    setClubs(prevClubs => [...prevClubs, newClubData]);
    setNewClub({ name: '', description: '', privacy: 'public' }); // Clear input fields
    setShowForm(false); // Hide the form after creation
    toast.success('New club created!');
  };

  // Handle Update Club
  const handleUpdateClub = () => {
    if (!newClub.name || !newClub.description) {
      toast.error('Please fill out all fields');
      return;
    }

    setClubs(prevClubs => 
      prevClubs.map(club => 
        club.id === editingClub.id ? { ...club, ...newClub } : club
      )
    );
    setEditingClub(null); // Clear editing state
    setNewClub({ name: '', description: '', privacy: 'public' });
    setShowForm(false); // Hide the form after update
    toast.success('Club updated!');
  };

  // Handle Delete Club
  const handleDeleteClub = (clubId) => {
    if (window.confirm('Are you sure you want to delete this club?')) {
      setClubs(prevClubs => prevClubs.filter(club => club.id !== clubId));
      toast.success('Club deleted!');
    }
  };

  // Handle Join/Request Club
  const handleJoinClub = (club) => {
    setJoinedClubs(prevState => ({ ...prevState, [club.id]: 'joined' }));
    toast.success(`You have joined the club: ${club.name}!`);
  };

  const handleRequestToJoinClub = (club) => {
    setJoinedClubs(prevState => ({ ...prevState, [club.id]: 'requested' }));
    toast.success(`Join request sent for club: ${club.name}!`);
  };

  const handleLeaveClub = (club) => {
    setJoinedClubs(prevState => {
      const updatedState = { ...prevState };
      delete updatedState[club.id];
      return updatedState;
    });
    toast.success(`You have left the club: ${club.name}!`);
  };

  const handleCancelRequest = (club) => {
    setJoinedClubs(prevState => {
      const updatedState = { ...prevState };
      delete updatedState[club.id];
      return updatedState;
    });
    toast.success(`Join request canceled for club: ${club.name}!`);
  };

  // Handle Edit Club
  const handleEditClub = (club) => {
    setEditingClub(club);
    setNewClub({ name: club.name, description: club.description, privacy: club.privacy });
    setShowForm(true); // Show the form when editing
  };

  return (
    <div className="container my-4">
      <h2 className="mb-4 text-center">Explore Clubs</h2>

      {/* Search bar */}
      <div className="input-group mb-4">
        <input
          type="text"
          className="form-control"
          placeholder="Search for clubs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Button to Create Club */}
      {!showForm && (
        <button className="btn btn-success mb-4" onClick={() => setShowForm(true)}>Create New Club</button>
      )}

      {/* Create/Edit Club Form */}
      {showForm && (
        <div className="mb-4">
          <h3>{editingClub ? 'Edit Club' : 'Create New Club'}</h3>
          <input
            type="text"
            className="form-control mb-2"
            placeholder="Club Name"
            value={newClub.name}
            onChange={(e) => setNewClub({ ...newClub, name: e.target.value })}
          />
          <textarea
            className="form-control mb-2"
            placeholder="Club Description"
            value={newClub.description}
            onChange={(e) => setNewClub({ ...newClub, description: e.target.value })}
          />
          <select
            className="form-control mb-2"
            value={newClub.privacy}
            onChange={(e) => setNewClub({ ...newClub, privacy: e.target.value })}
          >
            <option value="public">Public</option>
            <option value="private">Private</option>
          </select>

          {editingClub ? (
            <div>
              <button className="btn btn-primary" onClick={handleUpdateClub}>Update Club</button>
              <button className="btn btn-secondary ml-2" onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          ) : (
            <div>
              <button className="btn btn-success" onClick={handleCreateClub}>Create Club</button>
              <button className="btn btn-secondary ml-2" onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          )}
        </div>
      )}

      {/* Display clubs */}
      <div className="row">
        {filteredClubs.length > 0 ? (
          filteredClubs.map(club => (
            <div key={club.id} className="col-12 col-md-6 mb-4">
              <div className="p-3 border rounded">
                <h5>{club.name}</h5>
                <p>{club.description}</p>
                <p><strong>Privacy:</strong> {club.privacy === 'public' ? 'Public' : 'Private'}</p>

                {/* Join/Leave button */}
                {joinedClubs[club.id] === 'joined' ? (
                  <div>
                    <button className="btn btn-danger btn-sm" onClick={() => handleLeaveClub(club)}>Leave Club</button>
                  </div>
                ) : joinedClubs[club.id] === 'requested' ? (
                  <div>
                    <button className="btn btn-warning btn-sm" onClick={() => handleCancelRequest(club)}>Cancel Request</button>
                  </div>
                ) : (
                  club.privacy === 'public' ? (
                    <button className="btn btn-primary btn-sm" onClick={() => handleJoinClub(club)}>Join Club</button>
                  ) : (
                    <button className="btn btn-secondary btn-sm" onClick={() => handleRequestToJoinClub(club)}>Request to Join</button>
                  )
                )}

                {/* Edit/Delete buttons */}
                <div className="mt-2">
                  <button className="btn btn-info btn-sm" onClick={() => handleEditClub(club)}>Edit</button>
                  <button className="btn btn-danger btn-sm ml-2" onClick={() => handleDeleteClub(club.id)}>Delete</button>
                </div>
              </div>
              <hr />
            </div>
          ))
        ) : (
          <p className="text-center">No clubs available.</p>
        )}
      </div>
    </div>
  );
};

export default Clubs;
