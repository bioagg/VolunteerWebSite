<?php
// fetch_statistics.php

// Include your database connection script
include 'connect_to_db.php';

// Check if the start and end dates are set in the request
if (isset($_GET['start_date']) && isset($_GET['end_date'])) {
    $startDate = $_GET['start_date'];
    $endDate = $_GET['end_date'];

    // Prepare the SQL query
    $query = "SELECT type, status, COUNT(*) as count 
              FROM requests_offers 
              WHERE date_added BETWEEN ? AND ? 
              GROUP BY type, status";

    $stmt = $db->prepare($query);
    $stmt->bind_param("ss", $startDate, $endDate);
    $stmt->execute();
    $result = $stmt->get_result();

    $statistics = [];
    while ($row = $result->fetch_assoc()) {
        $statistics[] = $row;
    }

    echo json_encode($statistics);
} else {
    echo json_encode(['error' => 'Start and end dates are required.']);
}
?>
