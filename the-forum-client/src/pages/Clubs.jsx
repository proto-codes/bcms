import React, { useState, useEffect } from 'react';

const Clubs = () => {
  // Hardcoded dummy data
  const dummyClubs = [
    { id: 1, name: 'Tech Innovators', description: 'A club for tech enthusiasts to share ideas and collaborate.', privacy: 'public' },
    { id: 2, name: 'Book Lovers', description: 'Join us to discuss and share your favorite books.', privacy: 'public' },
    { id: 3, name: 'Outdoor Adventures', description: 'Explore the great outdoors and meet new friends.', privacy: 'private' },
    { id: 4, name: 'Photography Club', description: 'Capture the world through your lens.', privacy: 'public' },
    { id: 5, name: 'Fitness Fanatics', description: 'Stay fit and motivated together.', privacy: 'private' },
  ];

  const [clubs, setClubs] = useState(dummyClubs); // Use dummy data directly
  const [searchTerm, setSearchTerm] = useState("");

  const filteredClubs = clubs.filter(club => 
    club.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const joinClub = (clubId) => {
    alert(`You have joined the club: ${clubId}!`);
  };

  const requestToJoinClub = (clubId) => {
    alert(`Join request sent for club: ${clubId}!`);
  };

  return (
    <div className="container my-4">
      <h2 className="mb-4 text-gold">Explore Clubs</h2>

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

      {/* Display clubs */}
      <div className="row">
        {filteredClubs.length > 0 ? (
          filteredClubs.map(club => (
            <div key={club.id} className="col-md-4 mb-4">
              <div className="card h-100">
                <div className="card-body">
                  <h5 className="card-title">{club.name}</h5>
                  <p className="card-text">{club.description}</p>
                  <p className="card-text"><strong>Privacy:</strong> {club.privacy === 'public' ? 'Public' : 'Private'}</p>
                  
                  {/* Join button */}
                  {club.privacy === 'public' ? (
                    <button className="btn btn-gold" onClick={() => joinClub(club.id)}>Join Club</button>
                  ) : (
                    <button className="btn btn-secondary" onClick={() => requestToJoinClub(club.id)}>Request to Join</button>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No clubs available.</p>
        )}
      </div>
    </div>
  );
};

export default Clubs;
