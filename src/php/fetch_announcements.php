<?php
include 'connect_to_db.php';

header('Content-Type: application/json');

try {
    $query = "SELECT * FROM announcements";
    $result = $db->query($query);

    if (!$result) {
        throw new Exception($db->error);
    }

    $announcements = [];
    while ($row = $result->fetch_assoc()) {
        $announcements[] = $row;
    }

    echo json_encode($announcements);
} catch (Exception $e) {
    echo json_encode(['error' => $e->getMessage()]);
}

$db->close();
?>