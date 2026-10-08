const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;

const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
};

const server = http.createServer((req, res) => {
  console.log(`${req.method} ${req.url}`);
  
  // Clean up URL and set default to index.html
  let filePath = req.url === '/' ? '/index.html' : req.url;
  // Remove query strings
  filePath = filePath.split('?')[0];
  
  // Resolve absolute path
  const absPath = path.join(__dirname, filePath);
  const ext = path.extname(absPath);
  const contentType = MIME_TYPES[ext] || 'text/plain';

  fs.readFile(absPath, (err, data) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.writeHead(404);
        res.end('404 Not Found');
      } else {
        res.writeHead(500);
        res.end('500 Internal Server Error');
      }
      return;
    }

    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  });
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
  console.log(`Press Ctrl+C to stop`);
});
