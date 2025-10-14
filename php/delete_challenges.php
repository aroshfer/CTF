<?php
include 'db.php';
$id = $_GET['id'];

$stmt = $conn->prepare("DELETE FROM challenges WHERE id = ?");
$stmt->bind_param("i", $id);
$stmt->execute();

echo json_encode(["status" => "deleted"]);
$conn->close();
?>
