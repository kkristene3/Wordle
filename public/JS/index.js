document.addEventListener('DOMContentLoaded', function() {
    
    // Get all squares
    const squares = document.querySelectorAll('.square');

    // Initialize a count to keep track of which square the user is at
    let count = 0;

    // Initialize a row counter to keep track of which row the user is at
    let rowCounter = 0;

    // Add event listener to capture keypress events
    document.addEventListener('keydown', function(event) {
        // Get the key pressed
        const keyPressed = event.key.toUpperCase();


        if (keyPressed === 'BACKSPACE') {
            // Ensure count doesn't go below 0
            if (count > 0) {
                count--;
                squares[count + rowCounter].textContent = '';
            }
        } else if (/^[A-Z]$/.test(keyPressed)) { // Check if the key pressed is a letter (A-Z)
            // Ensure count doesn't go beyond the number of squares
            if (count < 5) {
                squares[count+rowCounter].textContent = keyPressed;
                count++;
            } else if (count+rowCounter < squares.length-1) {
                count = 0;
                rowCounter += 5;
                console.log(count+rowCounter);
                squares[count+rowCounter].textContent = keyPressed;
            }
        }
    });
});



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