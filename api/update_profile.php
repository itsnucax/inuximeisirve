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
  $userId = $data['userId']; // Añadido para identificar al usuario
  $name = $data['name'];
  $phone = $data['phone'];

  $stmt = $conn->prepare("UPDATE users SET name = ?, phone = ? WHERE id = ?");
  $stmt->bind_param("ssi", $name, $phone, $userId);

  if ($stmt->execute()) {
      echo json_encode(['message' => 'Perfil actualizado']);
  } else {
      echo json_encode(['message' => 'Error al actualizar', 'error' => $conn->error]);
  }

  $stmt->close();
  $conn->close();
  ?>