#!/bin/bash
set -e

ROOT="$(cd "$(dirname "$0")" && pwd)"

# Free ports if already in use
lsof -ti :8000 | xargs kill -9 2>/dev/null || true
lsof -ti :5173 | xargs kill -9 2>/dev/null || true

# Start FastAPI backend
(cd "$ROOT/api" && uv run uvicorn app.main:app --reload --port 8000) &
API_PID=$!

# Start React frontend
(cd "$ROOT/frontend/subman-client" && npm run dev) &
CLIENT_PID=$!

# Kill both on exit
trap "kill $API_PID $CLIENT_PID 2>/dev/null" EXIT

echo ""
echo "  API:      http://localhost:8000"
echo "  Frontend: http://localhost:5173"
echo ""
echo "  Press Ctrl+C to stop both."
echo ""

wait
