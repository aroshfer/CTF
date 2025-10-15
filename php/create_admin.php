<<<<<<< HEAD
<?php
include 'db.php';

// CHANGE these to your desired admin username/password
$username = "superadmin";
$password = "admin123";

// Hash the password securely
$hashed_password = password_hash($password, PASSWORD_DEFAULT);

$sql = "INSERT INTO admins (username, password) VALUES (?, ?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ss", $username, $hashed_password);

if ($stmt->execute()) {
    echo "✅ Admin account created successfully!";
} else {
    echo "❌ Error: " . $stmt->error;
}

$stmt->close();
$conn->close();
?>
=======
<?php
include 'db.php';

// CHANGE these to your desired admin username/password
$username = "superadmin";
$password = "admin123";

// Hash the password securely
$hashed_password = password_hash($password, PASSWORD_DEFAULT);

$sql = "INSERT INTO admins (username, password) VALUES (?, ?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ss", $username, $hashed_password);

if ($stmt->execute()) {
    echo "✅ Admin account created successfully!";
} else {
    echo "❌ Error: " . $stmt->error;
}

$stmt->close();
$conn->close();
?>
>>>>>>> 6cd235d1aad7beabbda8b99226829b9b92fef45b
