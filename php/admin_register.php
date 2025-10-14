<?php
include 'db.php';

$data = json_decode(file_get_contents("php://input"), true);

$username = trim($data['username']);
$password = trim($data['password']);

// Check for empty fields
if (empty($username) || empty($password)) {
    echo json_encode(["status" => "fail", "message" => "Username and password required"]);
    exit;
}

// Check if username already exists
$sql_check = "SELECT id FROM admins WHERE username = ?";
$stmt_check = $conn->prepare($sql_check);
$stmt_check->bind_param("s", $username);
$stmt_check->execute();
$stmt_check->store_result();

if ($stmt_check->num_rows > 0) {
    echo json_encode(["status" => "fail", "message" => "Username already taken"]);
    $stmt_check->close();
    $conn->close();
    exit;
}
$stmt_check->close();

// Hash the password
$hashed_password = password_hash($password, PASSWORD_DEFAULT);

// Insert new admin
$sql = "INSERT INTO admins (username, password) VALUES (?, ?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ss", $username, $hashed_password);

if ($stmt->execute()) {
    echo json_encode(["status" => "success"]);
} else {
    echo json_encode(["status" => "fail", "message" => "Database error: " . $stmt->error]);
}

$stmt->close();
$conn->close();
?>
