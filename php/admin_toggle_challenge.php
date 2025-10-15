<<<<<<< HEAD
<?php
$conn = new mysqli("localhost","root","","ctf");
$id = $_POST['id'];
$current = $_POST['active'];
$new = $current==1?0:1;
$conn->query("UPDATE challenges SET active=$new WHERE id=$id");
echo $new==1?'Challenge Activated':'Challenge Deactivated';
?>
=======
<?php
$conn = new mysqli("localhost","root","","ctf");
$id = $_POST['id'];
$current = $_POST['active'];
$new = $current==1?0:1;
$conn->query("UPDATE challenges SET active=$new WHERE id=$id");
echo $new==1?'Challenge Activated':'Challenge Deactivated';
?>
>>>>>>> 6cd235d1aad7beabbda8b99226829b9b92fef45b
