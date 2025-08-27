# 🎯 Quiz Application

A full-stack interactive quiz application built with React and Node.js, featuring multiple quiz types with diverse question formats including multiple choice, checkboxes, type-answer, reorder, range sliders, and pinpoint interactions.

## 🌟 Features

### Quiz Types
- **🚗 Car Logo Quiz** - Test your knowledge of automotive brands
- **🏳️ Country Flag Quiz** - Identify flags from around the world  
- **🐘 Ganesh Chaturthi Quiz** - Learn about Lord Ganesha and the festival
- **🧠 Advanced Quiz** - Mixed topics with various question types
- **🎲 Mixed Quiz** - Randomized questions from different categories

### Question Types Supported
- **Multiple Choice** - Single correct answer with image support
- **Checkboxes** - Multiple correct answers
- **Type Answer** - Fill-in-the-blank text input
- **Reorder** - Drag and drop items in correct sequence
- **Range Slider** - Select values on a numeric scale
- **Pinpoint** - Click specific locations on images

### Interactive Features
- 🎊 Confetti animations for correct answers
- 📊 Progress tracking and scoring
- 🔀 Random option shuffling
- 📱 Responsive design
- 🎨 Modern UI with festive styling

## 🏗️ Project Structure

```
quiz/
├── quiz-frontend/          # React frontend application
│   ├── public/
│   │   ├── images/         # Quiz images and assets
│   │   └── index.html
│   ├── src/
│   │   ├── components/     # Quiz components
│   │   ├── HomePage.js     # Main navigation
│   │   ├── App.js         # Routing and main app
│   │   └── *.css          # Styling files
│   └── package.json
├── quiz-backend/           # Node.js/Express backend
│   ├── public/
│   │   └── images/         # Static image assets
│   ├── server.js          # Main server file with quiz data
│   └── package.json
└── README.md
```

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn package manager
- Git

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd quiz-backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the backend server:**
   ```bash
   node server.js
   ```
   
   The backend will run on `http://localhost:5001`

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd quiz-frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the React development server:**
   ```bash
   npm start
   ```
   
   The frontend will run on `http://localhost:3000`

## 🎮 Usage

1. **Start both servers** (backend on port 5001, frontend on port 3000)
2. **Open your browser** to `http://localhost:3000`
3. **Choose a quiz type** from the home page
4. **Answer questions** using various interaction methods:
   - Click for multiple choice
   - Check boxes for multiple selections
   - Type answers in text fields
   - Drag and drop for reordering
   - Use sliders for range questions
   - Click on images for pinpoint questions
5. **View your score** and enjoy confetti animations for correct answers!

## 🛠️ Development

### Backend API Endpoints

- `GET /api/questions` - Get all advanced quiz questions
- `GET /api/car-quiz` - Get car logo quiz questions
- `GET /api/country-quiz` - Get country flag quiz questions
- `GET /api/ganesh-quiz` - Get Ganesh Chaturthi quiz questions
- `GET /api/mixed-quiz` - Get mixed quiz questions

### Frontend Components

- **HomePage** - Main navigation and quiz selection
- **AdvancedQuiz** - Advanced quiz with all question types
- **CarLogoQuiz** - Car brand logo identification
- **CountryFlagQuiz** - Country flag identification
- **GaneshChaturthiQuiz** - Festival-themed quiz
- **MixedQuiz** - Randomized mixed questions

### Adding New Questions

Questions are stored in the `quiz-backend/server.js` file. Each question follows this structure:

```javascript
{
  questionId: 'unique-id',
  questionType: 'multiple-choice|checkboxes|type-answer|reorder|range|pinpoint',
  questionText: 'Your question text',
  imageId: 'optional-image-url',
  options: [...], // For multiple choice/checkboxes
  correctAnswer: '...', // For type-answer
  correctOrder: [...], // For reorder
  correctValue: number, // For range
  correctCoordinates: {...} // For pinpoint
}
```

## 🎨 Customization

### Styling
- Modify CSS files in `quiz-frontend/src/` to customize appearance
- Each quiz component has its own CSS file for specific styling
- Global styles are in `index.css`

### Adding New Quiz Types
1. Create a new React component in `src/`
2. Add corresponding CSS file
3. Add questions to `server.js` backend
4. Update routing in `App.js`
5. Add navigation option in `HomePage.js`

## 🚀 Deployment

### Frontend (Vercel)
The frontend is configured for Vercel deployment:
```bash
npm run build
# Deploy build folder to Vercel
```

### Backend (Render)
The backend is configured for Render deployment with:
- Production API URL: `https://quiz-wfun.onrender.com`
- CORS configured for both local and production environments

## 🧪 Testing

Run frontend tests:
```bash
cd quiz-frontend
npm test
```

## 📦 Dependencies

### Frontend
- React 19.1.0
- React Router for navigation
- Leaflet for map interactions
- Testing libraries for unit tests

### Backend
- Express.js for server framework
- CORS for cross-origin requests
- Static file serving for images

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is open source and available under the MIT License.

## 🎯 Future Enhancements

- User authentication and score tracking
- Leaderboards and competitions
- More quiz categories
- Timed questions
- Difficulty levels
- Social sharing features

---

**Enjoy quizzing! 🎉**
