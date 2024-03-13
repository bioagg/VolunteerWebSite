<?php
include 'connect_to_db.php'; // Replace with your database connection script

header('Content-Type: application/json');

try {
    // Retrieve data from POST request
    $vehicleId = $_POST['vehicle_id'];
    $userId = $_POST['user_id'];
    $vehicleType = $_POST['vehicle_type'];
    $licensePlate = $_POST['license_plate'];
    $manufactorer = $_POST['manufactorer'];
    $model = $_POST['model'];
    $year = $_POST['year'];
    $color = $_POST['color'];

    // echo "This is the color: ". $color;

    // Prepare an UPDATE statement
    $stmt = $db->prepare("UPDATE vehicles SET user_id = ?, vehicle_type = ?, license_plate = ?, manufactorer = ?, model = ?, year = ?, color = ? WHERE vehicle_id = ?");
    $stmt->bind_param("issssisi", $userId, $vehicleType, $licensePlate, $manufactorer, $model, $year, $color, $vehicleId);

    // Execute the statement and check if it was successful
    if ($stmt->execute()) {
        echo json_encode(['status' => 'success', 'message' => 'Vehicle updated successfully']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Error updating vehicle']);
    }

    // Close the statement
    $stmt->close();
} catch (Exception $e) {
    // Handle any errors and return an error message
    echo json_encode(['error' => $e->getMessage()]);
}

// Close the database connection
$db->close();
?>