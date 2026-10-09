# Lumora Market Signal — Render version

This version serves the simple site and its `/api/market` endpoint from one Node.js service.

## Deploy to Render (free for testing)
1. Upload this folder to a GitHub repository.
2. Open https://render.com and create a **New Web Service**.
3. Connect the repository.
4. Build command: `npm install`
5. Start command: `npm start`
6. Choose the Free instance for testing.
7. Deploy and open the generated `onrender.com` URL.

## Live data requirement
Without `MT5_BRIDGE_URL`, the site safely shows WAIT. To show actual signals, you still need a secure HTTPS bridge that reads/receives your MT5 XAUUSD M1 data and returns JSON such as:
{
  "connected": true,
  "symbol": "XAUUSD",
  "status": "GOOD_TO_ON",
  "message": "Trend pattern detected",
  "updatedAt": "2026-10-09T12:00:00Z"
}
Allowed status values: GOOD_TO_ON, WAIT, AVOID.
Set `MT5_BRIDGE_URL` and optionally `MT5_BRIDGE_TOKEN` in Render Environment settings. Do not place credentials in browser files.

## Important free-host limitation
Render free web services can sleep after 15 minutes without incoming traffic and may take about a minute to wake. This is okay for a prototype but is not ideal for a live trading alert that must be continuously available. A free host does not itself create a connection to MT5 running on your PC.

To reproduce your exact blue/red indicator pattern, the indicator's `.mq5` source or reliable documented signal output is needed. This template does not guess live market conditions.
