<?php
include 'db.php';
$user_id = intval($_GET['user_id'] ?? 0);

$stmt = $conn->prepare("SELECT points FROM users WHERE id = ?");
$stmt->bind_param("i", $user_id);
$stmt->execute();
$stmt->bind_result($points);
$stmt->fetch();
$stmt->close();
$conn->close();

echo json_encode(['points' => $points]);
?>
