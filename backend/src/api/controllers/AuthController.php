<?php
/**
 * AuthController — login simple contra la tabla EMP_USUARIOS.
 *
 * Si aún no existe esa tabla en tu data.fdb, créala así (por ejemplo desde
 * IBExpert / flamerobin, o vía prueba.php con una consulta CREATE TABLE):
 *
 *   CREATE TABLE EMP_USUARIOS (
 *       USUARIO       VARCHAR(50) NOT NULL PRIMARY KEY,
 *       PASSWORD_HASH VARCHAR(200) NOT NULL,
 *       NOMBRE        VARCHAR(100),
 *       ACTIVO        SMALLINT DEFAULT 1
 *   );
 *
 * Para generar el hash de una contraseña de prueba, ejecútalo con PHP:
 *   php -r "echo password_hash('123456', PASSWORD_BCRYPT), PHP_EOL;"
 * y guarda el resultado en PASSWORD_HASH.
 */
class AuthController
{
    public static function login(): void
    {
        $body = Request::jsonBody();
        $usuario = trim($body['usuario'] ?? '');
        $password = $body['password'] ?? '';

        if ($usuario === '' || $password === '') {
            Response::error('Usuario y contraseña son requeridos', 422);
        }

        $result = Database::call('usuarios_get_by_username', ['usuario' => $usuario]);

        if (!$result['success'] || empty($result['data'])) {
            Response::error('Usuario o contraseña incorrectos', 401);
        }

        $row = $result['data'][0];
        if (!password_verify($password, $row['PASSWORD_HASH'])) {
            Response::error('Usuario o contraseña incorrectos', 401);
        }

        $token = Jwt::encode([
            'sub'    => $row['USUARIO'],
            'nombre' => $row['NOMBRE'],
        ]);

        Response::json([
            'success'      => true,
            'access_token' => $token,
            'token_type'   => 'bearer',
            'usuario'      => $row['USUARIO'],
            'nombre'       => $row['NOMBRE'],
        ]);
    }
}
