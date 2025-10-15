<<<<<<< HEAD
<?php
include 'db.php';
$data = json_decode(file_get_contents("php://input"), true);

$user_id = intval($data['user_id']);
$challenge_id = intval($data['challenge_id']);
$flag = $data['flag'];

// Check if challenge exists
$sql = "SELECT flag, points FROM challenges WHERE id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $challenge_id);
$stmt->execute();
$stmt->bind_result($correct_flag, $challenge_points);
$stmt->fetch();
$stmt->close();

if (!$correct_flag) {
    echo json_encode(["status" => "error", "message" => "Challenge not found."]);
    exit;
}

// Check if already solved
$sql = "SELECT id FROM submissions WHERE user_id = ? AND challenge_id = ? AND result = 'correct'";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ii", $user_id, $challenge_id);
$stmt->execute();
$stmt->store_result();
if ($stmt->num_rows > 0) {
    echo json_encode(["status" => "already", "message" => "Challenge already solved."]);
    $stmt->close();
    exit;
}
$stmt->close();

// Check flag
$result = ($flag === $correct_flag) ? "correct" : "incorrect";

// Insert submission
$stmt = $conn->prepare("INSERT INTO submissions (user_id, challenge_id, flag, result) VALUES (?, ?, ?, ?)");
$stmt->bind_param("iiss", $user_id, $challenge_id, $flag, $result);
$stmt->execute();
$stmt->close();

// If correct, update user points
if ($result === "correct") {
    $stmt = $conn->prepare("UPDATE users SET points = points + ? WHERE id = ?");
    $stmt->bind_param("ii", $challenge_points, $user_id);
    $stmt->execute();
    $stmt->close();
}

echo json_encode(["status" => $result]);
$conn->close();
?>
=======
<?php
include 'db.php';
$data = json_decode(file_get_contents("php://input"), true);

$user_id = intval($data['user_id']);
$challenge_id = intval($data['challenge_id']);
$flag = $data['flag'];

// Check if challenge exists
$sql = "SELECT flag, points FROM challenges WHERE id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $challenge_id);
$stmt->execute();
$stmt->bind_result($correct_flag, $challenge_points);
$stmt->fetch();
$stmt->close();

if (!$correct_flag) {
    echo json_encode(["status" => "error", "message" => "Challenge not found."]);
    exit;
}

// Check if already solved
$sql = "SELECT id FROM submissions WHERE user_id = ? AND challenge_id = ? AND result = 'correct'";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ii", $user_id, $challenge_id);
$stmt->execute();
$stmt->store_result();
if ($stmt->num_rows > 0) {
    echo json_encode(["status" => "already", "message" => "Challenge already solved."]);
    $stmt->close();
    exit;
}
$stmt->close();

// Check flag
$result = ($flag === $correct_flag) ? "correct" : "incorrect";

// Insert submission
$stmt = $conn->prepare("INSERT INTO submissions (user_id, challenge_id, flag, result) VALUES (?, ?, ?, ?)");
$stmt->bind_param("iiss", $user_id, $challenge_id, $flag, $result);
$stmt->execute();
$stmt->close();

// If correct, update user points
if ($result === "correct") {
    $stmt = $conn->prepare("UPDATE users SET points = points + ? WHERE id = ?");
    $stmt->bind_param("ii", $challenge_points, $user_id);
    $stmt->execute();
    $stmt->close();
}

echo json_encode(["status" => $result]);
$conn->close();
?>
>>>>>>> 6cd235d1aad7beabbda8b99226829b9b92fef45b
