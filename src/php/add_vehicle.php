<?php
include 'connect_to_db.php';

header('Content-Type: application/json');

try {
    // Fetch user coordinates
    $userStmt = $db->prepare("SELECT lat_user, lng_user FROM users WHERE id = ?");
    $userStmt->bind_param("i", $_POST['user_id']);
    $userStmt->execute();
    $result = $userStmt->get_result();
    $userStmt->close();

    if ($user = $result->fetch_assoc()) {
        // User coordinates
        $lat_user = $user['lat_user'];
        $lng_user = $user['lng_user'];

        // Insert vehicle with user coordinates
        $stmt = $db->prepare("INSERT INTO vehicles (user_id, vehicle_type, license_plate, manufactorer, model, year, color, latitude, longitude) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->bind_param("issssisdd", $_POST['user_id'], $_POST['vehicle_type'], $_POST['license_plate'], $_POST['manufactorer'], $_POST['model'], $_POST['year'], $_POST['color'], $lat_user, $lng_user);

        if ($stmt->execute()) {
            echo json_encode(['status' => 'success', 'message' => 'Vehicle added successfully']);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Error adding vehicle']);
        }

        $stmt->close();
    } else {
        echo json_encode(['status' => 'error', 'message' => 'User not found']);
    }
} catch (Exception $e) {
    echo json_encode(['error' => $e->getMessage()]);
}

$db->close();
?>
