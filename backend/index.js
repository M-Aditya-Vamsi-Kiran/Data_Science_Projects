const express = require('express');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());

const words = [
    "javascript", "hangman", "react", "node", "express", "mongodb", "html", "css", "developer"
];

app.get('/word', (req, res) => {
    const word = words[Math.floor(Math.random() * words.length)];
    res.json({ word });
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});