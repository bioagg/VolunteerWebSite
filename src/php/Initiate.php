<?php
// 1643373636 Σκλαβενίτης 38.3013077 21.7814960



$host = "localhost";
$username = "root";
$password = "";
$database = "web24";

$connection = new mysqli($host, $username, $password);

// Check if the connection was successful
if ($connection->connect_error){
    die("Connection failed: " . $connection->connect_error);
}

// Create the database
$createDatabaseSQL = "CREATE DATABASE IF NOT EXISTS $database";
if ($connection->query($createDatabaseSQL) !== true) {
    die("Error creating database: " . $connection->error);
}

$connection->select_db($database);

$tables = array(
    "users" => "CREATE TABLE IF NOT EXISTS users (
        id INT(11) AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(100) NOT NULL,
        user_name VARCHAR(100) NOT NULL,
        user_lastname VARCHAR(100) NOT NULL,
        telephone_number VARCHAR(100) NOT NULL,
        lat_user FLOAT(11,7) NOT NULL,
        lng_user FLOAT(11,7) NOT NULL,
        email VARCHAR(100) NOT NULL,
        password VARCHAR(255) NOT NULL
    )",
    "roles" => "CREATE TABLE IF NOT EXISTS roles (
        role_id int(4) NOT NULL PRIMARY KEY,
        role_name varchar(50) NOT NULL
    )",
    "user_roles" => "CREATE TABLE IF NOT EXISTS user_roles (
        id_user INT(11) NOT NULL,
        id_role INT(5) NOT NULL,
        CONSTRAINT `FK1` FOREIGN KEY (`id_user`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT `FK2` FOREIGN KEY (`id_role`) REFERENCES roles (`role_id`) ON DELETE CASCADE ON UPDATE CASCADE
    )",
    "categories" => "CREATE TABLE IF NOT EXISTS categories (
        category_id INT NOT NULL PRIMARY KEY,
        category_name VARCHAR(100) NOT NULL,
        date_added DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    )",
    "products" => "CREATE TABLE IF NOT EXISTS products (
        product_id VARCHAR(36) NOT NULL PRIMARY KEY,
        product_name VARCHAR(100) NOT NULL,
        category_id INT NOT NULL,
        product_description TEXT,
        quantity INT DEFAULT 0,
        date_added DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT `sub_cat_1` FOREIGN KEY (`category_id`) REFERENCES categories (`category_id`) ON DELETE CASCADE ON UPDATE CASCADE    
    )",
    "details" => "CREATE TABLE details (
        detail_id INT AUTO_INCREMENT PRIMARY KEY,
        product_id VARCHAR(36),
        detail_name VARCHAR(100),
        detail_value VARCHAR(100),
        FOREIGN KEY (product_id) REFERENCES products(product_id)
    )",
    "transactions" => "CREATE TABLE IF NOT EXISTS transactions (
        transaction_id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT(11) NOT NULL,
        product_id VARCHAR(36) NOT NULL,
        quantity INT NOT NULL,
        transaction_type ENUM('addition', 'removal') NOT NULL,
        transaction_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT FK_user_transaction FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT FK_product_transaction FOREIGN KEY (product_id) REFERENCES products (product_id) ON DELETE CASCADE ON UPDATE CASCADE
    )",
    "vehicles" => "CREATE TABLE IF NOT EXISTS vehicles (
        vehicle_id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT(11) NOT NULL UNIQUE,
        vehicle_type VARCHAR(100) NOT NULL,
        license_plate VARCHAR(50) NOT NULL UNIQUE,
        manufactorer VARCHAR(50),
        model VARCHAR(50),
        year YEAR,
        color VARCHAR(30),
        registration_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        latitude FLOAT(11,7) NOT NULL DEFAULT 38.276826,
        longitude FLOAT(11,7) NOT NULL DEFAULT 21.762957,
        CONSTRAINT FK_user_vehicle FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE ON UPDATE CASCADE
    )",
    "rescuer_inventory" => "CREATE TABLE rescuer_inventory (
        user_id INT NOT NULL,
        product_id VARCHAR(36) NOT NULL,
        quantity INT NOT NULL,
        PRIMARY KEY (user_id, product_id),
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (product_id) REFERENCES products(product_id)
    )",
    "requests_offers" => "CREATE TABLE IF NOT EXISTS requests_offers (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        type ENUM('request', 'offer') NOT NULL,
        product_id VARCHAR(36) NOT NULL,
        quantity INT NOT NULL,
        number_of_persons INT DEFAULT 0,
        status ENUM('pending', 'taken', 'completed') NOT NULL DEFAULT 'pending',
        lat FLOAT(11,7), 
        lng FLOAT(11,7), 
        date_added DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        date_taken DATETIME,
        date_completed DATETIME, 
        taken_by_user_id INT,
        vehicle_id INT, 
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (product_id) REFERENCES products(product_id),
        FOREIGN KEY (taken_by_user_id) REFERENCES users(id),
        FOREIGN KEY (vehicle_id) REFERENCES vehicles(vehicle_id)
    )",
    "announcements" => "CREATE TABLE announcements (
        announcement_id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        product_id VARCHAR(36),
        required_quantity INT,
        date_posted DATETIME DEFAULT CURRENT_TIMESTAMP,
        status ENUM('active', 'closed') DEFAULT 'active',
        FOREIGN KEY (product_id) REFERENCES products(product_id)
    )"
);

foreach ($tables as $tableName => $createTableSQL) {
    if ($connection -> query($createTableSQL) !== true) {
        die("Error creating table $tableName: " . $connection->error);
    }
}

// After creating all tables, add the trigger
$createTriggerSQL = "
    CREATE TRIGGER before_task_completed
    BEFORE UPDATE ON requests_offers
    FOR EACH ROW
    BEGIN
        IF NEW.status = 'completed' THEN
            SET NEW.taken_by_user_id = NULL,
                NEW.vehicle_id = NULL,
                NEW.date_completed = NOW();
        END IF;
    END;
";

if ($connection->query($createTriggerSQL) !== true) {
    die("Error creating trigger: " . $connection->error);
}

// After creating all tables, add the trigger
$createTriggerSQL = "
    CREATE TRIGGER check_task_limit_before_insert
    BEFORE INSERT ON requests_offers
    FOR EACH ROW
    BEGIN
        DECLARE task_count INT;

        SELECT COUNT(*) INTO task_count
        FROM requests_offers
        WHERE taken_by_user_id = NEW.taken_by_user_id AND status = 'taken';

        IF task_count >= 4 THEN
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Cannot take more than 4 tasks';
        END IF;
    END;
";

if ($connection->multi_query($createTriggerSQL) !== true) {
    die("Error creating trigger: " . $connection->error);
}

$insertRolesSQL = "INSERT IGNORE INTO roles (role_id, role_name) VALUES (0, 'client'), (1, 'admin'), (2, 'rescuer')";

if ($connection->query($insertRolesSQL) !== true) {
    die("Error inserting data into roles table: " . $connection->error);
}

// Sample user data with complex passwords
$users = [
    ['john_doe1', 'John', 'Doe', '555-0101', 38.3013077, 21.7814960, 'john.doe1@example.com', 'Password1!'],
    ['jane_doe2', 'Jane', 'Doe', '555-0102', 38.3013087, 21.7814960, 'jane.doe2@example.com', 'Password2@'],
    ['user_three', 'User', 'Three', '555-0103', 38.3013097, 21.7814960, 'user.three@example.com', 'Password3#'],
    ['user_four', 'User', 'Four', '555-0104', 38.3014077, 21.7814960, 'user.four@example.com', 'Password4$'],
    ['user_five', 'User', 'Five', '555-0105', 38.3015077, 21.7814960, 'user.five@example.com', 'Password5%'],
    ['user_six', 'User', 'Six', '555-0106', 38.3016077, 21.7814960, 'user.six@example.com', 'Password6^'],
    ['user_seven', 'User', 'Seven', '555-0107', 38.3063077, 21.7814960, 'user.seven@example.com', 'Password7&'],
    ['user_eight', 'User', 'Eight', '555-0108', 38.3073077, 21.7814960, 'user.eight@example.com', 'Password8*'],
    ['user_nine', 'User', 'Nine', '555-0109', 38.3083077, 21.7814960, 'user.nine@example.com', 'Password9('],
    ['user_ten', 'User', 'Ten', '555-0110', 38.1013077, 21.7814960, 'user.ten@example.com', 'Password10)']
];

// Start the SQL statement
$insertUsersSQL = "INSERT IGNORE INTO users (username, user_name, user_lastname, telephone_number, lat_user, lng_user, email, password) VALUES ";

// Array to hold the VALUES part of the SQL statement
$valuesArr = [];

foreach ($users as $user) {
    // Hash the password
    $hashed_password = password_hash($user[7], PASSWORD_DEFAULT);

    // Prepare the VALUES part of the SQL statement for each user
    $valuesArr[] = sprintf(
        "(%s, %s, %s, %s, %f, %f, %s, %s)",
        "'".$connection->real_escape_string($user[0])."'",
        "'".$connection->real_escape_string($user[1])."'",
        "'".$connection->real_escape_string($user[2])."'",
        "'".$connection->real_escape_string($user[3])."'",
        $user[4],
        $user[5],
        "'".$connection->real_escape_string($user[6])."'",
        "'".$connection->real_escape_string($hashed_password)."'"
    );
}

// Concatenate all VALUES into one SQL statement
$insertUsersSQL .= implode(", ", $valuesArr) . ";";

// Execute the SQL statement
if ($connection->query($insertUsersSQL) !== true) {
    die("Error inserting data into users table: " . $connection->error);
} else {
    echo "Users inserted successfully!";
}

$connection->close();

echo 'Database and tables created successfully!';


?>
