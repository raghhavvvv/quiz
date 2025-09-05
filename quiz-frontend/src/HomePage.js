import React from 'react';
import './HomePage.css';

function HomePage({ onNavigate }) {
  return (
    <div className="home-page">
      <div className="home-header">
        <h1>any2quiz.com</h1>
        <p>Celebrating Teachers & Education</p>
      </div>

      {/* Featured Teacher's Day Quiz */}
      <div className="featured-quiz">
        <div className="featured-quiz-card" onClick={() => onNavigate('teachers-day')}>
          <div className="featured-icon">📚</div>
          <h2>Teacher's Day Special Quiz</h2>
          <p>Celebrate the educators who shape our world with 30 comprehensive questions covering Indian and global teacher history, philosophy, and educational traditions.</p>
          <div className="quiz-stats">
            <span className="stat">📊 30 Questions</span>
            <span className="stat">🏆 Multiple Formats</span>
            <span className="stat">🎯 Educational Focus</span>
          </div>
          <button className="start-button">Start Teacher's Day Quiz →</button>
        </div>
      </div>

      {/* Other Quizzes */}
      <div className="other-quizzes">
        <h3>Other Available Quizzes</h3>
        <div className="quiz-options-small">
          <div className="quiz-option-small" onClick={() => onNavigate('ganesh-chaturthi')}>
            <div className="option-icon-small">🐘</div>
            <span>Ganesh Chaturthi</span>
          </div>

          <div className="quiz-option-small" onClick={() => onNavigate('car-logos')}>
            <div className="option-icon-small">🚗</div>
            <span>Car Logos</span>
          </div>

          <div className="quiz-option-small" onClick={() => onNavigate('country-flags')}>
            <div className="option-icon-small">🏳️</div>
            <span>Country Flags</span>
          </div>

          <div className="quiz-option-small" onClick={() => onNavigate('quiz-selector')}>
            <div className="option-icon-small">🎯</div>
            <span>Advanced Quizzes</span>
          </div>
        </div>
      </div>
    </div>
  );
}


export default HomePage;
