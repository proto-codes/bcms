import React from 'react';
import { Bar, Line } from 'react-chartjs-2';
import { Container, Row, Col, Card } from 'react-bootstrap';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const StatisticsPage = () => {
  // Sample data for the bar chart and line chart
  const barData = {
    labels: ['January', 'February', 'March', 'April', 'May'],
    datasets: [
      {
        label: 'Task Completion',
        data: [12, 19, 8, 15, 11],
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const lineData = {
    labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    datasets: [
      {
        label: 'Daily Active Users',
        data: [200, 450, 300, 500, 400],
        fill: false,
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
        borderColor: 'rgba(255, 99, 132, 1)',
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <Container fluid className="my-4">
      <Row className="mb-4">
        <Col>
          <h2 className="text-center text-gold-dark">Statistics Dashboard</h2>
        </Col>
      </Row>
      <Row>
        <Col md={6} className="mb-4">
          <Card className="p-3 shadow">
            <h5>Task Completion (Bar Chart)</h5>
            <div style={{ height: '300px' }}>
              <Bar data={barData} options={options} />
            </div>
          </Card>
        </Col>
        <Col md={6} className="mb-4">
          <Card className="p-3 shadow">
            <h5>Daily Active Users (Line Chart)</h5>
            <div style={{ height: '300px' }}>
              <Line data={lineData} options={options} />
            </div>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default StatisticsPage;
