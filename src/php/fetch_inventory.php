<?php
include 'connect_to_db.php'; // Your database connection file

header('Content-Type: application/json');

try {
    $categoryFilter = '';
    if (isset($_POST['categories'])) {
        $categoryIds = array_map(function($id) use ($db) {
            return mysqli_real_escape_string($db, $id);
        }, $_POST['categories']);

        if (count($categoryIds) > 0) {
            $categoryFilter = "WHERE p.category_id IN ('" . implode("','", $categoryIds) . "')";
        }
    }

    $query = "SELECT p.product_name, p.quantity AS total_quantity, 
                     ri.quantity AS rescuer_quantity, u.username AS rescuer_name
              FROM products p
              LEFT JOIN rescuer_inventory ri ON p.product_id = ri.product_id
              LEFT JOIN users u ON ri.user_id = u.id
              $categoryFilter
              GROUP BY p.product_id, u.username
              ORDER BY p.product_name";

    $stmt = $db->prepare($query);
    $stmt->execute();
    $result = $stmt->get_result();
    $inventory = $result->fetch_all(MYSQLI_ASSOC);

    echo json_encode($inventory);
} catch (Exception $e) {
    echo json_encode(['error' => $e->getMessage()]);
}

$db->close();
?>
