<?php
include 'connect_to_db.php'; // Your database connection file

// Set the Content-Type of the response to 'application/json'
// This informs the client that the server will be returning JSON data.
// It ensures that the client (like a web browser or AJAX call in JavaScript) interprets
// the response as JSON instead of plain text or HTML.
header('Content-Type: application/json');

try {
    // Prepare a SQL statement to select category_id and category_name from the 'categories' table
    $stmt = $db->prepare("SELECT category_id, category_name FROM categories");

    // Execute the prepared statement
    $stmt->execute();

    // Get the result of the executed statement
    $result = $stmt->get_result();

    // Fetch the data from the result as an associative array
    // Each row will be an associative array with keys 'category_id' and 'category_name'
    $categories = $result->fetch_all(MYSQLI_ASSOC);

    // Encode the array of categories as JSON and output it
    // This JSON will be sent as the response body
    echo json_encode($categories);
} catch (Exception $e) {
    // In case of an error, encode the error message as JSON and output it
    echo json_encode(['error' => $e->getMessage()]);
}

$db->close();
?>