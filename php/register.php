<?php
include 'db.php';
$data = json_decode(file_get_contents("php://input"), true);

$username = $data['username'];
$password = password_hash($data['password'], PASSWORD_DEFAULT);

$sql = "INSERT INTO users (username, password) VALUES (?, ?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ss", $username, $password);

try {
    $stmt->execute();
    echo json_encode(["status" => "success"]);
} catch (mysqli_sql_exception $e) {
    echo json_encode(["status" => "fail", "message" => "Username already exists"]);
}
$stmt->close();
$conn->close();
?>