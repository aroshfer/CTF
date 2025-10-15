<<<<<<< HEAD
<?php
$conn = new mysqli("localhost","root","","ctf");
$id = $_POST['id'];
$title = $_POST['title'];
$category = $_POST['category'];
$description = $_POST['description'];
$flag = $_POST['flag'];
$points = $_POST['points'];

if($id){ // update
    $stmt = $conn->prepare("UPDATE challenges SET title=?, category=?, description=?, flag=?, points=? WHERE id=?");
    $stmt->bind_param("sssiii",$title,$category,$description,$flag,$points,$id);
    $stmt->execute();
    echo "Challenge updated!";
}else{ // insert
    $stmt = $conn->prepare("INSERT INTO challenges (title,category,description,flag,points) VALUES (?,?,?,?,?)");
    $stmt->bind_param("ssssi",$title,$category,$description,$flag,$points);
    $stmt->execute();
    echo "Challenge added!";
}
?>
=======
<?php
$conn = new mysqli("localhost","root","","ctf");
$id = $_POST['id'];
$title = $_POST['title'];
$category = $_POST['category'];
$description = $_POST['description'];
$flag = $_POST['flag'];
$points = $_POST['points'];

if($id){ // update
    $stmt = $conn->prepare("UPDATE challenges SET title=?, category=?, description=?, flag=?, points=? WHERE id=?");
    $stmt->bind_param("sssiii",$title,$category,$description,$flag,$points,$id);
    $stmt->execute();
    echo "Challenge updated!";
}else{ // insert
    $stmt = $conn->prepare("INSERT INTO challenges (title,category,description,flag,points) VALUES (?,?,?,?,?)");
    $stmt->bind_param("ssssi",$title,$category,$description,$flag,$points);
    $stmt->execute();
    echo "Challenge added!";
}
?>
>>>>>>> 6cd235d1aad7beabbda8b99226829b9b92fef45b
