import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './AdvancedQuiz.css';

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

function MixedQuiz({ onBack }) {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [results, setResults] = useState({});
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const mapInstanceRef = useRef(null);

  useEffect(() => {
    addConfettiStyles();
    
    fetch(`${API_URL}/api/mixed-quiz`)
      .then((res) => res.json())
      .then((data) => {
        console.log('Mixed quiz data received:', data);
        setQuestions(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to fetch mixed quiz data:', err);
        setLoading(false);
      });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    const currentQuestion = questions[currentQuestionIndex];
    if (currentQuestion && currentQuestion.questionType === 'real-world-map' && currentQuestion.mapConfig) {
      setTimeout(() => {
        initializeMap(currentQuestion.mapConfig, currentQuestion.questionId);
      }, 100);
    }
  }, [currentQuestionIndex, questions]);

  const currentQuestion = questions[currentQuestionIndex];

  const handleMultipleChoice = (optionId) => {
    if (selectedAnswers[currentQuestion.questionId]) return;
    
    setSelectedAnswers({ ...selectedAnswers, [currentQuestion.questionId]: optionId });
    checkAnswer({ userAnswerId: optionId });
  };

  const handleCheckboxes = (optionId) => {
    const current = selectedAnswers[currentQuestion.questionId] || [];
    let newSelection;
    
    if (current.includes(optionId)) {
      newSelection = current.filter(id => id !== optionId);
    } else {
      newSelection = [...current, optionId];
    }
    
    setSelectedAnswers({ ...selectedAnswers, [currentQuestion.questionId]: newSelection });
  };

  const handleCheckboxesSubmit = () => {
    if (selectedAnswers[currentQuestion.questionId] && selectedAnswers[currentQuestion.questionId].length > 0) {
      checkAnswer({ userSelectedIds: selectedAnswers[currentQuestion.questionId] });
    }
  };

  const handleRange = (value) => {
    setSelectedAnswers({ ...selectedAnswers, [currentQuestion.questionId]: value });
  };

  const handleRangeSubmit = () => {
    if (selectedAnswers[currentQuestion.questionId] !== undefined) {
      checkAnswer({ userValue: selectedAnswers[currentQuestion.questionId] });
    }
  };

  const handleLocation = (event) => {
    const rect = event.target.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    setSelectedAnswers({ ...selectedAnswers, [currentQuestion.questionId]: { x, y } });
    checkAnswer({ userLocation: { x, y } });
  };

  const handleTypeAnswer = (event) => {
    event.preventDefault();
    const input = event.target.answer.value;
    if (input.trim()) {
      checkAnswer({ userAnswer: input.trim() });
    }
  };

  const handleMapClick = (lat, lng) => {
    if (!currentQuestion) return;
    
    setSelectedAnswers({ ...selectedAnswers, [currentQuestion.questionId]: { lat, lng } });
    checkAnswer({ userLocation: { lat, lng } });
  };

  const initializeMap = (mapConfig, questionId) => {
    if (!mapConfig || !questionId) return;
    
    const mapElement = document.getElementById(`map-${questionId}`);
    if (mapElement && !mapInstanceRef.current) {
      try {
        const map = L.map(`map-${questionId}`, {
          center: [mapConfig.center.lat, mapConfig.center.lng],
          zoom: mapConfig.zoom || 10,
          zoomControl: true,
          attributionControl: true
        });

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors',
          maxZoom: 18
        }).addTo(map);

        mapConfig.landmarks.forEach(landmark => {
          const marker = L.marker([landmark.lat, landmark.lng], {
            title: landmark.name
          }).addTo(map);
          
          marker.bindPopup(`
            <div style="text-align: center;">
              <div style="font-size: 1.5rem; margin-bottom: 0.5rem;">${landmark.icon}</div>
              <strong>${landmark.name}</strong>
            </div>
          `);
        });

        map.on('click', (e) => {
          const { lat, lng } = e.latlng;
          handleMapClick(lat, lng);
          
          const userMarker = L.marker([lat, lng], {
            icon: L.divIcon({
              className: 'user-marker',
              html: '📍',
              iconSize: [30, 30],
              iconAnchor: [15, 30]
            })
          }).addTo(map);
          
          setTimeout(() => {
            map.removeLayer(userMarker);
          }, 3000);
        });

        mapInstanceRef.current = map;
      } catch (error) {
        console.error('Failed to initialize map:', error);
      }
    }
  };

  const checkAnswer = (answerData) => {
    if (!currentQuestion) return;
    
    fetch(`${API_URL}/api/quiz/check-answer`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        questionId: currentQuestion.questionId,
        answer: answerData,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log('Answer check result:', data);
        setResults({ ...results, [currentQuestion.questionId]: data });
        
        if (data.result === 'correct') {
          setScore(prevScore => prevScore + 1);
          // Trigger confetti animation for correct answers
          createConfetti();
        }
      })
      .catch((err) => console.error('Failed to check answer:', err));
  };

  const nextQuestion = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }
    
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setQuizCompleted(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setResults({});
    setScore(0);
    setQuizCompleted(false);
  };

  if (loading) {
    return <div className="loading">Loading mixed quiz...</div>;
  }

  if (questions.length === 0) {
    return <div>No questions available</div>;
  }

  if (quizCompleted) {
    return (
      <div className="quiz-container">
        <div className="quiz-header">
          <button onClick={onBack} className="back-button">← Back</button>
          <h1>Quiz Completed!</h1>
        </div>
        <div className="quiz-results">
          <h2>Final Score: {score}/{questions.length}</h2>
          <p>You answered {score} out of {questions.length} questions correctly!</p>
          <div className="result-actions">
            <button onClick={resetQuiz} className="reset-button">Try Again</button>
            <button onClick={onBack} className="back-button">Back to Menu</button>
          </div>
        </div>
      </div>
    );
  }

  const renderQuestionContent = () => {
    if (!currentQuestion) return null;

    switch (currentQuestion.questionType) {
      case 'multiple-choice':
        return (
          <div className="options-area">
            {currentQuestion.options.map((option) => (
              <button
                key={option.optionId}
                onClick={() => handleMultipleChoice(option.optionId)}
                className={`option-button ${getButtonClassName(option.optionId)}`}
                disabled={!!selectedAnswers[currentQuestion.questionId]}
              >
                {option.text}
              </button>
            ))}
          </div>
        );

      case 'checkboxes':
        return (
          <div className="checkboxes-area">
            {currentQuestion.options.map((option) => (
              <label key={option.optionId} className="checkbox-option">
                <input
                  type="checkbox"
                  checked={(selectedAnswers[currentQuestion.questionId] || []).includes(option.optionId)}
                  onChange={() => handleCheckboxes(option.optionId)}
                  disabled={!!results[currentQuestion.questionId]}
                />
                <span>{option.text}</span>
              </label>
            ))}
            {!results[currentQuestion.questionId] && (
              <button 
                onClick={handleCheckboxesSubmit}
                className="submit-button"
                disabled={!selectedAnswers[currentQuestion.questionId] || selectedAnswers[currentQuestion.questionId].length === 0}
              >
                Submit
              </button>
            )}
          </div>
        );

      case 'range':
        return (
          <div className="range-area">
            <div className="range-slider">
              <input
                type="range"
                min={currentQuestion.minValue}
                max={currentQuestion.maxValue}
                value={selectedAnswers[currentQuestion.questionId] || currentQuestion.minValue}
                onChange={(e) => handleRange(parseInt(e.target.value))}
                className="range-input"
                disabled={!!results[currentQuestion.questionId]}
              />
              <div className="range-value">
                Selected: {selectedAnswers[currentQuestion.questionId] || currentQuestion.minValue}
              </div>
            </div>
            {!results[currentQuestion.questionId] && (
              <button 
                onClick={handleRangeSubmit}
                className="submit-button"
              >
                Submit
              </button>
            )}
          </div>
        );

      case 'pinpoint':
        return (
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
              />
              {selectedAnswers[currentQuestion.questionId] && (
                <div 
                  className="pinpoint-marker"
                  style={{
                    left: `${selectedAnswers[currentQuestion.questionId].x * 100}%`,
                    top: `${selectedAnswers[currentQuestion.questionId].y * 100}%`
                  }}
                >
                  🎯
                </div>
              )}
            </div>
          </div>
        );

      case 'real-world-map':
        return (
          <div className="real-world-map-area">
            <div className="map-instructions">
              <p>Click on the map to mark your answer.</p>
            </div>
            <div className="map-container">
              <div 
                id={`map-${currentQuestion.questionId}`} 
                className="real-map"
                style={{ height: '400px', width: '100%' }}
              />
            </div>
          </div>
        );

      case 'type-answer':
        return (
          <div className="type-answer-area">
            <form onSubmit={handleTypeAnswer}>
              <input
                type="text"
                name="answer"
                placeholder="Type your answer here..."
                className="answer-input"
                autoComplete="off"
                disabled={!!results[currentQuestion.questionId]}
              />
              {!results[currentQuestion.questionId] && (
                <button type="submit" className="submit-button">
                  Submit
                </button>
              )}
            </form>
          </div>
        );

      default:
        return <div>Unsupported question type</div>;
    }
  };

  const getButtonClassName = (optionId) => {
    const result = results[currentQuestion.questionId];
    if (!selectedAnswers[currentQuestion.questionId] || !result) {
      return '';
    }
    
    if (result.correctOptionId === optionId) {
      return 'correct';
    }
    
    if (selectedAnswers[currentQuestion.questionId] === optionId && result.result === 'incorrect') {
      return 'incorrect';
    }
    
    if (selectedAnswers[currentQuestion.questionId] === optionId && result.result === 'correct') {
      return 'correct';
    }
    
    return 'disabled';
  };

  return (
    <div className="quiz-container">
      <div className="quiz-header">
        <button onClick={onBack} className="back-button">← Back</button>
        <h1>Mixed Quiz</h1>
        <p className="score">Score: {score}/{questions.length}</p>
      </div>

      <div className="quiz-progress">
        <p>Question {currentQuestionIndex + 1} of {questions.length}</p>
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="question-area">
        {currentQuestion.imageId && (
          <img 
            src={currentQuestion.imageId} 
            alt="Quiz context" 
            className="quiz-image" 
            onError={(e) => {
              console.error('Failed to load image:', currentQuestion.imageId);
              e.target.style.display = 'none';
            }}
          />
        )}
        <h2>{currentQuestion.questionText}</h2>
      </div>

      {renderQuestionContent()}
      
      {results[currentQuestion.questionId] && (
        <div className={`result-message ${results[currentQuestion.questionId].result}`}>
          {results[currentQuestion.questionId].result === 'correct' ? 
            '🎉 Correct! Well done!' : 
            '❌ Not quite!'
          }
          <button onClick={nextQuestion} className="next-button">
            {currentQuestionIndex < questions.length - 1 ? 'Next Question →' : 'Finish Quiz'}
          </button>
        </div>
      )}
    </div>
  );
}

export default MixedQuiz;
