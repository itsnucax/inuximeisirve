<?php
/**
 * @author Dhru.com (adaptado)
 * @APi kit version 2.0 (modificado)
 */

require ('header.php');
include ('dhrufusionapi.class.php');
define("REQUESTFORMAT", "JSON");
define('DHRUFUSION_URL', "https://team-gaby.com/");
define("USERNAME", "itsnucax");
define("API_ACCESS_KEY", "T94-7AQ-TZR-TBL-SDK-PAC-MX3-MZX");

$api = new DhruFusion();
$api->debug = true;

$data = json_decode(file_get_contents('php://input'), true);
$para = ['ID' => $data['orderId'] ?? ''];

if (!$para['ID']) {
    echo json_encode(['message' => 'Falta el parámetro orderId']);
    exit;
}

$request = $api->action('getimeiorder', $para);
echo json_encode($request);
?>