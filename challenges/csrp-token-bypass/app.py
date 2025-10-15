# app.py — CSRF demo (hard + SQLi step)
# - Multi-piece secret: STATIC_SECRET prefix leaked via /info, suffix randomized at startup
# - Per-user numeric salt: only one digit leaked at /user-leak
# - Rate-limit on /transfer to prevent online brute-force
# - Vulnerable SQL endpoint /user-search?q=... that intentionally uses string formatting
#   — players must perform SQL injection to find a valid username to use in the flow.

from flask import Flask, render_template, request, session, redirect, url_for
import time
import hashlib
import secrets
import sqlite3
import os

app = Flask(__name__)
app.secret_key = secrets.token_hex(16)

# ---------- Difficulty / secret params ----------
SUFFIX_DIGITS = 4  # 10^4 possibilities for STATIC_SECRET suffix
SECRET_PREFIX = "challenge_static_secret_"
_secret_suffix = f"{secrets.randbelow(10**SUFFIX_DIGITS):0{SUFFIX_DIGITS}d}"
STATIC_SECRET = SECRET_PREFIX + _secret_suffix

USER_SALT_DIGITS = 3  # per-user salt length (10^3 possibilities)
SESSION_TRY_LIMIT = 3  # small server-side attempt limit
# ------------------------------------------------

# Simple filesystem sqlite DB for the SQLi step
DB_PATH = "ctf_users.db"


def init_db():
    """Create sqlite DB and prepopulate a users table with the usernames and salts."""
    first_time = not os.path.exists(DB_PATH)
    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()
    # Create table if not exists
    cur.execute(
        """
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        user_salt TEXT,
        notes TEXT
    )
    """
    )
    # Prepopulate known users if first run (instructor-visible)
    if first_time:
        users = [
            (
                "admin_alice_user",
                f"{secrets.randbelow(10**USER_SALT_DIGITS):0{USER_SALT_DIGITS}d}",
                "standard user",
            ),
            (
                "admin_@bob",
                f"{secrets.randbelow(10**USER_SALT_DIGITS):0{USER_SALT_DIGITS}d}",
                "standard user",
            ),
            (
                "attacker__34",
                f"{secrets.randbelow(10**USER_SALT_DIGITS):0{USER_SALT_DIGITS}d}",
                "attacker account",
            ),
        ]
        cur.executemany(
            "INSERT OR IGNORE INTO users(username,user_salt,notes) VALUES (?,?,?)",
            users,
        )
        conn.commit()
    conn.close()


# initialize DB at startup
init_db()


# Sync sqlite users into in-memory ACCOUNTS dict (so server uses consistent salts)
def load_accounts_from_db():
    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()
    cur.execute("SELECT username, user_salt FROM users")
    rows = cur.fetchall()
    conn.close()
    accs = {}
    for username, user_salt in rows:
        # Give the account an initial balance and record the salt
        accs[username] = {
            "balance": 1000 if username != "attacker" else 0,
            "user_salt": user_salt,
        }
    return accs


ACCOUNTS = load_accounts_from_db()

FLAG = "FLAG{csrf_039a3ba7c693cb53a015b30d8ce867d44ac46a53}"


def generate_csrf_token_for(static_secret, user_salt, when=None):
    """Token formula: sha1( str(int(time.time()) // 60) + static_secret + user_salt )"""
    if when is None:
        when = int(time.time())
    minute_component = str(when // 60)
    combined = minute_component + static_secret + user_salt
    return hashlib.sha1(combined.encode()).hexdigest()


def generate_csrf_token(user, when=None):
    return generate_csrf_token_for(
        STATIC_SECRET, ACCOUNTS[user]["user_salt"], when=when
    )


# ----------------- Routes -----------------


@app.route("/")
def index():
    return render_template("login.html")


@app.route("/login", methods=["POST"])
def login():
    username = request.form.get("username") or ""
    if username not in ACCOUNTS:
        # For realism we return generic message; players must discover valid usernames via SQLi.
        return (
            "Unknown user. If you don't know a username, try the user-search endpoint.",
            400,
        )
    session["user"] = username
    session["transfer_tries"] = 0
    return redirect(url_for("account"))


@app.route("/account")
def account():
    user = session.get("user")
    if not user:
        return redirect(url_for("index"))
    token = generate_csrf_token(user)
    balance = ACCOUNTS.get(user, {}).get("balance", 0)
    return render_template("account.html", user=user, balance=balance, csrf_token=token)


@app.route("/transfer", methods=["GET", "POST"])
def transfer():
    user = session.get("user")
    if not user:
        return redirect(url_for("index"))

    tries = session.get("transfer_tries", 0)
    if tries >= SESSION_TRY_LIMIT:
        return "Too many transfer attempts in this session. Try again later.", 429

    if request.method == "GET":
        token = generate_csrf_token(user)
        return render_template("transfer.html", csrf_token=token)

    req_token = request.form.get("csrf_token", "")
    session["transfer_tries"] = tries + 1

    if req_token != generate_csrf_token(user):
        return "Invalid CSRF token", 400

    to = request.form.get("to")
    try:
        amount = int(request.form.get("amount") or 0)
    except ValueError:
        return "Invalid amount", 400

    if ACCOUNTS.get(user, {}).get("balance", 0) < amount:
        return "Insufficient funds", 400

    ACCOUNTS[user]["balance"] -= amount
    ACCOUNTS.setdefault(to, {}).setdefault("balance", 0)
    ACCOUNTS[to]["balance"] += amount

    if to == "attacker":
        return render_template("success.html", flag=FLAG)
    return render_template("success.html", flag=None)


# ----------------- Vulnerable SQL endpoint -----------------
@app.route("/user-search")
def user_search():
    """
    Intentionally vulnerable endpoint:
    Example usage: /user-search?q=ali
    Vulnerable query (DO NOT DO THIS IN REAL APPS):
        SELECT username, notes FROM users WHERE username LIKE '%{q}%';
    Players should exploit SQL injection here to enumerate or discover usernames.
    """
    q = request.args.get("q", "")
    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()
    # --------- VULNERABLE: direct string formatting into SQL ---------
    # This is intentionally insecure for the CTF challenge.
    vulnerable_sql = f"SELECT username, notes FROM users WHERE username LIKE '%{q}%';"
    try:
        cur.execute(vulnerable_sql)
        rows = cur.fetchall()
    except Exception as e:
        rows = [("SQL error", str(e))]
    conn.close()

    # Render a simple HTML list of results so players can see what they extracted.
    html = "<h3>User search results (vulnerable)</h3>"
    html += f"<p>Query used (unsafe):<br><code>{vulnerable_sql}</code></p>"
    if rows:
        html += "<ul>"
        for r in rows:
            html += f"<li>{r[0]} — {r[1]}</li>"
        html += "</ul>"
    else:
        html += "<p>No results.</p>"
    html += "<p>Hint: try SQL injection payloads in the <code>q</code> parameter.</p>"
    return html


# ----------------- Info/leak endpoints -----------------
@app.route("/info")
def info():
    """Leaked: only the prefix of STATIC_SECRET."""
    return (
        "<h3>Server info</h3>"
        f"<p>STATIC_SECRET prefix (leaked): <code>{SECRET_PREFIX}</code></p>"
        "<p>Suffix is randomized at startup and not shown here.</p>"
    )


@app.route("/user-leak")
def user_leak():
    """Leaked: only one digit of the logged-in user's salt (last digit)."""
    user = session.get("user")
    if not user:
        return redirect(url_for("index"))
    user_salt = ACCOUNTS[user]["user_salt"]
    leaked_digit = user_salt[-1]
    return (
        f"<h3>User info (partial)</h3>"
        f"<p>User: <strong>{user}</strong></p>"
        f"<p>Leaked digit of user_salt: <code>{leaked_digit}</code> (only one digit shown)</p>"
        "<p>Combine this with /info to brute force the rest offline.</p>"
    )


@app.route("/hint")
def hint():
    return (
        "<h3>Hint</h3>"
        "<p>Token formula: sha1( str(int(time.time()) // 60) + STATIC_SECRET + user_salt )</p>"
        "<p>/info leaks the STATIC_SECRET prefix. /user-leak shows a single digit of the user's salt.</p>"
        "<p>Use /user-search?q=... to discover valid usernames (SQL injection allowed in the query parameter).</p>"
    )


# ----------------- Startup debug prints -----------------
if __name__ == "__main__":
    print("DEBUG: full STATIC_SECRET (instructor only):", STATIC_SECRET)
    print("DEBUG: Accounts loaded from DB:")
    for u, v in ACCOUNTS.items():
        print(f"  user={u} user_salt={v['user_salt']} balance={v['balance']}")
    print("DEBUG: SQLite DB path:", DB_PATH)
    app.run(port=5000, debug=True)
