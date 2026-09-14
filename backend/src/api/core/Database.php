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
        // fbembed/linux tiene los .so para el hosting; fbembed/win tiene los
        // .dll para tu PC. db_bridge.py elige la carpeta correcta solo según
        // el sistema operativo en el que corre.
        $fbDir  = SRC_PATH . 'fbembed' . (IS_WINDOWS ? DIRECTORY_SEPARATOR . 'win' : DIRECTORY_SEPARATOR . 'linux');
        $bridge = escapeshellarg(SRC_PATH . 'db_bridge.py');
        $act    = escapeshellarg($action);
        $json   = escapeshellarg(json_encode($params, JSON_UNESCAPED_UNICODE));

        if (IS_WINDOWS) {
            // cmd.exe no entiende "VAR=valor comando"; hay que usar set && comando.
            // Se antepone fbDir al PATH para que Windows encuentre fbclient.dll.
            $cmd = sprintf(
                'set "FIREBIRD=%s" && set "PATH=%s;%%PATH%%" && %s %s %s %s 2>&1',
                $fbDir,
                $fbDir,
                PYTHON_BIN,
                $bridge,
                $act,
                $json
            );
        } else {
            $cmd = sprintf(
                'LD_LIBRARY_PATH=%s FIREBIRD=%s %s %s %s %s 2>&1',
                escapeshellarg($fbDir),
                escapeshellarg($fbDir),
                PYTHON_BIN,
                $bridge,
                $act,
                $json
            );
        }

        $out = shell_exec($cmd);
        $data = json_decode((string) $out, true);

        if ($data === null) {
            // El puente no devolvió JSON válido: probablemente un error
            // de PHP/Python no capturado (ruta incorrecta, permisos, etc.)
            return [
                'success' => false,
                'error'   => 'Respuesta inválida del motor de datos',
                'raw'     => $out,
            ];
        }

        return $data;
    }
}
