<?php
session_start();
include 'connect_to_db.php';

header('Content-Type: application/json');

// Check if the user is logged in and if the request method is POST
if (!isset($_SESSION['user_id_logged_in']) || $_SERVER['REQUEST_METHOD'] != 'POST') {
    echo json_encode(['status' => 'error', 'message' => 'Unauthorized access']);
    exit;
}

$jsonData = file_get_contents('php://input');
$data = json_decode($jsonData, true);
$unloadedProducts = $data['unloadedProducts'];
$userId = $_SESSION['user_id_logged_in'];

// Begin a transaction
$db->begin_transaction();

try {
    foreach ($unloadedProducts as $product) {
        // print_r($product);// "This is the product" .$product;
        $productId = $product['product_id'];
        $quantity = $product['quantity'];

        // Check if there is sufficient quantity available
        $checkQuery = "SELECT quantity FROM products WHERE product_id = '$productId'";
        $checkResult = $db->query($checkQuery);
        $row = $checkResult->fetch_assoc();

        // if ($row['quantity'] < $quantity) {
        //     // Not enough quantity, rollback and return an error
        //     $db->rollback();
        //     echo json_encode(['status' => 'error', 'message' => 'Not enough quantity available for product ID: ' . $productId]);
        //     exit;
        // }

        // Update products table
        $updateProductQuery = "UPDATE products SET quantity = quantity + ? WHERE product_id = ?";
        $updateProductStmt = $db->prepare($updateProductQuery);
        $updateProductStmt->bind_param("is", $quantity, $productId);
        $updateProductStmt->execute();

        // Delete from rescuer_inventory table
        $deleteInventoryQuery = "DELETE FROM rescuer_inventory WHERE user_id = ? AND product_id = ?"; // INSERT INTO rescuer_inventory (user_id, product_id, quantity) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE quantity = quantity + ?
        $insertInventoryStmt = $db->prepare($deleteInventoryQuery);
        $insertInventoryStmt->bind_param("is", $userId, $productId);
        $insertInventoryStmt->execute();
    }

    // Commit the transaction
    $db->commit();
    echo json_encode(['status' => 'success', 'message' => 'Inventory updated successfully']);
} catch (Exception $e) {
    $db->rollback();
    echo json_encode(['status' => 'error', 'message' => 'Error updating inventory: ' . $e->getMessage()]);
}

$db->close();
?>