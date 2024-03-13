<?php
// Start a new session or resume the existing session
session_start();

// Include the database connection script
include 'connect_to_db.php';

// Set the header to indicate that the response will be in JSON format
header('Content-Type: application/json');

// Retrieve the user ID of the currently logged-in user from the session
$userId = $_SESSION['user_id_logged_in'];

// SQL query to select data related to tasks (requests or offers) taken by the logged-in user
$query = "SELECT 
              ro.id as request_id,  
              ro.type,             
              p.product_name,      
              ro.quantity,         
              ro.status,           
              ro.date_added,       
              u.user_name,         
              u.user_lastname,     
              u.telephone_number,  
              ro.lat as request_lat,   
              ro.lng as request_lng,   
              v.latitude as vehicle_lat,  
              v.longitude as vehicle_lng  
          FROM requests_offers ro
          JOIN products p ON ro.product_id = p.product_id
          JOIN users u ON ro.user_id = u.id
          LEFT JOIN vehicles v ON ro.taken_by_user_id = v.user_id
          WHERE ro.taken_by_user_id = ? AND ro.status = 'taken'";

// Prepare the SQL query for execution
$stmt = $db->prepare($query);

// Bind the logged-in user's ID to the query
$stmt->bind_param("i", $userId);

// Execute the query
$stmt->execute();

// Get the result set from the executed query
$result = $stmt->get_result();

// Initialize an array to hold task data
$tasks = [];

// Iterate over each row in the result set
while ($row = $result->fetch_assoc()) {
    // Add each row's data to the tasks array
    $tasks[] = $row;
}

// Encode the tasks array into JSON format and output it
echo json_encode($tasks);

// Close the database connection
$db->close();

// Unique ID of the request/offer
// Type of the task (request or offer)
// Name of the product related to the task
// Quantity requested/offered
// Current status of the task (e.g., 'taken')
// Date when the task was added
// First name of the user who created the task
// Last name of the user who created the task
// Phone number of the user who created the task
// Latitude coordinate of the task's location
// Longitude coordinate of the task's location
// Latitude coordinate of the rescuer's vehicle
// Longitude coordinate of the rescuer's vehicle
?>

