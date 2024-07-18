<?php
/**
 * This model will handel fecthing the JSON content
 
 */
require_once '../app/models/JsonHandler.php';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $jsonHandler = new JsonHandler();
    $data = $jsonHandler->getJsonContent();
    header('Content-Type: application/json');
    echo json_encode($data);
}
?>
