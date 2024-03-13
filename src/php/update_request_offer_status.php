<?php
include 'connect_to_db.php';
session_start(); // Start the session to access session variables
header('Content-Type: application/json');

// Function to fetch the vehicle ID associated with a rescuer
function fetchVehicleIdForRescuer($db, $rescuerId) {
    $query = "SELECT vehicle_id FROM vehicles WHERE user_id = ?";
    $stmt = $db->prepare($query);
    $stmt->bind_param("i", $rescuerId);
    $stmt->execute();
    $result = $stmt->get_result();
    if ($result) {
        $row = $result->fetch_assoc();
        return $row['vehicle_id'];
    } else {
        return null; // Return null if there's no result
    }
}

$data = json_decode(file_get_contents('php://input'), true);

if (isset($data['id']) && isset($data['action']) && isset($data['type'])) {
    $id = $data['id'];
    $type = $data['type'];
    $rescuerId = $_SESSION['user_id_logged_in']; // Get rescuer's user ID from session
    $vehicleId = fetchVehicleIdForRescuer($db, $rescuerId); // Fetch vehicle ID for the rescuer

    

    // Prepare and execute the update query based on the type of the request/offer
    if ($data['action'] === 'take' && $type === 'request') {
        $query = "UPDATE requests_offers SET status = 'taken', taken_by_user_id = ?, vehicle_id = ?, date_taken = NOW() WHERE id = ?";
        $stmt = $db->prepare($query);
        $stmt->bind_param("iii", $rescuerId, $vehicleId, $id);
    } elseif ($data['action'] === 'take' && $type === 'offer') {
        $query = "UPDATE requests_offers SET status = 'taken', taken_by_user_id = ?, vehicle_id = ?, date_taken = NOW() WHERE id = ?";
        $stmt = $db->prepare($query);
        $stmt->bind_param("iii", $rescuerId, $vehicleId, $id);
    }

    // Execute the query and respond with success or error
    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'type' => $type, 'id' => $id]);
    } else {
        echo json_encode(['success' => false, 'error' => $db->error]);
    }
} else {
    echo json_encode(['success' => false, 'error' => 'Invalid data']);
}

// Close the database connection
$db->close();
?>
