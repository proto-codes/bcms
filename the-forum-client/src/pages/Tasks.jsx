import React, { useState, useEffect } from 'react';
import { Container, Card, Form, Button, ListGroup, Row, Col, Alert } from 'react-bootstrap';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import api from '../api/axios';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [editingTask, setEditingTask] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await api.get('/tasks');
        setTasks(response.data); // Assume response.data is the array of tasks
      } catch (error) {
        console.error('Error fetching tasks:', error);
        setError('Failed to fetch tasks.');
      }
    };

    fetchTasks();
  }, []);

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!taskTitle || !dueDate) return;

    try {
      const response = await api.post('/tasks', {
        title: taskTitle,
        description: taskDescription,
        dueDate,
        priority,
      });
      setTasks([...tasks, response.data]);
      setSuccess('Task added successfully!');
      clearForm();
    } catch (error) {
      console.error('Error adding task:', error);
      setError('Failed to add task.');
    }
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setTaskTitle(task.title);
    setTaskDescription(task.description);
    setDueDate(task.dueDate);
    setPriority(task.priority);
  };

  const handleUpdateTask = async (e) => {
    e.preventDefault();
    if (!taskTitle || !dueDate) return;

    try {
      const response = await api.put(`/tasks/${editingTask.id}`, {
        title: taskTitle,
        description: taskDescription,
        dueDate,
        priority,
      });
      setTasks(tasks.map((task) => (task.id === editingTask.id ? response.data : task)));
      setSuccess('Task updated successfully!');
      clearForm();
      setEditingTask(null);
    } catch (error) {
      console.error('Error updating task:', error);
      setError('Failed to update task.');
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await api.delete(`/tasks/${taskId}`);
      setTasks(tasks.filter((task) => task.id !== taskId));
      setSuccess('Task deleted successfully!');
    } catch (error) {
      console.error('Error deleting task:', error);
      setError('Failed to delete task.');
    }
  };

  const clearForm = () => {
    setTaskTitle('');
    setTaskDescription('');
    setDueDate('');
    setPriority('Medium');
    setEditingTask(null);
    setError('');
    setSuccess('');
  };

  return (
    <Container className="my-4">
      <Card className="shadow-lg border-0">
        <Card.Body>
          <h2 className="mb-4 text-gold-dark">{editingTask ? 'Edit Task' : 'Add New Task'}</h2>
          
          {/* Success and Error Alerts */}
          {success && <Alert variant="success">{success}</Alert>}
          {error && <Alert variant="danger">{error}</Alert>}
          
          <Form onSubmit={editingTask ? handleUpdateTask : handleAddTask} className="mb-4">
            <Form.Group className="mb-3">
              <Form.Label>Task Title</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter task title"
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Task Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Enter task description"
                value={taskDescription}
                onChange={(e) => setTaskDescription(e.target.value)}
              />
            </Form.Group>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Due Date</Form.Label>
                  <Form.Control
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Priority</Form.Label>
                  <Form.Select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            <Button variant={editingTask ? 'success' : 'gold-dark'} type="submit">
              {editingTask ? 'Update Task' : 'Add Task'}
            </Button>
            {editingTask && (
              <Button variant="secondary" className="ms-2" onClick={clearForm}>
                Cancel
              </Button>
            )}
          </Form>

          <h4 className="mb-3 text-gold-dark">Task List</h4>
          {tasks.length === 0 ? (
            <p className="text-muted">No tasks available. Please add a new task.</p>
          ) : (
            <ListGroup>
              {tasks.map((task) => (
                <ListGroup.Item key={task.id} className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6>{task.title} <span className="text-muted">({task.priority})</span></h6>
                    <p>{task.description}</p>
                    <small className="text-muted">Due: {new Date(task.dueDate).toLocaleDateString()}</small>
                  </div>
                  <div>
                    <Button variant="outline-secondary me-1" onClick={() => handleEditTask(task)}>
                      <FaEdit className="d-block d-md-none" /> <span className="d-none d-md-block">Edit</span>
                    </Button>
                    <Button variant="outline-secondary" className="text-danger" onClick={() => handleDeleteTask(task.id)}>
                      <FaTrashAlt className="d-block d-md-none" /> <span className="d-none d-md-block">Delete</span>
                    </Button>
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Tasks;
