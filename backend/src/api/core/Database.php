<?php
/**
 * Database — puente hacia db_bridge.py.
 *
 * Nunca construye SQL aquí. Solo envía el nombre de una "acción"
 * (ya definida y parametrizada dentro de db_bridge.py) más un array
 * de parámetros, que se serializan a JSON y se pasan de forma segura
 * (escapeshellarg) al proceso Python.
 */
class Database
{
    /**
     * @param string $action  Nombre de la acción registrada en db_bridge.py
     * @param array  $params  Parámetros nombrados que espera esa acción
     * @return array          ['success'=>bool, 'data'=>[...] | 'affected'=>int | 'error'=>string]
     */
        public static function call(string $action, array $params = []): array
    {
        $fbDir = SRC_PATH . 'fbembed' . (IS_WINDOWS ? DIRECTORY_SEPARATOR . 'win' : DIRECTORY_SEPARATOR . 'linux');
        $bridge = SRC_PATH . 'db_bridge.py';
        $json = json_encode($params, JSON_UNESCAPED_UNICODE);

        // Configuramos las variables de entorno
        putenv("FIREBIRD=$fbDir");
        if (IS_WINDOWS) {
            putenv("PATH=$fbDir;" . getenv("PATH"));
        } else {
            putenv("LD_LIBRARY_PATH=$fbDir");
        }

        // Construimos el comando
        $cmd = sprintf('%s %s %s', PYTHON_BIN, escapeshellarg($bridge), escapeshellarg($action));

        // Usamos proc_open para poder pasar el JSON por stdin
        $descriptors = [
            0 => ["pipe", "r"],  // stdin
            1 => ["pipe", "w"],  // stdout
            2 => ["pipe", "w"],  // stderr
        ];

        $process = proc_open($cmd, $descriptors, $pipes);

        if (is_resource($process)) {
            // Escribimos el JSON en stdin
            fwrite($pipes[0], $json);
            fclose($pipes[0]);

            // Leemos la salida
            $out = stream_get_contents($pipes[1]);
            fclose($pipes[1]);

            // Leemos errores si los hay
            $err = stream_get_contents($pipes[2]);
            fclose($pipes[2]);

            proc_close($process);

            $data = json_decode((string) $out, true);

            if ($data === null) {
                return [
                    'success' => false,
                    'error' => 'Respuesta inválida del motor de datos',
                    'raw' => $out . ($err ? "\n\nErrores:\n" . $err : ''),
                ];
            }
            return $data;
        }

        return [
            'success' => false,
            'error' => 'No se pudo iniciar el proceso Python',
        ];
    }
}
