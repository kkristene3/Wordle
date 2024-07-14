<?php

function checkWord($guessedWord) {
    // check if a txt file exists
    if (file_exists('valid-wordle-words.txt')) {
        
        // read the file
        $words = file('valid-wordle-words.txt');

        // trim whitespace from each word
        $words = array_map('trim', $words);

        // trim whitespace from guessed word
        $guessedWord = trim($guessedWord);

        // check if guessed word is in the list of valid words
        if (in_array($guessedWord, $words)) {
            return 'Word is valid';
        } else {
            return 'Word is not valid';
        }

        
    } else {
        // error finding file
        return 'Error finding file';
    }
}

print_r(checkWord("hello"));

