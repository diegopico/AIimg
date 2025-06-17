<?php
// delete_image.php
require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    try {
        $fileName = $_GET['fileName'] ?? '';
        if (empty($fileName)) {
            throw new Exception('File name is required');
        }
        global $uploadDir;
        $filePath = $uploadDir . $fileName;
        if (file_exists($filePath)) {
            unlink($filePath);
            header('Content-Type: application/json');
            echo json_encode(['success' => true]);
        } else {
            throw new Exception('File not found');
        }
    } catch (Exception $e) {
        http_response_code(500);
        header('Content-Type: application/json');
        echo json_encode(['error' => $e->getMessage()]);
    }
}