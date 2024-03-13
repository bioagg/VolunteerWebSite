<?php
include 'connect_to_db.php';

header('Content-Type: application/json');

try {
    $db->begin_transaction(); // Start transaction

    $productId = $_POST['product_id'];
    $productName = $_POST['product_name'];
    $categoryId = $_POST['category_id'];
    $productDescription = $_POST['product_description'];
    $quantity = isset($_POST['quantity']) ? intval($_POST['quantity']) : 0; // Convert to integer, default to 0


    // Update the product
    $stmt = $db->prepare("UPDATE products SET product_name = ?, category_id = ?, product_description = ?, quantity = ? WHERE product_id = ?");
    $stmt->bind_param("sssis", $productName, $categoryId, $productDescription, $quantity, $productId);
    $stmt->execute();
    $stmt->close();

    // Update details
    $detailNames = $_POST['detail_names'];
    $detailValues = $_POST['detail_values'];

    // You need to decide how to handle the details:
    // 1. Update existing details
    // 2. Insert new details
    // 3. Delete old details

    // This is a simplified approach, assuming all details are new or replaced
    $stmt = $db->prepare("DELETE FROM details WHERE product_id = ?");
    $stmt->bind_param("s", $productId);
    $stmt->execute();

    $stmt = $db->prepare("INSERT INTO details (product_id, detail_name, detail_value) VALUES (?, ?, ?)");
    foreach ($detailNames as $index => $name) {
        $stmt->bind_param("sss", $productId, $name, $detailValues[$index]);
        $stmt->execute();
    }

    $db->commit(); // Commit the transaction

    echo json_encode(['status' => 'success', 'message' => 'Product updated successfully']);
} catch (Exception $e) {
    $db->rollback(); // Rollback on error
    echo json_encode(['error' => $e->getMessage()]);
}

$db->close();
?>