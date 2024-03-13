<?php
include 'connect_to_db.php';

session_start();
header('Content-Type: application/json');

if(isset($_SESSION['user_id_logged_in'])) {
    $userId = $_SESSION['user_id_logged_in'];

    $query = "SELECT p.product_name, ri.quantity
              FROM rescuer_inventory ri
              JOIN products p ON ri.product_id = p.product_id
              WHERE ri.user_id = ?";
    
    $stmt = $db->prepare($query);
    $stmt->bind_param("i", $userId);
    $stmt->execute();
    $result = $stmt->get_result();
    $inventory = $result->fetch_all(MYSQLI_ASSOC);

    echo json_encode(['status' => 'success', 'inventory' => $inventory]);
} else {
    echo json_encode(['status' => 'error', 'message' => 'User not logged in']);
}