<?php

include 'connect_to_db.php';

header('Content-Type: application/json');

// Check if the form data is received
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $productId = $_POST['product_id'];
    $productName = $_POST['product_name'] ?? ''; // use empty string if not present
    $categoryId = $_POST['category_id'];
    $productDescription = $_POST['product_description'] ?? ''; // use empty string if not present
    $quantity = isset($_POST['quantity']) ? intval($_POST['quantity']) : 0; // Convert to integer, default to 0

    // Begin a transaction
    $db->begin_transaction();

    try {
        // Prepare and execute product insert statement
        $stmt = $db->prepare("INSERT INTO products (product_id, product_name, category_id, product_description, quantity) VALUES (?, ?, ?, ?, ?)");
        $stmt->bind_param("ssssi", $productId, $productName, $categoryId, $productDescription, $quantity);
        $stmt->execute();
        $stmt->close();

        // Process detail names and values
        $detailNames = $_POST['detail_names'] ?? [];
        $detailValues = $_POST['detail_values'] ?? [];

        // Prepare statement for inserting details
        $stmt = $db->prepare("INSERT INTO details (product_id, detail_name, detail_value) VALUES (?, ?, ?)");

        for ($i = 0; $i < count($detailNames); $i++) {
            $detailName = $detailNames[$i] ?? ''; // use empty string if not present
            $detailValue = $detailValues[$i] ?? ''; // use empty string if not present

            $stmt->bind_param("sss", $productId, $detailName, $detailValue);
            $stmt->execute();
        }

        // Commit the transaction
        $db->commit();
        echo json_encode(['status' => 'success', 'message' => 'Product and details added successfully']);
    } catch (Exception $e) {
        // Rollback the transaction on error
        $db->rollback();
        echo json_encode(['status' => 'error', 'message' => 'Error adding product and details: ' . $e->getMessage()]);
    }

    $stmt->close();
    $db->close();
} else {
    echo json_encode(['status' => 'error', 'message' => 'Invalid request method']);
}
?>