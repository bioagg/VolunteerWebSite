<?php
// get_username.php


include 'connect_to_db.php';
session_start();
// Include your database connection code here
// ...

if (isset($_SESSION['user_id_logged_in'])) {
    $user_id_logged_in = $_SESSION['user_id_logged_in'];

    // Database query to get the username
    // Assuming you have a working database connection in $db
    $stmt = $db->prepare("SELECT username FROM users WHERE id = ?");
    $stmt->bind_param("i", $user_id_logged_in);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        echo $row['username'];
    } else {
        echo "Guest";
    }
    $stmt->close();
} else {
    echo "Guest";
}

$db->close();
?>
