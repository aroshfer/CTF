<<<<<<< HEAD
<?php
include 'db.php';
$id = $_GET['id'];

$stmt = $conn->prepare("DELETE FROM challenges WHERE id = ?");
$stmt->bind_param("i", $id);
$stmt->execute();

echo json_encode(["status" => "deleted"]);
$conn->close();
?>
=======
<?php
include 'db.php';
$id = $_GET['id'];

$stmt = $conn->prepare("DELETE FROM challenges WHERE id = ?");
$stmt->bind_param("i", $id);
$stmt->execute();

echo json_encode(["status" => "deleted"]);
$conn->close();
?>
>>>>>>> 6cd235d1aad7beabbda8b99226829b9b92fef45b
