<<<<<<< HEAD
<?php
// admin_upload_file.php
include 'db.php'; // your DB connection

if(isset($_POST['challenge_id']) && isset($_FILES['file'])){
    $challenge_id = $_POST['challenge_id'];
    $file = $_FILES['file'];

    $uploadDir = '../uploads/'; // make sure this folder exists and writable
    if(!is_dir($uploadDir)){
        mkdir($uploadDir, 0777, true);
    }

    $filename = basename($file['name']);
    $targetFile = $uploadDir . $filename;

    if(move_uploaded_file($file['tmp_name'], $targetFile)){
        // Save in DB
        $stmt = $conn->prepare("INSERT INTO challenge_files (challenge_id, filename) VALUES (?, ?)");
        $stmt->bind_param("is", $challenge_id, $filename);
        if($stmt->execute()){
            echo "File uploaded successfully!";
        } else {
            echo "Database error!";
        }
    } else {
        echo "Failed to upload file!";
    }
} else {
    echo "Invalid request!";
}
?>
=======
<?php
// admin_upload_file.php
include 'db.php'; // your DB connection

if(isset($_POST['challenge_id']) && isset($_FILES['file'])){
    $challenge_id = $_POST['challenge_id'];
    $file = $_FILES['file'];

    $uploadDir = '../uploads/'; // make sure this folder exists and writable
    if(!is_dir($uploadDir)){
        mkdir($uploadDir, 0777, true);
    }

    $filename = basename($file['name']);
    $targetFile = $uploadDir . $filename;

    if(move_uploaded_file($file['tmp_name'], $targetFile)){
        // Save in DB
        $stmt = $conn->prepare("INSERT INTO challenge_files (challenge_id, filename) VALUES (?, ?)");
        $stmt->bind_param("is", $challenge_id, $filename);
        if($stmt->execute()){
            echo "File uploaded successfully!";
        } else {
            echo "Database error!";
        }
    } else {
        echo "Failed to upload file!";
    }
} else {
    echo "Invalid request!";
}
?>
>>>>>>> 6cd235d1aad7beabbda8b99226829b9b92fef45b
