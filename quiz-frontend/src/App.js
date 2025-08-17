import React, { useState } from 'react';
import HomePage from './HomePage';
import QuizSelector from './QuizSelector';
import AdvancedQuiz from './AdvancedQuiz';
import MixedQuiz from './MixedQuiz';
import CarLogoQuiz from './CarLogoQuiz';
import CountryFlagQuiz from './CountryFlagQuiz';
import './App.css';

function App() {
  const [currentView, setCurrentView] = useState('home'); // 'home', 'car-logos', 'country-flags', 'quiz-selector', 'advanced-quiz', or 'mixed-quiz'
  const [selectedQuizType, setSelectedQuizType] = useState(null);
  const [selectedQuestionId, setSelectedQuestionId] = useState(null);

  const handleNavigate = (view) => {
    setCurrentView(view);
    // Reset quiz state when navigating
    setSelectedQuizType(null);
    setSelectedQuestionId(null);
  };

  const handleQuizTypeSelect = (quizType) => {
    setSelectedQuizType(quizType);
    
    if (quizType === 'mixed') {
      setCurrentView('mixed-quiz');
      return;
    }
    
    // For other quiz types, map to question IDs
    const questionMap = {
      'multiple-choice': 'q1',
      'checkboxes': 'q2',
      'reorder': 'q3',
      'range': 'q4',
      'pinpoint': 'q5',
      'type-answer': 'q6',
      'real-world-map': 'q7'
    };
    setSelectedQuestionId(questionMap[quizType]);
    setCurrentView('advanced-quiz');
  };

  const handleBackToHome = () => {
    setCurrentView('home');
    setSelectedQuizType(null);
    setSelectedQuestionId(null);
  };

  const handleBackToSelector = () => {
    setCurrentView('quiz-selector');
    setSelectedQuizType(null);
    setSelectedQuestionId(null);
  };

  return (
    <div className="App">
      {currentView === 'home' && (
        <HomePage onNavigate={handleNavigate} />
      )}
      
      {currentView === 'car-logos' && (
        <CarLogoQuiz onBack={handleBackToHome} />
      )}
      
      {currentView === 'country-flags' && (
        <CountryFlagQuiz onBack={handleBackToHome} />
      )}
      
      {currentView === 'quiz-selector' && (
        <QuizSelector onQuizSelect={handleQuizTypeSelect} onBack={handleBackToHome} />
      )}
      
      {currentView === 'advanced-quiz' && (
        <AdvancedQuiz 
          questionId={selectedQuestionId} 
          onBack={handleBackToSelector}
        />
      )}
      
      {currentView === 'mixed-quiz' && (
        <MixedQuiz onBack={handleBackToSelector} />
      )}
    </div>
  );
}

export default App;