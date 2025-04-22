import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import './QuizGenerator.css';

function QuizGenerator() {
  const [category, setCategory] = useState('9');
  const [difficulty, setDifficulty] = useState('medium');
  const [questions, setQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
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

  // Memoize shuffled options to prevent re-shuffling on re-render
  const questionsWithShuffledOptions = useMemo(() => {
    return questions.map(q => ({
      ...q,
      shuffledOptions: [...q.incorrect_answers, q.correct_answer]
        .sort(() => Math.random() - 0.5)
    }));
  }, [questions]);

  const generateQuiz = async () => {
    setIsLoading(true);
    setError(null);
    setCurrentPage(1);
    setIsSubmitted(false);
    setUserAnswers({});
    setScore(0);
    
    try {
      const response = await axios.get('https://opentdb.com/api.php', {
        params: {
          amount: 10,
          category,
          difficulty,
          type: 'multiple',
          encode: 'url3986'
        }
      });

      if (!response.data.results || response.data.results.length === 0) {
        throw new Error('No questions found for these settings');
      }

      const decodedQuestions = response.data.results.map(q => ({
        id: Math.random().toString(36).substr(2, 9),
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

  const handleAnswerSelect = (questionId, answer) => {
    if (!userAnswers[questionId] && !isSubmitted) {
      setUserAnswers(prev => ({
        ...prev,
        [questionId]: answer
      }));
    }
  };

  const submitQuiz = () => {
    let correct = 0;
    questions.forEach(q => {
      if (userAnswers[q.id] === q.correct_answer) {
        correct++;
      }
    });
    
    setScore(correct);
    setIsSubmitted(true);
    
    // Save to quiz history
    const quizResult = {
      date: new Date().toISOString(),
      category: categories.find(c => c.id === category)?.name || 'General',
      difficulty,
      totalQuestions: questions.length,
      correctAnswers: correct,
      questions: questions.map(q => ({
        question: q.question,
        userAnswer: userAnswers[q.id],
        correctAnswer: q.correct_answer
      }))
    };
    
    const history = JSON.parse(localStorage.getItem('quizHistory')) || [];
    localStorage.setItem('quizHistory', JSON.stringify([...history, quizResult]));
  };

  // Pagination logic
  const indexOfLastQuestion = currentPage * questionsPerPage;
  const indexOfFirstQuestion = indexOfLastQuestion - questionsPerPage;
  const currentQuestions = questionsWithShuffledOptions.slice(indexOfFirstQuestion, indexOfLastQuestion);
  const totalPages = Math.ceil(questions.length / questionsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="quiz-generator">
      <h1>Trivia Quiz Generator</h1>
      
      {!isSubmitted && (
        <div className="controls">
          <div className="control-group">
            <label>Category:</label>
            <select 
              value={category} 
              onChange={(e) => setCategory(e.target.value)}
              disabled={isLoading || questions.length > 0}
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
              disabled={isLoading || questions.length > 0}
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
            {isLoading ? 'Loading...' : questions.length ? 'New Quiz' : 'Generate Quiz'}
          </button>
        </div>
      )}

      {error && <div className="error-message">{error}</div>}

      {isSubmitted ? (
        <div className="quiz-results">
          <h2>Quiz Results: {score}/{questions.length} correct</h2>
          <button onClick={generateQuiz} className="generate-btn">
            Start New Quiz
          </button>
        </div>
      ) : (
        <div className="questions-container">
          {currentQuestions.length > 0 && (
            <button 
              onClick={submitQuiz}
              className="submit-btn"
              disabled={Object.keys(userAnswers).length < questions.length}
            >
              Submit Quiz
            </button>
          )}

          {currentQuestions.map((q, index) => {
            const isAnswered = !!userAnswers[q.id];
            const isCorrect = isSubmitted && userAnswers[q.id] === q.correct_answer;
            
            return (
              <div key={q.id} className="question-card">
                <h3>Question {indexOfFirstQuestion + index + 1}</h3>
                <p dangerouslySetInnerHTML={{ __html: q.question }} />
                
                <div className="options">
                  {q.shuffledOptions.map((option, i) => {
                    let btnClass = 'option-btn';
                    if (isSubmitted) {
                      if (option === q.correct_answer) {
                        btnClass += ' correct';
                      } else if (option === userAnswers[q.id]) {
                        btnClass += ' incorrect';
                      }
                    } else if (option === userAnswers[q.id]) {
                      btnClass += ' selected';
                    }
                    
                    return (
                      <button
                        key={i}
                        className={btnClass}
                        onClick={() => handleAnswerSelect(q.id, option)}
                        disabled={isSubmitted || isAnswered}
                      >
                        {option}
                        {isSubmitted && option === q.correct_answer && (
                          <span className="correct-marker"> ✓</span>
                        )}
                        {isSubmitted && option === userAnswers[q.id] && option !== q.correct_answer && (
                          <span className="incorrect-marker"> ✗</span>
                        )}
                      </button>
                    );
                  })}
                </div>
                
                {isSubmitted && (
                  <div className={`feedback ${isCorrect ? 'correct' : 'incorrect'}`}>
                    {isCorrect ? 'Correct!' : `Correct answer: ${q.correct_answer}`}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {!isSubmitted && questions.length > questionsPerPage && (
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