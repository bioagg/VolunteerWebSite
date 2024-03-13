<?php
// Include the database connection file
include 'connect_to_db.php';

header('Content-Type: application/json');

// Check if the request method is POST
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    // Get the JSON POST body and decode it into an associative array
    $inputData = json_decode(file_get_contents('php://input'), true);

    // Extract vehicle_id, latitude, and longitude from the input data
    $vehicleId = $inputData['vehicle_id'];
    $latitude = $inputData['latitude'];
    $longitude = $inputData['longitude'];

    // Prepare an SQL statement to update the vehicle's position
    $stmt = $db->prepare("UPDATE vehicles SET latitude = ?, longitude = ? WHERE vehicle_id = ?");
    $stmt->bind_param("ddi", $latitude, $longitude, $vehicleId);

    // Execute the statement and check if it was successful
    if ($stmt->execute()) {
        echo json_encode(['status' => 'success', 'message' => 'Vehicle position updated successfully']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Error updating vehicle position']);
    }

    // Close the statement
    $stmt->close();
} else {
    // If the request method is not POST, return an error
    echo json_encode(['status' => 'error', 'message' => 'Invalid request method']);
}

// Close the database connection
$db->close();
?>
