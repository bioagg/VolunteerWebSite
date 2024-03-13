<?php
session_start();
include 'connect_to_db.php';

// Assuming you're sending JSON data, decode the received JSON data
$data = json_decode(file_get_contents('php://input'), true);

// Check if the task ID is set in the received data
if (!isset($data['task_id'])) {
    echo json_encode(['success' => false, 'error' => 'Task ID not provided']);
    exit;
}

// Retrieve the task ID from the received data
$taskId = $data['task_id'];

// SQL query to update the task in the requests_offers table
$query = "UPDATE requests_offers SET 
            date_taken = NULL, 
            taken_by_user_id = NULL, 
            vehicle_id = NULL, 
            status = 'pending' 
          WHERE id = ?";

// Prepare the SQL query for execution
$stmt = $db->prepare($query);

// Check if the statement was prepared correctly
if (!$stmt) {
    echo json_encode(['success' => false, 'error' => $db->error]);
    exit;
}

// Bind the task ID to the statement
$stmt->bind_param("i", $taskId);

// Execute the prepared statement
if ($stmt->execute()) {
    // If execution is successful, send a success response
    echo json_encode(['success' => true]);
} else {
    // If execution fails, send an error response
    echo json_encode(['success' => false, 'error' => $stmt->error]);
}

// Close the statement
$stmt->close();

// Close the database connection
$db->close();
?>
