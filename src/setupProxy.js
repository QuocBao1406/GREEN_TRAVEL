const { createProxyMiddleware } = require('http-proxy-middleware');
const http = require('http');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://localhost:5000',
      changeOrigin: true,
      secure: false,
      proxyTimeout: 60000, // Tăng timeout lên 60s
      timeout: 60000,
      agent: new http.Agent({ 
        keepAlive: true,
        maxSockets: 50 
      }),
      onError: (err, req, res) => {
        console.error('Proxy error:', err);
        if (!res.headersSent) {
          res.status(504).json({ error: 'Backend timeout' });
        }
      }
    })
  );
};