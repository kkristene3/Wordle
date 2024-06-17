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