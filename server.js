const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, "public"), { etag: false, maxAge: 0 }));

app.get("/api/market", async (req, res) => {
  res.set("Cache-Control", "no-store, max-age=0");
  const bridgeUrl = process.env.MT5_BRIDGE_URL;

  if (!bridgeUrl) {
    return res.json({
      connected: false,
      symbol: "XAUUSD",
      status: "WAIT",
      message: "MT5 data bridge is not configured. Waiting for live data.",
      updatedAt: null
    });
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 4000);

  try {
    const headers = {};
    if (process.env.MT5_BRIDGE_TOKEN) {
      headers.Authorization = `Bearer ${process.env.MT5_BRIDGE_TOKEN}`;
    }
    const upstream = await fetch(bridgeUrl, {
      headers,
      signal: controller.signal,
      cache: "no-store"
    });
    if (!upstream.ok) throw new Error("Bridge response not OK");
    const data = await upstream.json();
    if (!["GOOD_TO_ON", "WAIT", "AVOID"].includes(data.status)) {
      throw new Error("Invalid status from bridge");
    }
    return res.json({
      connected: data.connected === true,
      symbol: data.symbol || "XAUUSD",
      status: data.status,
      message: data.message || "",
      updatedAt: data.updatedAt || new Date().toISOString()
    });
  } catch (e) {
    return res.json({
      connected: false,
      symbol: "XAUUSD",
      status: "WAIT",
      message: "Cannot reach MT5 bridge. Waiting for connection.",
      updatedAt: null
    });
  } finally {
    clearTimeout(timeout);
  }
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Lumora Market Signal listening on port ${PORT}`);
});
