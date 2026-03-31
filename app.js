const express = require('express');
const app = express();
const PORT = 8080;
const {createProxyMiddleware} = require("http-proxy-middleware");


// Proxy: de /api hacia tu servidor HTTP
app.use("/", createProxyMiddleware({
  target: "http://comprobantes.razycia.net:8088", // tu backend HTTP
  changeOrigin: true,
  onProxyRes: (proxyRes, req, res) => {
    try {
      // Eliminar cabeceras que permiten cacheo a largo plazo
      delete proxyRes.headers['etag'];
      delete proxyRes.headers['ETag'];
      delete proxyRes.headers['last-modified'];
      delete proxyRes.headers['Last-Modified'];

      // Forzar políticas de no-cache para cliente/CDN
      proxyRes.headers['cache-control'] = 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0';
      proxyRes.headers['pragma'] = 'no-cache';
      proxyRes.headers['expires'] = '0';
    } catch (err) {
      console.error('[proxy] Error modifying headers:', err);
    }
  }
}));


// Start the server
app.listen(PORT, () => {
  console.log(`Express server running at http://localhost:${PORT}/ with target http://comprobantes.razycia.net:8088`);
});