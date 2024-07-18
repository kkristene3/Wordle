<?php

require_once __DIR__ . '/../config/_config.php';
require_once __DIR__ . '/../app/models/Game.php';

// Create an instance of Game
$game = new Game();

// Run the game with a test word
$result = $game->runGame();

// output what is in the JSON
echo "JSON: " . $game->getJsonData();

// Output the result
//echo "Result: " . print_r($result, true);
