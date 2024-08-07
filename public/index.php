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



?>
