import React, { useState, useEffect } from 'react';
import { Form, Button, Card, Container, Alert } from 'react-bootstrap';
import PageLoader from '../components/PageLoader';
import api from '../api/axios';

const Settings = () => {
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [notificationPreferences, setNotificationPreferences] = useState({
    emailNotifications: true,
    smsNotifications: false,
  });

  const [message, setMessage] = useState(null); // State for server messages
  const [loading, setLoading] = useState(true); // State to handle loading

  // Fetch user's notification preferences from the database
  useEffect(() => {
    const fetchPreferences = async () => {
        try {
            const { data } = await api.get('/notification-preferences');
            // Convert to boolean values
            setNotificationPreferences({
                emailNotifications: Boolean(data.email_notifications), // Convert to boolean
                smsNotifications: Boolean(data.sms_notifications),     // Convert to boolean
            });
        } catch (error) {
            console.error('Error fetching notification preferences:', error);
            setMessage('Failed to load notification preferences.');
        } finally {
            setLoading(false);
        }
    };

    fetchPreferences();
  }, []);

  // Handle input changes for password fields
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Handle checkbox changes for notification preferences
  const handleNotificationChange = (e) => {
    const { name, checked } = e.target;
    setNotificationPreferences((prevState) => ({
      ...prevState,
      [name]: checked,
    }));
  };

  // Handle password change form submission
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage("Passwords do not match!");
      return;
    }

    try {
      await api.put('/change-password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      setMessage('Password changed successfully!');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error) {
      console.error('Error changing password:', error);
      setMessage('Error changing password. Please try again.');
    }
  };

  // Handle notification preferences form submission
  const handleNotificationSubmit = async (e) => {
    e.preventDefault();
    // Check if at least one notification preference is selected
    if (!notificationPreferences.emailNotifications && !notificationPreferences.smsNotifications) {
      setMessage('At least one notification preference must be selected.');
      return; // Prevent form submission
    }
    try {
      await api.put('/notification-preferences', notificationPreferences);
      setMessage('Notification preferences updated successfully!');
    } catch (error) {
      console.error('Error updating notification preferences:', error);
      // Check if the error response has a message and set it
      const errorMessage = error.response?.data?.error || 'Error updating notification preferences. Please try again.';
      setMessage(errorMessage);
    }
  };

  // Handle account deletion
  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete your account? This action cannot be undone.");
    if (!confirmDelete) return;

    try {
      await api.delete('/delete-account');
      setMessage('Your account has been deleted.');
      localStorage.removeItem('token');
      window.location.href = '/';
    } catch (error) {
      console.error('Error deleting account:', error);
      setMessage('Error deleting account. Please try again.');
    }
  };

  if (loading) {
    return <PageLoader />;
  }

  return (
    <Container className="my-4">
      <Card className="shadow-lg border-0">
        <Card.Body>
          <h2 className="mb-4 text-gold-dark">Settings</h2>

          {/* Password Change Section */}
          <Form onSubmit={handlePasswordSubmit} className="mb-4">
            <h5>Change Password</h5>
            <Form.Group className="mb-3">
              <Form.Label>Current Password</Form.Label>
              <Form.Control
                type="password"
                name="currentPassword"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>New Password</Form.Label>
              <Form.Control
                type="password"
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Confirm New Password</Form.Label>
              <Form.Control
                type="password"
                name="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                required
              />
            </Form.Group>

            <Button variant="gold-dark" type="submit">
              Change Password
            </Button>
          </Form>

          {/* Notification Preferences Section */}
          <Form onSubmit={handleNotificationSubmit}>
            <h5>Notification Preferences</h5>
            <Form.Check
              type="checkbox"
              label="Email Notifications"
              name="emailNotifications"
              checked={notificationPreferences.emailNotifications}
              onChange={handleNotificationChange}
            />
            <Form.Check
              type="checkbox"
              label="SMS Notifications"
              name="smsNotifications"
              checked={notificationPreferences.smsNotifications}
              onChange={handleNotificationChange}
            />

            <Button variant="secondary" type="submit" className="mt-3">
              Save Notification Preferences
            </Button>
          </Form>
          
          {/* Display server messages */}
          {message && <Alert variant="info" className='mt-4' onClose={() => setMessage(null)} dismissible>{message}</Alert>}

          {/* Delete Account Section */}
          <div className="mt-4">
            <h5>Danger Zone</h5>
            <Button variant="danger" onClick={handleDeleteAccount}>
              Delete Account
            </Button>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Settings;
