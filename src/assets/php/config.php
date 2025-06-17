<?php
// CORS Headers
header('Access-Control-Allow-Origin: http://localhost:4200');
header('Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Allow-Credentials: true');

// Si es una solicitud OPTIONS (preflight), terminar aquí
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Configuración de la base de datos
$db_config = [
    'host' => 'localhost',
    'dbname' => 'up_imagen',
    'username' => 'root',
    'password' => ''
];

// URL base global para las imágenes
$baseImageUrl = './assets/uploads/'; // Ajusta esta ruta si tus imágenes están en otro directorio

// Directorio global donde se guardarán las imágenes (relativo a este script)
$uploadDir = '../uploads/';

// Función para conectar a la base de datos
function connectDB() {
    global $db_config;
    try {
        $pdo = new PDO(
            "mysql:host={$db_config['host']};dbname={$db_config['dbname']};charset=utf8",
            $db_config['username'],
            $db_config['password']
        );
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        return $pdo;
    } catch(PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Error de conexión a la base de datos']);
        exit;
    }
}