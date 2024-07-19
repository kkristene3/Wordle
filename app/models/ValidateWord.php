<?php

namespace App\Models;

use App\Models\JsonHandler;

/**
 * This model validates the word
 */
class ValidateWord {
    private $jsonHandler;

    /**
     * Constructor
     * Initializes the JSON handler
     * @return void
     */
    public function __construct() {
        $this->jsonHandler = new JsonHandler();
    }
    
    public function checkWord($guessedWord) {
        // get the JSON content (given a string -> decode it into an array)
        $jsonContent = $this->jsonHandler->getJsonData();

        // check if the word is valid
        if (file_exists('../app/models/valid-wordle-words.txt')) {
             // read the file
            $words = file('../app/models/valid-wordle-words.txt');

            // trim whitespace from each word
            $words = array_map('trim', $words);
            $guessedWord = trim($guessedWord);

            // check if guessed word is in the list of valid words
            if (in_array($guessedWord, $words)) {
                $this->jsonHandler->updateJsonField('wordValid', 0);
            } else {
                $this->jsonHandler->updateJsonField('wordValid', 1);
            }

        } else {
            die('Error finding file');
        }
    }
    
}
