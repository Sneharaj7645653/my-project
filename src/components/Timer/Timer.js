import React, { useState, useEffect } from 'react';
import './Timer.css';

function Timer() {
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isBreak, setIsBreak] = useState(false);

  useEffect(() => {
    let interval = null;
    
    if (isActive) {
      interval = setInterval(() => {
        if (seconds === 0) {
          if (minutes === 0) {
            clearInterval(interval);
            alert(isBreak ? "Break time over! Time to focus." : "Time for a break!");
            setIsBreak(!isBreak);
            setMinutes(isBreak ? 25 : 5);
            setIsActive(false);
          } else {
            setMinutes(minutes - 1);
            setSeconds(59);
          }
        } else {
          setSeconds(seconds - 1);
        }
      }, 1000);
    } else {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [isActive, minutes, seconds, isBreak]);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setIsBreak(false);
    setMinutes(25);
    setSeconds(0);
  };

  return (
    <div className="timer-container">
      <h1>{isBreak ? "Break Time" : "Focus Time"}</h1>
      <div className="timer-display">
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </div>
      <div className="timer-controls">
        <button onClick={toggleTimer} className="timer-btn">
          {isActive ? 'Pause' : 'Start'}
        </button>
        <button onClick={resetTimer} className="timer-btn reset-btn">
          Reset
        </button>
      </div>
    </div>
  );
}

export default Timer;