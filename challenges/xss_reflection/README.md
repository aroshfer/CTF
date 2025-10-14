# XSS Reflection — Easy (CTF Challenge)


**Objective**: Trigger JavaScript execution in the victim's browser via reflected input. When you successfully cause an alert() (or otherwise demonstrate DOM control), submit the flag shown below.


**Flag**: `FLAG{reflected_xss_easy}`


**How the challenge works**
- The page reads the `q` query parameter and injects it into the DOM via `innerHTML` (no sanitization) — a classic reflected XSS pattern.
- The goal is to craft a payload that executes when the page is loaded or when the form is submitted.


**Hints**
1. Event handlers on tags (e.g. `<svg onload=...>`) and image onerror tricks work well when script tags are blocked.
2. You can use `javascript:` URIs in certain contexts and attribute-breaking payloads.
3. Try embedding small inline event handlers or SVG to bypass filters.


**Example payloads** (for testing only)
- `<script>alert('xss')</script>` — easiest, if allowed.
- `<img src=x onerror=alert('xss')>` — common bypass.
- `<svg onload=alert('xss')>` — works in many browsers.


**Setup**
1. Save `challenge.html` and (optionally) `server.js` in the same folder.
2. If using the server: `npm init -y && npm i express` then `node server.js`.
3. Open the page in a browser and try payloads using the search form or by editing the `q` parameter in the URL.


Good luck!