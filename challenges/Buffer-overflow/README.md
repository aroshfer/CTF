# Stack Beginner - Overflow 1

## Summary
This is a beginner buffer‑overflow challenge for an **isolated** CTF lab. The binary intentionally reads unbounded input into a fixed-size stack buffer. The learning objective is to understand stack layout and control-flow hijacking **in a safe, offline environment**.

**DO NOT** expose this binary to the public Internet. Run this only in containers/VMs on networks you control.

## Files
- `vuln.c` — vulnerable C source (educational)
- `Makefile` — builds the binary with mitigations disabled (CTF mode)
- `flag.txt` — contains the flag
- `Dockerfile` — builds a container used to run the challenge (see below)
- `run.sh` — entrypoint that runs the binary inside the container

## Build & run (locally)
1. Build:
   ```bash
   make
