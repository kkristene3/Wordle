<?php

function getWordOfTheDay() {
    // check if a txt file exists
    if (file_exists('wordle-La.txt')) {
        // read the file
        $words = file('wordle-La.txt');
        // trim whitespace from each word
        $words = array_map('trim', $words);

        // choose a random word from the file
        $wordOfTheDay = $words[array_rand($words)];

        return $wordOfTheDay;
    } else {
        // error finding file
        return 'Error finding file';
    }
}

print_r(getWordOfTheDay());
