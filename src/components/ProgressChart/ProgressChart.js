import React from 'react';
import './ProgressChart.css';

function ProgressChart() {
  // Mock data - replace with real API data
  const studyData = [
    { day: 'Mon', hours: 2 },
    { day: 'Tue', hours: 3.5 },
    { day: 'Wed', hours: 1.5 },
    { day: 'Thu', hours: 4 },
    { day: 'Fri', hours: 2.5 },
    { day: 'Sat', hours: 1 },
    { day: 'Sun', hours: 0 }
  ];

  const maxHours = Math.max(...studyData.map(item => item.hours));

  return (
    <div className="progress-chart">
      <h2>Weekly Study Progress</h2>
      <div className="chart-bars">
        {studyData.map((item, index) => (
          <div key={index} className="chart-bar-container">
            <div className="chart-bar-label">{item.day}</div>
            <div className="chart-bar-bg">
              <div 
                className="chart-bar-fill" 
                style={{ height: `${(item.hours / maxHours) * 100}%` }}
              ></div>
            </div>
            <div className="chart-bar-value">{item.hours}h</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProgressChart;