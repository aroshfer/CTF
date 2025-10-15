<<<<<<< HEAD
<?php
// admin_get_files.php
include 'db.php';

$result = $conn->query("SELECT cf.id, cf.filename, cf.uploaded_at, c.title AS challenge_title 
                        FROM challenge_files cf 
                        JOIN challenges c ON cf.challenge_id = c.id 
                        ORDER BY cf.uploaded_at DESC");

$files = array();
while($row = $result->fetch_assoc()){
    $files[] = $row;
}

echo json_encode($files);
?>
=======
<?php
// admin_get_files.php
include 'db.php';

$result = $conn->query("SELECT cf.id, cf.filename, cf.uploaded_at, c.title AS challenge_title 
                        FROM challenge_files cf 
                        JOIN challenges c ON cf.challenge_id = c.id 
                        ORDER BY cf.uploaded_at DESC");

$files = array();
while($row = $result->fetch_assoc()){
    $files[] = $row;
}

echo json_encode($files);
?>
>>>>>>> 6cd235d1aad7beabbda8b99226829b9b92fef45b
