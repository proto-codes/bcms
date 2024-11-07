import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import api from '../api/axios';
import { AiOutlineDelete } from 'react-icons/ai';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);

  // Fetch notifications on component mount
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await api.get('/notifications');
        const fetchedNotifications = Array.isArray(response.data) ? response.data : [];
        setNotifications(fetchedNotifications);
      } catch (error) {
        console.error('Error fetching notifications:', error);
        toast.error('Failed to load notifications.');
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
      toast.success('Notification deleted successfully.');  // Show success for deletion
    } catch (error) {
      console.error('Error deleting notification:', error);
      toast.error('Failed to delete notification.');
    }
  };

  return (
    <div className="container my-4">
      <h3 className="mb-3">Notifications</h3>

      {/* List of Notifications */}
      {notifications.length > 0 ? (
        <div className="list-group">
          {notifications.map((notification) => (
            <div key={notification.id} className="list-group-item d-flex justify-content-between align-items-center p-3">
              {/* Notification Content */}
              <div className="d-flex align-items-center">
                <div>
                  <h5 className="text-muted">{notification.type}</h5>
                  {/* Truncated Message */}
                  <p className="mb-0 text-muted">
                    {notification.message}
                  </p>
                </div>
              </div>

              {/* Actions (Date and Delete) */}
              <div className="d-flex align-items-center">
                <small className="text-muted me-3">{new Date(notification.date).toLocaleTimeString()}</small>
                <Button variant="danger" size="sm" onClick={() => deleteNotification(notification.id)}>
                  <AiOutlineDelete />
                </Button>
              </div>
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
