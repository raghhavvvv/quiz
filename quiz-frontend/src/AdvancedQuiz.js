import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const API_URL = "https://quiz-wfun.onrender.com";

function AdvancedQuiz({ questionId, onBack }) {
  const [question, setQuestion] = useState(null);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/api/quiz/${questionId}`)
      .then((res) => res.json())
      .then((data) => {
        console.log('Quiz data received:', data);
        setQuestion(data);
        setLoading(false);
        
        // Initialize map if it's a real-world map question
        if (data.questionType === 'real-world-map' && data.mapConfig) {
          // Use setTimeout to ensure DOM is ready
          setTimeout(() => {
            if (data.mapConfig) {
              initializeMap(data.mapConfig);
            }
          }, 100);
        }
      })
      .catch((err) => console.error('Failed to fetch quiz data:', err));

    // Cleanup function to remove map when component unmounts
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [questionId]);

  const handleMultipleChoice = (optionId) => {
    if (selectedAnswers[questionId]) return;
    
    setSelectedAnswers({ [questionId]: optionId });
    checkAnswer({ userAnswerId: optionId });
  };

  const handleCheckboxes = (optionId) => {
    const current = selectedAnswers[questionId] || [];
    let newSelection;
    
    if (current.includes(optionId)) {
      newSelection = current.filter(id => id !== optionId);
    } else {
      newSelection = [...current, optionId];
    }
    
    setSelectedAnswers({ ...selectedAnswers, [questionId]: newSelection });
  };

  const handleCheckboxesSubmit = () => {
    if (selectedAnswers[questionId] && selectedAnswers[questionId].length > 0) {
      checkAnswer({ userSelectedIds: selectedAnswers[questionId] });
    }
  };

  const handleReorder = (itemId) => {
    const current = selectedAnswers[questionId] || [];
    if (current.includes(itemId)) {
      setSelectedAnswers({ ...selectedAnswers, [questionId]: current.filter(id => id !== itemId) });
    } else {
      setSelectedAnswers({ ...selectedAnswers, [questionId]: [...current, itemId] });
    }
  };

  const handleReorderSubmit = () => {
    if (selectedAnswers[questionId] && selectedAnswers[questionId].length === question.items.length) {
      checkAnswer({ userOrder: selectedAnswers[questionId] });
    }
  };

  const handleRange = (value) => {
    setSelectedAnswers({ ...selectedAnswers, [questionId]: value });
  };

  const handleRangeSubmit = () => {
    if (selectedAnswers[questionId] !== undefined) {
      checkAnswer({ userValue: selectedAnswers[questionId] });
    }
  };

  const handleLocation = (event) => {
    const rect = event.target.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    setSelectedAnswers({ ...selectedAnswers, [questionId]: { x, y } });
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
    if (!question) {
      console.error('Question not loaded yet');
      return;
    }
    
    setSelectedAnswers({ ...selectedAnswers, [questionId]: { lat, lng } });
    checkAnswer({ userLocation: { lat, lng } });
  };

  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  const initializeMap = (mapConfig) => {
    if (!mapConfig || !questionId) {
      console.error('Cannot initialize map: missing config or questionId');
      return;
    }
    
    const mapElement = document.getElementById(`map-${questionId}`);
    if (mapElement && !mapInstanceRef.current) {
      try {
        // Initialize Leaflet map
        const map = L.map(`map-${questionId}`, {
          center: [mapConfig.center.lat, mapConfig.center.lng],
          zoom: mapConfig.zoom || 10,
          zoomControl: true,
          attributionControl: true
        });

        // Add OpenStreetMap tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors',
          maxZoom: 18
        }).addTo(map);

        // Add landmarks as markers
        mapConfig.landmarks.forEach(landmark => {
          const marker = L.marker([landmark.lat, landmark.lng], {
            title: landmark.name
          }).addTo(map);
          
          // Add popup with landmark info
          marker.bindPopup(`
            <div style="text-align: center;">
              <div style="font-size: 1.5rem; margin-bottom: 0.5rem;">${landmark.icon}</div>
              <strong>${landmark.name}</strong>
            </div>
          `);
        });

        // Add click handler for the map
        map.on('click', (e) => {
          if (loading || !question) {
            console.log('Map interaction disabled while loading');
            return;
          }
          
          const { lat, lng } = e.latlng;
          handleMapClick(lat, lng);
          
          // Add a temporary marker to show where user clicked
          const userMarker = L.marker([lat, lng], {
            icon: L.divIcon({
              className: 'user-marker',
              html: '📍',
              iconSize: [30, 30],
              iconAnchor: [15, 30]
            })
          }).addTo(map);
          
          // Remove the marker after 3 seconds
          setTimeout(() => {
            map.removeLayer(userMarker);
          }, 3000);
        });

        // Store map instance
        mapInstanceRef.current = map;
        
        console.log('Leaflet map initialized successfully');
      } catch (error) {
        console.error('Failed to initialize Leaflet map:', error);
        // Fallback to placeholder if Leaflet fails
        createPlaceholderMap(mapElement, mapConfig);
      }
    }
  };

  const createPlaceholderMap = (mapElement, mapConfig) => {
    // Fallback placeholder map if Leaflet fails
    mapElement.innerHTML = `
      <div class="map-placeholder" style="
        width: 100%; 
        height: 100%; 
        background: linear-gradient(45deg, #e8f5e8 25%, #d4edda 25%, #d4edda 50%, #e8f5e8 50%, #e8f5e8 75%, #d4edda 75%, #d4edda);
        background-size: 40px 40px;
        position: relative;
        cursor: crosshair;
        border-radius: 8px;
        border: 2px solid #333;
      ">
        <div style="
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          text-align: center;
          color: #333;
          font-weight: bold;
        ">
          <div style="font-size: 2rem; margin-bottom: 0.5rem;">🗺️</div>
          <div>Map loading failed - using placeholder</div>
          <div style="font-size: 0.8rem; margin-top: 0.5rem;">
            Center: ${mapConfig.center.lat.toFixed(4)}, ${mapConfig.center.lng.toFixed(4)}
          </div>
        </div>
      </div>
    `;
  };

  const checkAnswer = (answerData) => {
    if (!question) {
      console.error('Cannot check answer: question not loaded');
      return;
    }
    
    fetch(`${API_URL}/api/quiz/check-answer`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        questionId: question.questionId,
        answer: answerData,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log('Answer check result:', data);
        setResult(data);
        if (data.result === 'correct') {
          setScore(prevScore => prevScore + 1);
        }
      })
      .catch((err) => console.error('Failed to check answer:', err));
  };

  const resetQuiz = () => {
    setSelectedAnswers({});
    setResult(null);
  };

  if (loading) {
    return <div className="loading">Loading quiz...</div>;
  }

  if (!question) {
    return <div>Question not found</div>;
  }

  const renderQuestionContent = () => {
    switch (question.questionType) {
      case 'multiple-choice':
        return (
          <div className="options-area">
            {question.options.map((option) => (
              <button
                key={option.optionId}
                onClick={() => handleMultipleChoice(option.optionId)}
                className={`option-button ${getButtonClassName(option.optionId)}`}
                disabled={!!selectedAnswers[questionId]}
              >
                {option.text}
              </button>
            ))}
          </div>
        );

      case 'checkboxes':
        return (
          <div className="checkboxes-area">
            {question.options.map((option) => (
              <label key={option.optionId} className="checkbox-option">
                <input
                  type="checkbox"
                  checked={(selectedAnswers[questionId] || []).includes(option.optionId)}
                  onChange={() => handleCheckboxes(option.optionId)}
                />
                <span>{option.text}</span>
              </label>
            ))}
            <button 
              onClick={handleCheckboxesSubmit}
              className="submit-button"
              disabled={!selectedAnswers[questionId] || selectedAnswers[questionId].length === 0}
            >
              Submit
            </button>
          </div>
        );

      case 'reorder':
        return (
          <div className="reorder-area">
            <div className="reorder-instructions">
              <p>Click items in the order you want them:</p>
              <div className="selected-order">
                {selectedAnswers[questionId]?.map((itemId, index) => {
                  const item = question.items.find(i => i.itemId === itemId);
                  return (
                    <span key={itemId} className="order-item">
                      {index + 1}. {item.text}
                    </span>
                  );
                })}
              </div>
            </div>
            <div className="reorder-items">
              {question.items.map((item) => (
                <button
                  key={item.itemId}
                  onClick={() => handleReorder(item.itemId)}
                  className={`reorder-item ${(selectedAnswers[questionId] || []).includes(item.itemId) ? 'selected' : ''}`}
                >
                  {item.text}
                </button>
              ))}
            </div>
            <button 
              onClick={handleReorderSubmit}
              className="submit-button"
              disabled={!selectedAnswers[questionId] || selectedAnswers[questionId].length !== question.items.length}
            >
              Submit Order
            </button>
          </div>
        );

      case 'range':
        return (
          <div className="range-area">
            <div className="range-slider">
              <input
                type="range"
                min={question.minValue}
                max={question.maxValue}
                value={selectedAnswers[questionId] || question.minValue}
                onChange={(e) => handleRange(parseInt(e.target.value))}
                className="range-input"
              />
              <div className="range-value">
                Selected: {selectedAnswers[questionId] || question.minValue}
              </div>
            </div>
            <button 
              onClick={handleRangeSubmit}
              className="submit-button"
            >
              Submit
            </button>
          </div>
        );

      case 'pinpoint':
        return (
          <div className="pinpoint-area">
            <div className="pinpoint-instructions">
              <p>{question.pinpointInstructions}</p>
            </div>
            <div className="image-container">
              <img 
                src={question.imageId} 
                alt="Quiz context" 
                className="quiz-image clickable" 
                onClick={handleLocation}
              />
              {selectedAnswers[questionId] && (
                <div 
                  className="pinpoint-marker"
                  style={{
                    left: `${selectedAnswers[questionId].x * 100}%`,
                    top: `${selectedAnswers[questionId].y * 100}%`
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
        );

      case 'real-world-map':
        if (loading || !question.mapConfig) {
          return (
            <div className="real-world-map-area">
              <div className="loading">Loading map...</div>
            </div>
          );
        }
        
        return (
          <div className="real-world-map-area">
            <div className="map-instructions">
              <p>Click on the map to mark your answer. Use the map controls to zoom and pan.</p>
              <p style={{ fontSize: '0.9rem', color: '#666', marginTop: '0.5rem' }}>
                Loading real geographical map from OpenStreetMap...
              </p>
            </div>
            <div className="map-container">
              <div 
                id={`map-${questionId}`} 
                className={`real-map ${loading ? 'loading' : ''}`}
                style={{ height: '400px', width: '100%' }}
              >
                {loading && (
                  <div className="map-loading-overlay">
                    <div className="map-loading-spinner">🗺️</div>
                    <div>Loading real map...</div>
                  </div>
                )}
              </div>
            </div>
            <div className="map-landmarks">
              <h4>Landmarks on this map:</h4>
              <div className="landmarks-list">
                {question.mapConfig.landmarks.map((landmark, index) => (
                  <div key={index} className="landmark-item">
                    <span className="landmark-icon">{landmark.icon}</span>
                    <span className="landmark-name">{landmark.name}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="map-feedback">
              {selectedAnswers[questionId] ? (
                <p>You clicked at: {selectedAnswers[questionId].lat.toFixed(4)}, {selectedAnswers[questionId].lng.toFixed(4)}</p>
              ) : (
                <p>Click anywhere on the map above to mark your answer</p>
              )}
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
              />
              <button type="submit" className="submit-button">
                Submit
              </button>
            </form>
          </div>
        );

      default:
        return <div>Unsupported question type</div>;
    }
  };

  const getButtonClassName = (optionId) => {
    if (!selectedAnswers[questionId]) {
      return '';
    }
    
    if (result && result.correctOptionId === optionId) {
      return 'correct';
    }
    
    if (selectedAnswers[questionId] === optionId && result && result.result === 'incorrect') {
      return 'incorrect';
    }
    
    if (selectedAnswers[questionId] === optionId && result && result.result === 'correct') {
      return 'correct';
    }
    
    return 'disabled';
  };

  return (
    <div className="quiz-container">
      <div className="quiz-header">
        <button onClick={onBack} className="back-button">← Back</button>
        <h1>Quiz</h1>
        <p className="score">Score: {score}</p>
      </div>

      <div className="question-area">
        {question.imageId && (
          <img 
            src={question.imageId} 
            alt="Quiz context" 
            className="quiz-image" 
            onError={(e) => {
              console.error('Failed to load image:', question.imageId);
              e.target.style.display = 'none';
            }}
          />
        )}
        <h2>{question.questionText}</h2>
      </div>

      {renderQuestionContent()}
      
      {result && (
        <div className={`result-message ${result.result}`}>
          {result.result === 'correct' ? 'Correct! Well done!' : 'Not quite!'}
          {result.result === 'incorrect' && (
            <div className="feedback-details">
              {result.correctOptionId && <p>Correct answer: {question.options?.find(opt => opt.optionId === result.correctOptionId)?.text}</p>}
              {result.correctOptionIds && <p>Correct answers: {result.correctOptionIds.map(id => question.options?.find(opt => opt.optionId === id)?.text).join(', ')}</p>}
              {result.correctOrder && <p>Correct order: {result.correctOrder.join(' → ')}</p>}
              {result.correctAnswer && <p>Correct answer: {result.correctAnswer}</p>}
              {result.correctAnswers && <p>Possible answers: {result.correctAnswers.join(', ')}</p>}
            </div>
          )}
        </div>
      )}
      
      {result && (
        <button onClick={resetQuiz} className="reset-button">
          Try Again
        </button>
      )}
    </div>
  );
}

export default AdvancedQuiz;
