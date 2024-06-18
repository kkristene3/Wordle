/* This is the main flow of the game */

// VARIABLES
var word = '';

var rowNumber = 0;
var columnNumber = 0;

var backspaceCounter = 0;
var newLetter = 0;

let wordleWord = getWordOfTheDay(); // a variable to hold the word of the day
let gameOver = false; // a variable to keep track of whether the game is over or not

//getting the grid
const wordleGrid = document.getElementById('game_grid');

    //typing letters into the squares of a row
    document.addEventListener('keydown', event =>{
        const keyPressed = event.key.toUpperCase();
        if (gameOver) return;
        //if we still have space in the row and it's a valid letter, add it to the squares
        if (columnNumber<5){
            if (keyPressed.match(/[a-z]/i) && keyPressed.length == 1){
                addLetter(wordleGrid, rowNumber, columnNumber, keyPressed);
                columnNumber++;
                backspaceCounter = 0;
            }
        }
        //if we have a backspace and we still have a letter left, erase the last letter upon backspace
        if (columnNumber > 0){
            if (keyPressed == 'BACKSPACE'){
                columnNumber--;
                removeLetter(wordleGrid, rowNumber, columnNumber);
                backspaceCounter++;
            }
        }

        //pressing enter to lock in the guess
        if (columnNumber == 5){
            if (keyPressed == 'ENTER'){
                //THIS IS WHERE WE CHECK IF THEY GOT THE WORD RIGHT/IF ITS VALID. IF THEY DID WE DO A YOU WON POPUP OR ASK THEM TO RE-ENTER WORD
                //NEXT, IF THE WORD IS WRONG, CHECK IF ITS THE LAST ROW/THE GAME IS OVER
                //OTHERWISE WE MOVE ON TO THE NEXT ROW
            

                // check if word if five-letters
                if (word.length !== 5) {
                    alert("Word must be five letters long.");
                }
                else {
                    checkWord(word).then(isValid => {
                        if (isValid) {
                            if (word == wordleWord) {
                                alert(`Congratulations! You took ${rowNumber+1} guesses!`);
                                gameOver = true; // end game
                            } else {
                                alert("DO THE FEEDBACK");
                                rowNumber++;
                                columnNumber = 0;
                            }
                        } else {
                            alert("Word is not valid. Try again.")
                        }
                    });
                }
            }
        }
    });

/**
 * This function adds a letter to a square
 * @param {*} grid 
 * @param {*} rowNum 
 * @param {*} squareNum 
 * @param {*} keyPressed 
 */
function addLetter(grid, rowNum, squareNum, keyPressed){
    const row = grid.children[rowNum];
    const square = row.children[squareNum];
    square.innerHTML = keyPressed;
}

/**
 * This function removes a letter from a square
 * @param {*} grid 
 * @param {*} rowNum 
 * @param {*} squareNum 
 */
function removeLetter(grid, rowNum, squareNum){
    const row = grid.children[rowNum];
    const square = row.children[squareNum];
    square.innerHTML = '';
}

/**
 * This function gets a random word from the list of possible wordle answers 
 * @returns the word of the day
 */
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

/**
 * This function checks if a word is a valid five-letter word
 * @param {*} word 
 * @returns true if word is valid, false otherwise
 */
function checkWord(word) {
    return fetch('https://raw.githubusercontent.com/charlesreid1/five-letter-words/master/sgb-words.txt')
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

// GET RID OF THIS LATER - its to set the guess word
function setWord(newWord) {
    word = newWord;
}