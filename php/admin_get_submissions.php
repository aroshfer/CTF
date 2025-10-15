<<<<<<< HEAD
<?php
$conn = new mysqli("localhost","root","","ctf");
$sql = "SELECT s.id, s.user, c.title as challenge_title, s.submitted_flag, s.correct, s.submitted_at 
        FROM submissions s
        JOIN challenges c ON s.challenge_id = c.id
        ORDER BY s.submitted_at DESC";
$res = $conn->query($sql);
$data = [];
while($row = $res->fetch_assoc()){ $data[] = $row; }
echo json_encode($data);
?>
=======
<?php
$conn = new mysqli("localhost","root","","ctf");
$sql = "SELECT s.id, s.user, c.title as challenge_title, s.submitted_flag, s.correct, s.submitted_at 
        FROM submissions s
        JOIN challenges c ON s.challenge_id = c.id
        ORDER BY s.submitted_at DESC";
$res = $conn->query($sql);
$data = [];
while($row = $res->fetch_assoc()){ $data[] = $row; }
echo json_encode($data);
?>
>>>>>>> 6cd235d1aad7beabbda8b99226829b9b92fef45b
