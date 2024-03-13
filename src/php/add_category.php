<?php
// Database connection setup
include 'connect_to_db.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $categoryId = $_POST['category_id'];
    $categoryName = $_POST['category_name'];

    $stmt = $db->prepare("INSERT INTO categories (category_id, category_name) VALUES (?, ?)");
    $stmt->bind_param("ss", $categoryId, $categoryName);

    if ($stmt->execute()) {
        echo json_encode(['status' => 'success', 'message' => 'Category added successfully']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Error adding category']);
    }

    $stmt->close();
} else {
    echo json_encode(['status' => 'error', 'message' => 'Invalid request method']);
}

$db->close();
?>
