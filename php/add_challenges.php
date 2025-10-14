<?php
include 'db.php';
$data = json_decode(file_get_contents("php://input"), true);

$title = $data['title'];
$description = $data['description'];
$flag = $data['flag'];

$stmt = $conn->prepare("INSERT INTO challenges (title, description, flag) VALUES (?, ?, ?)");
$stmt->bind_param("sss", $title, $description, $flag);
$stmt->execute();

echo json_encode(["status" => "success"]);
$conn->close();
?>
