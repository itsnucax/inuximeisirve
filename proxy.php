<?php
require 'config.php';
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

$targetUrl = "https://team-gaby.com/api/index.php";
$data = json_decode(file_get_contents('php://input'), true);

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

$options = [
    'http' => [
        'method' => 'POST',
        'header' => "Content-Type: application/json\r\n" .
                    "Username: " . USERNAME . "\r\n" .
                    "Apiaccesskey: " . API_ACCESS_KEY . "\r\n" .
                    "Action: " . ($_POST['action'] ?? '') . "\r\n" .
                    "Requestformat: " . REQUESTFORMAT . "\r\n",
        'content' => json_encode($data),
        'ignore_errors' => true,
    ],
];

$context = stream_context_create($options);
$response = file_get_contents($targetUrl, false, $context);

if ($response === false) {
    echo json_encode(['error' => 'No se pudo conectar con la API de Dhru']);
} else {
    echo $response;
}
?>