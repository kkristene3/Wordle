// Function to fetch data from Game.php
function fetchData() {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '../Game.php?action=fetchData', true);

    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var data = JSON.parse(xhr.responseText);
            updateScoreboard(data.score);
        }
    };

    xhr.send();
}

/**
 * Reload data into Wordle grid
 */
function fetchWordleData() {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'Game.php?action=fetchWordleData', true);

    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var data = JSON.parse(xhr.responseText);
            // get previous guesses to repopulate Wordle grid
            var colours = data.colourArray;
            var previousGuesses = data.guessedWords;
            var rowNum = data.rowNum;
            gameOver = data.GAMEOVER;
            repopulateGrid(colours, previousGuesses, gameOver, rowNum);
        }
    };

    xhr.send();
}

/**
 * Update the scoreboard with the data from Game.php
 * @param {} score 
 */
function updateScoreboard(score) {
    // Populate scoreboard with data from PHP
    let placeholder = document.getElementById('scoreboard-data');
    let output = "";
    let i = 1;
    // Access the score array within the data object
    for (let guess of score) {
        output += `
        <tr>
            <td>${i++}</td>
            <td>${guess}</td>
        </tr>
        `;
    }
    // Populate the table with the data from PHP
    placeholder.innerHTML = output;
}

// Fetch the data when the page loads
window.onload = function() {
    fetchData();
    fetchWordleData();
};

/* This is the main flow of the game */
// Variable to store guessed word
var word = "";

// Tile colours
var green = 'background-color: #6ca965';
var yellow = 'background-color: #c8b653';
var gray = 'background-color: #787c7f';

// Initialize rowNumber
var rowNumber = 0;

// Variables to keep track of current square in the Wordle grid
var columnNumber = 0;

// GRAB THIS VALUE FROM THE PHP FILE
let gameOver = 0; // a variable to keep track of whether the game is over or not

// Get button object
var restartButton = document.getElementById('reset_button');

// Getting the grid
const wordleGrid = document.getElementById('game_grid');

// Typing letters into the squares of a row
document.addEventListener('keydown', event => {
    const keyPressed = event.key.toUpperCase();

    if (gameOver !== 0 && gameOver !== -1) {
        restartButton.style.display = 'block';
    }

    if (gameOver === 1 || gameOver === 2) return;

    if (columnNumber < 5) {
        if (keyPressed.match(/[A-Z]/i) && keyPressed.length === 1) {
            addLetter(wordleGrid, rowNumber, columnNumber, keyPressed);
            word = word.concat(keyPressed);
            columnNumber++;
        }
    }

    if (columnNumber > 0 && keyPressed === 'BACKSPACE') {
        columnNumber--;
        removeLetter(wordleGrid, rowNumber, columnNumber);
        word = word.substring(0, word.length - 1);
    }

    if (columnNumber === 5 && keyPressed === 'ENTER') {
        word = word.toLowerCase();

        // Send guessed word to Game.php
        var xhttp = new XMLHttpRequest();
        xhttp.open('GET', 'Game.php?action=guessWord&word=' + word, true);
        xhttp.onreadystatechange = function() {
            if (this.readyState === 4 && this.status === 200) {
                var data = JSON.parse(this.responseText);

                var colours = data.colourArray;
                gameOver = data.GAMEOVER;
                var wordIsValid = data.wordValid;

                if (wordIsValid === 0) {
                    for (var i = 0; i < 5; i++) {
                        if (colours[i] === 0) {
                            changeColour(wordleGrid, rowNumber, i, gray);
                        } else if (colours[i] === 1) {
                            changeColour(wordleGrid, rowNumber, i, yellow);
                        } else if (colours[i] === 2) {
                            changeColour(wordleGrid, rowNumber, i, green);
                        }
                    }

                    columnNumber = 0;
                    rowNumber++;
                    word = '';
                } else {
                    if (wordIsValid === 1) {
                        alert("Word is not valid. Try again.");
                    } else if (wordIsValid === 2) {
                        alert("This word has already been guessed. Please try another one.");
                    }
                }

                if (gameOver === 1) {
                    alert(`Congratulations! You took ${rowNumber} guesses!`);
                    restartButton.style.display = 'block';
                    fetchData();
                } else if (gameOver === 2) {
                    alert(`Oh no! Looks like you ran out of guesses! Game over =(`);
                    restartButton.style.display = 'block';
                    fetchData();
                }
            }
        };
        xhttp.send();
    }
});

/**
 * This function adds a letter to a square
 * @param {*} grid The entire wordle grid
 * @param {*} rowNum The row index of the current square to be updated
 * @param {*} squareNum The column index of the current square to be updated
 * @param {*} keyPressed The character to insert into the current square
 */
function addLetter(grid, rowNum, squareNum, keyPressed) {
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
function removeLetter(grid, rowNum, squareNum) {
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
function changeColour(grid, rowNum, squareNum, colour) {
    const row = grid.children[rowNum];
    const square = row.children[squareNum];
    square.setAttribute("style", colour);
}

/**
 * This function resets the game values when the button is clicked
 */
function resetGame() {
    // hide restart button
    restartButton.style.display = 'none';

    // reset variables
    word = '';
    rowNumber = 0;
    columnNumber = 0;
    gameOver = -1;

    // reset grid
    for (var i = 0; i < 6; i++) {
        for (var j = 0; j < 5; j++) {
            changeColour(wordleGrid, i, j, 'background-color: white');
            removeLetter(wordleGrid, i, j);
        }
    }

    // call reset function in PHP
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'Game.php?action=resetGame', true);
    xhr.send();
}
