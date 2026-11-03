# Shubh Nimantran URL Shortener — Cloudflare Worker Deployment Guide

### Worker Details
- **Worker Endpoint**: `https://shubh-nimantran-shortener.goluraj1995.workers.dev/shorten`
- **HTTP Method**: `POST`
- **Authorized Production Origin**: `https://goluraj1995.github.io`
- **CORS Preflight**: Responds to `OPTIONS` with `204 No Content` and appropriate CORS headers.
- **CORS on Errors**: `400`, `403`, `404`, `405`, `500` all return JSON with matching CORS headers, allowing the browser and client app to read exact error messages instead of getting generic `Load failed` network errors.

---

### Step-by-Step Deployment on Cloudflare Dashboard:
1. Open your browser and go to: **[https://dash.cloudflare.com/](https://dash.cloudflare.com/)**
2. In the left-hand menu, navigate to **Compute (Workers) -> Workers & Pages**.
3. Click on your worker named: **`shubh-nimantran-shortener`**.
4. In the top-right corner, click **Edit code** (Quick Edit).
5. In the left editor pane, select the main script (e.g. `index.js` or `worker.js`) and replace all its contents with the code from:
   **`cloudflare-worker/worker.js`**
6. Click the blue **Deploy** (or **Save and Deploy**) button in the top right.
7. Wait 5 seconds for global deployment across Cloudflare edge locations.

---

### Verification:
After deploying, test from your terminal:
```bash
# Test 1: OPTIONS Preflight with live Origin
curl -i -X OPTIONS "https://shubh-nimantran-shortener.goluraj1995.workers.dev/shorten" \
  -H "Origin: https://goluraj1995.github.io" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type"

# Expected: HTTP/2 204 No Content with access-control-allow-origin: https://goluraj1995.github.io

# Test 2: POST /shorten with live Origin
curl -i -X POST "https://shubh-nimantran-shortener.goluraj1995.workers.dev/shorten" \
  -H "Origin: https://goluraj1995.github.io" \
  -H "Content-Type: application/json" \
  -d '{"url":"https://goluraj1995.github.io/shubh-nimantran/?invite=test12345"}'

# Expected: HTTP/2 200 OK with {"ok":true,"shortUrl":"https://tinyurl.com/...","tiny_url":"https://tinyurl.com/..."}
```
