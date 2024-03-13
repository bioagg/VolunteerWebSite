<?php
include 'connect_to_db.php';

header('Content-Type: application/json');

try {
    // SQL query to fetch products, their details, and quantity
    $query = "SELECT p.product_id, p.product_name, p.category_id, p.product_description, p.quantity,
                     c.category_name, d.detail_id, d.detail_name, d.detail_value
              FROM products p
              LEFT JOIN categories c ON p.category_id = c.category_id
              LEFT JOIN details d ON p.product_id = d.product_id";

    $result = $db->query($query);

    if (!$result) {
        throw new Exception($db->error);
    }

    $products = [];
    while ($row = $result->fetch_assoc()) {
        $productId = $row['product_id'];
        if (!isset($products[$productId])) {
            $products[$productId] = [
                'product_id' => $productId,
                'product_name' => $row['product_name'],
                'category_name' => $row['category_name'], // Assuming you have category names in your database
                'product_description' => $row['product_description'],
                'quantity' => $row['quantity'], // Include quantity
                'details' => []
            ];
        }
        if ($row['detail_id'] !== null) {
            $products[$productId]['details'][] = [
                'detail_id' => $row['detail_id'],
                'detail_name' => $row['detail_name'],
                'detail_value' => $row['detail_value']
            ];
        }
    }

    // Send a JSON response containing the products with details
    echo json_encode(array_values($products));
} catch (Exception $e) {
    echo json_encode(['error' => $e->getMessage()]);
}

$db->close();
?>
