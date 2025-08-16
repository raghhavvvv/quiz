const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5001;

app.use(cors());
app.use(express.json());

const quizDatabase = [
  {
    questionId: 'q1',
    questionType: 'multiple-choice',
    questionText: 'How many complete apples are in the picture?',
    imageId: 'http://localhost:5001/images/apples.jpg',
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
    imageId: 'http://localhost:5001/images/apples.jpg',
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
    imageId: 'http://localhost:5001/images/apples.jpg',
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
  // Car Logo Quiz Questions
  {
    questionId: 'car1',
    questionType: 'multiple-choice',
    questionText: 'Which car brand does this logo belong to?',
    imageId: 'https://upload.wikimedia.org/wikipedia/commons/4/44/BMW.svg',
    options: [
      { optionId: 'car1-optA', text: 'Mercedes-Benz', isCorrect: false },
      { optionId: 'car1-optB', text: 'BMW', isCorrect: true },
      { optionId: 'car1-optC', text: 'Audi', isCorrect: false },
      { optionId: 'car1-optD', text: 'Volkswagen', isCorrect: false },
    ],
  },
  {
    questionId: 'car2',
    questionType: 'multiple-choice',
    questionText: 'Which car brand does this logo belong to?',
    imageId: 'https://upload.wikimedia.org/wikipedia/commons/9/90/Mercedes-Logo.svg',
    options: [
      { optionId: 'car2-optA', text: 'Mercedes-Benz', isCorrect: true },
      { optionId: 'car2-optB', text: 'BMW', isCorrect: false },
      { optionId: 'car2-optC', text: 'Audi', isCorrect: false },
      { optionId: 'car2-optD', text: 'Lexus', isCorrect: false },
    ],
  },
  {
    questionId: 'car3',
    questionType: 'multiple-choice',
    questionText: 'Which car brand does this logo belong to?',
    imageId: 'https://upload.wikimedia.org/wikipedia/commons/9/92/Audi-Logo_2016.svg',
    options: [
      { optionId: 'car3-optA', text: 'BMW', isCorrect: false },
      { optionId: 'car3-optB', text: 'Mercedes-Benz', isCorrect: false },
      { optionId: 'car3-optC', text: 'Audi', isCorrect: true },
      { optionId: 'car3-optD', text: 'Volkswagen', isCorrect: false },
    ],
  },
  {
    questionId: 'car4',
    questionType: 'multiple-choice',
    questionText: 'Which car brand does this logo belong to?',
    imageId: 'https://upload.wikimedia.org/wikipedia/commons/6/60/Toyota-logo.svg',
    options: [
      { optionId: 'car4-optA', text: 'Honda', isCorrect: false },
      { optionId: 'car4-optB', text: 'Toyota', isCorrect: true },
      { optionId: 'car4-optC', text: 'Nissan', isCorrect: false },
      { optionId: 'car4-optD', text: 'Mazda', isCorrect: false },
    ],
  },
  {
    questionId: 'car5',
    questionType: 'multiple-choice',
    questionText: 'Which car brand does this logo belong to?',
    imageId: 'https://upload.wikimedia.org/wikipedia/commons/3/3e/Ford-logo.svg',
    options: [
      { optionId: 'car5-optA', text: 'Chevrolet', isCorrect: false },
      { optionId: 'car5-optB', text: 'Ford', isCorrect: true },
      { optionId: 'car5-optC', text: 'Dodge', isCorrect: false },
      { optionId: 'car5-optD', text: 'Chrysler', isCorrect: false },
    ],
  },
  {
    questionId: 'car6',
    questionType: 'multiple-choice',
    questionText: 'Which car brand does this logo belong to?',
    imageId: 'https://upload.wikimedia.org/wikipedia/commons/7/76/Honda.svg',
    options: [
      { optionId: 'car6-optA', text: 'Honda', isCorrect: true },
      { optionId: 'car6-optB', text: 'Toyota', isCorrect: false },
      { optionId: 'car6-optC', text: 'Hyundai', isCorrect: false },
      { optionId: 'car6-optD', text: 'Acura', isCorrect: false },
    ],
  },
  {
    questionId: 'car7',
    questionType: 'multiple-choice',
    questionText: 'Which car brand does this logo belong to?',
    imageId: 'https://upload.wikimedia.org/wikipedia/commons/6/60/Volkswagen_logo_2019.svg',
    options: [
      { optionId: 'car7-optA', text: 'Audi', isCorrect: false },
      { optionId: 'car7-optB', text: 'BMW', isCorrect: false },
      { optionId: 'car7-optC', text: 'Volkswagen', isCorrect: true },
      { optionId: 'car7-optD', text: 'Porsche', isCorrect: false },
    ],
  },
  {
    questionId: 'car8',
    questionType: 'multiple-choice',
    questionText: 'Which car brand does this logo belong to?',
    imageId: 'https://upload.wikimedia.org/wikipedia/de/9/90/Ferrari_Logo.svg',
    options: [
      { optionId: 'car8-optA', text: 'Lamborghini', isCorrect: false },
      { optionId: 'car8-optB', text: 'Ferrari', isCorrect: true },
      { optionId: 'car8-optC', text: 'Maserati', isCorrect: false },
      { optionId: 'car8-optD', text: 'Porsche', isCorrect: false },
    ],
  },
  {
    questionId: 'car9',
    questionType: 'multiple-choice',
    questionText: 'Which car brand does this logo belong to?',
    imageId: 'https://upload.wikimedia.org/wikipedia/commons/0/00/Nissan-logo.svg',
    options: [
      { optionId: 'car9-optA', text: 'Toyota', isCorrect: false },
      { optionId: 'car9-optB', text: 'Honda', isCorrect: false },
      { optionId: 'car9-optC', text: 'Nissan', isCorrect: true },
      { optionId: 'car9-optD', text: 'Mazda', isCorrect: false },
    ],
  },
  {
    questionId: 'car10',
    questionType: 'multiple-choice',
    questionText: 'Which car brand does this logo belong to?',
    imageId: 'https://upload.wikimedia.org/wikipedia/commons/b/bb/Tesla_T_symbol.svg',
    options: [
      { optionId: 'car10-optA', text: 'Tesla', isCorrect: true },
      { optionId: 'car10-optB', text: 'Lucid', isCorrect: false },
      { optionId: 'car10-optC', text: 'Rivian', isCorrect: false },
      { optionId: 'car10-optD', text: 'NIO', isCorrect: false },
    ],
  },
  // Country Flag Quiz Questions
  {
    questionId: 'flag1',
    questionType: 'multiple-choice',
    questionText: 'Which country does this flag belong to?',
    imageId: 'https://flagcdn.com/w320/us.png',
    options: [
      { optionId: 'flag1-optA', text: 'United States', isCorrect: true },
      { optionId: 'flag1-optB', text: 'United Kingdom', isCorrect: false },
      { optionId: 'flag1-optC', text: 'Canada', isCorrect: false },
      { optionId: 'flag1-optD', text: 'Australia', isCorrect: false },
    ],
  },
  {
    questionId: 'flag2',
    questionType: 'multiple-choice',
    questionText: 'Which country does this flag belong to?',
    imageId: 'https://flagcdn.com/w320/jp.png',
    options: [
      { optionId: 'flag2-optA', text: 'China', isCorrect: false },
      { optionId: 'flag2-optB', text: 'Japan', isCorrect: true },
      { optionId: 'flag2-optC', text: 'South Korea', isCorrect: false },
      { optionId: 'flag2-optD', text: 'Bangladesh', isCorrect: false },
    ],
  },
  {
    questionId: 'flag3',
    questionType: 'multiple-choice',
    questionText: 'Which country does this flag belong to?',
    imageId: 'https://flagcdn.com/w320/fr.png',
    options: [
      { optionId: 'flag3-optA', text: 'Netherlands', isCorrect: false },
      { optionId: 'flag3-optB', text: 'France', isCorrect: true },
      { optionId: 'flag3-optC', text: 'Russia', isCorrect: false },
      { optionId: 'flag3-optD', text: 'Czech Republic', isCorrect: false },
    ],
  },
  {
    questionId: 'flag4',
    questionType: 'multiple-choice',
    questionText: 'Which country does this flag belong to?',
    imageId: 'https://flagcdn.com/w320/de.png',
    options: [
      { optionId: 'flag4-optA', text: 'Belgium', isCorrect: false },
      { optionId: 'flag4-optB', text: 'Germany', isCorrect: true },
      { optionId: 'flag4-optC', text: 'Austria', isCorrect: false },
      { optionId: 'flag4-optD', text: 'Netherlands', isCorrect: false },
    ],
  },
  {
    questionId: 'flag5',
    questionType: 'multiple-choice',
    questionText: 'Which country does this flag belong to?',
    imageId: 'https://flagcdn.com/w320/br.png',
    options: [
      { optionId: 'flag5-optA', text: 'Argentina', isCorrect: false },
      { optionId: 'flag5-optB', text: 'Brazil', isCorrect: true },
      { optionId: 'flag5-optC', text: 'Colombia', isCorrect: false },
      { optionId: 'flag5-optD', text: 'Venezuela', isCorrect: false },
    ],
  },
  {
    questionId: 'flag6',
    questionType: 'multiple-choice',
    questionText: 'Which country does this flag belong to?',
    imageId: 'https://flagcdn.com/w320/ca.png',
    options: [
      { optionId: 'flag6-optA', text: 'Canada', isCorrect: true },
      { optionId: 'flag6-optB', text: 'United States', isCorrect: false },
      { optionId: 'flag6-optC', text: 'Poland', isCorrect: false },
      { optionId: 'flag6-optD', text: 'Lebanon', isCorrect: false },
    ],
  },
  {
    questionId: 'flag7',
    questionType: 'multiple-choice',
    questionText: 'Which country does this flag belong to?',
    imageId: 'https://flagcdn.com/w320/in.png',
    options: [
      { optionId: 'flag7-optA', text: 'Pakistan', isCorrect: false },
      { optionId: 'flag7-optB', text: 'India', isCorrect: true },
      { optionId: 'flag7-optC', text: 'Bangladesh', isCorrect: false },
      { optionId: 'flag7-optD', text: 'Sri Lanka', isCorrect: false },
    ],
  },
  {
    questionId: 'flag8',
    questionType: 'multiple-choice',
    questionText: 'Which country does this flag belong to?',
    imageId: 'https://flagcdn.com/w320/au.png',
    options: [
      { optionId: 'flag8-optA', text: 'New Zealand', isCorrect: false },
      { optionId: 'flag8-optB', text: 'Australia', isCorrect: true },
      { optionId: 'flag8-optC', text: 'United Kingdom', isCorrect: false },
      { optionId: 'flag8-optD', text: 'Fiji', isCorrect: false },
    ],
  },
  {
    questionId: 'flag9',
    questionType: 'multiple-choice',
    questionText: 'Which country does this flag belong to?',
    imageId: 'https://flagcdn.com/w320/mx.png',
    options: [
      { optionId: 'flag9-optA', text: 'Italy', isCorrect: false },
      { optionId: 'flag9-optB', text: 'Mexico', isCorrect: true },
      { optionId: 'flag9-optC', text: 'Ireland', isCorrect: false },
      { optionId: 'flag9-optD', text: 'Hungary', isCorrect: false },
    ],
  },
  {
    questionId: 'flag10',
    questionType: 'multiple-choice',
    questionText: 'Which country does this flag belong to?',
    imageId: 'https://flagcdn.com/w320/gb.png',
    options: [
      { optionId: 'flag10-optA', text: 'United Kingdom', isCorrect: true },
      { optionId: 'flag10-optB', text: 'United States', isCorrect: false },
      { optionId: 'flag10-optC', text: 'Australia', isCorrect: false },
      { optionId: 'flag10-optD', text: 'New Zealand', isCorrect: false },
    ],
  },
];

// --- API Routes ---

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

app.get('/api/quiz/:questionId', (req, res) => {
  const { questionId } = req.params;
  const questionRecord = quizDatabase.find((q) => q.questionId === questionId);

  if (!questionRecord) {
    return res.status(404).json({ message: 'Question not found' });
  }

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

app.post('/api/quiz/check-answer', (req, res) => {
  const { questionId, answer } = req.body;

  const questionRecord = quizDatabase.find((q) => q.questionId === questionId);
  if (!questionRecord) {
    return res.status(404).json({ message: 'Question not found' });
  }

  let isCorrect = false;

  if (questionRecord.questionType === 'multiple-choice') {
    const correctOption = questionRecord.options.find(opt => opt.isCorrect);
    isCorrect = correctOption && correctOption.optionId === answer.userAnswerId;
  } 
  else if (questionRecord.questionType === 'checkboxes') {
    const userSelectedIds = answer.userSelectedIds || [];
    const correctOptionIds = questionRecord.options
      .filter(opt => opt.isCorrect)
      .map(opt => opt.optionId);
    
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
      const latDiff = Math.abs(userLocation.lat - correctLocation.lat);
      const lngDiff = Math.abs(userLocation.lng - correctLocation.lng);
      
      isCorrect = latDiff <= tolerance && lngDiff <= tolerance;
    } else {
      isCorrect = false;
    }
  }

  if (isCorrect) {
    res.json({ result: 'correct' });
  } else {
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