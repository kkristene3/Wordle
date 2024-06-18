// Get all squares
let squares;

// Initialize a count to keep track of which square the user is at
let count = 0;

// Initialize a row counter to keep track of which row the user is at
let rowCounter = 0;

// Initialize a variable to hold the word of the day
let wordleWord = "";


document.addEventListener('DOMContentLoaded', function() {
    
    // Get all squares
    squares = document.querySelectorAll('.square');


    // Add event listener to capture keypress events
    document.addEventListener('keydown', function(event) {
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
        else if (/^[A-Z]$/.test(keyPressed)) { // Check if the key pressed is a letter (A-Z)
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

            checkWord(word).then(isValid => {
                if (isValid) {
                    console.log("true");
                } else {
                    console.log("false");
                }
            });
        }
    });
});

/* This function gets a random word from the list of possible wordle answers */
function getWordOfTheDay() {
    return fetch('https://gist.githubusercontent.com/dracos/dd0668f281e685bad51479e5acaadb93/raw/6bfa15d263d6d5b63840a8e5b64e04b382fdb079/valid-wordle-words.txt')
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
    return fetch('https://gist.githubusercontent.com/dracos/dd0668f281e685bad51479e5acaadb93/raw/6bfa15d263d6d5b63840a8e5b64e04b382fdb079/valid-wordle-words.txt')
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