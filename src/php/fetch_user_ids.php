<?php
include 'connect_to_db.php';

header('Content-Type: application/json');

try {
    $stmt = $db->prepare("SELECT u.id, u.username, u_r.id_role FROM users u JOIN user_roles u_r ON u.id = u_r.id_user"); 
    $stmt->execute();
    $result = $stmt->get_result();
    $users = $result->fetch_all(MYSQLI_ASSOC);

    echo json_encode($users);
} catch (Exception $e) {
    echo json_encode(['error' => $e->getMessage()]);
}

$db->close();
?>