<?php
include 'db.php';
$sql = "SELECT s.id, u.username, c.title, s.flag, s.result, s.submitted_at 
        FROM submissions s
        LEFT JOIN users u ON s.user_id = u.id
        LEFT JOIN challenges c ON s.challenge_id = c.id
        ORDER BY s.submitted_at DESC";
$result = $conn->query($sql);
$data = [];
while ($r = $result->fetch_assoc()) $data[] = $r;
echo json_encode($data);
$conn->close();
?>
