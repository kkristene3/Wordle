/* GLOBAL VARIABLES */
let squares; // Get all squares
let count = 0; // a count to keep track of which square the user is at
let rowCounter = 0; // a row counter to keep track of which row the user is at
let wordleWord = getWordOfTheDay(); // a variable to hold the word of the day
let gameOver = false; // a variable to keep track of whether the game is over or not

console.log(wordleWord);

document.addEventListener('DOMContentLoaded', function() {
    
    // Get all squares in grid
    squares = document.querySelectorAll('.square');

    // Add event listener to capture keypress events
    document.addEventListener('keydown', function(event) {

        if (gameOver) return;

        // Get the key pressed
        const keyPressed = event.key.toUpperCase();

        // if key pressed is backspace
        if (keyPressed === 'BACKSPACE') {
            // Ensure count doesn't go below 0
            if (count > 0) {
                count--;
                squares[count + rowCounter].textContent = '';
            }
        } 

        // Check if the key pressed is a letter (A-Z)
        else if (/^[A-Z]$/.test(keyPressed)) {
            // Ensure count doesn't go beyond the number of columns
            if (count < 5) {
                squares[count+rowCounter].textContent = keyPressed;
                count++;
            } else if (count+rowCounter < squares.length-1) { // if at end of row, move to next row
                count = 0;
                rowCounter += 5;
                console.log(count+rowCounter);
            }
        }

        // if key pressed is enter
        else if (keyPressed === 'ENTER') {
            word = getWord();

            // check if word if five-letters
            if (word.length !== 5) {
                alert("Word must be five letters long.");
            }
            else {
                checkWord(word).then(isValid => {
                    if (isValid) {
                        if (word == wordleWord) {
                            alert("Congratulations! You guessed the word of the day!");
                            gameOver = true; // end
                        } else {
                            alert("do the feedback thingy");
                        }
                    } else {
                        alert("Word is not valid. Try again.")
                    }
                });
            }
        }
    });
});

/* This function gets a random word from the list of possible wordle answers */
function getWordOfTheDay() {
    return fetch('https://gist.githubusercontent.com/scholtes/94f3c0303ba6a7768b47583aff36654d/raw/d9cddf5e16140df9e14f19c2de76a0ef36fd2748/wordle-La.txt')
        .then(response => response.text())
        .then(data => {

            // seperate words into array
            const possibleWords = data.split('\n');

            // get a random word from the array
            const randomIndex = Math.floor(Math.random() * possibleWords.length);
            wordleWord = possibleWords[randomIndex];

            console.log(wordleWord);

        })
        .catch((error) => {
            console.error('Error:', error);
            return "";
        });
}

/* This function takes the letter in each square and concatenates into into a word */
function getWord() {
     // Get the word
     let word = '';
     for (let i = rowCounter; i < rowCounter + 5; i++) {
         word += squares[i].textContent;
     }
     console.log(word);
     return word.toLowerCase();
}

/* This function checks if a word is a valid five-letter word */
function checkWord(word) {
    return fetch('https://raw.githubusercontent.com/kkristene3/Wordle/kristen-branch/public/JS/acceptedWords.txt?token=GHSAT0AAAAAACR7YG22A4FT36KW623VRIVGZTRBT3A')
        .then(response => response.text())
        .then(data => {

            // seperate words into array
            const words = data.split('\n');

            // check if word is valid
            if (words.includes(word)) {
                console.log(`The word "${word}" is valid.`);
                return true;
            } else {
                console.log(`The word "${word}" is not valid.`);
                return false;
            }
        })
        .catch((error) => {
            console.error('Error:', error);
            return false;
        });
}