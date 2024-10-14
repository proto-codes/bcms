import React, { useState } from 'react';
import { Form, Button, Card, Container } from 'react-bootstrap';
import axios from 'axios';

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

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleNotificationChange = (e) => {
    const { name, checked } = e.target;
    setNotificationPreferences((prevState) => ({
      ...prevState,
      [name]: checked,
    }));
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    
    try {
      await axios.put('http://localhost:8000/api/change-password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      alert('Password changed successfully!');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error) {
      console.error('Error changing password:', error);
      alert('Error changing password. Please try again.');
    }
  };

  const handleNotificationSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put('http://localhost:8000/api/notification-preferences', notificationPreferences);
      alert('Notification preferences updated successfully!');
    } catch (error) {
      console.error('Error updating notification preferences:', error);
      alert('Error updating notification preferences. Please try again.');
    }
  };

  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete your account? This action cannot be undone.");
    if (!confirmDelete) return;

    try {
      await axios.delete('http://localhost:8000/api/delete-account', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}` // Include the user's token
        }
      });
      alert('Your account has been deleted.');
      localStorage.removeItem('token'); // Optionally, remove the token from local storage
      // Redirect the user after account deletion
      window.location.href = '/';
    } catch (error) {
      console.error('Error deleting account:', error);
      alert('Error deleting account. Please try again.');
    }
  };

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

          {/* Delete Account Section */}
          <div className="mt-5">
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
