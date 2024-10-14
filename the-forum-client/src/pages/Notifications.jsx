// src/components/Notifications.jsx
import React, { useState, useEffect } from 'react';
import { Button, Card } from 'react-bootstrap'; // Import Bootstrap components

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);

  // Fetch notifications when the component mounts
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = [
          { id: 1, message: 'New event coming up next week!', type: 'event', date: '2024-10-10' },
          { id: 2, message: 'Membership fee is due soon.', type: 'reminder', date: '2024-10-08' },
          { id: 3, message: 'Welcome to the club!', type: 'welcome', date: '2024-09-30' },
        ];
        setNotifications(response);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotifications();
  }, []);

  // Function to handle deleting a notification
  const deleteNotification = (id) => {
    setNotifications((prevNotifications) =>
      prevNotifications.filter((notification) => notification.id !== id)
    );
  };

  // Get the color variant based on notification type
  const getNotificationVariant = (type) => {
    switch (type) {
      case 'event':
        return 'success';
      case 'reminder':
        return 'warning';
      case 'welcome':
        return 'blue';
      default:
        return 'secondary';
    }
  };

  return (
    <div className="container my-4">
      <h2 className="mb-4">Notifications</h2>
      {notifications.length > 0 ? (
        <div className="row">
          {notifications.map((notification) => (
            <div key={notification.id} className="col-md-6 mb-4">
              <Card border={getNotificationVariant(notification.type)} className="shadow-sm">
                <Card.Body>
                  <Card.Title className="text-capitalize">
                    {notification.type} Notification
                  </Card.Title>
                  <Card.Text>
                    {notification.message}
                  </Card.Text>
                  <Card.Subtitle className="mb-2 text-muted">
                    {new Date(notification.date).toLocaleDateString()}
                  </Card.Subtitle>
                  <Button
                    variant="danger"
                    onClick={() => deleteNotification(notification.id)}
                  >
                    Delete
                  </Button>
                </Card.Body>
              </Card>
            </div>
          ))}
        </div>
      ) : (
        <div className="alert alert-info">No notifications available</div>
      )}
    </div>
  );
};

export default Notifications;
