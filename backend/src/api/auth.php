<?php
/**
 * POST /api/auth.php
 * Body JSON: {"usuario": "...", "password": "..."}
 * Devuelve: {"access_token": "...", "token_type": "bearer", ...}
 */
require_once __DIR__ . '/bootstrap.php';

if (Request::method() !== 'POST') {
    Response::error('Método no permitido, usa POST', 405);
}

AuthController::login();
