// server.js
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json()); // for parsing JSON bodies

// Sample endpoint
app.get('/', (req, res) => {
    res.send('Gamified Quiz API is running...');
});

// Quiz questions endpoint
app.get('/questions', (req, res) => {
    const questions = [
        { id: 1, question: '2 + 2 = ?', options: ['3', '4', '5'], answer: '4' },
        { id: 2, question: 'Capital of France?', options: ['Berlin', 'Paris', 'Rome'], answer: 'Paris' }
    ];
    res.json(questions);
});

// Start server
app.listen(5000, () => {
    console.log('Server running on http://localhost:5000');
});
