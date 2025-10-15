from flask import Flask, request, render_template, jsonify
import hashlib
import os

app = Flask(__name__)
FLAG_PATH = os.path.join(os.path.dirname(__file__), 'flag.txt')
MAX_BYTES = 5 * 1024 * 1024  # 5 MB


def md5_bytes(data: bytes) -> str:
    """Return hex MD5 of bytes."""
    h = hashlib.md5()
    h.update(data)
    return h.hexdigest()


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/upload', methods=['POST'])
def upload():
    fileA = request.files.get('fileA')
    fileB = request.files.get('fileB')

    if not fileA or not fileB:
        return jsonify({'ok': False, 'err': 'Both files are required.'}), 400

    # read up to MAX_BYTES + 1 so we can detect oversize without reading infinite
    dataA = fileA.read(MAX_BYTES + 1)
    dataB = fileB.read(MAX_BYTES + 1)

    if len(dataA) > MAX_BYTES or len(dataB) > MAX_BYTES:
        return jsonify({'ok': False, 'err': 'Files must be <= 5 MB.'}), 400

    if dataA == dataB:
        return jsonify({'ok': False, 'err': 'Files are identical. Must be different.'}), 400

    hashA = md5_bytes(dataA)
    hashB = md5_bytes(dataB)

    if hashA != hashB:
        return jsonify({'ok': False, 'err': f'Checksums differ: md5(A)={hashA}, md5(B)={hashB}'}), 400

    # return flag if both files are different but have same MD5
    try:
        with open(FLAG_PATH, 'r', encoding='utf-8') as f:
            flag = f.read().strip()
    except FileNotFoundError:
        return jsonify({'ok': False, 'err': 'Flag not found on server.'}), 500

    return jsonify({'ok': True, 'flag': flag})


if __name__ == '__main__':
    # in production do not use debug=True
    app.run(host='0.0.0.0', port=5000, debug=True)
