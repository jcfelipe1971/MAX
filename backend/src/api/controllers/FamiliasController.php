<?php
/**
 * FamiliasController — CRUD de Familias de Artículos (ART_FAMILIAS).
 *
 * ART_FAMILIAS tiene clave compuesta (EMPRESA, FAMILIA):
 *   - EMPRESA: entero, lo elige el usuario en el frontend (multiempresa).
 *   - FAMILIA: varchar(5), código corto de la familia (ej. "ROPA1").
 *   - ID_FAMILIA: entero único, lo genera un trigger — nunca se manda.
 *
 * Casi todos los demás campos (MARGEN, TIPO_REDONDEO, TITULO_WEB,
 * DISPONIBILIDAD, SECCION, ORDEN...) tienen defaults o son recalculados
 * por los triggers BI0/BU0 de la tabla, así que aquí solo normalizamos
 * lo mínimo antes de pasarlo al puente Python.
 *
 * ESTA ES LA PLANTILLA a copiar para Artículos, Tarifas, Terceros, etc:
 *   1. Duplica este archivo -> ArticulosController.php
 *   2. Cambia los nombres de acción (articulos_list, articulos_get, ...)
 *   3. Agrega esas mismas acciones en src/db_bridge.py (ACTIONS)
 *   4. Crea el endpoint api/articulos.php (copiando api/familias.php)
 */
class FamiliasController
{
    public static function list(int $empresa): void
    {
        $result = Database::call('familias_list', ['empresa' => $empresa]);
        if (!$result['success']) {
            Response::error($result['error'] ?? 'Error al listar familias', 500);
        }
        Response::json(['success' => true, 'data' => $result['data']]);
    }

    public static function get(int $empresa, string $familia): void
    {
        $result = Database::call('familias_get', [
            'empresa' => $empresa,
            'familia' => $familia,
        ]);
        if (!$result['success']) {
            Response::error($result['error'] ?? 'Error al obtener la familia', 500);
        }
        if (empty($result['data'])) {
            Response::error('Familia no encontrada', 404);
        }
        Response::json(['success' => true, 'data' => $result['data'][0]]);
    }

    public static function create(): void
    {
        AuthMiddleware::check();
        $body = Request::jsonBody();

        foreach (['empresa', 'familia', 'titulo'] as $field) {
            if (!isset($body[$field]) || $body[$field] === '') {
                Response::error("El campo '{$field}' es requerido", 422);
            }
        }

        $empresa = (int) $body['empresa'];
        $familia = strtoupper(trim((string) $body['familia']));

        // Evita duplicados antes de insertar
        $existing = Database::call('familias_get', ['empresa' => $empresa, 'familia' => $familia]);
        if ($existing['success'] && !empty($existing['data'])) {
            Response::error('Ya existe una familia con ese código en esa empresa', 409);
        }

        $result = Database::call('familias_create', [
            'empresa'        => $empresa,
            'familia'        => $familia,
            'titulo'         => (string) $body['titulo'],
            'seccion'        => isset($body['seccion']) ? (string) $body['seccion'] : null,
            'web'            => (int) (bool) ($body['web'] ?? false),
            'titulo_web'     => (string) ($body['titulo_web'] ?? ''),
            'margen'         => (float) ($body['margen'] ?? 0),
            'disponibilidad' => (int) ($body['disponibilidad'] ?? 1),
            'orden'          => (int) ($body['orden'] ?? 0),
            'act_tar_autom'  => (int) (bool) ($body['act_tar_autom'] ?? false),
        ]);

        if (!$result['success']) {
            Response::error($result['error'] ?? 'Error al crear la familia', 500);
        }
        Response::json(['success' => true, 'empresa' => $empresa, 'familia' => $familia], 201);
    }

    public static function update(int $empresa, string $familia): void
    {
        AuthMiddleware::check();
        $body = Request::jsonBody();

        if (!isset($body['titulo']) || $body['titulo'] === '') {
            Response::error("El campo 'titulo' es requerido", 422);
        }

        $result = Database::call('familias_update', [
            'empresa'        => $empresa,
            'familia'        => $familia,
            'titulo'         => (string) $body['titulo'],
            'seccion'        => isset($body['seccion']) ? (string) $body['seccion'] : null,
            'web'            => (int) (bool) ($body['web'] ?? false),
            'titulo_web'     => (string) ($body['titulo_web'] ?? ''),
            'margen'         => (float) ($body['margen'] ?? 0),
            'disponibilidad' => (int) ($body['disponibilidad'] ?? 1),
            'orden'          => (int) ($body['orden'] ?? 0),
            'act_tar_autom'  => (int) (bool) ($body['act_tar_autom'] ?? false),
        ]);

        if (!$result['success']) {
            Response::error($result['error'] ?? 'Error al actualizar la familia', 500);
        }
        if (($result['affected'] ?? 0) === 0) {
            Response::error('Familia no encontrada', 404);
        }
        Response::json(['success' => true]);
    }

    public static function delete(int $empresa, string $familia): void
    {
        AuthMiddleware::check();

        $result = Database::call('familias_delete', [
            'empresa' => $empresa,
            'familia' => $familia,
        ]);
        if (!$result['success']) {
            Response::error($result['error'] ?? 'Error al eliminar la familia', 500);
        }
        if (($result['affected'] ?? 0) === 0) {
            Response::error('Familia no encontrada', 404);
        }
        Response::json(['success' => true]);
    }
}
