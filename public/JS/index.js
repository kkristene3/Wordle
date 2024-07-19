// XML HTTP Request to fetch data from a JSON file
// Function to fetch data from a JSON file
function fetchData() {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '../../JSON/objects.json', true);

    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var data = JSON.parse(xhr.responseText);
            updateScoreboard(data.score);
        }
    };

    xhr.send();
}

/**
 * Reload data into wordle grid
 */
function fetchWordleData() {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '../../JSON/objects.json', true);

    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var data = JSON.parse(xhr.responseText);
            // get previous guesses to repopulate wordle grid
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
 * Repopulates grid with previous guesses
 * @param {} colours 
 * @param {*} previousGuesses 
 */
function repopulateGrid(colours, previousGuesses, gameOver, rowNum) {

    if (gameOver === 1 || gameOver === 2) {
        restartButton.style.display = 'block';
    } 
    // Get the wordle grid
    let wordleGrid = document.getElementById('game_grid');

    // Iterate over previousGuesses array
    for (let r = 0; r < previousGuesses.length; r++) {
        let guess = previousGuesses[r];

        // Skip if guess is null or undefined
        if (guess === null || guess === undefined) {
            continue;
        }

        for (let c = 0; c < guess.length; c++) {
            let letter = guess[c] ? guess[c].toUpperCase() : '';
            let colour = colours[r * 5 + c]; // Assuming colours array is flat

            if (letter !== undefined && letter !== '') {
                addLetter(wordleGrid, r, c, letter);
                if (rowNum >= r) {
                    if (colour === 0) {
                    changeColour(wordleGrid, rowNum-1, c, gray);
                    } else if (colour === 1) {
                        changeColour(wordleGrid, rowNum-1, c, yellow);
                    } else if (colour === 2) {
                        changeColour(wordleGrid, rowNum-1, c, green);
                    }
                }
                
            }
        }
    
    }

    
}


/**
 * Update the scoreboard with the data from the JSON file
 * @param {} score 
 */
function updateScoreboard(score) {
    // populate scoreboard with data from JSON file
    let placeholder = document.getElementById('scoreboard-data');
    let output = "";
    let i = 1;
    // Access the score array within the JSON object
    for (let guess of score) {
        output += `
        <tr>
            <td>${i++}</td>
            <td>${guess}</td>
        </tr>
        `;
    }
    // Populate the table with the data from the JSON file
    placeholder.innerHTML = output;
}

// Fetch the data when the page loads
window.onload = function() {
    fetchData();
    fetchWordleData();
};

/* This is the main flow of the game */
//Variable to store guessed word
var word = "";

//Tile colours
var green = 'background-color: #6ca965';
var yellow = 'background-color: #c8b653';
var gray = 'background-color: #787c7f';

// get row number from JSON file
var request = new XMLHttpRequest();
request.open('GET', '../../JSON/objects.json', true);

request.onreadystatechange = function() {
    if (request.readyState === 4 && request.status === 200) {
        var data = JSON.parse(request.responseText);
        rowNumber = data.rowNum;
    }
};

request.send();

//Variables to keep track of current square in the wordle grid
var columnNumber = 0;

//GRAB THIS VALUE FROM THE JSON FILE
let gameOver = 0; // a variable to keep track of whether the game is over or not

// get button object
var restartButton = document.getElementById('reset_button');


//getting the grid
const wordleGrid = document.getElementById('game_grid');

    //typing letters into the squares of a row
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
    
            var xhttp = new XMLHttpRequest();
            xhttp.open('GET', "../Wordle.php?word=" + word, false);
            xhttp.send();
    
            var jsonInfo = new XMLHttpRequest();
            jsonInfo.onreadystatechange = function() {
                if (this.readyState === 4 && this.status === 200) {
                    var data = JSON.parse(jsonInfo.responseText);
    
                    var colours = data.colourArray;
                    gameOver = data.GAMEOVER;
                    var answer = data.currentWord;
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
                        alert(`Oh no! Looks like you ran out of guesses! The answer was ${answer}.`);
                        restartButton.style.display = 'block';
                        fetchData();
                    }
                }
            };
    
            jsonInfo.open('GET', '../../JSON/objects.json', true);
            jsonInfo.send();
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

function getRowNumber(){
    // get row number from JSON file
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '../../JSON/objects.json', true);

    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var data = JSON.parse(xhr.responseText);
            var row = data.rowNum;
            return row+1;
        }
    };
    
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
    for (var i = 0; i<6; i++){
        for (var j = 0; j<5; j++){
            changeColour(wordleGrid, i, j, 'background-color: white');
            removeLetter(wordleGrid, i, j);
        }
    }

    // call reset function in PHP 
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '../Wordle.php?word=resetIt', true);
    xhr.send();

}
