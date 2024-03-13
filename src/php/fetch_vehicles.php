<?php
include 'connect_to_db.php'; // Replace with your database connection script

header('Content-Type: application/json');

try {
    // Prepare and execute a query to fetch all vehicles
    $query = "SELECT vehicle_id, user_id, vehicle_type, license_plate, manufactorer, model, year, color FROM vehicles";
    $result = $db->query($query);

    // Check if the query was successful
    if (!$result) {
        throw new Exception($db->error);
    }

    // Fetch all vehicles
    $vehicles = $result->fetch_all(MYSQLI_ASSOC);

    // Send a JSON response containing the vehicles
    echo json_encode($vehicles);
} catch (Exception $e) {
    // Handle and return any errors
    echo json_encode(['error' => $e->getMessage()]);
}

// Close the database connection
$db->close();
?>