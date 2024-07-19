<?php

namespace App\Models;

/**
 * This model will handle fetching the JSON content
 */
class JSONHandler {
    private $filePath;

    public function __construct() {
        // Set the file path relative to the current script directory
        $this->filePath = __DIR__ . '/../../public/JSON/objects.json';
    }

    /**
     * Gets the JSON content
     * @return string The JSON content
     */
    public function getJsonData() {
        $jsonContent = file_get_contents($this->filePath);
    
        if ($jsonContent === false) {
            die('Could not read JSON file');
        }
    
        return $jsonContent; // Return JSON string
    }
    
    

    /**
     * Update a specific field in the JSON file
     * @param string $field The field to update
     * @param mixed $value The new value to set
     */
    public function updateJsonField($field, $value) {
        // Read the current JSON data
        $jsonContent = $this->getJsonData();
        $jsonArray = json_decode($jsonContent, true);

        if ($jsonArray === null) {
            die('Error decoding JSON file');
        }

        // Update the specific field
        $jsonArray[$field] = $value;

        // Encode the updated array back to JSON
        $newJsonContent = json_encode($jsonArray, JSON_PRETTY_PRINT);

        // Write the updated JSON back to the file
        if (file_put_contents($this->filePath, $newJsonContent) === false) {
            die('Could not write to JSON file');
        }
    }

    /**
     * Update a specific index of a field in the JSON file
     * @param string $field The field to update
     * @param mixed $value The new value to set
     * @param int $index The index to update
     */
    public function updateJsonIndexArray ($field, $index, $value) {
        // Read the current JSON data
        $jsonContent = $this->getJsonData();
        $jsonArray = json_decode($jsonContent, true);

        if ($jsonArray === null) {
            die('Error decoding JSON file');
        }

        // Update the specific field
        $jsonArray[$field][$index] = $value;

        // Encode the updated array back to JSON
        $newJsonContent = json_encode($jsonArray, JSON_PRETTY_PRINT);

        // Write the updated JSON back to the file
        if (file_put_contents($this->filePath, $newJsonContent) === false) {
            die('Could not write to JSON file');
        }
    }

    /**
     * Increment row number
     */
    public function incrementRowNum() {
        // Get the current JSON data and decode it
        $jsonContent = $this->getJsonData();
        $jsonArray = json_decode($jsonContent, true);
    
        if ($jsonArray === null) {
            die('Error decoding JSON file');
        }
    
        // Increment the rowNum value
        if (isset($jsonArray['rowNum'])) {
            $jsonArray['rowNum'] += 1;
        } else {
            die('rowNum does not exist in JSON file');
        }
    
        //Encode the updated array back to JSON
        $newJsonContent = json_encode($jsonArray, JSON_PRETTY_PRINT);
    
        // Write the updated JSON back to the file
        if (file_put_contents($this->filePath, $newJsonContent) === false) {
            die('Could not write to JSON file');
        }
    }
    
}
