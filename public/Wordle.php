<?php
require_once __DIR__ . '/../config/_config.php'; // Adjust path as needed
require_once __DIR__ . '/../app/models/Game.php'; // Adjust path as needed

$game = new Game();

if (isset($_GET['word'])) {
    $word = $_GET['word'];
    
    if ($word === 'resetIt') {
        $game->resetJSON();
        echo json_encode(['status' => 'success']);
    } else {
        $game->runGame($word); // Run game logic with the provided word
       // $jsonData = $game->jsonHandler->getJsonData();
     //   echo $jsonData;
    }
} else {
    echo 'No word provided';
}
?>