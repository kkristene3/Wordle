// XML HTTP Request to fetch data from a JSON file
// Function to fetch data from a JSON file
function fetchData() {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'objects.json', true);

    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var data = JSON.parse(xhr.responseText);
            updateScoreboard(data.score);
        }
    };

    xhr.send();
}

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
};

/* This is the main flow of the game */
//Variable to store guessed word
var word = "";

//Tile colours
var green = 'background-color: #6ca965';
var yellow = 'background-color: #c8b653';
var gray = 'background-color: #787c7f';

//Variables to keep track of current square in the wordle grid
var rowNumber = 0;
var columnNumber = 0;

//GRAB THIS VALUE FROM THE JSON FILE
let gameOver = 0; // a variable to keep track of whether the game is over or not

// get button object
let restartButton = document.getElementById('reset_button');

// get table object
let scoreboard = document.getElementById('scoreboard');


//getting the grid
const wordleGrid = document.getElementById('game_grid');

    //typing letters into the squares of a row
    document.addEventListener('keydown', event =>{
        const keyPressed = event.key.toUpperCase();

        //MAYBE PUT THIS OUTSIDE OF THE EVENT LISTENER, IT'S NOT GOING TO GET HERE OTHERWISE
        if (gameOver != 0 && gameOver != -1) { 
            // make restart button visible
            restartButton.style.display = 'block';
         };

        //making sure the user can't try to guess when the game is over
        if (gameOver == 1 || gameOver == 2) return;


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

                //send the word to index.php -> write something to grab that value in index.php, you haven't yet
                var xhttp = new XMLHttpRequest();
                xhttp.open('GET', "../Wordle.php?word=" + word, true);
                xhttp.send();

                //we now want to check our new values from the JSON file
                var jsonInfo = new XMLHttpRequest();
                jsonInfo.onreadystatechange = function(){
                    if (this.readyState == 4 && this.status == 200){
                        var data = JSON.parse(jsonInfo.responseText);
                        
                        var colours = data.colourArray;
                        gameOver = data.GAMEOVER;
                        var wordIsValid = data.wordValid;
                        var answer = data.currentWord;

                        //checking if the word is one in the list
                        if (wordIsValid == 0){
                            //going through all the letters in the row
                            for (var i = 0; i<5; i++){
                                //if this letter's spot has value 0, then it is gray
                                if (colours[i] == 0){
                                    changeColour(wordleGrid, rowNumber, i, gray);
                                }
                                //if this letter's spot has value 1, it is yellow
                                else if (colours[i] == 1){
                                    changeColour(wordleGrid, rowNumber, i, yellow);
                                }
                                //otherwise it is green
                                else if (colours[i] == 2){
                                    changeColour(wordleGrid, rowNumber, i, green);
                                }
                            }
                            //setting the column number back to 0 to prepare for the user's next guess
                            columnNumber = 0;
                            //adding one to the row number to prepare for the next guess
                            rowNumber++;
                            word = '';
                        }
                        //the guessed word is not a valid guess
                        else{
                            if (wordIsValid == 1){
                                alert("Word is not valid. Try again.");
                            }
                            else if (wordIsValid == 2){
                                alert("This word has already been guessed. Please try another one");
                            }
                        }
                        //the user won the game
                        if (gameOver == 1){
                            alert(`Congratulations! You took ${rowNumber} guesses!`);
                            // make restart button visible
                            restartButton.style.display = 'block';
                            fetchData();
                        }
                        //the user lost the game
                        else if (gameOver == 2){
                            alert(`Oh no! Looks like you ran out of guesses! The answer was ${answer}.`);
                            // make restart button visible
                            restartButton.style.display = 'block';
                            fetchData();
                        }
                    }
                }

                jsonInfo.open('GET', '../objects.json', true);
                jsonInfo.send();

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