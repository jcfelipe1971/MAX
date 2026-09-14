<?php
/**
 * Configuración central. Cambia aquí rutas y claves — nunca las repitas
 * dentro de los controladores.
 */

// Ruta absoluta donde está data.fdb, fbembed/, python_libs/ y db_bridge.py.
// Se calcula sola a partir de la ubicación real de este archivo (api/config.php
// vive un nivel por debajo de la raíz del proyecto), así que funciona igual
// en local (Windows) y en el hosting (Linux) sin tocar nada al subir.
define('SRC_PATH', dirname(__DIR__) . DIRECTORY_SEPARATOR);

// Binario de Python. En Windows normalmente es "python"; en el hosting
// Linux es "python3". Se detecta solo. Si en tu hosting `python3` no
// funciona, cambia aquí por la ruta completa que te devuelva `which python3`.
define('PYTHON_BIN', stripos(PHP_OS, 'WIN') === 0 ? 'python' : 'python3');

// true en Windows local, false en el hosting Linux. Lo usa Database.php
// para construir el comando de shell con la sintaxis correcta.
define('IS_WINDOWS', stripos(PHP_OS, 'WIN') === 0);

// Clave secreta para firmar los JWT. CAMBIA ESTO por algo largo y aleatorio
// antes de subir a producción. No la compartas ni la subas a git.
define('JWT_SECRET', 'CAMBIA-ESTA-CLAVE-POR-UNA-LARGA-Y-ALEATORIA-1234567890');
define('JWT_TTL_SECONDS', 8 * 60 * 60); // 8 horas

// Orígenes permitidos para CORS (tu frontend React). Agrega el dominio
// final donde publiques el frontend en producción.
define('CORS_ORIGINS', [
    'http://localhost:3000',
    'https://jksoft.neti.cu',
]);
