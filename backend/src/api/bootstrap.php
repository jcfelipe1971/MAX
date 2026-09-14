<?php
/**
 * bootstrap.php — se incluye al inicio de CADA endpoint (familias.php, auth.php...).
 * Centraliza: carga de config, autoload de clases, CORS y manejo de preflight.
 */

require_once __DIR__ . '/config.php';

spl_autoload_register(function ($class) {
    $paths = [
        __DIR__ . '/core/' . $class . '.php',
        __DIR__ . '/controllers/' . $class . '.php',
    ];
    foreach ($paths as $path) {
        if (file_exists($path)) {
            require_once $path;
            return;
        }
    }
});

// ---- CORS ----
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (in_array($origin, CORS_ORIGINS, true)) {
    header("Access-Control-Allow-Origin: {$origin}");
}
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Allow-Credentials: true');

// El navegador manda OPTIONS antes de PUT/DELETE/POST con headers custom.
// Respondemos vacío y cortamos aquí, antes de tocar la base de datos.
if (Request::method() === 'OPTIONS') {
    http_response_code(204);
    exit;
}
