<?php
session_start();
include 'connect_to_db.php';

$jsonData = file_get_contents('php://input');
$data = json_decode($jsonData, true);

if (!isset($_SESSION['user_id_logged_in']) || !isset($data['announcement_id']) || !isset($data['quantity']) || !isset($data['product_id'])) {
    echo json_encode(['success' => false, 'error' => 'Invalid request']);
    exit;
}

$userId = $_SESSION['user_id_logged_in'];
$announcementId = $data['announcement_id'];
$quantity = $data['quantity'];
$productId = $data['product_id']; // Get the product_id from the request

// Fetch the user's latitude and longitude
$query = "SELECT lat_user, lng_user FROM users WHERE id = ?";
$stmt = $db->prepare($query);

if (false === $stmt) {
    echo json_encode(['success' => false, 'error' => $db->error]);
    exit;
}

$stmt->bind_param('i', $userId);
$stmt->execute();
$stmt->store_result();
$stmt->bind_result($lat, $lng);
$stmt->fetch();

// Prepare the insert statement for requests_offers
$insertStmt = $db->prepare("INSERT INTO requests_offers (user_id, type, product_id, quantity, status, lat, lng) VALUES (?, 'offer', ?, ?, 'pending', ?, ?)");

if (false === $insertStmt) {
    echo json_encode(['success' => false, 'error' => $db->error]);
    exit;
}

$insertStmt->bind_param('isidd', $userId, $productId, $quantity, $lat, $lng); // Include lat and lng in the bind_param

if ($insertStmt->execute()) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'error' => $insertStmt->error]);
}

$insertStmt->close();
$stmt->close();
$db->close();
?>
