<?php
session_start();
include 'connect_to_db.php';

header('Content-Type: application/json');

$userId = $_SESSION['user_id_logged_in']; // Retrieve user ID from session

$query = "SELECT ro.*, p.product_name, u.username AS taken_by_username
          FROM requests_offers ro
          JOIN products p ON ro.product_id = p.product_id
          LEFT JOIN users u ON ro.taken_by_user_id = u.id
          WHERE ro.user_id = ? AND ro.type = 'offer'";

$stmt = $db->prepare($query);
$stmt->bind_param('i', $userId);
$stmt->execute();
$result = $stmt->get_result();

$offers = [];
while ($row = $result->fetch_assoc()) {
    $offers[] = $row;
}

echo json_encode($offers);

$stmt->close();
$db->close();
?>
