# Desarrollo local en Windows 10 → mismo código al hosting Linux

## Qué se cambió en el código

- `api/config.php`: `SRC_PATH` ya no es una ruta fija de Linux; se calcula
  sola con `dirname(__DIR__)`, así que apunta a la carpeta del proyecto
  esté donde esté (tu PC o el hosting). `PYTHON_BIN` e `IS_WINDOWS` se
  detectan solos según el sistema operativo.
- `api/core/Database.php`: arma el comando de shell con la sintaxis de
  Windows (`set VAR=... &&`) o de Linux (`VAR=... comando`) según toque.
- `db_bridge.py` / `conectar.py`: la ruta base se calcula con `__file__`
  (ya no está escrita a mano) y cargan `fbembed/win/fbclient.dll` en
  Windows o `fbembed/linux/libfbclient.so` en Linux.
- `fbembed/` ahora tiene dos subcarpetas: `linux/` (lo que ya tenías
  funcionando en el servidor) y `win/` (la creas tú, ver abajo).

Resultado: puedes subir la carpeta completa al hosting tal cual, sin
editar ninguna ruta a mano nunca más.

## Instalar en tu PC Windows 10

1. **Servidor Apache + PHP**: instala **Laragon** (más simple) o XAMPP.
   Copia esta carpeta del proyecto dentro de `www/` (Laragon) o
   `htdocs/` (XAMPP), por ejemplo como `www/max`.

2. **Python**: instala Python 3 de https://python.org (marca "Add to
   PATH" en el instalador). Usa la misma arquitectura que tu Windows
   (normalmente 64 bits). No necesitas instalar ningún paquete extra:
   `fdb` ya viene incluido en `python_libs/` y usa `ctypes`, sin
   dependencias.

3. **Firebird embebido para Windows**: sigue las instrucciones de
   `fbembed/win/LEEME.txt` (descargar el ZIP embedded de Firebird 5.0
   para Windows y copiar los .dll ahí).

4. **Base de datos**: copia tu `data.fdb` (una copia/backup de la real,
   no trabajes en local contra la de producción) a la raíz del proyecto,
   junto a `db_bridge.py`.

5. Abre `http://max.test/api/health.php` (Laragon) o
   `http://localhost/max/api/health.php` (XAMPP) en el navegador. Debe
   responder `{"success":true,...}`.

## Subir al hosting

Sube la carpeta tal cual (incluida `fbembed/linux/`, que ya tienes
funcionando). No hace falta tocar `config.php` ni ningún otro archivo:
las rutas y el sistema operativo se detectan solos.
