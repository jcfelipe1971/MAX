<?php
require_once __DIR__ . '/config.php';
require_once __DIR__ . '/core/Database.php';

echo "<h3>Probando consulta real: Listar Familias</h3>";

// Llamamos a la acción 'familias_list' definida en db_bridge.py
// (Cambia '1' por el código de empresa que uses en tu base de datos)
$resultado = Database::call('familias_list', ['empresa' => '1']);

echo "<pre>";
print_r($resultado);
echo "</pre>";

if ($resultado['success']) {
    echo "<p style='color: green;'>Se encontraron " . count($resultado['data']) . " familias en la base de datos.</p>";
} else {
    echo "<p style='color: red;'>Error: " . $resultado['error'] . "</p>";
}
?>