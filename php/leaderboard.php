<?php
include 'db.php';

$sql = "
SELECT u.username, SUM(c.points) AS total_points
FROM users u
JOIN submissions s ON u.id = s.user_id
JOIN challenges c ON s.challenge_id = c.id
WHERE s.correct = 1
GROUP BY u.username
ORDER BY total_points DESC
";

$result = $conn->query($sql);
$leaderboard = [];

while ($row = $result->fetch_assoc()) {
  $leaderboard[] = $row;
}

echo json_encode($leaderboard);
$conn->close();
?>
