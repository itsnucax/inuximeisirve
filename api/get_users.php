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

  $result = $conn->query("SELECT id, username, email, credits, role FROM users");
  $users = $result->fetch_all(MYSQLI_ASSOC);

  echo json_encode(['users' => $users]);

  $conn->close();
  ?>