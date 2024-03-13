<?php
session_start();
include 'connect_to_db.php';

header('Content-Type: application/json');

if($_SERVER["REQUEST_METHOD"] == "POST" && isset($_SESSION['user_id_logged_in'])) {
    $productId = $_POST['product_id'];
    $quantityToLoad = $_POST['quantity_to_load'];
    $rescuerId = $_SESSION['user_id_logged_in'];

    // Begin transaction
    $db->begin_transaction();

    try {
        // Check available quantity
        $stmt = $db->prepare("SELECT quantity FROM products WHERE product_id = ?");
        $stmt->bind_param("s", $productId);
        $stmt->execute();
        $result = $stmt->get_result();
        $row = $result->fetch_assoc();

        if ($quantityToLoad > $row['quantity']) {
            throw new Exception('Requested quantity exceeds available stock');
        }

        // Update rescuer inventory
        $stmt = $db->prepare("INSERT INTO rescuer_inventory (user_id, product_id, quantity) VALUES (?, ?, ?)");
        $stmt->bind_param("isi", $rescuerId, $productId, $quantityToLoad);
        $stmt->execute();

        // Adjust stock quantity
        $newQuantity = $row['quantity'] - $quantityToLoad;
        $stmt = $db->prepare("UPDATE products SET quantity = ? WHERE product_id = ?");
        $stmt->bind_param("is", $newQuantity, $productId);
        $stmt->execute();

        // Commit transaction
        $db->commit();
        echo json_encode(['status' => 'success', 'message' => 'Product loaded successfully']);
    } catch (Exception $e) {
        // Rollback transaction on error
        $db->rollback();
        echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
    }

    $db->close();
} else {
    echo json_encode(['status' => 'error', 'message' => 'Invalid request or user not logged in']);
}
?>
