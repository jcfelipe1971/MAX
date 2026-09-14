import sys, os, json

base = os.path.dirname(os.path.abspath(__file__)) + os.sep
_subdir = 'win' if sys.platform == 'win32' else 'linux'
fb = os.path.join(base, 'fbembed', _subdir) + os.sep

os.environ['FIREBIRD'] = fb
if sys.platform == 'win32':
    os.environ['PATH'] = fb + os.pathsep + os.environ.get('PATH', '')
    _fb_lib = fb + 'fbclient.dll'
else:
    os.environ['LD_LIBRARY_PATH'] = fb
    _fb_lib = fb + 'libfbclient.so'

sys.path.insert(0, base + 'python_libs')
import fdb

fdb.load_api(_fb_lib)

con = fdb.connect(
    dsn=base + 'data.fdb',
    user='SYSDBA',
    password='masterkey'
)
cur = con.cursor()
sql = sys.argv[1] if len(sys.argv) > 1 else \
    "SELECT rdb$relation_name FROM rdb$relations WHERE rdb$view_blr IS NULL AND rdb$system_flag=0"
cur.execute(sql)
cols = [d[0] for d in cur.description]
rows = [dict(zip(cols, r)) for r in cur.fetchall()]
print(json.dumps(rows, default=str, ensure_ascii=False))
con.close()