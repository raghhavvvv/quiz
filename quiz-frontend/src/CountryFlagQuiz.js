import React, { useState, useEffect } from 'react';
import './CountryFlagQuiz.css';

const API_URL = "https://quiz-wfun.onrender.com";

function CountryFlagQuiz({ onBack }) {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [isAnswered, setIsAnswered] = useState(false);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState(null);

  const flagQuestionIds = ['flag1', 'flag2', 'flag3', 'flag4', 'flag5', 'flag6', 'flag7', 'flag8', 'flag9', 'flag10'];

  useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = async () => {
    try {
      const questionPromises = flagQuestionIds.map(id => 
        fetch(`${API_URL}/api/quiz/${id}`).then(res => res.json())
      );
      const loadedQuestions = await Promise.all(questionPromises);
      setQuestions(loadedQuestions);
      setLoading(false);
    } catch (error) {
      console.error('Failed to load questions:', error);
      setLoading(false);
    }
  };

  const handleAnswerSelect = (optionId) => {
    if (isAnswered) return;
    setSelectedAnswer(optionId);
  };

  const handleSubmitAnswer = async () => {
    if (!selectedAnswer || isAnswered) return;

    setIsAnswered(true);
    const currentQuestion = questions[currentQuestionIndex];

    try {
      const response = await fetch(`${API_URL}/api/quiz/check-answer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questionId: currentQuestion.questionId,
          answer: { userAnswerId: selectedAnswer }
        })
      });

      const result = await response.json();
      
      if (result.result === 'correct') {
        setScore(score + 1);
        setFeedback({ type: 'correct', message: 'Correct!' });
      } else {
        setFeedback({ type: 'incorrect', message: 'Incorrect!' });
      }

      setTimeout(() => {
        if (currentQuestionIndex < questions.length - 1) {
          setCurrentQuestionIndex(currentQuestionIndex + 1);
          setSelectedAnswer(null);
          setIsAnswered(false);
          setFeedback(null);
        } else {
          setShowResult(true);
        }
      }, 1500);
    } catch (error) {
      console.error('Failed to submit answer:', error);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setScore(0);
    setShowResult(false);
    setIsAnswered(false);
    setFeedback(null);
  };

  if (loading) {
    return <div className="flag-quiz-loading">Loading country flag quiz...</div>;
  }

  if (questions.length === 0) {
    return <div className="flag-quiz-loading">No questions available. Please try again later.</div>;
  }

  if (showResult) {
    return (
      <div className="flag-quiz-result">
        <div className="result-content">
          <h1>🏳️ Country Flag Quiz Complete!</h1>
          <div className="score-display">
            <span className="score">{score}</span>
            <span className="total">/ {questions.length}</span>
          </div>
          <p className="score-message">
            {score >= 8 ? "Outstanding! You're a geography expert!" :
             score >= 6 ? "Great job! You know your world flags well." :
             score >= 4 ? "Good effort! Keep exploring world geography." :
             "Keep learning! There are many flags to discover."}
          </p>
          <div className="result-actions">
            <button onClick={resetQuiz} className="retry-button">Try Again</button>
            <button onClick={onBack} className="back-button">Back to Home</button>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  if (!currentQuestion || !currentQuestion.options) {
    return <div className="flag-quiz-loading">Loading question...</div>;
  }

  return (
    <div className="country-flag-quiz">
      <div className="quiz-header">
        <button onClick={onBack} className="back-btn">← Back</button>
        <div className="progress">
          <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
            ></div>
          </div>
        </div>
        <div className="score-display">Score: {score}</div>
      </div>

      <div className="question-container">
        <div className="question-image">
          <img src={currentQuestion.imageId} alt="Country flag" />
        </div>
        
        <h2 className="question-text">{currentQuestion.questionText}</h2>
        
        <div className="options-grid">
          {currentQuestion.options.map((option) => (
            <button
              key={option.optionId}
              className={`option-button ${
                selectedAnswer === option.optionId ? 'selected' : ''
              } ${isAnswered ? 'disabled' : ''}`}
              onClick={() => handleAnswerSelect(option.optionId)}
              disabled={isAnswered}
            >
              {option.text}
            </button>
          ))}
        </div>

        {feedback && (
          <div className={`feedback ${feedback.type}`}>
            {feedback.message}
          </div>
        )}

        <button
          className="submit-button"
          onClick={handleSubmitAnswer}
          disabled={!selectedAnswer || isAnswered}
        >
          {isAnswered ? 'Next Question...' : 'Submit Answer'}
        </button>
      </div>
    </div>
  );
}

export default CountryFlagQuiz;
