<?php

include 'connect_to_db.php';

if($_SERVER["REQUEST_METHOD"] == "POST") {
    $jsonData = file_get_contents('php://input');
    $data = json_decode($jsonData, true);

    // Access the values
    $username = $data['username'];
    $name = $data['name'];
    $lastname = $data['lastname'];
    $phone = $data['phone'];
    $lat = $data['lat'];
    $lng = $data['lng'];
    $email = $data['email'];
    $password = $data['password'];


    $query = $db->query("SELECT * FROM users WHERE username = '$username' OR email = '$email' OR telephone_number = '$phone'");

    if (mysqli_num_rows($query) != 0) {
        echo 1;
    } else {
        $hashed_password = password_hash($password, PASSWORD_DEFAULT);

        if ($db->query("INSERT INTO users(username, user_name, user_lastname, telephone_number, lat_user, lng_user, email, password) VALUES ('$username', '$name', '$lastname', '$phone', '$lat', '$lng', '$email', '$hashed_password')") !== true) {
            die("Error in inserting data into users table: " . $db->error);
        }

        $get_last_id_inserted = $db->query("SELECT id FROM users WHERE username = '$username'");

        while($row=mysqli_fetch_assoc($get_last_id_inserted)) {
            $id = $row["id"];
            if ($db->query("INSERT INTO user_roles VALUES ('$id', '0')") !== true) {
                die("Error inserting data into user_roles table: " . $db->error);
            }
        }

        echo 0;
    }
}

?>