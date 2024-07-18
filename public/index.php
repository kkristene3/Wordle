<!-- HTML CODE -->
<!DOCTYPE html>
<html lang="en">

<head>
    <!-- Meta Tags -->
    <meta charset="UTF-8">
    <meta name="author" content="Alex Oprea, Kristen Duong">
    <meta name="description" content="This project is an online copy of the New York Times game Wordle. 
    The technologies used are HTML, CSS and JavaScript. 
    It includes all the game functionalities of the original game, but is meant to be replayable with no user accounts, success stats or replay timeout.">
    <meta name="keywords" content="wordle">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <!-- CSS File Location -->
    <link rel="stylesheet" href="CSS/index.css">

    <!-- Title Bar -->
    <title>Wordle</title>
</head>

<body>
    <h1>Wordle</h1>

    <!-- Game structure -->
    <div id="game_grid">
        <div class="row" name="row1">
            <div class="square" name="s1"></div>
            <div class="square" name="s2"></div>
            <div class="square" name="s3"></div>
            <div class="square" name="s4"></div>
            <div class="square" name="s5"></div>
        </div>

        <div class="row" name="row2">
            <div class="square" name="s1"></div>
            <div class="square" name="s2"></div>
            <div class="square" name="s3"></div>
            <div class="square" name="s4"></div>
            <div class="square" name="s5"></div>
        </div>

        <div class="row" name="row3">
            <div class="square" name="s1"></div>
            <div class="square" name="s2"></div>
            <div class="square" name="s3"></div>
            <div class="square" name="s4"></div>
            <div class="square" name="s5"></div>
        </div>

        <div class="row" name="row4">
            <div class="square" name="s1"></div>
            <div class="square" name="s2"></div>
            <div class="square" name="s3"></div>
            <div class="square" name="s4"></div>
            <div class="square" name="s5"></div>
        </div>

        <div class="row" name="row5">
            <div class="square" name="s1"></div>
            <div class="square" name="s2"></div>
            <div class="square" name="s3"></div>
            <div class="square" name="s4"></div>
            <div class="square" name="s5"></div>
        </div>

        <div class="row" name="row6">
            <div class="square" name="s1"></div>
            <div class="square" name="s2"></div>
            <div class="square" name="s3"></div>
            <div class="square" name="s4"></div>
            <div class="square" name="s5"></div>
        </div>
    </div>

    <!-- Play Again Button -->
    <button id="reset_button" onclick="resetGame()">PLAY AGAIN?</button>

    <!-- Scoreboard -->
     <h2>SCOREBOARD</h2>
     <table name="scoreboard" id="scoreboard">
        <thead>
             <tr>
                <th>Rank</th>
                <th>Guesses Taken</th>
            </tr>
        </thead>
        <tbody id="scoreboard-data">
        <!-- Populate table with data in JSON using JS-->
       </tbody>
        
     </table>

    <!-- JS File Location -->
    <script src="JS/index.js"></script>

    
    </body>

</html>

<?php

//connecting the file to the Wordle.php files
require('../app/models/Wordle.php');

$wordle = new Wordle();

$word = $_REQUEST['word'];

//grabbing the JSON file contents
$json_content = file_get_contents('objects.json');

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

if ($word == "resetIt"){
}

else{
    //check if the game just started
    if ($json_array['GAMEOVER'] == -1){
        //if it did, get a new word and put it in the JSON
        $wordleWord = $wordle->getWordOfTheDay();
        $json_array['currentWord'] = $wordleWord;
        //indicate that the game has started in the JSON
        $json_array['GAMEOVER'] = 0;

        //update the json file with the new values
        $final_json_content = json_encode($json_array);
        file_put_contents('objects.json', $final_json_content);
    }
    
    //check if the word is valid
    $wordle->checkWord($word);
    
    //if the word is valid, we check the placement
    if ($json_array['wordValid'] == 0){
        $wordle->checkLetterPlacement($word);
    }

    
}
?>


