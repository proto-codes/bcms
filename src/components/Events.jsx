import React, { useState, useEffect } from 'react';
import { Button, ListGroup, Modal, Form, Dropdown  } from 'react-bootstrap';
import { MdEdit, MdDelete, MdSettings } from 'react-icons/md';
import { BsCalendarPlus } from "react-icons/bs";
import { toast } from 'react-toastify';
import { addEventToCalendar } from '../pages/utils/calendarUtils';
import { format } from 'date-fns';
import api from '../api/axios';

const Events = ({ clubId, loggedInUserId }) => {
  const [events, setEvents] = useState([]);
  const [showEventModal, setShowEventModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    startTime: '',
    endTime: '',
    location: '',
    description: '',
  });
  const [isRSVPing, setIsRSVPing] = useState(false);
  const [editEventId, setEditEventId] = useState(null);

  const fetchEvents = async () => {
    try {
      const response = await api.get(`/events/${clubId}`);
      setEvents(response.data);
    } catch (error) {
      toast.error(error.response?.data?.error || 'Error fetching events');
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [clubId]);

  const handleRSVP = async (eventId) => {
    setIsRSVPing(true);
    try {
      const event = events.find(e => e.id === eventId);
      const updatedEvent = { ...event, rsvp: !event.rsvp };

      const response = await api.post(`/events/${eventId}/rsvp`, { rsvp: updatedEvent.rsvp });
      setEvents(events.map(e => e.id === eventId ? updatedEvent : e));
      toast.success(response.data.message);
    } catch (error) {
      toast.error(error.response?.data?.error || 'Error updating RSVP');
    } finally {
      setIsRSVPing(false); // End the RSVP process
    }
  };

  const handleOpenEventModal = (event = null) => {
    if (event) {
      setEditEventId(event.id);
      setFormData({
        title: event.title,
        date: event.date,
        startTime: event.start_time,
        endTime: event.end_time,
        location: event.location,
        description: event.description,
      });
    } else {
      setEditEventId(null);
      setFormData({
        title: '',
        date: '',
        startTime: '',
        endTime: '',
        location: '',
        description: '',
      });
    }
    setShowEventModal(true);
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [id]: value }));
  };

  const handleSaveEvent = async (e) => {
    e.preventDefault();
    const { title, date, startTime, endTime, location, description } = formData;

    if (!title || !date || !startTime || !endTime || !location || !description) {
      toast.error('All fields are required');
      return;
    }
    if (endTime <= startTime) {
      toast.error('End time must be after start time');
      return;
    }

    const selectedDate = new Date(date);
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0); // Set current date to midnight for comparison

    if (selectedDate < currentDate) {
      toast.error('Selected date cannot be in the past');
      return;
    }

    try {
      if (editEventId) {
        const response = await api.put(`/events/${editEventId}`, formData);
        fetchEvents();
        toast.success(response.data.message);
      } else {
        const response = await api.post(`/events/${clubId}`, formData);
        fetchEvents();
        toast.success(response.data.message);
      }
      setShowEventModal(false);
    } catch (error) {
      toast.error(error.response?.data?.error || 'Error saving event');
    }
  };

  const handleDeleteEvent = async (eventId) => {
    try {
      const response = await api.delete(`/events/${eventId}`);
      fetchEvents();
      toast.success(response.data.message);
    } catch (error) {
      toast.error(error.response?.data?.error || 'Error deleting event');
    }
  };

  const handleAddToCalendar = (event) => {
    addEventToCalendar(event);
    toast.success('Event added to your calendar');
  };

  const formatDateTime = (date, startTime, endTime) => {
    if (!date || !startTime || !endTime) return 'Invalid Date or Time';
    
    try {
      const startDateTime = new Date(`${date.split('T')[0]}T${startTime}`);
      const endDateTime = new Date(`${date.split('T')[0]}T${endTime}`);
  
      const formattedDate = format(new Date(date), 'MMM dd, yyyy');
      const formattedStartTime = format(startDateTime, 'hh:mm a');
      const formattedEndTime = format(endDateTime, 'hh:mm a');
      
      return `${formattedDate} | ${formattedStartTime} - ${formattedEndTime}`;
    } catch (error) {
      console.error("Error formatting date/time:", error);
      return 'Invalid Date or Time';
    }
  };    

  return (
    <>
      <ListGroup className="mb-4">
        <ListGroup.Item className="d-flex justify-content-between align-items-center">
          <h5>Upcoming Events</h5>
          {events.map((event) => (
            loggedInUserId === event.created_by && (
              <Button key={event.id} variant="outline-dark" size="sm" onClick={() => handleOpenEventModal(event)}>Add event</Button>
            )
          ))}
        </ListGroup.Item>
        {events.length === 0 ? (
          <p className='mx-3 my-2'>No events found</p>
        ) : (
          events.map((event) => (
            <ListGroup.Item key={event.id} className="d-flex justify-content-between align-items-center">
              <div>
                <h6>{event.title}</h6>
                <p className='mb-0'>{formatDateTime(event.date, event.start_time, event.end_time)} | {event.location}</p>
                <p className='mb-0'>{event.description}</p>
              </div>
              <div className="d-flex align-items-center gap-2">
                {loggedInUserId === event.created_by && (
                  <Dropdown align="end">
                    <Dropdown.Toggle variant="outline-dark" size="sm" id="dropdown-custom-components">
                      <MdSettings size={20} />
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                      <Dropdown.Item as="button" className='d-flex align-items-center gap-2' onClick={() => handleOpenEventModal(event)} title="Edit event">
                        <MdEdit size={20} /> Edit
                      </Dropdown.Item>
                      <Dropdown.Item as="button" className='text-danger d-flex align-items-center gap-2' onClick={() => handleDeleteEvent(event.id)} title="Delete event">
                        <MdDelete size={20} /> Delete
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                )}
                {loggedInUserId !== event.created_by && (
                  <>
                    <Button variant="outline-dark" size="sm" onClick={() => handleAddToCalendar(event)} title="Add event to calendar"><BsCalendarPlus size={20} /></Button>
                    <Button
                      variant={event.rsvp ? 'danger' : 'outline-purple'}
                      size="sm"
                      onClick={() => handleRSVP(event.id)}
                      disabled={isRSVPing}
                    >
                      {event.rsvp ? 'Cancel RSVP' : 'RSVP'}
                    </Button>
                  </>
                )}
              </div>
            </ListGroup.Item>
          ))
        )}
      </ListGroup>

      <Modal show={showEventModal} onHide={() => setShowEventModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{editEventId ? 'Edit Event' : 'Create Event'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <Form onSubmit={handleSaveEvent}>
          <Form.Control type="text" id="title" placeholder="Enter event title" value={formData.title} onChange={handleInputChange} required className="form-control mb-3" />
          <Form.Control type="date" id="date" value={formData.date ? format(new Date(formData.date), 'yyyy-MM-dd') : ''} onChange={handleInputChange} required className="form-control mb-3" />          
          <div className="d-flex flex-column flex-md-row mb-3">
            <Form.Control type="time" id="startTime" value={formData.startTime ? formData.startTime : ''} onChange={handleInputChange} required className="form-control me-md-2 mb-3 mb-md-0" />
            <Form.Control type="time" id="endTime" value={formData.endTime ? formData.endTime : ''} onChange={handleInputChange} required className="form-control" />
          </div>
          <Form.Control type="text" id="location" placeholder="Enter event location" value={formData.location} onChange={handleInputChange} required className="form-control mb-3" />
          <Form.Control as="textarea" id="description" rows={3} placeholder="Enter event description" value={formData.description} onChange={handleInputChange} required className="form-control mb-3" />          
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
