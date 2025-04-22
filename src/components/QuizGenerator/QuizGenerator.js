import React, { useState } from 'react';
import './QuizGenerator.css';
import axios from 'axios';

function QuizGenerator() {
  const [topic, setTopic] = useState('');
  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const generateQuiz = async () => {
    if (!topic.trim()) return;
    
    setIsLoading(true);
    try {
      // Mock API fallback
      const mockQuestions = [
        `1. What is the main purpose of ${topic}?`,
        `2. Explain the key concept of ${topic} in 2-3 sentences.`,
        `3. What are the advantages of using ${topic}?`
      ];
      
      setQuestions(mockQuestions);
      
      /* Real API (uncomment when ready)
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content: `Generate 3 quiz questions about ${topic}` }]
        },
        {
          headers: {
            'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      );
      setQuestions(response.data.choices[0].message.content.split('\n'));
      */
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to generate quiz. Using mock data instead.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="quiz-generator">
      <h1>Quiz Generator</h1>
      <div className="input-group">
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Enter a topic (e.g., React Hooks)"
          className="topic-input"
        />
        <button 
          onClick={generateQuiz} 
          disabled={isLoading}
          className="generate-btn"
        >
          {isLoading ? 'Generating...' : 'Generate Quiz'}
        </button>
      </div>
      <div className="questions-container">
        {questions.map((q, i) => (
          <div key={i} className="question-card">
            <p>{q}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default QuizGenerator;