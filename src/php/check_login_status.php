<?php
session_start();

if (!isset($_SESSION['status'])) {
    echo 'not_logged_in';
} else {
    echo 'logged_in';
}
?>
