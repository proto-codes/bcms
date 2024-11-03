import React from 'react';

const Overview = () => {
  return (
    <div className="container my-4">
      <h1 className="h2">Dashboard Overview</h1>
      <div className="row">
        {/* Sample Card 1 */}
        <div className="col-md-4 mb-4">
          <div className="card text-white bg-primary">
            <div className="card-body">
              <h5 className="card-title">Total Users</h5>
              <p className="card-text">150 users</p>
            </div>
          </div>
        </div>
        {/* Sample Card 2 */}
        <div className="col-md-4 mb-4">
          <div className="card text-white bg-success">
            <div className="card-body">
              <h5 className="card-title">Total Events</h5>
              <p className="card-text">20 events</p>
            </div>
          </div>
        </div>
        {/* Sample Card 3 */}
        <div className="col-md-4 mb-4">
          <div className="card text-white bg-warning">
            <div className="card-body">
              <h5 className="card-title">Pending Approvals</h5>
              <p className="card-text">5 approvals</p>
            </div>
          </div>
        </div>
      </div>

      <h2 className="h4">Recent Activities</h2>
      {/* Activity Log */}
      <div className="list-group mb-4">
        <a href="#" className="list-group-item list-group-item-action">
          User John Doe registered
        </a>
        <a href="#" className="list-group-item list-group-item-action">
          Event "Tech Conference" created
        </a>
        <a href="#" className="list-group-item list-group-item-action">
          User Jane Smith updated profile
        </a>
      </div>
    </div>
  );
};

export default Overview;
