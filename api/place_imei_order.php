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
$para = [
    'IMEI' => $data['imei'] ?? '',
    'ID' => $data['serviceId'] ?? ''
    // Opcionales: descomenta y ajusta si son requeridos
    // 'MODELID' => $data['modelId'] ?? '',
    // 'PROVIDERID' => $data['providerId'] ?? '',
    // 'MEP' => $data['mep'] ?? '',
    // 'PIN' => $data['pin'] ?? '',
    // 'KBH' => $data['kbh'] ?? '',
    // 'PRD' => $data['prd'] ?? '',
    // 'TYPE' => $data['type'] ?? '',
    // 'REFERENCE' => $data['reference'] ?? '',
    // 'LOCKS' => $data['locks'] ?? ''
];

if (!$para['IMEI'] || !$para['ID']) {
    echo json_encode(['message' => 'Faltan parámetros requeridos (IMEI o ID)']);
    exit;
}

$request = $api->action('placeimeiorder', $para);
echo json_encode($request);
?>