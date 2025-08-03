<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *'); // Ajusta según tu dominio

$host = 'localhost';
$db_user = 'u800829861_therealnux';
$db_pass = 'Nucamendi23';
$db_name = 'u800829861_inuxteam_db';

$conn = new mysqli($host, $db_user, $db_pass, $db_name);

if ($conn->connect_error) {
    echo json_encode(['message' => 'Error de conexión', 'error' => $conn->connect_error]);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);
$username = $data['username'];
$name = $data['name'];
$phone = $data['phone'];
$email = $data['email'];
$password = password_hash($data['password'], PASSWORD_BCRYPT);

$stmt = $conn->prepare("INSERT INTO users (username, name, phone, email, password) VALUES (?, ?, ?, ?, ?)");
$stmt->bind_param("sssss", $username, $name, $phone, $email, $password);

if ($stmt->execute()) {
    echo json_encode(['message' => 'Usuario registrado']);
} else {
    echo json_encode(['message' => 'Error al registrar', 'error' => $conn->error]);
}

$stmt->close();
$conn->close();
?>