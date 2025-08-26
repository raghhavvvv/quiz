const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5001;

// Configure CORS for production
const corsOptions = {
  origin: [
    'http://localhost:3000', // For local development
    'https://quiz-theta-henna.vercel.app', // Frontend Vercel URL
  ],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());

const quizDatabase = [
  {
    questionId: 'q1',
    questionType: 'multiple-choice',
    questionText: 'How many complete apples are in the picture?',
    imageId: 'https://quiz-wfun.onrender.com/images/apples.jpg',
    options: [
      { optionId: 'q1-optA', text: '2', isCorrect: false },
      { optionId: 'q1-optB', text: '3', isCorrect: true },
      { optionId: 'q1-optC', text: '4', isCorrect: false },
      { optionId: 'q1-optD', text: '5', isCorrect: false },
    ],
  },
  {
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
    questionType: 'type-answer',
    questionText: 'What car brand is known for the slogan "The Ultimate Driving Machine"?',
    correctAnswers: ['bmw', 'BMW'],
    caseSensitive: false,
  },
  {
    questionId: 'car3',
    questionType: 'multiple-choice',
    questionText: 'Which car brand does this logo belong to?',
    imageId: 'https://upload.wikimedia.org/wikipedia/commons/9/90/Mercedes-Logo.svg',
    options: [
      { optionId: 'car3-optA', text: 'Mercedes-Benz', isCorrect: true },
      { optionId: 'car3-optB', text: 'BMW', isCorrect: false },
      { optionId: 'car3-optC', text: 'Audi', isCorrect: false },
      { optionId: 'car3-optD', text: 'Lexus', isCorrect: false },
    ],
  },
  {
    questionId: 'car4',
    questionType: 'checkboxes',
    questionText: 'Which of these are German car brands?',
    options: [
      { optionId: 'car4-optA', text: 'BMW', isCorrect: true },
      { optionId: 'car4-optB', text: 'Toyota', isCorrect: false },
      { optionId: 'car4-optC', text: 'Mercedes-Benz', isCorrect: true },
      { optionId: 'car4-optD', text: 'Honda', isCorrect: false },
      { optionId: 'car4-optE', text: 'Audi', isCorrect: true },
    ],
  },
  {
    questionId: 'car5',
    questionType: 'range',
    questionText: 'On a scale of 1-10, how expensive do you think a new BMW typically is? (1=very affordable, 10=very expensive)',
    minValue: 1,
    maxValue: 10,
    correctAnswer: 8,
    tolerance: 1,
  },
  {
    questionId: 'car6',
    questionType: 'reorder',
    questionText: 'Arrange these car brands by their founding year (oldest first):',
    items: [
      { itemId: 'mercedes', text: 'Mercedes-Benz (1926)' },
      { itemId: 'bmw', text: 'BMW (1916)' },
      { itemId: 'audi', text: 'Audi (1909)' },
      { itemId: 'volkswagen', text: 'Volkswagen (1937)' },
    ],
    correctOrder: ['audi', 'bmw', 'mercedes', 'volkswagen'],
  },
  {
    questionId: 'car7',
    questionType: 'multiple-choice',
    questionText: 'Which car brand does this logo belong to?',
    imageId: 'https://upload.wikimedia.org/wikipedia/commons/6/60/Toyota-logo.svg',
    options: [
      { optionId: 'car7-optA', text: 'Honda', isCorrect: false },
      { optionId: 'car7-optB', text: 'Toyota', isCorrect: true },
      { optionId: 'car7-optC', text: 'Nissan', isCorrect: false },
      { optionId: 'car7-optD', text: 'Mazda', isCorrect: false },
    ],
  },
  {
    questionId: 'car8',
    questionType: 'checkboxes',
    questionText: 'Which of these are Japanese car brands?',
    options: [
      { optionId: 'car8-optA', text: 'Toyota', isCorrect: true },
      { optionId: 'car8-optB', text: 'Ford', isCorrect: false },
      { optionId: 'car8-optC', text: 'Honda', isCorrect: true },
      { optionId: 'car8-optD', text: 'BMW', isCorrect: false },
      { optionId: 'car8-optE', text: 'Nissan', isCorrect: true },
    ],
  },
  {
    questionId: 'car9',
    questionType: 'pinpoint',
    questionText: 'Click on the Ford logo in this image showing multiple car logos.',
    imageId: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=600&fit=crop',
    correctLocation: { x: 0.6, y: 0.4 },
    tolerance: 0.2,
    pinpointInstructions: 'Look for the Ford oval logo among the various car brand logos displayed.',
  },
  {
    questionId: 'car10',
    questionType: 'type-answer',
    questionText: 'What electric car company was founded by Elon Musk?',
    correctAnswers: ['tesla', 'Tesla'],
    caseSensitive: false,
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
    questionType: 'type-answer',
    questionText: 'What country has a flag with a red circle on a white background?',
    correctAnswers: ['japan', 'Japan'],
    caseSensitive: false,
  },
  {
    questionId: 'flag3',
    questionType: 'range',
    questionText: 'How many stars are on the flag of the United States?',
    minValue: 40,
    maxValue: 60,
    correctAnswer: 50,
    tolerance: 0,
  },
  {
    questionId: 'flag4',
    questionType: 'checkboxes',
    questionText: 'Which of these countries have red, white, and blue in their flags?',
    options: [
      { optionId: 'flag4-optA', text: 'United States', isCorrect: true },
      { optionId: 'flag4-optB', text: 'Japan', isCorrect: false },
      { optionId: 'flag4-optC', text: 'France', isCorrect: true },
      { optionId: 'flag4-optD', text: 'Germany', isCorrect: false },
      { optionId: 'flag4-optE', text: 'United Kingdom', isCorrect: true },
    ],
  },
  {
    questionId: 'flag5',
    questionType: 'reorder',
    questionText: 'Arrange these countries by their population size (largest first):',
    items: [
      { itemId: 'china', text: 'China' },
      { itemId: 'usa', text: 'United States' },
      { itemId: 'india', text: 'India' },
      { itemId: 'brazil', text: 'Brazil' },
    ],
    correctOrder: ['china', 'india', 'usa', 'brazil'],
  },
  {
    questionId: 'flag6',
    questionType: 'type-answer',
    questionText: 'What country is known for its maple leaf flag?',
    correctAnswers: ['canada', 'Canada'],
    caseSensitive: false,
  },
  {
    questionId: 'flag7',
    questionType: 'multiple-choice',
    questionText: 'Which country does this flag belong to?',
    imageId: 'https://flagcdn.com/w320/de.png',
    options: [
      { optionId: 'flag7-optA', text: 'Belgium', isCorrect: false },
      { optionId: 'flag7-optB', text: 'Germany', isCorrect: true },
      { optionId: 'flag7-optC', text: 'Austria', isCorrect: false },
      { optionId: 'flag7-optD', text: 'Netherlands', isCorrect: false },
    ],
  },
  {
    questionId: 'flag8',
    questionType: 'pinpoint',
    questionText: 'Click on Brazil on this map of South America.',
    imageId: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop',
    correctLocation: { x: 0.65, y: 0.4 },
    tolerance: 0.25,
    pinpointInstructions: 'Brazil is the largest country in South America, located in the central-eastern part of the continent.',
  },
  {
    questionId: 'flag9',
    questionType: 'multiple-choice',
    questionText: 'Which country does this flag belong to?',
    imageId: 'https://flagcdn.com/w320/br.png',
    options: [
      { optionId: 'flag9-optA', text: 'Argentina', isCorrect: false },
      { optionId: 'flag9-optB', text: 'Brazil', isCorrect: true },
      { optionId: 'flag9-optC', text: 'Colombia', isCorrect: false },
      { optionId: 'flag9-optD', text: 'Venezuela', isCorrect: false },
    ],
  },
  {
    questionId: 'flag10',
    questionType: 'checkboxes',
    questionText: 'Which of these countries are located in Europe?',
    options: [
      { optionId: 'flag10-optA', text: 'Germany', isCorrect: true },
      { optionId: 'flag10-optB', text: 'Brazil', isCorrect: false },
      { optionId: 'flag10-optC', text: 'France', isCorrect: true },
      { optionId: 'flag10-optD', text: 'Japan', isCorrect: false },
      { optionId: 'flag10-optE', text: 'Italy', isCorrect: true },
    ],
  },
  // Mixed quiz questions combining different types
  {
    questionId: 'mixed1',
    questionType: 'multiple-choice',
    questionText: 'Which car brand does this logo belong to?',
    imageId: 'https://upload.wikimedia.org/wikipedia/commons/4/44/BMW.svg',
    options: [
      { optionId: 'mixed1-optA', text: 'Mercedes-Benz', isCorrect: false },
      { optionId: 'mixed1-optB', text: 'BMW', isCorrect: true },
      { optionId: 'mixed1-optC', text: 'Audi', isCorrect: false },
      { optionId: 'mixed1-optD', text: 'Volkswagen', isCorrect: false },
    ],
  },
  {
    questionId: 'mixed2',
    questionType: 'type-answer',
    questionText: 'What is the capital of France?',
    correctAnswers: ['paris', 'Paris'],
    caseSensitive: false,
  },
  {
    questionId: 'mixed3',
    questionType: 'checkboxes',
    questionText: 'Which of these are programming languages?',
    options: [
      { optionId: 'mixed3-optA', text: 'JavaScript', isCorrect: true },
      { optionId: 'mixed3-optB', text: 'HTML', isCorrect: false },
      { optionId: 'mixed3-optC', text: 'Python', isCorrect: true },
      { optionId: 'mixed3-optD', text: 'CSS', isCorrect: false },
      { optionId: 'mixed3-optE', text: 'Java', isCorrect: true },
    ],
  },
  {
    questionId: 'mixed4',
    questionType: 'pinpoint',
    questionText: 'Click on the apple with the most visible stem.',
    imageId: 'https://quiz-wfun.onrender.com/images/apples.jpg',
    correctLocation: { x: 0.3, y: 0.5 },
    tolerance: 0.15,
    pinpointInstructions: 'Look carefully at each apple and identify which one has the most visible stem. Click precisely on that apple.',
  },
  {
    questionId: 'mixed5',
    questionType: 'range',
    questionText: 'On a scale of 1-10, how difficult is this quiz so far?',
    minValue: 1,
    maxValue: 10,
    correctAnswer: 5,
    tolerance: 2,
  },
  // Ganesh Chaturthi Quiz Questions
  {
    questionId: 'ganesh1',
    questionType: 'multiple-choice',
    questionText: 'What is the name of Lord Ganesha\'s vehicle?',
    imageId: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400',
    options: [
      { optionId: 'ganesh1-optA', text: 'Mouse', isCorrect: true },
      { optionId: 'ganesh1-optB', text: 'Elephant', isCorrect: false },
      { optionId: 'ganesh1-optC', text: 'Lion', isCorrect: false },
      { optionId: 'ganesh1-optD', text: 'Tiger', isCorrect: false },
    ],
  },
  {
    questionId: 'ganesh2',
    questionType: 'checkboxes',
    questionText: 'Which of these are traditional offerings to Lord Ganesha?',
    options: [
      { optionId: 'ganesh2-optA', text: 'Modak', isCorrect: true },
      { optionId: 'ganesh2-optB', text: 'Laddu', isCorrect: true },
      { optionId: 'ganesh2-optC', text: 'Pizza', isCorrect: false },
      { optionId: 'ganesh2-optD', text: 'Durva Grass', isCorrect: true },
      { optionId: 'ganesh2-optE', text: 'Hamburger', isCorrect: false },
    ],
  },
  {
    questionId: 'ganesh3',
    questionType: 'type-answer',
    questionText: 'What is the popular chant associated with Ganesh Chaturthi that means "Hail Lord Ganesha"?',
    correctAnswers: ['ganpati bappa morya', 'Ganpati Bappa Morya', 'GANPATI BAPPA MORYA'],
    caseSensitive: false,
  },
  {
    questionId: 'ganesh4',
    questionType: 'multiple-choice',
    questionText: 'How many days is Ganesh Chaturthi typically celebrated?',
    options: [
      { optionId: 'ganesh4-optA', text: '7 days', isCorrect: false },
      { optionId: 'ganesh4-optB', text: '10 days', isCorrect: false },
      { optionId: 'ganesh4-optC', text: '11 days', isCorrect: true },
      { optionId: 'ganesh4-optD', text: '15 days', isCorrect: false },
    ],
  },
  {
    questionId: 'ganesh5',
    questionType: 'reorder',
    questionText: 'Arrange these Ganesh Chaturthi rituals in the correct order:',
    items: [
      { itemId: 'ganesh5-item1', text: 'Ganesh Sthapana (Installation)' },
      { itemId: 'ganesh5-item2', text: 'Daily Aarti and Prayers' },
      { itemId: 'ganesh5-item3', text: 'Visarjan (Immersion)' },
      { itemId: 'ganesh5-item4', text: 'Preparation and Decoration' },
    ],
    correctOrder: ['ganesh5-item4', 'ganesh5-item1', 'ganesh5-item2', 'ganesh5-item3'],
  },
  {
    questionId: 'ganesh6',
    questionType: 'range',
    questionText: 'In which month of the Hindu calendar is Ganesh Chaturthi celebrated? (1=Chaitra, 6=Bhadrapada, 12=Phalguna)',
    minValue: 1,
    maxValue: 12,
    correctAnswer: 6,
    tolerance: 0,
  },
  {
    questionId: 'ganesh7',
    questionType: 'checkboxes',
    questionText: 'Which states in India are famous for grand Ganesh Chaturthi celebrations?',
    options: [
      { optionId: 'ganesh7-optA', text: 'Maharashtra', isCorrect: true },
      { optionId: 'ganesh7-optB', text: 'Karnataka', isCorrect: true },
      { optionId: 'ganesh7-optC', text: 'Punjab', isCorrect: false },
      { optionId: 'ganesh7-optD', text: 'Telangana', isCorrect: true },
      { optionId: 'ganesh7-optE', text: 'Kerala', isCorrect: false },
    ],
  },
  {
    questionId: 'ganesh8',
    questionType: 'multiple-choice',
    questionText: 'Who is credited with starting the public celebration of Ganesh Chaturthi in Maharashtra?',
    options: [
      { optionId: 'ganesh8-optA', text: 'Bal Gangadhar Tilak', isCorrect: true },
      { optionId: 'ganesh8-optB', text: 'Mahatma Gandhi', isCorrect: false },
      { optionId: 'ganesh8-optC', text: 'Jawaharlal Nehru', isCorrect: false },
      { optionId: 'ganesh8-optD', text: 'Sardar Patel', isCorrect: false },
    ],
  },
  {
    questionId: 'ganesh9',
    questionType: 'pinpoint',
    questionText: 'Click on the trunk of Lord Ganesha in this traditional image.',
    imageId: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600',
    correctLocation: { x: 0.5, y: 0.6 },
    tolerance: 0.2,
    pinpointInstructions: 'Look for Lord Ganesha\'s distinctive curved trunk in the image and click on it.',
  },
  {
    questionId: 'ganesh10',
    questionType: 'type-answer',
    questionText: 'What is the name of the sweet dumpling that is Lord Ganesha\'s favorite food?',
    correctAnswers: ['modak', 'Modak', 'MODAK'],
    caseSensitive: false,
  },
];

// Fisher-Yates shuffle algorithm
function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

app.get('/api/quiz-types', (req, res) => {
  const quizTypes = [
    { id: 'multiple-choice', name: 'Buttons', description: 'One correct answer', icon: '🔘' },
    { id: 'checkboxes', name: 'Checkboxes', description: 'Multiple correct answers', icon: '☑️' },
    { id: 'reorder', name: 'Reorder', description: 'Place answers in the correct order', icon: '📋' },
    { id: 'range', name: 'Range', description: 'Guess the answer on a scale', icon: '📊' },
    { id: 'pinpoint', name: 'Pinpoint', description: 'Pin the answer on an image', icon: '🎯' },
    { id: 'type-answer', name: 'Type answer', description: 'Type the correct answer', icon: '⌨️' },
    { id: 'real-world-map', name: 'Real World Map', description: 'Geographical questions on real maps', icon: '🗺️' },
    { id: 'mixed', name: 'Mixed Quiz', description: 'Combination of different question types', icon: '🎲' },
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
    // Shuffle options randomly
    const shuffledOptions = shuffleArray(sanitizedOptions);
    dataForFrontend = { ...questionRecord, options: shuffledOptions };
  } else if (questionRecord.questionType === 'reorder') {
    // Shuffle items for reorder questions too
    const shuffledItems = shuffleArray(questionRecord.items);
    dataForFrontend = {
      questionId: questionRecord.questionId,
      questionType: questionRecord.questionType,
      questionText: questionRecord.questionText,
      items: shuffledItems,
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

// New endpoint for mixed quiz questions
app.get('/api/mixed-quiz', (req, res) => {
  // Shuffle the mixed quiz questions
  const shuffledQuestions = shuffleArray(quizDatabase);
  
  // Process each question to remove answer keys and shuffle options
  const processedQuestions = shuffledQuestions.map(question => {
    let processedQuestion = { ...question };
    
    if (question.questionType === 'multiple-choice' || question.questionType === 'checkboxes') {
      const sanitizedOptions = question.options.map(({ optionId, text }) => ({
        optionId,
        text,
      }));
      const shuffledOptions = shuffleArray(sanitizedOptions);
      processedQuestion.options = shuffledOptions;
    }
    
    // Remove answer keys
    delete processedQuestion.correctOrder;
    delete processedQuestion.correctAnswer;
    delete processedQuestion.correctAnswers;
    delete processedQuestion.correctLocation;
    delete processedQuestion.tolerance;
    delete processedQuestion.caseSensitive;
    
    return processedQuestion;
  });
  
  res.json(processedQuestions);
});

app.post('/api/quiz/check-answer', (req, res) => {
  const { questionId, answer } = req.body;

  // Search in both regular quiz database and mixed quiz database
  let questionRecord = quizDatabase.find((q) => q.questionId === questionId);
  if (!questionRecord) {
    questionRecord = quizDatabase.find((q) => q.questionId === questionId);
  }
  
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
      const correctOption = questionRecord.options.find(opt => opt.isCorrect);
      response.correctOptionId = correctOption.optionId;
      response.correctAnswer = correctOption.text;
    } else if (questionRecord.questionType === 'checkboxes') {
      const correctOptions = questionRecord.options.filter(opt => opt.isCorrect);
      response.correctOptionIds = correctOptions.map(opt => opt.optionId);
      response.correctAnswer = correctOptions.map(opt => opt.text).join(', ');
    } else if (questionRecord.questionType === 'reorder') {
      response.correctOrder = questionRecord.correctOrder;
      response.correctAnswer = questionRecord.correctOrder.join(' → ');
    } else if (questionRecord.questionType === 'range') {
      response.correctAnswer = questionRecord.correctAnswer;
      response.tolerance = questionRecord.tolerance;
    } else if (questionRecord.questionType === 'pinpoint') {
      response.correctLocation = questionRecord.correctLocation;
      response.correctAnswer = `X: ${questionRecord.correctLocation.x}, Y: ${questionRecord.correctLocation.y}`;
    } else if (questionRecord.questionType === 'type-answer') {
      response.correctAnswers = questionRecord.correctAnswers;
      response.correctAnswer = questionRecord.correctAnswers[0];
    } else if (questionRecord.questionType === 'real-world-map') {
      response.correctLocation = questionRecord.mapConfig.correctLocation;
      response.tolerance = questionRecord.mapConfig.tolerance;
      response.correctAnswer = `X: ${questionRecord.mapConfig.correctLocation.x}, Y: ${questionRecord.mapConfig.correctLocation.y}`;
    }
    
    res.json(response);
  }
});

app.use(express.static('public'));

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});