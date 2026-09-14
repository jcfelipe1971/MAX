<?php
/**
 * GET /api/health.php
 * Útil para el widget "Estado de API / REST Service" del panel izquierdo
 * del frontend: confirma que PHP puede invocar Python y que Firebird responde.
 */
require_once __DIR__ . '/bootstrap.php';

$result = Database::call('health');

Response::json([
    'api'      => 'online',
    'firebird' => $result['success'] ? 'conectado' : 'error',
    'detalle'  => $result['success'] ? null : ($result['error'] ?? $result['raw'] ?? null),
]);
