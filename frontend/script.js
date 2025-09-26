document.addEventListener('DOMContentLoaded', () => {
    const wordContainer = document.getElementById('word-container');
    const incorrectGuessesContainer = document.getElementById('incorrect-guesses');
    const guessInput = document.getElementById('guess-input');
    const guessButton = document.getElementById('guess-button');
    const messageContainer = document.getElementById('message-container');
    const playAgainButton = document.getElementById('play-again-button');
    const bodyParts = document.querySelectorAll('.body-part');

    let word = '';
    let guessedLetters = [];
    let incorrectGuesses = 0;
    const maxIncorrectGuesses = 6;

    async function getWord() {
        try {
            // IMPORTANT: This assumes the backend is running on localhost:3000
            const response = await fetch('http://localhost:3000/word');
            const data = await response.json();
            return data.word;
        } catch (error) {
            console.error('Error fetching word:', error);
            messageContainer.textContent = 'Error fetching word. Please ensure the backend is running.';
            return null;
        }
    }

    async function startGame() {
        word = await getWord();
        if (!word) return;

        guessedLetters = [];
        incorrectGuesses = 0;

        wordContainer.innerHTML = word.split('').map(() => '_').join('');
        incorrectGuessesContainer.textContent = '';
        messageContainer.textContent = '';
        guessInput.value = '';
        guessInput.disabled = false;
        guessButton.disabled = false;
        playAgainButton.style.display = 'none';

        bodyParts.forEach(part => part.classList.remove('visible'));
    }

    function updateWordDisplay() {
        const displayWord = word.split('').map(letter => {
            return guessedLetters.includes(letter) ? letter : '_';
        }).join('');
        wordContainer.textContent = displayWord;
    }

    function handleGuess() {
        const letter = guessInput.value.toLowerCase();
        guessInput.value = '';

        if (!letter || !/^[a-z]$/.test(letter)) {
            messageContainer.textContent = 'Please enter a valid letter.';
            return;
        }

        if (guessedLetters.includes(letter)) {
            messageContainer.textContent = 'You already guessed that letter.';
            return;
        }

        guessedLetters.push(letter);
        messageContainer.textContent = '';


        if (word.includes(letter)) {
            updateWordDisplay();
        } else {
            incorrectGuesses++;
            incorrectGuessesContainer.textContent += (incorrectGuessesContainer.textContent ? ', ' : '') + letter;
            document.getElementById(getBodyPartId(incorrectGuesses)).classList.add('visible');
        }

        checkGameStatus();
    }

    function getBodyPartId(guessCount) {
        switch (guessCount) {
            case 1: return 'head';
            case 2: return 'body';
            case 3: return 'left-arm';
            case 4: return 'right-arm';
            case 5: return 'left-leg';
            case 6: return 'right-leg';
            default: return '';
        }
    }

    function checkGameStatus() {
        const isWinner = word.split('').every(letter => guessedLetters.includes(letter));

        if (isWinner) {
            messageContainer.textContent = 'Congratulations! You won!';
            endGame();
        } else if (incorrectGuesses >= maxIncorrectGuesses) {
            messageContainer.textContent = `Game over! The word was "${word}".`;
            wordContainer.textContent = word; // Reveal the word
            endGame();
        }
    }

    function endGame() {
        guessInput.disabled = true;
        guessButton.disabled = true;
        playAgainButton.style.display = 'block';
    }

    guessButton.addEventListener('click', handleGuess);
    guessInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleGuess();
        }
    });
    playAgainButton.addEventListener('click', startGame);

    // Initial game start
    startGame();
});