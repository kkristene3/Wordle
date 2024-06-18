
/* This is the main flow of the game */

//boolean and counter to check if the game is finished
var wordIsCorrect = 0;

var rowNumber = 0;
var columnNumber = 0;


var backspaceCounter = 0;
var newLetter = 0;

//getting the grid
const wordleGrid = document.getElementById('game_grid');

    //typing letters into the squares of a row
    document.addEventListener('keydown', event =>{
    const keyPressed = event.key.toUpperCase();
    //if we still have space in the row and it's a valid letter, add it to the squares
    if (columnNumber<5){
        if (keyPressed.match(/[a-z]/i) && keyPressed.length == 1){
            addLetter(wordleGrid, rowNumber, columnNumber, keyPressed);
            columnNumber++;
            backspaceCounter = 0;
        }
    }
    //if we have a backspace and we still have a letter left, erase the last letter upon backspace
    //THIS IS MESSED UP, FIX IT
    if (columnNumber>=0){
        if (keyPressed == 'BACKSPACE'){
            removeLetter(wordleGrid, rowNumber, columnNumber);
            if (backspaceCounter>0){
                columnNumber = columnNumber-1;
            }
            backspaceCounter++;
        }
    }

    //pressing enter to lock in the guess
    if (columnNumber == 5){
        if (keyPressed == 'ENTER'){
            //THIS IS WHERE WE CHECK IF THEY GOT THE WORD RIGHT/IF ITS VALID. IF THEY DID WE DO A YOU WON POPUP OR ASK THEM TO RE-ENTER WORD
            //NEXT, IF THE WORD IS WRONG, CHECK IF ITS THE LAST ROW/THE GAME IS OVER
            //OTHERWISE WE MOVE ON TO THE NEXT ROW
            rowNumber++;
            columnNumber = 0;
        }
    }
        
    });

/*This function adds a letter to a square */
function addLetter(grid, rowNum, squareNum, keyPressed){
    const row = grid.children[rowNum];
    const square = row.children[squareNum];
    square.innerHTML = keyPressed;
}

/* This function removes a letter from a square */
function removeLetter(grid, rowNum, squareNum){
    const row = grid.children[rowNum];
    const square = row.children[squareNum];
    square.innerHTML = ' ';

}

/* This function checks if a word is a valid five-letter word */
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



//checkWord('hello').then(b => console.log(b));