/* This is the main flow of the game */

//Variable to store guessed word
var word = '';
//List to store previous guesses
var wordList = [];

//Tile colours
var green = 'background-color: #6ca965';
var yellow = 'background-color: #c8b653';
var gray = 'background-color: #787c7f';

//Variables to keep track of current square in the wordle grid
var rowNumber = 0;
var columnNumber = 0;

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
                word = word.concat(keyPressed);
                columnNumber++;
            }
        }
        //if we have a backspace and we still have a letter left, erase the last letter upon backspace
        if (columnNumber > 0){
            if (keyPressed == 'BACKSPACE'){
                columnNumber--;
                removeLetter(wordleGrid, rowNumber, columnNumber);
                word = word.substring(0, word.length-1);
            }
        }

        //pressing enter to lock in the guess
        if (columnNumber == 5){
            if (keyPressed == 'ENTER'){
                word = word.toLowerCase();

                // check if word if five-letters
                checkWord(word).then(isValid => {
                    if (isValid) {

                        //you won!
                        if (word == wordleWord) {
                            //change all the squares to green
                            for (var i = 0; i<5; i++){
                                changeColour(wordleGrid, rowNumber, i, green);
                            }
                            alert(`Congratulations! You took ${rowNumber+1} guesses!`);
                            gameOver = true; // end game
                        } 
                        //make sure the word hasn't alrady been guessed
                        else if (wordList.includes(word)){
                            alert("You've already tried this word. Try a different one");
                        }
                        //the word can be guessed, but is not correct 
                        else {
                            //check the position of every letter
                            for (var i = 0; i<5; i++){
                                currentLetter = word.charAt(i);
                                expectedLetter = wordleWord.charAt(i);

                                //if the letter is in the correct position, turn it green
                                if (currentLetter == expectedLetter){
                                    changeColour(wordleGrid, rowNumber, i, green);
                                }
                                //otherwise, if the word contains this letter, turn it yellow
                                else if (wordleWord.includes(currentLetter)){
                                    changeColour(wordleGrid, rowNumber, i, yellow);
                                }
                                //if the letter is not in the word, turn it yellow
                                else{
                                    changeColour(wordleGrid, rowNumber, i, gray);
                                }
                            }
                            //if the user is on the last row and the word is not correct, they lost
                            if (rowNumber == 5){
                                gameOver = true; //end game
                                alert('Oh no! Looks like you ran out of guesses! Game over =(');
                            }
                            //if the game is not over, move on to the next row, save the word as a previous guess and reset the word
                            rowNumber++;
                            columnNumber = 0;
                            wordList.push(word);
                            word = '';
                        }
                    } else {
                        alert("Word is not valid. Try again.");
                    }
                });
            }
        }
    });

/**
 * This function adds a letter to a square
 * @param {*} grid The entire wordle grid
 * @param {*} rowNum The row index of the current square to be updated
 * @param {*} squareNum The column index of the current square to be updated
 * @param {*} keyPressed The character to insert into the current square
 */
function addLetter(grid, rowNum, squareNum, keyPressed){
    const row = grid.children[rowNum];
    const square = row.children[squareNum];
    square.innerHTML = keyPressed;
}

/**
 * This function removes a letter from a square
 * @param {*} grid The entire wordle grid
 * @param {*} rowNum The row index of the square to be updated
 * @param {*} squareNum The column index of the square to be updated
 */
function removeLetter(grid, rowNum, squareNum){
    const row = grid.children[rowNum];
    const square = row.children[squareNum];
    square.innerHTML = '';
}

/**
 * This function changes the colour of a square
 * @param {*} grid The entire wordle grid
 * @param {*} rowNum The row index of the square to be changed
 * @param {*} squareNum The column of the square to be changed
 * @param {*} colour The color that the square must be turned into
 */
function changeColour(grid, rowNum, squareNum, colour){
    const row = grid.children[rowNum];
    const square = row.children[squareNum];
    square.setAttribute("style", colour);
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

            return wordleWord;
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
            word = word.toLowerCase();

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