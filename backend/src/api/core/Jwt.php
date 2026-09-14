<?php
/**
 * Jwt — implementación mínima de JWT (HS256), sin librerías externas.
 * No necesitamos Composer/SSH para instalar nada: solo funciones nativas
 * de PHP (hash_hmac, base64).
 */
class Jwt
{
    private static function base64UrlEncode(string $data): string
    {
        return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
    }

    private static function base64UrlDecode(string $data): string
    {
        $pad = strlen($data) % 4;
        if ($pad) {
            $data .= str_repeat('=', 4 - $pad);
        }
        return base64_decode(strtr($data, '-_', '+/'));
    }

    public static function encode(array $payload): string
    {
        $header = ['alg' => 'HS256', 'typ' => 'JWT'];
        $payload['iat'] = time();
        $payload['exp'] = time() + JWT_TTL_SECONDS;

        $segments = [
            self::base64UrlEncode(json_encode($header)),
            self::base64UrlEncode(json_encode($payload)),
        ];
        $signingInput = implode('.', $segments);
        $signature = hash_hmac('sha256', $signingInput, JWT_SECRET, true);
        $segments[] = self::base64UrlEncode($signature);

        return implode('.', $segments);
    }

    /**
     * Devuelve el payload (array) si el token es válido y no expiró,
     * o null si es inválido/expirado.
     */
    public static function decode(string $token): ?array
    {
        $parts = explode('.', $token);
        if (count($parts) !== 3) {
            return null;
        }
        [$headerB64, $payloadB64, $sigB64] = $parts;

        $signingInput = $headerB64 . '.' . $payloadB64;
        $expectedSig = hash_hmac('sha256', $signingInput, JWT_SECRET, true);
        $actualSig = self::base64UrlDecode($sigB64);

        if (!hash_equals($expectedSig, $actualSig)) {
            return null; // firma inválida -> token manipulado o de otra clave
        }

        $payload = json_decode(self::base64UrlDecode($payloadB64), true);
        if (!is_array($payload)) {
            return null;
        }
        if (isset($payload['exp']) && time() > $payload['exp']) {
            return null; // expirado
        }
        return $payload;
    }
}
