<?php
// admin_get_totals.php
include 'db.php';

$totals = array();

$res = $conn->query("SELECT COUNT(*) AS challenges FROM challenges");
$totals['challenges'] = $res->fetch_assoc()['challenges'];

$res = $conn->query("SELECT COUNT(*) AS players FROM players");
$totals['players'] = $res->fetch_assoc()['players'];

$res = $conn->query("SELECT COUNT(*) AS submissions FROM submissions");
$totals['submissions'] = $res->fetch_assoc()['submissions'];

$res = $conn->query("SELECT COUNT(*) AS files FROM challenge_files");
$totals['files'] = $res->fetch_assoc()['files'];

echo json_encode($totals);
?>