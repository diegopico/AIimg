<?php
// upload.php
require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        $entityId = $_POST['entityId'] ?? '';
        $productIds = isset($_POST['productIds']) ? $_POST['productIds'] : null;
        if (empty($entityId) && empty($productIds)) {
            throw new Exception('Entity ID or productIds is required');
        }
        // Si productIds es un string JSON, decodificarlo
        if (is_string($productIds)) {
            $productIds = json_decode($productIds, true);
        }
        // Si no hay productIds, usar entityId como array
        if (!$productIds) {
            $productIds = [$entityId];
        }

        $uploadedImages = [];
        global $uploadDir;
        global $baseImageUrl;
        // $uploadDir = '../uploads/'; // Directorio donde se guardarán las imágenes (ahora global)
        
        // Crear el directorio si no existe
        if (!file_exists($uploadDir)) {
            mkdir($uploadDir, 0777, true);
        }

        // Procesar cada archivo subido
        foreach ($_FILES['files']['tmp_name'] as $key => $tmp_name) {
            $fileName = $_FILES['files']['name'][$key];
            $fileType = $_FILES['files']['type'][$key];
            $fileSize = $_FILES['files']['size'][$key];
            // Generar nombre único para el archivo
            $uniqueFileName = time() . '_' . $fileName;
            $targetPath = $uploadDir . $uniqueFileName;
            // Mover el archivo
            if (move_uploaded_file($tmp_name, $targetPath)) {
                $uploadedImages[] = [
                    'fileName' => $fileName,
                    'url' => $baseImageUrl . $uniqueFileName,
                    'size' => $fileSize,
                    'type' => $fileType,
                    'uploadDate' => date('Y-m-d H:i:s')
                ];
            }
        }
        header('Content-Type: application/json');
        echo json_encode($uploadedImages);
        
    } catch (Exception $e) {
        http_response_code(500);
        header('Content-Type: application/json');
        echo json_encode(['error' => $e->getMessage()]);
    }
}