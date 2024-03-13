<?php
include 'connect_to_db.php'; // Ensure this path is correct

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $inputData = json_decode(file_get_contents('php://input'), true);

    $title = $inputData['title'];
    $description = $inputData['description'];
    $productId = $inputData['productId'];
    $requiredQuantity = $inputData['requiredQuantity'];

    // Prepare the SQL statement to insert the announcement
    $stmt = $db->prepare("INSERT INTO announcements (title, description, product_id, required_quantity) VALUES (?, ?, ?, ?)");
    $stmt->bind_param("sssi", $title, $description, $productId, $requiredQuantity);

    if ($stmt->execute()) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false, 'error' => $stmt->error]);
    }

    $stmt->close();
    $db->close();
} else {
    echo json_encode(['success' => false, 'error' => 'Invalid request method.']);
}
?>
