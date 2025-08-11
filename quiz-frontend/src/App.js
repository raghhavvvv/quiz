import React, { useState } from 'react';
import QuizSelector from './QuizSelector';
import AdvancedQuiz from './AdvancedQuiz';
import './App.css';

function App() {
  const [currentView, setCurrentView] = useState('selector'); // 'selector' or 'quiz'
  const [selectedQuizType, setSelectedQuizType] = useState(null);
  const [selectedQuestionId, setSelectedQuestionId] = useState(null);

  const handleQuizTypeSelect = (quizType) => {
    setSelectedQuizType(quizType);
    // For now, let's map quiz types to question IDs
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
    setCurrentView('quiz');
  };

  const handleBackToSelector = () => {
    setCurrentView('selector');
    setSelectedQuizType(null);
    setSelectedQuestionId(null);
  };

  return (
    <div className="App">
      {currentView === 'selector' ? (
        <QuizSelector onQuizSelect={handleQuizTypeSelect} />
      ) : (
        <AdvancedQuiz 
          questionId={selectedQuestionId} 
          onBack={handleBackToSelector}
        />
      )}
    </div>
  );
}

export default App;