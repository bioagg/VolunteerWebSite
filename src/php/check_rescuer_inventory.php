<?php
session_start();
include 'connect_to_db.php';

header('Content-Type: application/json');

if (!isset($_SESSION['user_id_logged_in'])) {
    echo json_encode(['status' => 'error', 'message' => 'Unauthorized access']);
    exit;
}

$userId = $_SESSION['user_id_logged_in'];

$query = "SELECT * FROM rescuer_inventory WHERE user_id = '$userId'";
$result = $db->query($query);

if ($result->num_rows > 0) {
    $items = [];
    while ($row = $result->fetch_assoc()) {
        $items[] = $row; // Store each item
    }
    echo json_encode(['status' => 'success', 'hasItems' => true, 'items' => $items]);
} else {
    echo json_encode(['status' => 'success', 'hasItems' => false]);
}

$db->close();
?>
