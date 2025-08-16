import React, {useState, useEffect} from 'react';

const API_URL = "https://quiz-wfun.onrender.com";

function Quiz(){
    const [question, setQuestion] = useState(null);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [result, setResult] = useState(null);
    const [score, setScore] = useState(0);
  
  const resetQuiz = () => {
    setSelectedAnswer(null);
    setResult(null);
    setScore(0);
  };

    useEffect(() => {
    fetch(`${API_URL}/api/quiz/q1`) 
      .then((res) => res.json())
      .then((data) => {
        console.log('Quiz data received:', data);
        setQuestion(data);
      })
      .catch((err) => console.error('Failed to fetch quiz data:', err));
  }, []); 

  const handleAnswerClick = (optionId) => {
    if (selectedAnswer) return;

    setSelectedAnswer(optionId);

    fetch(`${API_URL}/api/quiz/check-answer`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        questionId: question.questionId,
        answer: {
          userAnswerId: optionId,
        },
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
  
  const getButtonClassName = (optionId) => {
    if (!selectedAnswer) {
      return 'option-button'; 
    }
    
    // If this is the correct answer, always show it as correct
    if (result && result.correctOptionId === optionId) {
      return 'option-button correct'; 
    }
    
    // If this is the user's selected answer and it's not correct, show as incorrect
    if (selectedAnswer === optionId && result && result.result === 'incorrect') {
      return 'option-button incorrect'; 
    }
    
    // If this is the user's selected answer and it's correct, show as correct
    if (selectedAnswer === optionId && result && result.result === 'correct') {
      return 'option-button correct'; 
    }
    
    // All other options are disabled
    return 'option-button disabled'; 
  };


  if (!question) {
    return <div className="loading">Loading quiz...</div>;
  }

  return (
    <div className="quiz-container">
      <h1>Picture Quiz!</h1>
      <p className="score">Score: {score}</p>

      <div className="question-area">
        <img 
          src={question.imageId} 
          alt="Quiz context" 
          className="quiz-image" 
          onError={(e) => {
            console.error('Failed to load image:', question.imageId);
            e.target.style.display = 'none';
          }}
          onLoad={() => console.log('Image loaded successfully:', question.imageId)}
        />
        <h2>{question.questionText}</h2>
      </div>

      <div className="options-area">
        {question.options.map((option) => (
          <button
            key={option.optionId}
            onClick={() => handleAnswerClick(option.optionId)}
            className={getButtonClassName(option.optionId)}
            disabled={!!selectedAnswer} 
          >
            {option.text}
          </button>
        ))}
      </div>
      
      {result && (
        <div className={`result-message ${result.result}`}>
            {result.result === 'correct' ? 'Correct! Well done!' : 'Not quite!'}
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

export default Quiz;
 
