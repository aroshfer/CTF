<?php
$conn = new mysqli("localhost","root","","ctf");
$res = $conn->query("SELECT * FROM challenges");
$challenges = [];
while($row = $res->fetch_assoc()){ $challenges[] = $row; }
echo json_encode($challenges);
?>

