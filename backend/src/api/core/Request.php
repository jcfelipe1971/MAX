<?php
/**
 * Request — helpers para leer la petición HTTP entrante.
 */
class Request
{
    public static function method(): string
    {
        return $_SERVER['REQUEST_METHOD'] ?? 'GET';
    }

    /** Lee y decodifica el body JSON (para POST/PUT). Devuelve [] si no hay body. */
    public static function jsonBody(): array
    {
        $raw = file_get_contents('php://input');
        if (!$raw) {
            return [];
        }
        $data = json_decode($raw, true);
        return is_array($data) ? $data : [];
    }

    /** Devuelve el valor de un query param (?codigo=10), o null. */
    public static function query(string $key)
    {
        return $_GET[$key] ?? null;
    }

    /** Extrae el token del header Authorization: Bearer xxx */
    public static function bearerToken(): ?string
    {
        $header = $_SERVER['HTTP_AUTHORIZATION'] ?? '';

        if (!$header && function_exists('apache_request_headers')) {
            $headers = apache_request_headers();
            $header = $headers['Authorization'] ?? '';
        }

        if (preg_match('/Bearer\s+(\S+)/i', $header, $m)) {
            return $m[1];
        }
        return null;
    }
}
