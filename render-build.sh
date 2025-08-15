#!/usr/bin/env bash
set -euo pipefail
echo "[render] installing backend deps"
pip install --no-cache-dir -r backend/requirements.txt
echo "[render] building frontend"
(cd frontend && npm install --no-audit --no-fund && npm run build)
cp -r frontend/dist backend/frontend_dist || true
echo "[render] build complete"
