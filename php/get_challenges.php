<?php
header('Content-Type: application/json');

$servername = "localhost";
$username = "root"; // MySQL username
$password = "";     // MySQL password
$dbname = "ctf_db"; // Database name

$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    die(json_encode(['error' => $conn->connect_error]));
}

$sql = "SELECT id, title, description, category, points FROM challenges WHERE status='active'";
$result = $conn->query($sql);

$challenges = [];
if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $challenges[] = $row;
    }
}

echo json_encode($challenges);
$conn->close();
?>
