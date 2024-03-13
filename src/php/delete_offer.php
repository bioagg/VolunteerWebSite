<?php
session_start();
include 'connect_to_db.php';

$jsonData = file_get_contents('php://input');
$data = json_decode($jsonData, true);

$userId = $_SESSION['user_id_logged_in']; // Retrieve user ID from session
$offerId = $data['offer_id'];

// Prepared statement to delete the offer
$stmt = $db->prepare("DELETE FROM requests_offers WHERE id = ? AND user_id = ? AND status = 'pending'");
$stmt->bind_param('ii', $offerId, $userId);

if ($stmt->execute()) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'error' => $stmt->error]);
}

$stmt->close();
$db->close();
?>
