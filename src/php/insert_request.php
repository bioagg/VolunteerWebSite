<?php
session_start();
include 'connect_to_db.php';

// Check if the request is POST
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $productName = $_POST['productName'];
    $numberOfPersons = $_POST['numberOfPersons'];
    $type = $_POST['type'];
    $quantity = $_POST['quantity'];
    $status = $_POST['status'];
    $userId = $_SESSION['user_id_logged_in'];

    // echo "This is the status: " .$status;

    // Fetch product ID based on product name
    $stmt = $db->prepare("SELECT product_id FROM products WHERE product_name = ?");
    $stmt->bind_param("s", $productName);
    $stmt->execute();
    $result = $stmt->get_result();
    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        $productId = $row['product_id'];
    } else {
        echo json_encode(['error' => 'Product not found']);
        $db->close();
        exit;
    }

    // Fetch user location
    $stmt = $db->prepare("SELECT lat_user, lng_user FROM users WHERE id = ?");
    $stmt->bind_param("i", $userId);
    $stmt->execute();
    $result = $stmt->get_result();
    $row = $result->fetch_assoc();
    $lat = $row['lat_user'];
    $lng = $row['lng_user'];

    // Insert into requests_offers table
    $stmt = $db->prepare("INSERT INTO requests_offers (user_id, type, product_id, quantity, status, lat, lng, number_of_persons) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("issisddi", $userId, $type, $productId, $quantity, $status, $lat, $lng, $numberOfPersons);
    $stmt->execute();

    if ($stmt->affected_rows > 0) {
        echo json_encode(['success' => 'Request submitted successfully']);
    } else {
        echo json_encode(['error' => 'Error in submitting request']);
    }

    $db->close();
}
?>
