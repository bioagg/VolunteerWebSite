<?php
include 'connect_to_db.php';

header('Content-Type: application/json');

try {
    $categoryId = $_POST['category_id'];

    $stmt = $db->prepare("DELETE FROM categories WHERE category_id = ?");
    $stmt->bind_param("s", $categoryId);

    if ($stmt->execute()) {
        echo json_encode(['status' => 'success', 'message' => 'Category deleted successfully']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Error deleting category']);
    }

    $stmt->close();
} catch (Exception $e) {
    echo json_encode(['error' => $e->getMessage()]);
}

$db->close();
?>