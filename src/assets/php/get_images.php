<?php
// get_images.php
require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    try {
        global $uploadDir, $baseImageUrl;
        $files = array_diff(scandir($uploadDir), array('.', '..'));
        $images = [];
        foreach ($files as $file) {
            $filePath = $uploadDir . $file;
            if (is_file($filePath)) {
                $images[] = [
                    'fileName' => $file,
                    'url' => $baseImageUrl . $file,
                    'size' => filesize($filePath),
                    'type' => mime_content_type($filePath),
                    'uploadDate' => date('Y-m-d H:i:s', filemtime($filePath))
                ];
            }
        }
        header('Content-Type: application/json');
        echo json_encode($images);
    } catch (Exception $e) {
        http_response_code(500);
        header('Content-Type: application/json');
        echo json_encode(['error' => $e->getMessage()]);
    }
}