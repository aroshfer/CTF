<<<<<<< HEAD
<?php
session_start();
header('Content-Type: application/json');
$player_id = $_SESSION['player_id']; // make sure player is logged in

$conn = new mysqli("localhost", "root", "", "ctf_db");
if($conn->connect_error) { die(json_encode(["error"=>"DB connection failed"])); }

// Get player info
$player_res = $conn->query("SELECT username, points FROM players WHERE id=$player_id");
$player = $player_res->fetch_assoc();

// Get active challenges
$challenges_res = $conn->query("SELECT id, name FROM challenges WHERE active=1");
$challenges = [];
while($row = $challenges_res->fetch_assoc()){
    $challenges[] = $row;
}

echo json_encode([
    "username" => $player['username'],
    "points" => $player['points'],
    "activeChallenges" => $challenges
]);
?>
=======
<?php
session_start();
header('Content-Type: application/json');
$player_id = $_SESSION['player_id']; // make sure player is logged in

$conn = new mysqli("localhost", "root", "", "ctf_db");
if($conn->connect_error) { die(json_encode(["error"=>"DB connection failed"])); }

// Get player info
$player_res = $conn->query("SELECT username, points FROM players WHERE id=$player_id");
$player = $player_res->fetch_assoc();

// Get active challenges
$challenges_res = $conn->query("SELECT id, name FROM challenges WHERE active=1");
$challenges = [];
while($row = $challenges_res->fetch_assoc()){
    $challenges[] = $row;
}

echo json_encode([
    "username" => $player['username'],
    "points" => $player['points'],
    "activeChallenges" => $challenges
]);
?>
>>>>>>> 6cd235d1aad7beabbda8b99226829b9b92fef45b
