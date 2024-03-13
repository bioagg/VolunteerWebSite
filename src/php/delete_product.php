<?php
include 'connect_to_db.php';

header('Content-Type: application/json');

try {
    $productId = $_POST['product_id'];

    // Begin transaction
    $db->begin_transaction();

    // First, delete the details associated with the product
    $stmt = $db->prepare("DELETE FROM details WHERE product_id = ?");
    $stmt->bind_param("s", $productId);
    $stmt->execute();
    $stmt->close();

    // Then, delete the product itself
    $stmt = $db->prepare("DELETE FROM products WHERE product_id = ?");
    $stmt->bind_param("s", $productId);
    $stmt->execute();
    $stmt->close();

    // Commit the transaction
    $db->commit();

    echo json_encode(['status' => 'success', 'message' => 'Product and its details deleted successfully']);
} catch (Exception $e) {
    // Rollback the transaction in case of error
    $db->rollback();
    echo json_encode(['error' => $e->getMessage()]);
}

$db->close();
?>