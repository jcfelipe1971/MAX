<?php
/**
 * AuthMiddleware — protege endpoints de escritura (crear/editar/borrar).
 * Uso dentro de un endpoint:
 *     $user = AuthMiddleware::check(); // corta la petición con 401 si falla
 */
class AuthMiddleware
{
    public static function check(): array
    {
        $token = Request::bearerToken();
        if (!$token) {
            Response::error('Falta el token de autenticación', 401);
        }

        $payload = Jwt::decode($token);
        if ($payload === null) {
            Response::error('Token inválido o expirado', 401);
        }

        return $payload;
    }
}
