<?php
function consultaFirebird($sql) {
    $isWin  = stripos(PHP_OS, 'WIN') === 0;
    $python = $isWin ? 'python' : 'python3';
    $base   = __DIR__ . DIRECTORY_SEPARATOR;
    $fb     = $base . 'fbembed' . DIRECTORY_SEPARATOR . ($isWin ? 'win' : 'linux');

    if ($isWin) {
        $cmd = "set \"FIREBIRD={$fb}\" && set \"PATH={$fb};%PATH%\" && {$python} {$base}conectar.py "
             . escapeshellarg($sql) . " 2>&1";
    } else {
        $cmd = "LD_LIBRARY_PATH={$fb} FIREBIRD={$fb} {$python} {$base}conectar.py "
             . escapeshellarg($sql) . " 2>&1";
    }
    $out = shell_exec($cmd);
    $data = json_decode($out, true);
    return $data !== null ? $data : $out;
}

echo "<pre>";
print_r(consultaFirebird("SELECT * FROM EMP_CLIENTES"));
echo "</pre>";