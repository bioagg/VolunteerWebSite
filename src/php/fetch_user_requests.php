<?php
session_start();
include 'connect_to_db.php';

$userId = $_SESSION['user_id_logged_in']; // Get the user ID from the session

$query = "SELECT ro.id, p.product_name, ro.status, ro.date_added, ro.date_taken, ro.date_completed
          FROM requests_offers ro
          JOIN products p ON ro.product_id = p.product_id
          WHERE ro.user_id = ? AND ro.type = 'request'
          ORDER BY ro.date_added DESC";

$stmt = $db->prepare($query);
$stmt->bind_param("i", $userId);
$stmt->execute();
$result = $stmt->get_result();
$requests = $result->fetch_all(MYSQLI_ASSOC);

echo json_encode($requests);

$db->close();
?>
