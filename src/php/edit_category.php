<?php
include 'connect_to_db.php';

header('Content-Type: application/json');

try {
    $categoryId = $_POST['category_id'];
    $categoryName = $_POST['category_name'];

    $stmt = $db->prepare("UPDATE categories SET category_name = ? WHERE category_id = ?");
    $stmt->bind_param("ss", $categoryName, $categoryId);

    if ($stmt->execute()) {
        echo json_encode(['status' => 'success', 'message' => 'Category updated successfully']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Error updating category']);
    }

    $stmt->close();
} catch (Exception $e) {
    echo json_encode(['error' => $e->getMessage()]);
}

$db->close();
?>
