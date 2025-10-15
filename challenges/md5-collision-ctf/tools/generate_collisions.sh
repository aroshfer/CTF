#!/usr/bin/env bash
set -e


if command -v fastcoll >/dev/null 2>&1; then
echo "fastcoll found: generating colliding pair as coll1.bin coll2.bin"
fastcoll -o coll1.bin coll2.bin
echo "done. md5s:"
md5sum coll1.bin coll2.bin
else
echo "fastcoll not found. Please install fastcoll and place it in PATH."
echo "See tools/fastcoll-instructions.txt for instructions."
exit 1
fi