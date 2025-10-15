<?php
include 'db.php';

$user_id = intval($_GET['user_id'] ?? 0);

// Fetch challenges with user's submission status
$sql = "SELECT c.id, c.title, c.description,
        IF(s.result='correct', 1, 0) as solved
        FROM challenges c
        LEFT JOIN submissions s
        ON c.id = s.challenge_id AND s.user_id = ?
        GROUP BY c.id";

$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $user_id);
$stmt->execute();
$result = $stmt->get_result();

$challenges = [];
while ($row = $result->fetch_assoc()) {
    $challenges[] = $row;
}

echo json_encode($challenges);
$stmt->close();
$conn->close();
?>
