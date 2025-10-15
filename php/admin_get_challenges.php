<<<<<<< HEAD
<?php
$conn = new mysqli("localhost","root","","ctf");
$res = $conn->query("SELECT * FROM challenges");
$challenges = [];
while($row = $res->fetch_assoc()){ $challenges[] = $row; }
echo json_encode($challenges);
?>

=======
<?php
$conn = new mysqli("localhost","root","","ctf");
$res = $conn->query("SELECT * FROM challenges");
$challenges = [];
while($row = $res->fetch_assoc()){ $challenges[] = $row; }
echo json_encode($challenges);
?>

>>>>>>> 6cd235d1aad7beabbda8b99226829b9b92fef45b
