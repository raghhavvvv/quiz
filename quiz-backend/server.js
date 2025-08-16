const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5001;

app.use(cors());
app.use(express.json());

// --- In-Memory Database ---
const quizDatabase = [
  {
    // --- Multiple Choice Question (Buttons) ---
    questionId: 'q1',
    questionType: 'multiple-choice',
    questionText: 'How many complete apples are in the picture?',
    imageId: 'http://quiz-wfun.onrender.com/images/apples.jpg',
    options: [
      { optionId: 'q1-optA', text: '2', isCorrect: false },
      { optionId: 'q1-optB', text: '3', isCorrect: true },
      { optionId: 'q1-optC', text: '4', isCorrect: false },
      { optionId: 'q1-optD', text: '5', isCorrect: false },
    ],
  },
  {
    // --- Checkboxes Question (Multiple Correct Answers) ---
    questionId: 'q2',
    questionType: 'checkboxes',
    questionText: 'Which fruits are typically red when ripe?',
    imageId: 'https://quiz-wfun.onrender.com/images/apples.jpg',
    options: [
      { optionId: 'q2-optA', text: 'Apple', isCorrect: true },
      { optionId: 'q2-optB', text: 'Strawberry', isCorrect: true },
      { optionId: 'q2-optC', text: 'Banana', isCorrect: false },
      { optionId: 'q2-optD', text: 'Cherry', isCorrect: true },
      { optionId: 'q2-optE', text: 'Orange', isCorrect: false },
    ],
  },
  {
    // --- Reorder Question ---
    questionId: 'q3',
    questionType: 'reorder',
    questionText: 'Place the letters in alphabetical order.',
    items: [
      { itemId: 'd', text: 'D' },
      { itemId: 'a', text: 'A' },
      { itemId: 'c', text: 'C' },
      { itemId: 'b', text: 'B' },
    ],
    correctOrder: ['a', 'b', 'c', 'd'],
  },
  {
    // --- Range Question ---
    questionId: 'q4',
    questionType: 'range',
    questionText: 'On a scale of 1-10, how sweet are these apples?',
    minValue: 1,
    maxValue: 10,
    correctAnswer: 7,
    tolerance: 1, // Accept answers within ±1
  },

  {
    // --- Pinpoint Question ---
    questionId: 'q5',
    questionType: 'pinpoint',
    questionText: 'Click on the apple with the most visible stem.',
    imageId: 'https://quiz-wfun.onrender.com/images/apples.jpg',
    correctLocation: { x: 0.3, y: 0.5 },
    tolerance: 0.15,
    pinpointInstructions: 'Look carefully at each apple and identify which one has the most visible stem. Click precisely on that apple.',
  },
  {
    // --- Type Answer Question ---
    questionId: 'q6',
    questionType: 'type-answer',
    questionText: 'What color are these apples?',
    correctAnswers: ['red', 'red apples', 'red apple', 'reddish'],
    caseSensitive: false,
  },
  {
    // --- Real World Map Question ---
    questionId: 'q7',
    questionType: 'real-world-map',
    questionText: 'Where is the Eiffel Tower located?',
    mapConfig: {
      center: { lat: 48.8584, lng: 2.2945 },
      zoom: 12,
      correctLocation: { lat: 48.8584, lng: 2.2945 },
      tolerance: 0.01,
      mapType: 'osm',
      landmarks: [
        { name: 'Eiffel Tower', lat: 48.8584, lng: 2.2945, icon: '🗼' },
        { name: 'Arc de Triomphe', lat: 48.8738, lng: 2.2950, icon: '🏛️' },
        { name: 'Louvre Museum', lat: 48.8606, lng: 2.3376, icon: '🏛️' },
        { name: 'Mount Fuji', lat: 35.3606, lng: 138.7274, icon: '🗻' }
      ]
    }
  },
  {
    // --- Country Capital Question ---
    questionId: 'q8',
    questionType: 'real-world-map',
    questionText: 'Click on the capital city of Japan',
    mapConfig: {
      center: { lat: 35.6762, lng: 139.6503 },
      zoom: 6,
      correctLocation: { lat: 35.6762, lng: 139.6503 },
      tolerance: 0.5,
      mapType: 'osm',
      landmarks: [
        { name: 'Tokyo', lat: 35.6762, lng: 139.6503, icon: '🏙️' },
        { name: 'Osaka', lat: 34.6937, lng: 135.5023, icon: '🏙️' },
        { name: 'Kyoto', lat: 35.0116, lng: 135.7681, icon: '🏛️' },
        { name: 'Mount Fuji', lat: 35.3606, lng: 138.7274, icon: '🗻' }
      ]
    }
  },
  {
    // --- Landmark Identification ---
    questionId: 'q9',
    questionType: 'real-world-map',
    questionText: 'Where is the Great Wall of China?',
    mapConfig: {
      center: { lat: 40.4319, lng: 116.5704 },
      zoom: 8,
      correctLocation: { lat: 40.4319, lng: 116.5704 },
      tolerance: 0.5,
      mapType: 'osm',
      landmarks: [
        { name: 'Great Wall', lat: 40.4319, lng: 116.5704, icon: '🏛️' },
        { name: 'Forbidden City', lat: 39.9163, lng: 116.3972, icon: '🏛️' },
        { name: 'Temple of Heaven', lat: 39.8822, lng: 116.4066, icon: '🏛️' }
      ]
    }
  },
];

// --- API Routes ---

// GET all available quiz types
app.get('/api/quiz-types', (req, res) => {
  const quizTypes = [
    { id: 'multiple-choice', name: 'Buttons', description: 'One correct answer', icon: '🔘' },
    { id: 'checkboxes', name: 'Checkboxes', description: 'Multiple correct answers', icon: '☑️' },
    { id: 'reorder', name: 'Reorder', description: 'Place answers in the correct order', icon: '📋' },
    { id: 'range', name: 'Range', description: 'Guess the answer on a scale', icon: '📊' },

    { id: 'pinpoint', name: 'Pinpoint', description: 'Pin the answer on an image', icon: '🎯' },
    { id: 'type-answer', name: 'Type answer', description: 'Type the correct answer', icon: '⌨️' },
    { id: 'real-world-map', name: 'Real World Map', description: 'Geographical questions on real maps', icon: '🗺️' },
  ];
  res.json(quizTypes);
});

// GET a specific quiz question (now handles all types)
app.get('/api/quiz/:questionId', (req, res) => {
  const { questionId } = req.params;
  const questionRecord = quizDatabase.find((q) => q.questionId === questionId);

  if (!questionRecord) {
    return res.status(404).json({ message: 'Question not found' });
  }

  // Sanitize the data based on question type
  let dataForFrontend;
  if (questionRecord.questionType === 'multiple-choice' || questionRecord.questionType === 'checkboxes') {
    const sanitizedOptions = questionRecord.options.map(({ optionId, text }) => ({
      optionId,
      text,
    }));
    dataForFrontend = { ...questionRecord, options: sanitizedOptions };
  } else if (questionRecord.questionType === 'reorder') {
    dataForFrontend = {
      questionId: questionRecord.questionId,
      questionType: questionRecord.questionType,
      questionText: questionRecord.questionText,
      items: questionRecord.items,
    };
  } else if (questionRecord.questionType === 'range') {
    dataForFrontend = {
      questionId: questionRecord.questionId,
      questionType: questionRecord.questionType,
      questionText: questionRecord.questionText,
      minValue: questionRecord.minValue,
      maxValue: questionRecord.maxValue,
    };
  } else if (questionRecord.questionType === 'pinpoint') {
    dataForFrontend = {
      questionId: questionRecord.questionId,
      questionType: questionRecord.questionType,
      questionText: questionRecord.questionText,
      imageId: questionRecord.imageId,
      pinpointInstructions: questionRecord.pinpointInstructions,
    };
  } else if (questionRecord.questionType === 'real-world-map') {
    dataForFrontend = {
      questionId: questionRecord.questionId,
      questionType: questionRecord.questionType,
      questionText: questionRecord.questionText,
      mapConfig: questionRecord.mapConfig,
    };
  } else if (questionRecord.questionType === 'type-answer') {
    dataForFrontend = {
      questionId: questionRecord.questionId,
      questionType: questionRecord.questionType,
      questionText: questionRecord.questionText,
    };
  } else {
    return res.status(500).json({ message: 'Unknown question type' });
  }
  
  // Important: remove the answer key before sending
  if (dataForFrontend.correctOrder) delete dataForFrontend.correctOrder;
  if (dataForFrontend.options) {
      dataForFrontend.options.forEach(opt => delete opt.isCorrect);
  }


  res.json(dataForFrontend);
});

// POST to check the answer (now handles both types)
app.post('/api/quiz/check-answer', (req, res) => {
  const { questionId, answer } = req.body;

  const questionRecord = quizDatabase.find((q) => q.questionId === questionId);
  if (!questionRecord) {
    return res.status(404).json({ message: 'Question not found' });
  }

  let isCorrect = false;

  // Validation logic depends on the question type
  if (questionRecord.questionType === 'multiple-choice') {
    const correctOption = questionRecord.options.find(opt => opt.isCorrect);
    isCorrect = correctOption && correctOption.optionId === answer.userAnswerId;
  } 
  else if (questionRecord.questionType === 'checkboxes') {
    const userSelectedIds = answer.userSelectedIds || [];
    const correctOptionIds = questionRecord.options
      .filter(opt => opt.isCorrect)
      .map(opt => opt.optionId);
    
    // Check if all correct options are selected and no incorrect ones
    const allCorrectSelected = correctOptionIds.every(id => userSelectedIds.includes(id));
    const noIncorrectSelected = !userSelectedIds.some(id => 
      !correctOptionIds.includes(id)
    );
    isCorrect = allCorrectSelected && noIncorrectSelected;
  }
  else if (questionRecord.questionType === 'reorder') {
    const userOrder = answer.userOrder;
    const correctOrder = questionRecord.correctOrder;
    isCorrect = JSON.stringify(userOrder) === JSON.stringify(correctOrder);
  }
  else if (questionRecord.questionType === 'range') {
    const userValue = answer.userValue;
    const correctValue = questionRecord.correctAnswer;
    const tolerance = questionRecord.tolerance;
    isCorrect = Math.abs(userValue - correctValue) <= tolerance;
  }
  else if (questionRecord.questionType === 'pinpoint') {
    const userLocation = answer.userLocation;
    const correctLocation = questionRecord.correctLocation;
    const tolerance = questionRecord.tolerance;
    
    const distance = Math.sqrt(
      Math.pow(userLocation.x - correctLocation.x, 2) + 
      Math.pow(userLocation.y - correctLocation.y, 2)
    );
    isCorrect = distance <= tolerance;
  }
  else if (questionRecord.questionType === 'type-answer') {
    const userAnswer = answer.userAnswer;
    const correctAnswers = questionRecord.correctAnswers;
    const caseSensitive = questionRecord.caseSensitive;
    
    if (caseSensitive) {
      isCorrect = correctAnswers.includes(userAnswer);
    } else {
      isCorrect = correctAnswers.some(correct => 
        correct.toLowerCase() === userAnswer.toLowerCase()
      );
    }
  }
  else if (questionRecord.questionType === 'real-world-map') {
    const userLocation = answer.userLocation;
    const correctLocation = questionRecord.mapConfig.correctLocation;
    const tolerance = questionRecord.mapConfig.tolerance;
    
    if (userLocation && userLocation.lat && userLocation.lng) {
      // Calculate distance between user's click and correct location
      const latDiff = Math.abs(userLocation.lat - correctLocation.lat);
      const lngDiff = Math.abs(userLocation.lng - correctLocation.lng);
      
      // Check if within tolerance (simplified distance calculation)
      isCorrect = latDiff <= tolerance && lngDiff <= tolerance;
    } else {
      isCorrect = false;
    }
  }

  // Respond to the client
  if (isCorrect) {
    res.json({ result: 'correct' });
  } else {
    // For incorrect answers, send back appropriate feedback
    const response = { result: 'incorrect' };
    
    if (questionRecord.questionType === 'multiple-choice') {
      response.correctOptionId = questionRecord.options.find(opt => opt.isCorrect).optionId;
    } else if (questionRecord.questionType === 'checkboxes') {
      response.correctOptionIds = questionRecord.options
        .filter(opt => opt.isCorrect)
        .map(opt => opt.optionId);
    } else if (questionRecord.questionType === 'reorder') {
      response.correctOrder = questionRecord.correctOrder;
    } else if (questionRecord.questionType === 'range') {
      response.correctAnswer = questionRecord.correctAnswer;
      response.tolerance = questionRecord.tolerance;
    } else if (questionRecord.questionType === 'pinpoint') {
      response.correctLocation = questionRecord.correctLocation;
    } else if (questionRecord.questionType === 'type-answer') {
      response.correctAnswers = questionRecord.correctAnswers;
    } else if (questionRecord.questionType === 'real-world-map') {
      response.correctLocation = questionRecord.mapConfig.correctLocation;
      response.tolerance = questionRecord.mapConfig.tolerance;
    }
    
    res.json(response);
  }
});

app.use(express.static('public'));

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});