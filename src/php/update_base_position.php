<?php
include 'connect_to_db.php'; // Include the database connection
header('Content-Type: application/json'); // Set the content type to JSON for the response

$data = json_decode(file_get_contents('php://input'), true); // Decode the JSON data sent from JavaScript

// Assuming admin user has a specific user ID, for example, 1
$adminUserId = 1; // Replace with the actual admin user ID

// Check if latitude and longitude data are set in the received data
if (isset($data['lat']) && isset($data['lng'])) {
    $lat = $data['lat']; // Store the latitude
    $lng = $data['lng']; // Store the longitude

    // Prepare a SQL query to update the user's location
    $query = "UPDATE users SET lat_user = ?, lng_user = ? WHERE id = ?";
    $stmt = $db->prepare($query); // Prepare the SQL statement
    $stmt->bind_param("ddi", $lat, $lng, $adminUserId); // Bind parameters to the prepared statement

    // Execute the query and check if it was successful
    if ($stmt->execute()) {
        echo json_encode(['success' => true]); // Send a success response
    } else {
        echo json_encode(['success' => false, 'error' => $stmt->error]); // Send an error response if failed
    }

    $stmt->close(); // Close the prepared statement
} else {
    echo json_encode(['success' => false, 'error' => 'Invalid data']); // Send an error response if data is invalid
}

$db->close(); // Close the database connection
?>
