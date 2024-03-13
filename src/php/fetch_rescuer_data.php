<?php
// Include the database connection file
include 'connect_to_db.php';

session_start(); // Start the session to access session variables
header('Content-Type: application/json');

// Fetch the base location, which is the location of the admin user
$baseLocation = fetchBaseLocation($db);

// Fetch the current location of the logged-in rescuer (from session)
$rescuerLocation = fetchRescuerLocation($db);

// Fetch the current requests and offers
$requestsOffers = fetchRequestsAndOffers($db);

// Fetch the rescuer's vehicle data
$vehicleData = fetchVehicleData($db);

// Send a JSON response with all the fetched data
echo json_encode([
    'baseLocation' => $baseLocation,
    'rescuerLocation' => $rescuerLocation,
    'requestsOffers' => $requestsOffers,
    'vehicleData' => $vehicleData
]);

// Function to fetch the base location (admin user's location)
function fetchBaseLocation($db) {
    $query = "SELECT lat_user, lng_user FROM users WHERE id IN (SELECT id_user FROM user_roles WHERE id_role = 1)";
    $result = $db->query($query);
    if ($result) {
        return $result->fetch_assoc();
    } else {
        return null; // Return null if there's no result
    }
}

// Function to fetch the rescuer's current location
function fetchRescuerLocation($db) {
    // Assuming rescuer's user ID is stored in a session variable
    $rescuerId = $_SESSION['user_id_logged_in'];
    $query = "SELECT lat_user, lng_user FROM users WHERE id = ?";
    $stmt = $db->prepare($query);
    $stmt->bind_param("i", $rescuerId);
    $stmt->execute();
    $result = $stmt->get_result();
    if ($result) {
        return $result->fetch_assoc();
    } else {
        return null; // Return null if there's no result
    }
}

// Function to fetch current requests and offers from the database
function fetchRequestsAndOffers($db) {
    // Fetch all requests, joining with user and product information and the user who took the request
    $requestsQuery = "SELECT ro.*, 
                             u.user_name, u.user_lastname, u.telephone_number, p.product_name, 
                             taker.username AS taker_username
                      FROM requests_offers ro
                      JOIN users u ON ro.user_id = u.id
                      JOIN products p ON ro.product_id = p.product_id
                      LEFT JOIN users taker ON ro.taken_by_user_id = taker.id
                      WHERE ro.type = 'request'";

    // Fetch all offers, joining with user and product information and the user who took the offer
    $offersQuery = "SELECT ro.*, 
                           u.user_name, u.user_lastname, u.telephone_number, p.product_name, 
                           taker.username AS taker_username
                    FROM requests_offers ro
                    JOIN users u ON ro.user_id = u.id
                    JOIN products p ON ro.product_id = p.product_id
                    LEFT JOIN users taker ON ro.taken_by_user_id = taker.id
                    WHERE ro.type = 'offer'";

    $requests = fetchQueryResults($db, $requestsQuery);
    $offers = fetchQueryResults($db, $offersQuery);

    return ['requests' => $requests, 'offers' => $offers];
}

// Function to fetch the rescuer's vehicle data
function fetchVehicleData($db) {
    $rescuerId = $_SESSION['user_id_logged_in'];
    $query = "SELECT * FROM vehicles WHERE user_id = ?";
    $stmt = $db->prepare($query);
    $stmt->bind_param("i", $rescuerId);
    $stmt->execute();
    $result = $stmt->get_result();
    if ($result) {
        return $result->fetch_assoc();
    } else {
        return null; // Return null if there's no result
    }
}

// Helper function to execute a query and return the results
function fetchQueryResults($db, $query) {
    $result = $db->query($query);
    $data = [];
    if ($result) {
        while ($row = $result->fetch_assoc()) {
            $data[] = $row;
        }
    }
    return $data;
}

$db->close();
?>
