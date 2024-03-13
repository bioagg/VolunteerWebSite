<?php
include 'connect_to_db.php';

header('Content-Type: application/json');

$announcementId = isset($_GET['id']) ? intval($_GET['id']) : 0;

// Query to get the announcement details including product name and required quantity
$query = "SELECT a.title, a.description, a.required_quantity, a.product_id, p.product_name
          FROM announcements a
          JOIN products p ON a.product_id = p.product_id
          WHERE a.announcement_id = ?";

$stmt = $db->prepare($query);
$stmt->bind_param('i', $announcementId);
$stmt->execute();
$result = $stmt->get_result();

if ($row = $result->fetch_assoc()) {
    echo json_encode($row);
} else {
    echo json_encode(['error' => 'No announcement found with that ID.']);
}

$db->close();
?>
