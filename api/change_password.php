<?php
  header('Content-Type: application/json');
  header('Access-Control-Allow-Origin: *');

  $host = 'localhost';
  $db_user = 'tu_usuario';
  $db_pass = 'tu_contraseña';
  $db_name = 'inuxteam_db';

  $conn = new mysqli($host, $db_user, $db_pass, $db_name);

  if ($conn->connect_error) {
      echo json_encode(['message' => 'Error de conexión', 'error' => $conn->connect_error]);
      exit;
  }

  $data = json_decode(file_get_contents('php://input'), true);
  $userId = $data['userId'];
  $currentPassword = $data['currentPassword'];
  $newPassword = password_hash($data['newPassword'], PASSWORD_BCRYPT);

  $stmt = $conn->prepare("SELECT password FROM users WHERE id = ?");
  $stmt->bind_param("i", $userId);
  $stmt->execute();
  $result = $stmt->get_result();
  $user = $result->fetch_assoc();

  if ($user && password_verify($currentPassword, $user['password'])) {
      $stmt = $conn->prepare("UPDATE users SET password = ? WHERE id = ?");
      $stmt->bind_param("si", $newPassword, $userId);
      if ($stmt->execute()) {
          echo json_encode(['message' => 'Contraseña actualizada']);
      } else {
          echo json_encode(['message' => 'Error al actualizar', 'error' => $conn->error]);
      }
  } else {
      echo json_encode(['message' => 'Contraseña actual incorrecta']);
  }

  $stmt->close();
  $conn->close();
  ?>