import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, TextField, Button, Grid } from '@mui/material';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import axios from 'axios';

function Dashboard() {
  const [cycleData, setCycleData] = useState([]);
  const [cycleStartDate, setCycleStartDate] = useState('');
  const [cycleLength, setCycleLength] = useState(28); // Default average cycle length

  // Simulated data - replace with actual data fetching logic if required
  const mockCycleData = [
    { date: '2024-01-01', mood: 5, cycleDay: 1 },
    { date: '2024-01-02', mood: 4, cycleDay: 2 },
    { date: '2024-01-03', mood: 6, cycleDay: 3 },
    // Add more sample data for the full cycle
  ];

  useEffect(() => {
    // Fetch cycle data if using an API
    // axios.get('your-api-url').then(response => setCycleData(response.data));

    // Otherwise, just use the mock data
    setCycleData(mockCycleData);
  }, []);

  // Calculate the next expected period date
  const calculateNextPeriod = (startDate) => {
    const start = new Date(startDate);
    start.setDate(start.getDate() + cycleLength); // Add cycle length to start date
    return start.toLocaleDateString();
  };

  return (
    <div>
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>Track Your Period</Typography>
          
          {/* Input for cycle start date */}
          <TextField
            label="Cycle Start Date"
            type="date"
            value={cycleStartDate}
            onChange={(e) => setCycleStartDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
          <Button variant="contained" color="primary" style={{ marginLeft: '10px' }}>
            Set Cycle Start
          </Button>

          {/* Expected Next Period */}
          {cycleStartDate && (
            <Typography variant="body1" style={{ marginTop: '20px' }}>
              Next Expected Period: {calculateNextPeriod(cycleStartDate)}
            </Typography>
          )}
        </CardContent>
      </Card>

      <Card style={{ marginTop: '20px' }}>
        <CardContent>
          <Typography variant="h6">Mood Tracking</Typography>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={cycleData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="mood" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Other sections can go here like symptoms tracking, cycle summary, etc. */}
    </div>
  );
}

export default Dashboard;
