import React, { useState, useEffect } from 'react';
import { Table, Form, Container, Row, Col, Card } from 'react-bootstrap';

const Logs = () => {
  const [logs, setLogs] = useState([
    {
      id: 1,
      user: 'John Doe',
      action: 'Logged in',
      timestamp: '2024-10-08T14:20:00Z',
    },
    {
      id: 2,
      user: 'Jane Smith',
      action: 'Updated profile',
      timestamp: '2024-10-07T10:15:00Z',
    },
    {
      id: 3,
      user: 'Admin',
      action: 'Deleted user account',
      timestamp: '2024-10-06T09:05:00Z',
    },
  ]);

  const [searchQuery, setSearchQuery] = useState('');

  // Search filter for logs
  const filteredLogs = logs.filter(
    (log) =>
      log.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.action.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  return (
    <Container className="my-4">
      <Row className="mb-3">
        <Col>
          <h2 className="text-center text-blue">Activity Logs</h2>
        </Col>
      </Row>
      <Card className="shadow-lg border-0">
        <Card.Body>
          <Row className="mb-3">
            <Col md={4}>
              <Form.Group>
                <Form.Control
                  type="text"
                  placeholder="Search by user or action..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </Form.Group>
            </Col>
          </Row>
          <Table striped bordered hover responsive>
            <thead className="table-primary">
              <tr>
                <th>#</th>
                <th>User</th>
                <th>Action</th>
                <th>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.length > 0 ? (
                filteredLogs.map((log) => (
                  <tr key={log.id}>
                    <td>{log.id}</td>
                    <td>{log.user}</td>
                    <td>{log.action}</td>
                    <td>{formatTimestamp(log.timestamp)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center">
                    No logs found
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Logs;
