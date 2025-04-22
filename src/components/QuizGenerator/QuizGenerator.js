import React, { useState } from 'react';
import axios from 'axios';
import './QuizGenerator.css';

function QuizGenerator() {
  const [category, setCategory] = useState('9'); // General Knowledge by default
  const [difficulty, setDifficulty] = useState('medium');
  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const questionsPerPage = 3;

  const categories = [
    { id: '9', name: 'General Knowledge' },
    { id: '18', name: 'Science: Computers' },
    { id: '19', name: 'Science: Mathematics' },
    { id: '23', name: 'History' },
    { id: '22', name: 'Geography' }
  ];

  const generateQuiz = async () => {
    setIsLoading(true);
    setError(null);
    setCurrentPage(1);
    
    try {
      const response = await axios.get('https://opentdb.com/api.php', {
        params: {
          amount: 10,
          category,
          difficulty,
          type: 'multiple', // Multiple choice questions
          encode: 'url3986' // URL encoding format
        }
      });

      if (!response.data.results || response.data.results.length === 0) {
        throw new Error('No questions found for these settings');
      }

      const decodedQuestions = response.data.results.map(q => ({
        question: decodeURIComponent(q.question),
        correct_answer: decodeURIComponent(q.correct_answer),
        incorrect_answers: q.incorrect_answers.map(a => decodeURIComponent(a))
      }));

      setQuestions(decodedQuestions);
      
    } catch (err) {
      console.error('API Error:', err);
      setError(err.message || 'Failed to fetch questions. Try different settings.');
      setQuestions([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Pagination logic
  const indexOfLastQuestion = currentPage * questionsPerPage;
  const indexOfFirstQuestion = indexOfLastQuestion - questionsPerPage;
  const currentQuestions = questions.slice(indexOfFirstQuestion, indexOfLastQuestion);
  const totalPages = Math.ceil(questions.length / questionsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="quiz-generator">
      <h1>Trivia Quiz Generator</h1>
      
      <div className="controls">
        <div className="control-group">
          <label>Category:</label>
          <select 
            value={category} 
            onChange={(e) => setCategory(e.target.value)}
            disabled={isLoading}
          >
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>

        <div className="control-group">
          <label>Difficulty:</label>
          <select 
            value={difficulty} 
            onChange={(e) => setDifficulty(e.target.value)}
            disabled={isLoading}
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>

        <button
          onClick={generateQuiz}
          disabled={isLoading}
          className="generate-btn"
        >
          {isLoading ? 'Loading...' : 'Generate Quiz'}
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="questions-container">
        {currentQuestions.length > 0 ? (
          currentQuestions.map((q, index) => (
            <div key={index} className="question-card">
              <h3>Question {indexOfFirstQuestion + index + 1}</h3>
              <p dangerouslySetInnerHTML={{ __html: q.question }} />
              
              <div className="options">
                {[...q.incorrect_answers, q.correct_answer]
                  .sort(() => Math.random() - 0.5)
                  .map((option, i) => (
                    <button key={i} className="option-btn">
                      {option}
                    </button>
                  ))}
              </div>
            </div>
          ))
        ) : (
          !isLoading && <div className="placeholder">
            {error ? 'Try again' : 'Select settings and generate a quiz!'}
          </div>
        )}
      </div>

      {/* Pagination */}
      {questions.length > questionsPerPage && (
        <div className="pagination">
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className="page-btn"
          >
            &laquo; Previous
          </button>
          
          {Array.from({ length: totalPages }).map((_, index) => (
            <button
              key={index}
              onClick={() => paginate(index + 1)}
              className={`page-btn ${currentPage === index + 1 ? 'active' : ''}`}
            >
              {index + 1}
            </button>
          ))}
          
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="page-btn"
          >
            Next &raquo;
          </button>
        </div>
      )}
    </div>
  );
}

export default QuizGenerator;