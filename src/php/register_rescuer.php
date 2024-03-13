<?php
include 'connect_to_db.php';

header('Content-Type: application/json');

$response = ['success' => false, 'error' => ''];

if($_SERVER["REQUEST_METHOD"] == "POST") {
    $jsonData = file_get_contents('php://input');
    $data = json_decode($jsonData, true);

    $username = $data['username'];
    $name = $data['name'];
    $lastname = $data['lastname'];
    $phone = $data['phone'];
    $lat = $data['lat'];
    $lng = $data['lng'];
    $email = $data['email'];
    $password = $data['password'];
    $role = $data['role']; // Rescuer role

    $query = $db->query("SELECT * FROM users WHERE username = '$username' OR email = '$email' OR telephone_number = '$phone'");

    if (mysqli_num_rows($query) != 0) {
        $response['error'] = 'User with the same username, email, or phone already exists.';
    } else {
        $hashed_password = password_hash($password, PASSWORD_DEFAULT);

        if ($db->query("INSERT INTO users(username, user_name, user_lastname, telephone_number, lat_user, lng_user, email, password) VALUES ('$username', '$name', '$lastname', '$phone', '$lat', '$lng', '$email', '$hashed_password')")) {
            $last_id = $db->insert_id;
            if ($db->query("INSERT INTO user_roles(id_user, id_role) VALUES ('$last_id', '$role')")) {
                $response['success'] = true;
            } else {
                $response['error'] = 'Error inserting data into user_roles table: ' . $db->error;
            }
        } else {
            $response['error'] = 'Error inserting data into users table: ' . $db->error;
        }
    }
} else {
    $response['error'] = 'Invalid request method.';
}

echo json_encode($response);
$db->close();
?>
