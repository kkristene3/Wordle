<?php

use App\Models\JsonHandler;
use App\Models\ValidateWord;

/**
 * This model handles the game logic
 */
class Game {
    private $jsonHandler;
    private $wordValidator;

    public function __construct() {
        $this->jsonHandler = new JsonHandler();
        $this->wordValidator = new ValidateWord();
    }

    /**
     * Wordle game logic 
     * Calls other functions to run the game
     * @return void
     */
    public function runGame() {
        // get the JSON data in an array
        $jsonContent= $this->jsonHandler->getJsonData();
        $jsonArray = json_decode($jsonContent, true);
       
       // $word = $_REQUEST['word'];
       $word= "retro";

        // reset the JSON array
        if ($word == "resetIt") {
            $this->resetJSON();
        } else {
            if ($jsonArray['GAMEOVER'] == -1) {
                //if it did, get a new word and put it in the JSON
                $wordleWord = $this->getWordOfTheDay();
                $this->jsonHandler->updateJsonField('currentWord', $wordleWord);
                //indicate that the game has started in the JSON
                $this->jsonHandler->updateJsonField('GAMEOVER', 0);
            }

            $this->wordValidator->checkWord($word);
            $this->checkLetterPlacement($word);
        }
    }

/**
     * Check if player won game!!
     * Updates JSON file with new data
     * @param $guess the word that the user guessed
     * @return void
     */
    public function checkLetterPlacement($guess) {
        // Get the JSON data in an array
        $jsonContent = $this->jsonHandler->getJsonData();
        $jsonArray = json_decode($jsonContent, true);
    
        if ($jsonArray === null) {
            die('Error decoding JSON file');
        }
    
        // Get current row number
        $currentRowNum = $jsonArray['rowNum'];
        
        // If the word is guessed correctly, the game is over
        if ($jsonArray['currentWord'] == $guess) {
            $this->jsonHandler->updateJsonField('GAMEOVER', 1);
            $this->jsonHandler->updateJsonField('colourArray', [2, 2, 2, 2, 2]);
            $this->jsonHandler->updateJsonIndexArray('guessedWords', $currentRowNum, $guess);
    
            // Get the current scoreboard and the current score
            $scoreboard = $jsonArray['score'];
            $currentScore = $jsonArray['rowNum'] + 1;
    
            // Add the current score to the scoreboard
            array_push($scoreboard, $currentScore);
    
            // Filter out the placeholders ("-") from the scoreboard into a new array
            $filteredScores = array_filter($scoreboard, function($value) {
                return $value !== "-";
            });
    
            // Sort the filtered scores array
            sort($filteredScores, SORT_NUMERIC);
    
            // Keep track of only the top 10 scores
            $topScores = array_slice($filteredScores, 0, 10);
    
            // Add back in the placeholders if there are less than 10 scores
            while (count($topScores) < 10) {
                $topScores[] = "-";
            }
    
            // Place the updated scoreboard back into the JSON array
            $this->jsonHandler->updateJsonField('score', $topScores);
            $this->jsonHandler->incrementRowNum();
    
        } else if (in_array($guess, $jsonArray['guessedWords'])) {
            $this->jsonHandler->updateJsonField('wordValid', 2);
        } else if ($jsonArray['wordValid'] != 1) {
            // Check the position of every letter
            for ($i = 0; $i < 5; $i++) {
                $currentLetter = substr($guess, $i, 1);
                $expectedLetter = substr($jsonArray['currentWord'], $i, 1);
    
                if ($currentLetter == $expectedLetter) {
                    $this->jsonHandler->updateJsonIndexArray('colourArray', $i, 2);
                } else if (strpos($jsonArray['currentWord'], $currentLetter) !== false) {
                    // Check if this letter is guessed an extra time
                    $wordleCount = 0;
                    $incorrectCount = 0;
                    $correctCount = 0;
    
                    for ($j = 0; $j < 5; $j++) {
                        if (substr($jsonArray['currentWord'], $j, 1) == $currentLetter) {
                            $wordleCount++;
                            if (substr($guess, $j, 1) == $currentLetter) {
                                $correctCount++;
                            }
                        }
                    }
    
                    for ($j = 0; $j < $i; $j++) {
                        if (substr($guess, $j, 1) == $currentLetter && substr($jsonArray['currentWord'], $j, 1) != $currentLetter) {
                            $incorrectCount++;
                        }
                    }
    
                    if ($wordleCount - ($correctCount + $incorrectCount) <= 0) {
                        $this->jsonHandler->updateJsonIndexArray('colourArray', $i, 0);
                    } else {
                        $this->jsonHandler->updateJsonIndexArray('colourArray', $i, 1);
                    }
                } else {
                    $this->jsonHandler->updateJsonIndexArray('colourArray', $i, 0);
                }
            }
    
            if ($jsonArray['rowNum'] == 5) {
                $this->jsonHandler->updateJsonField('GAMEOVER', 2);
            }
    
            // Move on to the next row and save the word as a previous guess
            $this->jsonHandler->updateJsonIndexArray('guessedWords', $jsonArray['rowNum'], $guess);
            $this->jsonHandler->incrementRowNum();
        }
    }
    
    

    public function getWordOfTheDay() {
        $filePath = __DIR__ . '/wordle-La.txt'; // Adjust based on the actual script location

    if (file_exists($filePath)) {
        // Read the file
        $words = file($filePath);
        // Trim whitespace from each word
        $words = array_map('trim', $words);

        // Choose a random word from the file
        $wordOfTheDay = $words[array_rand($words)];

        return $wordOfTheDay;
    } else {
        // Error finding file
        return 'Error finding file!';
    }
    }

    /**
     * Reset the JSON data
     * @return void
     */
    public function resetJSON() {
        // reset JSON data
        $this->jsonHandler->updateJsonField('currentWord', "");
        $this->jsonHandler->updateJsonField('rowNum', 0);
        $this->jsonHandler->updateJsonField('guessedWords', ["-", "-", "-", "-", "-"]);
        $this->jsonHandler->updateJsonField('colourArray', [0, 0, 0, 0, 0]);
        $this->jsonHandler->updateJsonField('wordValid', 0);
        $this->jsonHandler->updateJsonField('GAMEOVER', -1);
        
    }

    public function getJsonData() {
        return $this->jsonHandler->getJsonData();
    }
    

}

// Uncomment this if running directly for testing
//$game = new Game();
//$game->runGame('hello');
