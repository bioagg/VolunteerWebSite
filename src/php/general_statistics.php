<?php
// Database connection
include 'connect_to_db.php';

if($_SERVER["REQUEST_METHOD"] == "GET") {
    $response = [];

    // Fetch total products
    $query = "SELECT COUNT(*) as total FROM products";
    $result = mysqli_query($db, $query);
    $row = mysqli_fetch_assoc($result);
    $response['totalProducts'] = $row['total'];

    // Fetch total categories
    $query = "SELECT COUNT(*) as total FROM categories";
    $result = mysqli_query($db, $query);
    $row = mysqli_fetch_assoc($result);
    $response['totalCategories'] = $row['total'];

    // Fetch total vehicles
    $query = "SELECT COUNT(*) as total FROM vehicles"; // Assuming you have a vehicles table
    $result = mysqli_query($db, $query);
    $row = mysqli_fetch_assoc($result);
    $response['totalVehicles'] = $row['total'];

    echo json_encode($response);
}
?>
