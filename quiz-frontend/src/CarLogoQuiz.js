import React, { useState, useEffect, useCallback } from 'react';
import './CarLogoQuiz.css';

const API_URL = "https://quiz-wfun.onrender.com";

// Simple confetti animation function
const createConfetti = () => {
  const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7', '#dda0dd', '#98d8c8'];
  const confettiCount = 50;
  
  for (let i = 0; i < confettiCount; i++) {
    const confetti = document.createElement('div');
    confetti.style.position = 'fixed';
    confetti.style.left = Math.random() * 100 + 'vw';
    confetti.style.top = '-10px';
    confetti.style.width = '10px';
    confetti.style.height = '10px';
    confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    confetti.style.borderRadius = '50%';
    confetti.style.pointerEvents = 'none';
    confetti.style.zIndex = '9999';
    confetti.style.animation = `confetti-fall ${Math.random() * 2 + 2}s linear forwards`;
    
    document.body.appendChild(confetti);
    
    setTimeout(() => {
      confetti.remove();
    }, 4000);
  }
};

// Add CSS animation for confetti
const addConfettiStyles = () => {
  if (!document.getElementById('confetti-styles')) {
    const style = document.createElement('style');
    style.id = 'confetti-styles';
    style.textContent = `
      @keyframes confetti-fall {
        0% {
          transform: translateY(-10px) rotate(0deg);
          opacity: 1;
        }
        100% {
          transform: translateY(100vh) rotate(360deg);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);
  }
};

function CarLogoQuiz({ onBack }) {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [isAnswered, setIsAnswered] = useState(false);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState(null);

  const loadQuestions = useCallback(async () => {
    const carQuestionIds = ['car1', 'car2', 'car3', 'car4', 'car5', 'car6', 'car7', 'car8', 'car9', 'car10'];
    
    try {
      console.log('Loading car questions...');
      const questionPromises = carQuestionIds.map(id => 
        fetch(`${API_URL}/api/quiz/${id}`)
          .then(res => {
            console.log(`Response for ${id}:`, res.status);
            if (!res.ok) {
              throw new Error(`Failed to load question ${id}: ${res.status}`);
            }
            return res.json();
          })
          .then(data => {
            console.log(`Question ${id} data:`, data);
            return data;
          })
      );
      const loadedQuestions = await Promise.all(questionPromises);
      console.log('All loaded questions:', loadedQuestions);
      console.log('Questions array length:', loadedQuestions.length);
      console.log('Setting loading to false...');
      setQuestions(loadedQuestions);
      setLoading(false);
      console.log('Loading state should now be false');
    } catch (error) {
      console.error('Failed to load questions:', error);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    addConfettiStyles();
    loadQuestions();
  }, [loadQuestions]);

  const handleAnswerSelect = (optionId) => {
    if (isAnswered) return;
    
    const currentQuestion = questions[currentQuestionIndex];
    if (currentQuestion.questionType === 'checkboxes') {
      const current = selectedAnswer || [];
      let newSelection;
      
      if (current.includes(optionId)) {
        newSelection = current.filter(id => id !== optionId);
      } else {
        newSelection = [...current, optionId];
      }
      
      setSelectedAnswer(newSelection);
    } else {
      setSelectedAnswer(optionId);
    }
  };

  const handleTypeAnswer = (event) => {
    event.preventDefault();
    const input = event.target.answer.value;
    if (input.trim()) {
      setSelectedAnswer(input.trim());
      submitAnswer({ userAnswer: input.trim() });
    }
  };

  const handleReorder = (itemId) => {
    if (isAnswered) return;
    const current = selectedAnswer || [];
    if (current.includes(itemId)) {
      setSelectedAnswer(current.filter(id => id !== itemId));
    } else {
      setSelectedAnswer([...current, itemId]);
    }
  };

  const handleReorderSubmit = () => {
    const currentQuestion = questions[currentQuestionIndex];
    if (selectedAnswer && selectedAnswer.length === currentQuestion.items.length) {
      submitAnswer({ userOrder: selectedAnswer });
    }
  };

  const handleRange = (value) => {
    if (isAnswered) return;
    setSelectedAnswer(value);
  };

  const handleRangeSubmit = () => {
    if (selectedAnswer !== undefined && selectedAnswer !== null) {
      submitAnswer({ userValue: selectedAnswer });
    }
  };

  const handleLocation = (event) => {
    if (isAnswered) return;
    const rect = event.target.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    setSelectedAnswer({ x, y });
    submitAnswer({ userLocation: { x, y } });
  };

  const handleSubmitAnswer = async () => {
    const currentQuestion = questions[currentQuestionIndex];
    
    if (currentQuestion.questionType === 'multiple-choice') {
      if (!selectedAnswer || isAnswered) return;
      submitAnswer({ userAnswerId: selectedAnswer });
    } else if (currentQuestion.questionType === 'checkboxes') {
      if (!selectedAnswer || selectedAnswer.length === 0 || isAnswered) return;
      submitAnswer({ userSelectedIds: selectedAnswer });
    }
  };

  const submitAnswer = async (answerData) => {
    if (isAnswered) return;

    setIsAnswered(true);
    const currentQuestion = questions[currentQuestionIndex];

    try {
      const response = await fetch(`${API_URL}/api/quiz/check-answer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questionId: currentQuestion.questionId,
          answer: answerData
        })
      });

      const result = await response.json();
      
      if (result.result === 'correct') {
        setScore(prevScore => prevScore + 1);
        setFeedback({ type: 'correct', message: 'Correct!' });
        // Trigger confetti animation for correct answers
        createConfetti();
      } else {
        setFeedback({ 
          type: 'incorrect', 
          message: `Incorrect! The correct answer is: ${result.correctAnswer}` 
        });
      }

      setTimeout(() => {
        setCurrentQuestionIndex(prevIndex => {
          if (prevIndex < questions.length - 1) {
            setSelectedAnswer(null);
            setIsAnswered(false);
            setFeedback(null);
            return prevIndex + 1;
          } else {
            setShowResult(true);
            return prevIndex;
          }
        });
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
    return <div className="car-quiz-loading">Loading car logo quiz...</div>;
  }

  if (questions.length === 0) {
    return <div className="car-quiz-loading">No questions available. Please try again later.</div>;
  }

  if (showResult) {
    return (
      <div className="car-quiz-result">
        <div className="result-content">
          <h1>🚗 Car Logo Quiz Complete!</h1>
          <div className="score-display">
            <span className="score">{score}</span>
            <span className="total">/ {questions.length}</span>
          </div>
          <p className="score-message">
            {score >= 8 ? "Excellent! You're a car logo expert!" :
             score >= 6 ? "Good job! You know your car brands well." :
             score >= 4 ? "Not bad! Keep learning about car logos." :
             "Keep practicing! There's room for improvement."}
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

  if (!currentQuestion) {
    return <div className="car-quiz-loading">Loading question...</div>;
  }

  return (
    <div className="car-logo-quiz">
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
        {currentQuestion.imageId && (
          <div className="question-image">
            <img src={currentQuestion.imageId} alt="Car logo" />
          </div>
        )}
        
        <h2 className="question-text">{currentQuestion.questionText}</h2>
        
        {currentQuestion.questionType === 'multiple-choice' && (
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
        )}

        {currentQuestion.questionType === 'checkboxes' && (
          <div className="checkboxes-area">
            {currentQuestion.options.map((option) => (
              <label key={option.optionId} className="checkbox-option">
                <input
                  type="checkbox"
                  checked={(selectedAnswer || []).includes(option.optionId)}
                  onChange={() => handleAnswerSelect(option.optionId)}
                  disabled={isAnswered}
                />
                <span>{option.text}</span>
              </label>
            ))}
          </div>
        )}

        {currentQuestion.questionType === 'type-answer' && (
          <div className="type-answer-area">
            <form onSubmit={handleTypeAnswer}>
              <input
                type="text"
                name="answer"
                placeholder="Type your answer here..."
                className="answer-input"
                autoComplete="off"
                disabled={isAnswered}
              />
              {!isAnswered && (
                <button type="submit" className="submit-button">
                  Submit Answer
                </button>
              )}
            </form>
          </div>
        )}

        {currentQuestion.questionType === 'reorder' && (
          <div className="reorder-area">
            <div className="reorder-instructions">
              <p>Click items in the order you want them:</p>
              <div className="selected-order">
                {selectedAnswer?.map((itemId, index) => {
                  const item = currentQuestion.items.find(i => i.itemId === itemId);
                  return (
                    <span key={itemId} className="order-item">
                      {index + 1}. {item?.text}
                    </span>
                  );
                })}
              </div>
            </div>
            <div className="reorder-items">
              {currentQuestion.items.map((item) => (
                <button
                  key={item.itemId}
                  onClick={() => handleReorder(item.itemId)}
                  className={`reorder-item ${(selectedAnswer || []).includes(item.itemId) ? 'selected' : ''}`}
                  disabled={isAnswered}
                >
                  {item.text}
                </button>
              ))}
            </div>
            {!isAnswered && (
              <button 
                onClick={handleReorderSubmit}
                className="submit-button"
                disabled={!selectedAnswer || selectedAnswer.length !== currentQuestion.items.length}
              >
                Submit Order
              </button>
            )}
          </div>
        )}

        {currentQuestion.questionType === 'range' && (
          <div className="range-area">
            <div className="range-slider">
              <input
                type="range"
                min={currentQuestion.minValue}
                max={currentQuestion.maxValue}
                value={selectedAnswer || currentQuestion.minValue}
                onChange={(e) => handleRange(parseInt(e.target.value))}
                className="range-input"
                disabled={isAnswered}
              />
              <div className="range-value">
                Selected: {selectedAnswer || currentQuestion.minValue}
              </div>
            </div>
            {!isAnswered && (
              <button 
                onClick={handleRangeSubmit}
                className="submit-button"
              >
                Submit
              </button>
            )}
          </div>
        )}

        {currentQuestion.questionType === 'pinpoint' && (
          <div className="pinpoint-area">
            <div className="pinpoint-instructions">
              <p>{currentQuestion.pinpointInstructions}</p>
            </div>
            <div className="image-container">
              <img 
                src={currentQuestion.imageId} 
                alt="Quiz context" 
                className="quiz-image clickable" 
                onClick={handleLocation}
                style={{ cursor: isAnswered ? 'default' : 'crosshair' }}
              />
              {selectedAnswer && selectedAnswer.x !== undefined && (
                <div 
                  className="pinpoint-marker"
                  style={{
                    left: `${selectedAnswer.x * 100}%`,
                    top: `${selectedAnswer.y * 100}%`
                  }}
                >
                  🎯
                </div>
              )}
            </div>
            <div className="pinpoint-feedback">
              <p>Click anywhere on the image above to mark your answer</p>
            </div>
          </div>
        )}

        {feedback && (
          <div className={`feedback ${feedback.type}`}>
            {feedback.message}
          </div>
        )}

        {(currentQuestion.questionType === 'multiple-choice' || currentQuestion.questionType === 'checkboxes') && (
          <button
            className="submit-button"
            onClick={handleSubmitAnswer}
            disabled={
              !selectedAnswer || 
              (currentQuestion.questionType === 'checkboxes' && selectedAnswer.length === 0) || 
              isAnswered
            }
          >
            {isAnswered ? 'Next Question...' : 'Submit Answer'}
          </button>
        )}
      </div>
    </div>
  );
}

export default CarLogoQuiz;
