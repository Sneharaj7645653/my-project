import React from 'react';
import './Dashboard.css';
import ProgressChart from '../ProgressChart/ProgressChart';

function Dashboard() {
  return (
    <div className="dashboard">
      <h1>Study Dashboard</h1>
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Today's Study</h3>
          <p>2.5 hours</p>
        </div>
        <div className="stat-card">
          <h3>Notes</h3>
          <p>15</p>
        </div>
      </div>
      <ProgressChart />
    </div>
  );
}

export default Dashboard;