const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

app.use('/react', createProxyMiddleware({ target: 'http://localhost:3001', changeOrigin: true }));
app.use('/svelte', createProxyMiddleware({ target: 'http://localhost:3002', changeOrigin: true }));
app.use('/vue', createProxyMiddleware({ target: 'http://localhost:3003', changeOrigin: true }));

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
