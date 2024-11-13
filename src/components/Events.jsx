import React, { useState } from 'react';
import { Button, ListGroup, Modal, Form } from 'react-bootstrap';
import { MdEdit, MdDelete } from 'react-icons/md';
import { BsCalendarPlus } from "react-icons/bs";
import { toast } from 'react-toastify';
import { addEventToCalendar } from '../pages/utils/calendarUtils';
import { format } from 'date-fns';

const Events = () => {
  const [events, setEvents] = useState([
    { id: 1, title: 'Photography Workshop', date: '2024-12-01', startTime: '10:00', endTime: '12:00', location: 'Online', description: 'A workshop on photography basics.', rsvp: false },
    { id: 2, title: 'Photo Walk', date: '2024-12-15', startTime: '14:00', endTime: '16:00', location: 'Park', description: 'A guided photo walk in the park.', rsvp: false },
  ]);
  const [showEventModal, setShowEventModal] = useState(false);
  const [eventTitle, setEventTitle] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventStartTime, setEventStartTime] = useState('');
  const [eventEndTime, setEventEndTime] = useState('');
  const [eventLocation, setEventLocation] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [editEventId, setEditEventId] = useState(null);

  // Toggle RSVP
  const handleRSVP = (eventId) => {
    const updatedEvents = events.map(event =>
      event.id === eventId ? { ...event, rsvp: !event.rsvp } : event
    );
    setEvents(updatedEvents);
    toast.success('RSVP updated');
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
  const handleSaveEvent = (e) => {
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
      id: editEventId || events.length + 1,
      title: eventTitle,
      date: eventDate,
      startTime: eventStartTime,
      endTime: eventEndTime,
      location: eventLocation,
      description: eventDescription,
      rsvp: false,
    };
    const updatedEvents = editEventId ? events.map(event => event.id === editEventId ? newEvent : event) : [...events, newEvent];

    setEvents(updatedEvents);
    setShowEventModal(false);
    toast.success(editEventId ? 'Event updated successfully' : 'Event created successfully');
  };

  // Delete event
  const handleDeleteEvent = (eventId) => {
    setEvents(events.filter(event => event.id !== eventId));
    toast.success('Event deleted successfully');
  };

  // Add event to calendar
  const handleAddToCalendar = (event) => {
    addEventToCalendar(event);  // Call the updated function
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
          <Button variant="outline-dark" size="sm"  onClick={() => handleOpenEventModal()}>
            Add event
          </Button>
        </ListGroup.Item>
        {events.map((event) => (
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
              <Button variant="outline-dark" onClick={() => handleAddToCalendar(event)} size="sm" title='Add event to calender'>
                <BsCalendarPlus size={20} />
              </Button>
            </div>
          </ListGroup.Item>
        ))}
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

          <Button variant="primary" type="submit" className="mt-3">
            {editEventId ? 'Update' : 'Create'}
          </Button>
        </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default Events;
