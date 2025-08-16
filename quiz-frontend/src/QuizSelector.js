import React, { useState, useEffect } from 'react';
import './QuizSelector.css';

const API_URL = "https://quiz-wfun.onrender.com";

function QuizSelector({ onQuizSelect, onBack }) {
  const [quizTypes, setQuizTypes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/api/quiz-types`)
      .then((res) => res.json())
      .then((data) => {
        setQuizTypes(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to fetch quiz types:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="loading">Loading quiz types...</div>;
  }

  return (
    <div className="quiz-selector">
      <div className="selector-header">
        <button onClick={onBack} className="back-button">← Back</button>
        <h1>Advanced Quizzes</h1>
        <div className="spacer"></div>
      </div>

      <div className="quiz-types-grid">
        {quizTypes.map((quizType) => (
          <button
            key={quizType.id}
            className="quiz-type-button"
            onClick={() => onQuizSelect(quizType.id)}
          >
            <div className="quiz-type-icon">{quizType.icon}</div>
            <div className="quiz-type-content">
              <h3>{quizType.name}</h3>
              <p>{quizType.description}</p>
            </div>
          </button>
        ))}
      </div>

      <div className="selector-footer">
        <button className="add-button">+</button>
      </div>
    </div>
  );
}

export default QuizSelector;
