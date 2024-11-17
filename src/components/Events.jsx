import React, { useState, useEffect } from 'react';
import { Button, ListGroup, Modal, Form } from 'react-bootstrap';
import { MdEdit, MdDelete } from 'react-icons/md';
import { BsCalendarPlus } from "react-icons/bs";
import { toast } from 'react-toastify';
import { addEventToCalendar } from '../pages/utils/calendarUtils';
import { format } from 'date-fns';
import api from '../api/axios';  // Import the axios instance for API requests

const Events = () => {
  const [events, setEvents] = useState([]);
  const [showEventModal, setShowEventModal] = useState(false);
  const [eventTitle, setEventTitle] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventStartTime, setEventStartTime] = useState('');
  const [eventEndTime, setEventEndTime] = useState('');
  const [eventLocation, setEventLocation] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [editEventId, setEditEventId] = useState(null);

  // Fetch events from the server on component mount
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await api.get('/events');
        setEvents(response.data); // Assuming the API returns the list of events
      } catch (error) {
        toast.error('Error fetching events');
      }
    };
    fetchEvents();
  }, []);

  // Toggle RSVP
  const handleRSVP = async (eventId) => {
    try {
      const event = events.find(e => e.id === eventId);
      const updatedEvent = { ...event, rsvp: !event.rsvp };
      
      await api.put(`/events/rsvp/${eventId}`, { rsvp: updatedEvent.rsvp }); // Update RSVP on the server
      setEvents(events.map(e => e.id === eventId ? updatedEvent : e)); // Update local state
      toast.success('RSVP updated');
    } catch (error) {
      toast.error('Error updating RSVP');
    }
  };

  // Open modal to create or edit event
  const handleOpenEventModal = (event = null) => {
    if (event) {
      setEditEventId(event.id);
      setEventTitle(event.title);
      setEventDate(event.date);
      setEventStartTime(event.startTime);
      setEventEndTime(event.endTime);
      setEventLocation(event.location);
      setEventDescription(event.description);
    } else {
      setEditEventId(null);
      setEventTitle('');
      setEventDate('');
      setEventStartTime('');
      setEventEndTime('');
      setEventLocation('');
      setEventDescription('');
    }
    setShowEventModal(true);
  };

  // Create or edit event
  const handleSaveEvent = async (e) => {
    e.preventDefault();
    if (!eventTitle || !eventDate || !eventStartTime || !eventEndTime || !eventLocation || !eventDescription) {
      toast.error('All fields are required');
      return;
    }
    if (eventEndTime <= eventStartTime) {
      toast.error('End time must be after start time');
      return;
    }

    const newEvent = {
      title: eventTitle,
      date: eventDate,
      startTime: eventStartTime,
      endTime: eventEndTime,
      location: eventLocation,
      description: eventDescription,
      rsvp: false,
    };

    try {
      if (editEventId) {
        await api.put(`/events/${editEventId}`, newEvent);  // Update the event on the server
        setEvents(events.map(event => event.id === editEventId ? { ...event, ...newEvent } : event));
        toast.success('Event updated successfully');
      } else {
        const response = await api.post('/events', newEvent);  // Create a new event
        setEvents([...events, response.data]);
        toast.success('Event created successfully');
      }
      setShowEventModal(false);
    } catch (error) {
      toast.error('Error saving event');
    }
  };

  // Delete event
  const handleDeleteEvent = async (eventId) => {
    try {
      await api.delete(`/events/${eventId}`);  // Delete event on the server
      setEvents(events.filter(event => event.id !== eventId));  // Remove from local state
      toast.success('Event deleted successfully');
    } catch (error) {
      toast.error('Error deleting event');
    }
  };

  // Add event to calendar
  const handleAddToCalendar = (event) => {
    addEventToCalendar(event);
    toast.success('Event added to your calendar');
  };

  // Function to format date and time
  const formatDateTime = (date, startTime, endTime) => {
    const formattedDate = format(new Date(date), 'MMM dd, yyyy');
    const formattedStartTime = format(new Date(`${date}T${startTime}`), 'hh:mm a');
    const formattedEndTime = format(new Date(`${date}T${endTime}`), 'hh:mm a');
    return `${formattedDate} | ${formattedStartTime} - ${formattedEndTime}`;
  };

  return (
    <>
      {/* Events */}
      <ListGroup className="mb-4">
        <ListGroup.Item className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Upcoming Events</h5>
          <Button variant="outline-dark" size="sm" onClick={() => handleOpenEventModal()}>
            Add event
          </Button>
        </ListGroup.Item>
        {events.length === 0 ? (
          <p className='mx-3 my-2'>No events found</p> // Display "No events found" if events array is empty
        ) : (
          events.map((event) => (
            <ListGroup.Item key={event.id} className="d-flex justify-content-between align-items-center">
              <div>
                <h6>{event.title}</h6>
                <p className='mb-0'>{formatDateTime(event.date, event.startTime, event.endTime)} | {event.location}</p>
                <p className='mb-0'>{event.description}</p>
              </div>
              <div className="d-flex align-items-center gap-2">
                <Button
                  variant={event.rsvp ? 'danger' : 'outline-gold'}
                  onClick={() => handleRSVP(event.id)}
                >
                  {event.rsvp ? 'Cancel RSVP' : 'RSVP'}
                </Button>
                <Button variant="outline-dark" onClick={() => handleOpenEventModal(event)} size="sm" title='Edit event'>
                  <MdEdit size={20} />
                </Button>
                <Button variant="outline-danger" onClick={() => handleDeleteEvent(event.id)} size="sm" title='Delete event'>
                  <MdDelete size={20} />
                </Button>
                <Button variant="outline-dark" onClick={() => handleAddToCalendar(event)} size="sm" title='Add event to calendar'>
                  <BsCalendarPlus size={20} />
                </Button>
              </div>
            </ListGroup.Item>
          ))
        )}
      </ListGroup>

      {/* Modal for Creating or Editing Events */}
      <Modal show={showEventModal} onHide={() => setShowEventModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{editEventId ? 'Edit Event' : 'Create Event'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSaveEvent}>
            <div className="form-floating mb-3">
              <Form.Control
                type="text"
                id="eventTitle"
                placeholder="Enter event title"
                value={eventTitle}
                onChange={(e) => setEventTitle(e.target.value)}
                required
                className="form-control"
              />
              <label htmlFor="eventTitle">Title</label>
            </div>

            <div className="form-floating mb-3">
              <Form.Control
                type="date"
                id="eventDate"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                required
                className="form-control"
              />
              <label htmlFor="eventDate">Date</label>
            </div>

            <div className="row mb-3">
              <div className="col-md-6">
                <div className="form-floating">
                  <Form.Control
                    type="time"
                    id="eventStartTime"
                    value={eventStartTime}
                    onChange={(e) => setEventStartTime(e.target.value)}
                    required
                    className="form-control"
                  />
                  <label htmlFor="eventStartTime">Start Time</label>
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-floating">
                  <Form.Control
                    type="time"
                    id="eventEndTime"
                    value={eventEndTime}
                    onChange={(e) => setEventEndTime(e.target.value)}
                    required
                    className="form-control"
                  />
                  <label htmlFor="eventEndTime">End Time</label>
                </div>
              </div>
            </div>

            <div className="form-floating mb-3">
              <Form.Control
                type="text"
                id="eventLocation"
                placeholder="Enter event location"
                value={eventLocation}
                onChange={(e) => setEventLocation(e.target.value)}
                required
                className="form-control"
              />
              <label htmlFor="eventLocation">Location</label>
            </div>

            <div className="form-floating mb-3">
              <Form.Control
                as="textarea"
                id="eventDescription"
                rows={3}
                placeholder="Enter event description"
                value={eventDescription}
                onChange={(e) => setEventDescription(e.target.value)}
                required
                className="form-control"
              />
              <label htmlFor="eventDescription">Description</label>
            </div>

            <Button type="submit" variant="outline-gold" className="w-100">
              {editEventId ? 'Update Event' : 'Create Event'}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default Events;
