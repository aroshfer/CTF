<?php
$conn = new mysqli("localhost","root","","ctf");
$id = $_GET['id'];
$stmt = $conn->prepare("SELECT * FROM challenges WHERE id=?");
$stmt->bind_param("i",$id);
$stmt->execute();
$res = $stmt->get_result();
echo json_encode($res->fetch_assoc());
?>
