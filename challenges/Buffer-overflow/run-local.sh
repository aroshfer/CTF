#!/usr/bin/env bash
# run_local.sh
# Run the vuln binary in a controlled way on the host (non-Docker).
#
# Usage:
#   sudo ./run_local.sh <participant-id>
# Example:
#   sudo ./run_local.sh user42
#
# This script:
# - uses a dedicated system user per participant (ctf_<id>) created on-demand
# - places the participant's flag at /home/ctf_<id>/flag.txt
# - runs the vuln binary as that dedicated user with resource limits (prlimit + timeout)
# - optionally blocks network access for that UID via iptables while binary runs
#
# REQUIREMENTS: run as root to create users and apply network rules. prlimit, timeout, and iptables required.

set -euo pipefail

if [ "$EUID" -ne 0 ]; then
  echo "Please run as root: sudo $0 <participant-id>"
  exit 2
fi

if [ $# -ne 1 ]; then
  echo "Usage: $0 <participant-id>"
  exit 2
fi

PART="$1"
USER="ctf_${PART}"
USER_HOME="/home/${USER}"
FLAG_SRC="./flag.txt"         # default flag in this folder (copy/replace per participant)
FLAG_DEST="${USER_HOME}/flag.txt"
BINARY_PATH="$(pwd)/vuln"    # expected vuln binary in current folder
TIMEOUT_SECONDS=300          # max run time for binary
MEM_LIMIT_BYTES=$((512*1024*1024))  # 512 MB

# 1) create user if not exists
if ! id "${USER}" >/dev/null 2>&1; then
  echo "[*] Creating system user: ${USER}"
  useradd -m -s /bin/bash "${USER}"
fi

# 2) prepare user's workspace
mkdir -p "${USER_HOME}"
chown "${USER}:${USER}" "${USER_HOME}"
# copy a participant-unique flag (you can also mount a per-user flag externally)
if [ -f "${FLAG_SRC}" ]; then
  cp -f "${FLAG_SRC}" "${FLAG_DEST}"
  chown root:root "${FLAG_DEST}"
  chmod 0400 "${FLAG_DEST}"   # readable only by root; see note below about challenge design
else
  echo "Warning: ${FLAG_SRC} not found. Create a flag file and re-run."
fi

# NOTE on permissions:
# - By making the flag owned by root and 0400, it's *not* directly readable by the unprivileged user.
# - The vulnerable binary will need to be able to open/read it to reveal it when exploited.
#   To follow the simplest model (like the Docker image), make the flag readable by the challenge user:
#     chown ${USER}:${USER} "${FLAG_DEST}" ; chmod 0400 "${FLAG_DEST}"
#   But that makes the flag trivially readable. For a basic learning lab you can set it to the challenge user.
#   Adjust according to your threat model.

# If you want the flag to be readable by the challenge user (common for simple CTF setups), do:
chown "${USER}:${USER}" "${FLAG_DEST}"
chmod 0400 "${FLAG_DEST}"

# 3) ensure binary exists and permissions are correct
if [ ! -x "${BINARY_PATH}" ]; then
  echo "[!] vuln binary not found or not executable at ${BINARY_PATH}. Build it first with 'make'."
  exit 3
fi

# Copy binary into user's directory to reduce path issues and to allow per-user variants.
cp -f "${BINARY_PATH}" "${USER_HOME}/vuln"
chown "${USER}:${USER}" "${USER_HOME}/vuln"
chmod 0500 "${USER_home}/vuln" 2>/dev/null || chmod 0500 "${USER_HOME}/vuln"

echo "[*] Prepared user ${USER}. Flag at ${FLAG_DEST}. Binary at ${USER_HOME}/vuln"

# 4) block network for that UID while running (optional but recommended)
echo "[*] Blocking network for UID of ${USER} during challenge run (iptables)."
UIDNUM="$(id -u "${USER}")"
# Save rule tokens so we can remove them later. We'll drop OUTPUT for this uid.
iptables -I OUTPUT -m owner --uid-owner "${UIDNUM}" -j DROP

# 5) run the binary as the user with limits
echo "[*] Running the binary as ${USER} with timeout ${TIMEOUT_SECONDS}s and memory limit ${MEM_LIMIT_BYTES} bytes."

sudo -u "${USER}" bash -c "cd ~ && /usr/bin/timeout --preserve-status ${TIMEOUT_SECONDS}s /usr/bin/prlimit --as=${MEM_LIMIT_BYTES} --cpu=${TIMEOUT_SECONDS} ./vuln"

EXIT_CODE=$?

# 6) cleanup - remove iptables rule we added
echo "[*] Cleaning up network rule."
iptables -D OUTPUT -m owner --uid-owner "${UIDNUM}" -j DROP || true

echo "[*] Challenge run finished with exit code ${EXIT_CODE}."
exit ${EXIT_CODE}
