<?php
// complete_task.php
session_start();
include 'connect_to_db.php'; // Ensure you have a proper DB connection file included

// Decoding the JSON POST request
$data = json_decode(file_get_contents('php://input'), true);
$taskId = $data['task_id'];

// Check if taskId is provided
if(isset($taskId)) {
    // Prepare the SQL statement to update the task status
    $query = "UPDATE requests_offers SET status = 'completed' WHERE id = ?";
    $stmt = $db->prepare($query);

    // Bind the taskId parameter
    $stmt->bind_param("i", $taskId);

    // Execute the statement
    $stmt->execute();

    // Check if any row was updated
    if($stmt->affected_rows > 0) {
        // Return success response
        echo json_encode(['success' => true]);
    } else {
        // Return failure response
        echo json_encode(['success' => false, 'message' => 'No task updated']);
    }
} else {
    // taskId not provided in request
    echo json_encode(['success' => false, 'message' => 'Task ID not provided']);
}
?>
