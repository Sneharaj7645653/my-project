import React, { useState, useEffect } from 'react';
import './Timer.css';

function Timer() {
  // Load saved duration from localStorage or default to 25 minutes
  const [duration, setDuration] = useState(() => {
    const saved = localStorage.getItem('focusDuration');
    return saved ? parseInt(saved) : 25;
  });
  
  const [timeLeft, setTimeLeft] = useState(() => {
    const saved = localStorage.getItem('focusTimeLeft');
    return saved ? parseInt(saved) : duration * 60;
  });
  
  const [isActive, setIsActive] = useState(false);
  const [isBreak, setIsBreak] = useState(false);

  // Save to localStorage whenever duration or timeLeft changes
  useEffect(() => {
    localStorage.setItem('focusDuration', duration.toString());
    localStorage.setItem('focusTimeLeft', timeLeft.toString());
  }, [duration, timeLeft]);

  useEffect(() => {
    let interval;
    
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          const newTime = prev - 1;
          localStorage.setItem('focusTimeLeft', newTime.toString());
          return newTime;
        });
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      clearInterval(interval);
      alert(isBreak ? "Break time over! Time to focus." : "Time for a break!");
      setIsBreak(!isBreak);
      setTimeLeft(isBreak ? duration * 60 : 5 * 60); // 5 min break
    }

    return () => clearInterval(interval);
  }, [isActive, timeLeft, isBreak, duration]);

  const handleStartPause = () => {
    setIsActive(!isActive);
  };

  const handleReset = () => {
    setIsActive(false);
    setIsBreak(false);
    setTimeLeft(duration * 60);
  };

  const handleDurationChange = (e) => {
    const newDuration = parseInt(e.target.value);
    setDuration(newDuration);
    if (!isActive) {
      setTimeLeft(newDuration * 60);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  // When a focus session completes:
const saveTimerSession = (duration) => {
    const history = JSON.parse(localStorage.getItem('timerHistory')) || [];
    localStorage.setItem('timerHistory', JSON.stringify([
      ...history,
      {
        date: new Date().toISOString(),
        duration: duration // in minutes
      }
    ]));
  };

  return (
    <div className="timer-container">
      <h1>{isBreak ? "Break Time" : "Focus Time"}</h1>
      
      <div className="duration-selector">
        <label>Focus Duration (minutes):</label>
        <select 
          value={duration} 
          onChange={handleDurationChange}
          disabled={isActive}
        >
          <option value="15">15</option>
          <option value="25">25</option>
          <option value="30">30</option>
          <option value="45">45</option>
          <option value="60">60</option>
        </select>
      </div>

      <div className="timer-display">
        {formatTime(timeLeft)}
      </div>
      
      <div className="timer-controls">
        <button 
          onClick={handleStartPause} 
          className={`timer-btn ${isActive ? 'pause-btn' : 'start-btn'}`}
        >
          {isActive ? 'Pause' : 'Start'}
        </button>
        <button 
          onClick={handleReset} 
          className="timer-btn reset-btn"
        >
          Reset
        </button>
      </div>
      
      <div className="progress-bar">
        <div 
          className="progress-fill"
          style={{
            width: `${((duration * 60 - timeLeft) / (duration * 60)) * 100}%`
          }}
        ></div>
      </div>
    </div>
  );
}

export default Timer;