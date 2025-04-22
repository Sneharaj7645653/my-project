import React, { useEffect, useState } from 'react';
import './Dashboard.css';

function Dashboard() {
  const [stats, setStats] = useState({
    totalQuizzes: 0,
    totalQuestions: 0,
    correctAnswers: 0,
    accuracy: 0,
    recentQuizzes: []
  });

  useEffect(() => {
    const quizHistory = JSON.parse(localStorage.getItem('quizHistory')) || [];
    
    const totalQuizzes = quizHistory.length;
    const totalQuestions = quizHistory.reduce((sum, quiz) => sum + quiz.totalQuestions, 0);
    const correctAnswers = quizHistory.reduce((sum, quiz) => sum + quiz.correctAnswers, 0);
    const accuracy = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;

    setStats({
      totalQuizzes,
      totalQuestions,
      correctAnswers,
      accuracy,
      recentQuizzes: quizHistory.slice(-3).reverse() // Last 3 quizzes
    });
  }, []);

  return (
    <div className="dashboard">
      <h1>Quiz Performance Dashboard</h1>
      
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Quizzes Taken</h3>
          <p>{stats.totalQuizzes}</p>
        </div>
        
        <div className="stat-card">
          <h3>Questions Attempted</h3>
          <p>{stats.totalQuestions}</p>
        </div>
        
        <div className="stat-card">
          <h3>Correct Answers</h3>
          <p>{stats.correctAnswers}</p>
        </div>
        
        <div className="stat-card">
          <h3>Accuracy</h3>
          <p>{stats.accuracy}%</p>
        </div>
      </div>

      <div className="recent-quizzes">
        <h2>Recent Quizzes</h2>
        {stats.recentQuizzes.length > 0 ? (
          stats.recentQuizzes.map((quiz, index) => (
            <div key={index} className="quiz-card">
              <div className="quiz-header">
                <h3>{quiz.category} ({quiz.difficulty})</h3>
                <span>{new Date(quiz.date).toLocaleDateString()}</span>
              </div>
              <div className="quiz-result">
                <span className="score">{quiz.correctAnswers}/{quiz.totalQuestions}</span>
                <span className="accuracy">
                  {Math.round((quiz.correctAnswers / quiz.totalQuestions) * 100)}%
                </span>
              </div>
            </div>
          ))
        ) : (
          <p className="no-quizzes">No quiz data yet. Complete a quiz to see your stats!</p>
        )}
      </div>
    </div>
  );
}

export default Dashboard;