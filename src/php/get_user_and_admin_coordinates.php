<?php
session_start();
include 'connect_to_db.php';

header('Content-Type: application/json');

// Check if a user is logged in
if(isset($_SESSION['user_id_logged_in'])) {
    $userId = $_SESSION['user_id_logged_in'];

    try {
        // Fetch the coordinates of the logged-in user
        $userQuery = $db->prepare("SELECT lat_user, lng_user FROM users WHERE id = ?");
        $userQuery->bind_param("i", $userId);
        $userQuery->execute();
        $userResult = $userQuery->get_result();
        $userCoords = $userResult->fetch_assoc();

        // Fetch the coordinates of the admin user
        $adminQuery = $db->prepare("SELECT lat_user, lng_user FROM users WHERE id IN (SELECT id_user FROM user_roles WHERE id_role = 1)");
        $adminQuery->execute();
        $adminResult = $adminQuery->get_result();
        $adminCoords = $adminResult->fetch_assoc();

        // Return the coordinates
        echo json_encode([
            'status' => 'success',
            'userCoordinates' => $userCoords,
            'adminCoordinates' => $adminCoords
        ]);
    } catch (Exception $e) {
        echo json_encode(['status' => 'error', 'message' => 'Failed to fetch coordinates: ' . $e->getMessage()]);
    }
} else {
    echo json_encode(['status' => 'error', 'message' => 'User not logged in']);
}

$db->close();
?>
