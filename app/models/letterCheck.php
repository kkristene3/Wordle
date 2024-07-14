<?php

//Checking if you won the game!!
function checkLetterPlacement($guess){

    //get objects from JSON file
    $json_content = file_get_contents('../practiceJsonAlex.json');

    //check if the file was read successfully
    if ($json_content === false){
        die('Could not read JSON file');
    }

    //turn the JSON content into an array
    $json_array = json_decode($json_content, true);

    //check if the JSON was decoded properly
    if ($json_array === null){
        die ("Error decoding the file");
    }

    //if the word is guessed correctly, the game is over
    if ($json_array['currentWord'] == $guess){
        $json_array['GAMEOVER'] = 1;  
        $json_array['colourArray'] = [2, 2, 2, 2, 2];
        $json_array['rowNum'] = $json_array['rowNum'] + 1;
    }

    //otherwise, if the word has already been guessed, we wanna make the word invalid
    else if (in_array($guess, $json_array['guessedWords'])){
        $json_array['wordValid'] = 2;
    }

    //the word can be guessed, but it is not correct
    else{
        //check the position of every letter
        for ($i = 0; $i<5; $i++){
            $currentLetter = substr($guess, $i, 1);
            $expectedLetter = substr($json_array['currentWord'], $i, 1);
            print_r($currentLetter);

            //if the letter is in the correct position, we add green to its spot in the colour array
            if ($currentLetter == $expectedLetter){
                $json_array['colourArray'][$i] = 2;
            }

            //check if the letter is somewhere in the word
            else if (strpos($json_array['currentWord'], $currentLetter)){
                //first we have to see if this letter is guessed an extra time
                $wordleCount = 0;
                $incorrectCount = 0;
                $correctCount = 0;

                //check if there are any more instances of the letter left in the word
                //we start by seeing how many instances there are in the expected sord and how many are guessed correctly
                for ($j = 0; $j<5; $j++){
                    if (substr($json_array['currentWord'], $j, 1) == $currentLetter){
                        $wordleCount++;
                        if (substr($guess, $j, 1) == $currentLetter){
                            $correctCount++;
                        }
                    }
                }
                //we see how many incorrect instances we already covered in our guess
                for ($j = 0; $j<$i; $j++){
                    if (substr($guess, $j, 1) == $currentLetter && substr($json_array, $j, 1) != $currentLetter){
                        $incorrectCount++;
                    }
                }
                //if the number of correct instances of the letter + the previous incorrect instances in the word are equal to the instances in the actual word, then this square should be gray
                if ($wordleCount - ($correctCount+$incorrectCount) <= 0){
                    $json_array['colourArray'][$i] = 0;
                }
                //otherwise it should be yellow
                else{
                    $json_array['colourArray'][$i] = 1;
                }
            }
            else{
                $json_array['colourArray'][$i] = 1;
            }
        }

        //if the user is on the last row and the word is not correct, they lost
        if ($json_array['rowNum'] == 5){
            $json_array['GAMEOVER'] = 2;
        }

        //if the game is not over, move on to the next row and save the word as a previous guess
        $json_array['guessedWords'][$json_array['rowNum']] = $guess;
        $json_array['rowNum'] = $json_array['rowNum'] + 1;
        
    }

    //modifying the data in the JSON file
    $final_json_content = json_encode($json_array);
    file_put_contents('../practiceJsonAlex.json', $final_json_content);
}

checkLetterPlacement("guess");

?>