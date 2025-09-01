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
    imageId: 'https://images.unsplash.com/photo-1567591391293-f9a99c77e128?q=80&w=1738&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
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
  // Teacher's Day Quiz Questions
  {
    questionId: 'td1',
    questionType: 'multiple-choice',
    questionText: 'When is Teacher\'s Day celebrated in India?',
    imageId: '',
    options: [
      { optionId: 'td1-optA', text: '5th September', isCorrect: true },
      { optionId: 'td1-optB', text: '14th November', isCorrect: false },
      { optionId: 'td1-optC', text: '15th August', isCorrect: false },
      { optionId: 'td1-optD', text: '2nd October', isCorrect: false }
    ],
  },
  {
    questionId: 'td2',
    questionType: 'multiple-choice',
    questionText: 'Teacher\'s Day in India marks the birthday of which great leader?',
    imageId: '',
    options: [
      { optionId: 'td2-optA', text: 'Mahatma Gandhi', isCorrect: false },
      { optionId: 'td2-optB', text: 'Dr. Sarvepalli Radhakrishnan', isCorrect: true },
      { optionId: 'td2-optC', text: 'Jawaharlal Nehru', isCorrect: false },
      { optionId: 'td2-optD', text: 'Swami Vivekananda', isCorrect: false }
    ],
  },
  {
    questionId: 'td3',
    questionType: 'type-answer',
    questionText: 'Dr. Sarvepalli Radhakrishnan was the ___ President of India.',
    correctAnswers: ['2nd', 'second', 'Second'],
    caseSensitive: false,
  },
  {
    questionId: 'td4',
    questionType: 'multiple-choice',
    questionText: 'Which year was the first Teacher\'s Day celebrated in India?',
    imageId: '',
    options: [
      { optionId: 'td4-optA', text: '1962', isCorrect: true },
      { optionId: 'td4-optB', text: '1950', isCorrect: false },
      { optionId: 'td4-optC', text: '1970', isCorrect: false },
      { optionId: 'td4-optD', text: '1980', isCorrect: false }
    ],
  },
  {
    questionId: 'td5',
    questionType: 'checkboxes',
    questionText: 'Which of the following are famous Indian teachers and philosophers?',
    imageId: '',
    options: [
      { optionId: 'td5-optA', text: 'Chanakya', isCorrect: true },
      { optionId: 'td5-optB', text: 'Savitribai Phule', isCorrect: true },
      { optionId: 'td5-optC', text: 'Dr. A.P.J. Abdul Kalam', isCorrect: true },
      { optionId: 'td5-optD', text: 'Sachin Tendulkar', isCorrect: false }
    ],
  },
  {
    questionId: 'td6',
    questionType: 'reorder',
    questionText: 'Arrange the following in chronological order of their birth: Dr. Radhakrishnan, A.P.J. Abdul Kalam, Savitribai Phule, Swami Vivekananda',
    items: [
      { itemId: 'td6-optA', text: 'Savitribai Phule' },
      { itemId: 'td6-optB', text: 'Swami Vivekananda' },
      { itemId: 'td6-optC', text: 'Dr. Sarvepalli Radhakrishnan' },
      { itemId: 'td6-optD', text: 'Dr. A.P.J. Abdul Kalam' }
    ],
    correctOrder: ['td6-optA', 'td6-optB', 'td6-optC', 'td6-optD'],
  },
  {
    questionId: 'td7',
    questionType: 'multiple-choice',
    questionText: 'Which subject did Dr. Sarvepalli Radhakrishnan primarily teach?',
    imageId: '',
    options: [
      { optionId: 'td7-optA', text: 'Physics', isCorrect: false },
      { optionId: 'td7-optB', text: 'Philosophy', isCorrect: true },
      { optionId: 'td7-optC', text: 'History', isCorrect: false },
      { optionId: 'td7-optD', text: 'Mathematics', isCorrect: false }
    ],
  },
  {
    questionId: 'td8',
    questionType: 'multiple-choice',
    questionText: 'Who is regarded as the first female teacher of India?',
    imageId: '',
    options: [
      { optionId: 'td8-optA', text: 'Anandibai Joshi', isCorrect: false },
      { optionId: 'td8-optB', text: 'Savitribai Phule', isCorrect: true },
      { optionId: 'td8-optC', text: 'Indira Gandhi', isCorrect: false },
      { optionId: 'td8-optD', text: 'Mother Teresa', isCorrect: false }
    ],
  },
  {
    questionId: 'td9',
    questionType: 'type-answer',
    questionText: 'Teachers are often called the ___ of the nation.',
    correctAnswers: ['nation builders', 'builders', 'backbone'],
    caseSensitive: false,
  },
  {
    questionId: 'td10',
    questionType: 'multiple-choice',
    questionText: 'Which of the following dates is celebrated as World Teachers\' Day (global)?',
    imageId: '',
    options: [
      { optionId: 'td10-optA', text: '5th October', isCorrect: true },
      { optionId: 'td10-optB', text: '5th September', isCorrect: false },
      { optionId: 'td10-optC', text: '14th November', isCorrect: false },
      { optionId: 'td10-optD', text: '1st May', isCorrect: false }
    ],
  },
  {
    questionId: 'td11',
    questionType: 'multiple-choice',
    questionText: 'Which famous teacher was the mentor of Chandragupta Maurya?',
    imageId: '',
    options: [
      { optionId: 'td11-optA', text: 'Chanakya', isCorrect: true },
      { optionId: 'td11-optB', text: 'Valmiki', isCorrect: false },
      { optionId: 'td11-optC', text: 'Vishwamitra', isCorrect: false },
      { optionId: 'td11-optD', text: 'Aryabhata', isCorrect: false }
    ],
  },
  {
    questionId: 'td12',
    questionType: 'multiple-choice',
    questionText: 'Which organization leads the celebration of World Teachers\' Day?',
    imageId: '',
    options: [
      { optionId: 'td12-optA', text: 'UNESCO', isCorrect: true },
      { optionId: 'td12-optB', text: 'UNICEF', isCorrect: false },
      { optionId: 'td12-optC', text: 'WHO', isCorrect: false },
      { optionId: 'td12-optD', text: 'IMF', isCorrect: false }
    ],
  },
  {
    questionId: 'td13',
    questionType: 'type-answer',
    questionText: 'The motto of a true teacher is to ___ knowledge.',
    correctAnswers: ['impart', 'share', 'spread', 'give'],
    caseSensitive: false,
  },
  {
    questionId: 'td14',
    questionType: 'checkboxes',
    questionText: 'Which qualities should a good teacher have?',
    imageId: '',
    options: [
      { optionId: 'td14-optA', text: 'Patience', isCorrect: true },
      { optionId: 'td14-optB', text: 'Creativity', isCorrect: true },
      { optionId: 'td14-optC', text: 'Arrogance', isCorrect: false },
      { optionId: 'td14-optD', text: 'Empathy', isCorrect: true }
    ],
  },
  {
    questionId: 'td15',
    questionType: 'multiple-choice',
    questionText: 'Which great scientist is often called the \'Missile Man of India\' and was also a teacher?',
    imageId: '',
    options: [
      { optionId: 'td15-optA', text: 'C.V. Raman', isCorrect: false },
      { optionId: 'td15-optB', text: 'Dr. A.P.J. Abdul Kalam', isCorrect: true },
      { optionId: 'td15-optC', text: 'Homi Bhabha', isCorrect: false },
      { optionId: 'td15-optD', text: 'Vikram Sarabhai', isCorrect: false }
    ],
  },
  {
    questionId: 'td16',
    questionType: 'multiple-choice',
    questionText: 'What is the traditional Indian word for teacher?',
    imageId: '',
    options: [
      { optionId: 'td16-optA', text: 'Guru', isCorrect: true },
      { optionId: 'td16-optB', text: 'Shishya', isCorrect: false },
      { optionId: 'td16-optC', text: 'Pandit', isCorrect: false },
      { optionId: 'td16-optD', text: 'Acharya', isCorrect: false }
    ],
  },
  {
    questionId: 'td17',
    questionType: 'reorder',
    questionText: 'Arrange the stages of effective learning in the correct order: Listening, Reflection, Practice',
    items: [
      { itemId: 'td17-optA', text: 'Listening' },
      { itemId: 'td17-optB', text: 'Reflection' },
      { itemId: 'td17-optC', text: 'Practice' }
    ],
    correctOrder: ['td17-optA', 'td17-optB', 'td17-optC'],
  },
  {
    questionId: 'td18',
    questionType: 'type-answer',
    questionText: 'Teachers light the ___ of knowledge in students\' lives.',
    correctAnswers: ['lamp', 'flame', 'light', 'candle'],
    caseSensitive: false,
  },
  {
    questionId: 'td19',
    questionType: 'multiple-choice',
    questionText: 'Who was the teacher of the Kauravas and Pandavas in the Mahabharata?',
    imageId: '',
    options: [
      { optionId: 'td19-optA', text: 'Dronacharya', isCorrect: true },
      { optionId: 'td19-optB', text: 'Vashishtha', isCorrect: false },
      { optionId: 'td19-optC', text: 'Chanakya', isCorrect: false },
      { optionId: 'td19-optD', text: 'Kripacharya', isCorrect: false }
    ],
  },
  {
    questionId: 'td20',
    questionType: 'checkboxes',
    questionText: 'Which of the following are globally respected teachers?',
    imageId: '',
    options: [
      { optionId: 'td20-optA', text: 'Confucius', isCorrect: true },
      { optionId: 'td20-optB', text: 'Aristotle', isCorrect: true },
      { optionId: 'td20-optC', text: 'Albert Einstein', isCorrect: true },
      { optionId: 'td20-optD', text: 'Bill Gates', isCorrect: false }
    ],
  },
  {
    questionId: 'td21',
    questionType: 'multiple-choice',
    questionText: 'Who was the family guru (kulaguru) of Lord Rama?',
    imageId: '',
    options: [
      { optionId: 'td21-optA', text: 'Vashishtha', isCorrect: true },
      { optionId: 'td21-optB', text: 'Vishwamitra', isCorrect: false },
      { optionId: 'td21-optC', text: 'Dronacharya', isCorrect: false },
      { optionId: 'td21-optD', text: 'Parashurama', isCorrect: false }
    ],
  },
  {
    questionId: 'td22',
    questionType: 'multiple-choice',
    questionText: 'Who said: "Teachers should be the best minds in the country"?',
    imageId: '',
    options: [
      { optionId: 'td22-optA', text: 'Dr. Sarvepalli Radhakrishnan', isCorrect: true },
      { optionId: 'td22-optB', text: 'Mahatma Gandhi', isCorrect: false },
      { optionId: 'td22-optC', text: 'A.P.J. Abdul Kalam', isCorrect: false },
      { optionId: 'td22-optD', text: 'Swami Vivekananda', isCorrect: false }
    ],
  },
  {
    questionId: 'td23',
    questionType: 'type-answer',
    questionText: 'The ___ tradition in India shows deep respect for teachers.',
    correctAnswers: ['Guru-Shishya', 'Guru Shishya', 'guru-shishya', 'guru shishya'],
    caseSensitive: false,
  },
  {
    questionId: 'td24',
    questionType: 'checkboxes',
    questionText: 'Which of these modern personalities also worked as teachers?',
    imageId: '',
    options: [
      { optionId: 'td24-optA', text: 'J.K. Rowling', isCorrect: true },
      { optionId: 'td24-optB', text: 'Barack Obama', isCorrect: true },
      { optionId: 'td24-optC', text: 'Mother Teresa', isCorrect: true },
      { optionId: 'td24-optD', text: 'Nelson Mandela', isCorrect: false }
    ],
  },
  {
    questionId: 'td25',
    questionType: 'multiple-choice',
    questionText: 'In which year was World Teachers\' Day established by UNESCO?',
    imageId: '',
    options: [
      { optionId: 'td25-optA', text: '1994', isCorrect: true },
      { optionId: 'td25-optB', text: '1975', isCorrect: false },
      { optionId: 'td25-optC', text: '2000', isCorrect: false },
      { optionId: 'td25-optD', text: '1987', isCorrect: false }
    ],
  },
  {
    questionId: 'td26',
    questionType: 'multiple-choice',
    questionText: 'Which Indian President is fondly known as the \'Teacher President\'?',
    imageId: '',
    options: [
      { optionId: 'td26-optA', text: 'Dr. Sarvepalli Radhakrishnan', isCorrect: true },
      { optionId: 'td26-optB', text: 'Rajendra Prasad', isCorrect: false },
      { optionId: 'td26-optC', text: 'Dr. A.P.J. Abdul Kalam', isCorrect: false },
      { optionId: 'td26-optD', text: 'Dr. Zakir Husain', isCorrect: false }
    ],
  },
  {
    questionId: 'td27',
    questionType: 'type-answer',
    questionText: 'A teacher takes a hand, opens a mind, and ___ a heart.',
    correctAnswers: ['touches', 'touch', 'warms', 'moves'],
    caseSensitive: false,
  },
  {
    questionId: 'td28',
    questionType: 'multiple-choice',
    questionText: 'Which teacher from Greek philosophy was the mentor of Alexander the Great?',
    imageId: '',
    options: [
      { optionId: 'td28-optA', text: 'Plato', isCorrect: false },
      { optionId: 'td28-optB', text: 'Aristotle', isCorrect: true },
      { optionId: 'td28-optC', text: 'Socrates', isCorrect: false },
      { optionId: 'td28-optD', text: 'Confucius', isCorrect: false }
    ],
  },
  {
    questionId: 'td29',
    questionType: 'checkboxes',
    questionText: 'Which activities are commonly organized in schools on Teacher\'s Day?',
    imageId: '',
    options: [
      { optionId: 'td29-optA', text: 'Cultural programs', isCorrect: true },
      { optionId: 'td29-optB', text: 'Sports competitions', isCorrect: true },
      { optionId: 'td29-optC', text: 'Students acting as teachers', isCorrect: true },
      { optionId: 'td29-optD', text: 'National holiday parade', isCorrect: false }
    ],
  },
  {
    questionId: 'td30',
    questionType: 'pinpoint',
    questionText: 'Pinpoint India on the map where Teacher\'s Day on 5th September is celebrated.',
    imageId: 'https://upload.wikimedia.org/wikipedia/commons/3/38/India_map.png',
    correctLocation: { x: 0.5, y: 0.5 },
    tolerance: 0.2,
    pinpointInstructions: 'Click on India on the map to identify where Teacher\'s Day is celebrated on September 5th.',
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