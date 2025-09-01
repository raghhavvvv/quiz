import React from 'react';
import './HomePage.css';

function HomePage({ onNavigate }) {
  return (
    <div className="home-page">
      <div className="home-header">
        <h1>QUIZ.com</h1>
        <p>Choose your quiz adventure</p>
      </div>

      <div className="quiz-options">
        <div className="quiz-option" onClick={() => onNavigate('car-logos')}>
          <div className="option-icon">🚗</div>
          <h2>Car Logo Quiz</h2>
          <p>Test your knowledge of car brands with 10 logo questions</p>
        </div>

        <div className="quiz-option" onClick={() => onNavigate('country-flags')}>
          <div className="option-icon">🏳️</div>
          <h2>Country Flag Quiz</h2>
          <p>Identify flags from around the world in 10 questions</p>
        </div>

        <div className="quiz-option" onClick={() => onNavigate('ganesh-chaturthi')}>
          <div className="option-icon">🐘</div>
          <h2>Ganesh Chaturthi Quiz</h2>
          <p>Test your knowledge about Lord Ganesha and the festival</p>
        </div>

        <div className="quiz-option" onClick={() => onNavigate('teachers-day')}>
          <div className="option-icon">📚</div>
          <h2>Teacher's Day Quiz</h2>
          <p>Celebrate teachers with 30 questions about education and great educators</p>
        </div>

        <div className="quiz-option" onClick={() => onNavigate('quiz-selector')}>
          <div className="option-icon">🎯</div>
          <h2>Advanced Quizzes</h2>
          <p>Explore different question types and formats</p>
        </div>
      </div>
    </div>
  );
}


export default HomePage;
