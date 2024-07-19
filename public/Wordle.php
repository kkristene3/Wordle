<?php

use App\Models\Game;
use App\Models\JsonHandler;
use App\Models\ValidateWord;

require_once __DIR__ . '/../config/_config.php';
require_once __DIR__ . '/../app/models/Game.php'; 

// Create a new instance of the Game class
$game = new Game();

// Check if a word has been passed in the URL
if (isset($_GET['word'])) {
    $word = $_GET['word'];

    // for debugging
    error_log("Received word: $word");

    // Pass the word to the runGame method
    $game->runGame($word);
    
} else {
    echo json_encode(['status' => 'error', 'message' => 'No word provided']);
}
