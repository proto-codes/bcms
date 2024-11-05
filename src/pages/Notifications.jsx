import React, { useState, useEffect } from 'react';
import { Button, Card, Toast, ToastContainer } from 'react-bootstrap';
import api from '../api/axios';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [dismissedNotifications, setDismissedNotifications] = useState([]);
  const [error, setError] = useState(null);

  // Fetch notifications on component mount
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await api.get('/notifications');
        const fetchedNotifications = Array.isArray(response.data) ? response.data : [];

        setNotifications(fetchedNotifications);
      } catch (error) {
        console.error('Error fetching notifications:', error);
        setError('Failed to load notifications.');
      }
    };

    fetchNotifications();
  }, []);

  // Delete notification on both server and client
  const deleteNotification = async (id) => {
    try {
      await api.delete(`/notifications/${id}`);
      setNotifications((prevNotifications) =>
        prevNotifications.filter((notification) => notification.id !== id)
      );
    } catch (error) {
      console.error('Error deleting notification:', error);
      setError('Failed to delete notification.');
    }
  };

  // Dismiss notification from toast view only
  const dismissNotificationFromToast = (id) => {
    setDismissedNotifications((prevDismissed) => [...prevDismissed, id]);
  };

  // Determine variant styling based on notification type
  const getNotificationVariant = (type) => {
    switch (type) {
      case 'event':
        return 'success';
      case 'reminder':
        return 'warning';
      case 'welcome':
        return 'primary';
      default:
        return 'secondary';
    }
  };

  return (
    <div className="container my-4">
      <h2 className="mb-3">Notifications</h2>

      {/* Display error message if fetch fails */}
      {error && <div className="alert alert-danger">{error}</div>}

      {/* Popup Alerts */}
      <ToastContainer position="top-end" className="p-3">
        {notifications
          .filter((notification) => !dismissedNotifications.includes(notification.id))
          .slice(0, 3)
          .map((notification) => (
            <Toast
              key={notification.id}
              onClose={() => dismissNotificationFromToast(notification.id)}
              bg={getNotificationVariant(notification.type)}
              delay={5000}
              autohide
            >
              <Toast.Header closeButton={false}>
                <strong className="me-auto">{notification.type} Alert</strong>
                <small>{new Date(notification.date).toLocaleDateString()}</small>
              </Toast.Header>
              <Toast.Body>{notification.message}</Toast.Body>
            </Toast>
          ))}
      </ToastContainer>

      {/* Notification Cards */}
      {notifications.length > 0 ? (
        <div className="row">
          {notifications.map((notification) => (
            <div key={notification.id} className="col-md-6 mb-4">
              <Card border={getNotificationVariant(notification.type)} className="shadow-sm">
                <Card.Body>
                  <Card.Title className="text-capitalize">
                    {notification.type} Notification
                  </Card.Title>
                  <Card.Text>{notification.message}</Card.Text>
                  <Card.Subtitle className="mb-2 text-muted">
                    {new Date(notification.date).toLocaleDateString()}
                  </Card.Subtitle>
                  <Button variant="danger" onClick={() => deleteNotification(notification.id)}>
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
