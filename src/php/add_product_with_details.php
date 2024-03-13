<?php
include 'connect_to_db.php';

header('Content-Type: application/json');

try {
    if ($_SERVER['REQUEST_METHOD'] != 'POST') {
        throw new Exception('Invalid request method');
    }

    $productId = $_POST['product_id'];
    $productName = $_POST['product_name'] ?? ''; // use empty string if not present
    $productDescription = $_POST['product_description'] ?? ''; // use empty string if not present

    $categoryId = $_POST['category_id'];
    $detailNames = $_POST['detail_names'] ?? [];
    $detailValues = $_POST['detail_values'] ?? [];

    // Begin a transaction
    $db->begin_transaction();

    // Insert product
    $stmt = $db->prepare("INSERT INTO products (product_id, product_name, category_id) VALUES (?, ?, ?)");
    $stmt->bind_param("sss", $productId, $productName, $categoryId);
    $stmt->execute();
    $stmt->close();

    // Insert product details
    $stmt = $db->prepare("INSERT INTO details (product_id, detail_name, detail_value) VALUES (?, ?, ?)");
    foreach ($detailNames as $index => $name) {
        $value = $detailValues[$index];
        $stmt->bind_param("sss", $productId, $name, $value);
        $stmt->execute();
    }

    // Commit the transaction
    $db->commit();
    echo json_encode(['status' => 'success', 'message' => 'Product and details added successfully']);
} catch (Exception $e) {
    // Rollback the transaction in case of error
    $db->rollback();
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}

$db->close();
?>