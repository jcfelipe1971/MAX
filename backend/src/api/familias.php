<?php
/**
 * /api/familias.php — REST de Familias de Artículos (ART_FAMILIAS).
 *
 * ART_FAMILIAS es multiempresa: EMPRESA es obligatorio en todas las
 * operaciones (lo elige el usuario en el frontend). FAMILIA es el código
 * corto de texto (no un id numérico).
 *
 *   GET    /api/familias.php?empresa=1                      -> listar
 *   GET    /api/familias.php?empresa=1&familia=ROPA1         -> obtener una
 *   POST   /api/familias.php                                  -> crear   (Authorization: Bearer, body incluye empresa+familia)
 *   PUT    /api/familias.php?empresa=1&familia=ROPA1         -> actualizar (Authorization: Bearer)
 *   DELETE /api/familias.php?empresa=1&familia=ROPA1         -> eliminar (Authorization: Bearer)
 */
require_once __DIR__ . '/bootstrap.php';

$empresaParam = Request::query('empresa');
$familia = Request::query('familia');

switch (Request::method()) {
    case 'GET':
        if ($empresaParam === null) {
            Response::error("Falta el parámetro 'empresa'", 422);
        }
        $empresa = (int) $empresaParam;

        if ($familia !== null) {
            FamiliasController::get($empresa, $familia);
        } else {
            FamiliasController::list($empresa);
        }
        break;

    case 'POST':
        FamiliasController::create();
        break;

    case 'PUT':
        if ($empresaParam === null || $familia === null) {
            Response::error("Faltan los parámetros 'empresa' y 'familia'", 422);
        }
        FamiliasController::update((int) $empresaParam, $familia);
        break;

    case 'DELETE':
        if ($empresaParam === null || $familia === null) {
            Response::error("Faltan los parámetros 'empresa' y 'familia'", 422);
        }
        FamiliasController::delete((int) $empresaParam, $familia);
        break;

    default:
        Response::error('Método no permitido', 405);
}
