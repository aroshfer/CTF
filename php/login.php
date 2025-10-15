<?php
include 'db.php';
$data = json_decode(file_get_contents("php://input"), true);

$username = $data['username'];
$password = $data['password'];

// Fetch user id, username, password
$sql = "SELECT id, username, password FROM users WHERE username = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $username);
$stmt->execute();
$stmt->store_result();

if ($stmt->num_rows > 0) {
    $stmt->bind_result($id, $user_name, $hashed);
    $stmt->fetch();
    if (password_verify($password, $hashed)) {
        echo json_encode([
            "status" => "success",
            "user_id" => $id,
            "username" => $user_name
        ]);
    } else {
        echo json_encode(["status" => "fail", "message" => "Invalid password"]);
    }
} else {
    echo json_encode(["status" => "fail", "message" => "User not found"]);
}

$stmt->close();
$conn->close();
?>
