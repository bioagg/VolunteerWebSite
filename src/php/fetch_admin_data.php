<?php
include 'connect_to_db.php';
session_start();
header('Content-Type: application/json');

try {
    // Fetch the base location (admin user's location)
    $baseQuery = "SELECT lat_user, lng_user FROM users WHERE id IN (SELECT id_user FROM user_roles WHERE id_role = 1)";
    $baseResult = $db->query($baseQuery);
    $baseLocation = $baseResult ? $baseResult->fetch_assoc() : null;

    // Fetch all vehicles
    $vehiclesQuery = "SELECT v.*, u.username FROM vehicles v JOIN users u ON v.user_id = u.id";
    $vehiclesResult = $db->query($vehiclesQuery);
    $vehicles = $vehiclesResult ? $vehiclesResult->fetch_all(MYSQLI_ASSOC) : [];

    // Fetch all requests and offers
    $requestsOffersQuery = "SELECT ro.*, u1.user_name, u1.user_lastname, u1.telephone_number, p.product_name, u2.username AS taker_username
                            FROM requests_offers ro 
                            JOIN users u1 ON ro.user_id = u1.id 
                            JOIN products p ON ro.product_id = p.product_id
                            LEFT JOIN users u2 ON ro.taken_by_user_id = u2.id";
$requestsOffersResult = $db->query($requestsOffersQuery);
    $requestsOffersResult = $db->query($requestsOffersQuery);
    $requestsOffers = $requestsOffersResult ? $requestsOffersResult->fetch_all(MYSQLI_ASSOC) : [];

    // Send a JSON response containing all data
    echo json_encode([
        'baseLocation' => $baseLocation,
        'vehicles' => $vehicles,
        'requestsOffers' => $requestsOffers
    ]);
} catch (Exception $e) {
    echo json_encode(['error' => $e->getMessage()]);
}

$db->close();
?>
