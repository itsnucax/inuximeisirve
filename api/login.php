<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

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
$password = $data['password'];

$stmt = $conn->prepare("SELECT * FROM users WHERE username = ?");
$stmt->bind_param("s", $username);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $user = $result->fetch_assoc();
    if (password_verify($password, $user['password'])) {
        $token = bin2hex(random_bytes(16)); // Token simple
        // Asegurar que credits sea un número
        $credits = floatval($user['credits']);
        echo json_encode([
            'token' => $token,
            'user' => [
                'id' => $user['id'],
                'username' => $user['username'],
                'role' => $user['role'],
                'credits' => $credits // Forzar a número
            ]
        ]);
    } else {
        echo json_encode(['message' => 'Contraseña incorrecta']);
    }
} else {
    echo json_encode(['message' => 'Usuario no encontrado']);
}

$stmt->close();
$conn->close();
?>