<?php
include 'connect_to_db.php';

header('Content-Type: application/json');

try {
    $vehicleId = $_POST['vehicle_id'];

    $stmt = $db->prepare("DELETE FROM vehicles WHERE vehicle_id = ?");
    $stmt->bind_param("i", $vehicleId);

    if ($stmt->execute()) {
        echo json_encode(['status' => 'success', 'message' => 'Vehicle deleted successfully']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Error deleting vehicle']);
    }

    $stmt->close();
} catch (Exception $e) {
    echo json_encode(['error' => $e->getMessage()]);
}

$db->close();
?>