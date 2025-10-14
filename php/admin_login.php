<?php
include 'db.php';
$data = json_decode(file_get_contents("php://input"), true);

$username = $data['username'];
$password = $data['password'];

$sql = "SELECT id, password FROM admins WHERE username = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $username);
$stmt->execute();
$stmt->store_result();

if ($stmt->num_rows > 0) {
    $stmt->bind_result($id, $hashed);
    $stmt->fetch();
    if (password_verify($password, $hashed)) {
        echo json_encode(["status" => "success", "admin_id" => $id]);
    } else {
        echo json_encode(["status" => "fail", "message" => "Invalid password"]);
    }
} else {
    echo json_encode(["status" => "fail", "message" => "Admin not found"]);
}

$stmt->close();
$conn->close();
?>
