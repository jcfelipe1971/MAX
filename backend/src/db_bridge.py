"""
db_bridge.py — Capa de acceso a datos.

Este script NO se llama desde el navegador. Apache no ejecuta .py aquí
(se descargan como texto), así que este archivo solo se invoca desde PHP
con shell_exec (ver api/core/Database.php).

Diseño de seguridad importante:
  - Nunca se recibe SQL libre desde fuera. Cada "acción" es una consulta
    FIJA y PARAMETRIZADA (placeholders ?), definida en ACTIONS.
  - Los parámetros llegan como JSON (segundo argumento) y se bindéan con
    fdb, NUNCA se concatenan al texto del SQL. Esto evita inyección SQL
    incluso si el dato del usuario viene "sucio" desde el frontend.
  - Para agregar un endpoint nuevo (ej. artículos), solo agregas una
    entrada en ACTIONS. No hay que tocar nada más de este archivo.

Uso:
    python3 db_bridge.py <accion> '<json_de_parametros>'

Salida (siempre JSON por stdout, incluso en error):
    {"success": true,  "data": [...]}                 -> SELECT
    {"success": true,  "affected": 1}                  -> INSERT/UPDATE/DELETE
    {"success": false, "error": "mensaje"}              -> error
"""
import sys
import os
import json

# Se calcula sola a partir de la ubicación real de este archivo, así que
# funciona igual en local (Windows) y en el hosting (Linux) sin editar nada.
BASE = os.path.dirname(os.path.abspath(__file__)) + os.sep

# fbembed/linux (.so) para el hosting, fbembed/win (.dll) para tu PC.
_subdir = 'win' if sys.platform == 'win32' else 'linux'
FB_DIR = os.path.join(BASE, 'fbembed', _subdir) + os.sep

os.environ['FIREBIRD'] = FB_DIR
if sys.platform == 'win32':
    os.environ['PATH'] = FB_DIR + os.pathsep + os.environ.get('PATH', '')
    _fb_lib = FB_DIR + 'fbclient.dll'
else:
    os.environ['LD_LIBRARY_PATH'] = FB_DIR
    _fb_lib = FB_DIR + 'libfbclient.so'

sys.path.insert(0, BASE + 'python_libs')
import fdb  # noqa: E402

fdb.load_api(_fb_lib)


# ---------------------------------------------------------------------------
# Catálogo de acciones permitidas: nombre -> (sql, [orden de parámetros])
# Ajusta/agrega aquí cuando crees nuevos módulos (artículos, tarifas, ...).
# Los nombres de columna/tabla deben coincidir EXACTO con tu esquema Firebird.
# ---------------------------------------------------------------------------
ACTIONS = {
    "health": (
        "SELECT 1 AS OK FROM RDB$DATABASE", []
    ),

    # --- Familias de artículos (ART_FAMILIAS) ---
    # PK real: (EMPRESA, FAMILIA). FAMILIA es VARCHAR(5), no un entero.
    # ID_FAMILIA, UN_DIGITO..CUATRO_DIGITOS, ULT_MODIFICACION y buena parte
    # de los defaults (MARGEN, TIPO_REDONDEO, TITULO_WEB, DISPONIBILIDAD,
    # SECCION, ORDEN, TIPO_PRECIO_BASE) los calculan los triggers BI0/BU0 de
    # ART_FAMILIAS: no hace falta ni conviene mandarlos desde aquí.
    "familias_list": (
        "SELECT EMPRESA, FAMILIA, TITULO, ID_FAMILIA, SECCION, WEB, TITULO_WEB, "
        "MARGEN, DISPONIBILIDAD, ORDEN, ACT_TAR_AUTOM "
        "FROM ART_FAMILIAS WHERE EMPRESA = ? ORDER BY ORDEN, FAMILIA", ["empresa"]
    ),
    "familias_get": (
        "SELECT EMPRESA, FAMILIA, TITULO, ID_FAMILIA, SECCION, WEB, TITULO_WEB, "
        "MARGEN, DISPONIBILIDAD, ORDEN, ACT_TAR_AUTOM "
        "FROM ART_FAMILIAS WHERE EMPRESA = ? AND FAMILIA = ?", ["empresa", "familia"]
    ),
    "familias_create": (
        "INSERT INTO ART_FAMILIAS (EMPRESA, FAMILIA, TITULO, SECCION, WEB, "
        "TITULO_WEB, MARGEN, DISPONIBILIDAD, ORDEN, ACT_TAR_AUTOM) "
        "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        ["empresa", "familia", "titulo", "seccion", "web", "titulo_web",
         "margen", "disponibilidad", "orden", "act_tar_autom"]
    ),
    "familias_update": (
        "UPDATE ART_FAMILIAS SET TITULO = ?, SECCION = ?, WEB = ?, TITULO_WEB = ?, "
        "MARGEN = ?, DISPONIBILIDAD = ?, ORDEN = ?, ACT_TAR_AUTOM = ? "
        "WHERE EMPRESA = ? AND FAMILIA = ?",
        ["titulo", "seccion", "web", "titulo_web", "margen", "disponibilidad",
         "orden", "act_tar_autom", "empresa", "familia"]
    ),
    "familias_delete": (
        "DELETE FROM ART_FAMILIAS WHERE EMPRESA = ? AND FAMILIA = ?",
        ["empresa", "familia"]
    ),

    # --- Usuarios (login) ---
    "usuarios_get_by_username": (
        "SELECT USUARIO, PASSWORD_HASH, NOMBRE "
        "FROM EMP_USUARIOS WHERE USUARIO = ? AND ACTIVO = 1", ["usuario"]
    ),
}

SELECT_ACTIONS = {name for name, (sql, _) in ACTIONS.items() if sql.strip().upper().startswith("SELECT")}


def fail(message: str, code: int = 1):
    print(json.dumps({"success": False, "error": message}, ensure_ascii=False))
    sys.exit(code)


def main():
    if len(sys.argv) < 2:
        fail("Falta el nombre de la acción")

    action = sys.argv[1]
    raw_params = sys.argv[2] if len(sys.argv) > 2 else "{}"

    if action not in ACTIONS:
        fail(f"Acción no permitida: {action}")

    try:
        params = json.loads(raw_params)
    except json.JSONDecodeError:
        fail("Parámetros no son JSON válido")

    sql, param_order = ACTIONS[action]
    try:
        values = tuple(params[p] for p in param_order)
    except KeyError as e:
        fail(f"Falta el parámetro requerido: {e}")

    try:
        con = fdb.connect(dsn=BASE + 'data.fdb', user='SYSDBA', password='masterkey')
    except Exception as e:
        fail(f"Error de conexión a Firebird: {e}")

    try:
        cur = con.cursor()
        cur.execute(sql, values)

        if action in SELECT_ACTIONS:
            cols = [d[0] for d in cur.description]
            rows = [dict(zip(cols, r)) for r in cur.fetchall()]
            print(json.dumps({"success": True, "data": rows}, default=str, ensure_ascii=False))
        else:
            con.commit()
            print(json.dumps({"success": True, "affected": cur.rowcount}, ensure_ascii=False))
    except Exception as e:
        con.rollback()
        fail(f"Error ejecutando la acción: {e}")
    finally:
        con.close()


if __name__ == "__main__":
    main()
