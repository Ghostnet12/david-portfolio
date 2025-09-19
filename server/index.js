/*
 * Back‑end server for David Northrop's portfolio site.
 *
 * Due to network restrictions in this environment, we cannot pull in
 * external npm packages such as Express or Mongoose.  Instead, we
 * implement a simple HTTP server using Node's built‑in modules.  The
 * server serves static files from the `public` directory and exposes a
 * single API endpoint (`/api/contact`) to accept contact form
 * submissions from the front‑end.  Messages are stored in a local
 * JSON file (`messages.json`) to simulate persistent storage.  In a
 * production MERN stack deployment this API would connect to a
 * MongoDB database using Mongoose.
 */

const http = require('http');
const path = require('path');
const fs = require('fs');
const url = require('url');

// Directory where static files live
const publicDir = path.join(__dirname, '..', 'public');

// Data file for storing contact messages
const messagesFile = path.join(__dirname, 'messages.json');

// Helper to send JSON responses
function sendJson(res, statusCode, data) {
  const json = JSON.stringify(data);
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(json),
  });
  res.end(json);
}

// Load existing messages from file or initialize empty array
function loadMessages() {
  try {
    const raw = fs.readFileSync(messagesFile, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    return [];
  }
}

// Save messages to file
function saveMessages(messages) {
  fs.writeFileSync(messagesFile, JSON.stringify(messages, null, 2), 'utf8');
}

// Serve static assets.  Looks up the requested file in the public
// directory and streams it back.  If the file is not found, returns
// 404.  Automatically maps `/` to `/index.html`.
function serveStatic(req, res) {
  let pathname = url.parse(req.url).pathname;
  if (pathname === '/') pathname = '/index.html';
  const filePath = path.join(publicDir, pathname);

  // Prevent directory traversal attacks by normalizing the path and
  // ensuring it lives under publicDir
  if (!filePath.startsWith(publicDir)) {
    res.statusCode = 403;
    res.end('Forbidden');
    return;
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.statusCode = 404;
      res.end('Not Found');
      return;
    }
    // Determine content type based on file extension
    const ext = path.extname(filePath).toLowerCase();
    let contentType = 'text/plain';
    switch (ext) {
      case '.html':
        contentType = 'text/html';
        break;
      case '.css':
        contentType = 'text/css';
        break;
      case '.js':
        contentType = 'application/javascript';
        break;
      case '.json':
        contentType = 'application/json';
        break;
      case '.png':
        contentType = 'image/png';
        break;
      case '.jpg':
      case '.jpeg':
        contentType = 'image/jpeg';
        break;
      case '.gif':
        contentType = 'image/gif';
        break;
      case '.svg':
        contentType = 'image/svg+xml';
        break;
    }
    res.writeHead(200, { 'Content-Type': contentType });
    fs.createReadStream(filePath).pipe(res);
  });
}

// Handle API requests
async function handleApi(req, res) {
  const parsedUrl = url.parse(req.url, true);
  if (req.method === 'POST' && parsedUrl.pathname === '/api/contact') {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
      // Protect against large payloads
      if (body.length > 1e6) {
        req.connection.destroy();
      }
    });
    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        const { name, email, subject, message } = data;
        if (!name || !email || !subject || !message) {
          return sendJson(res, 400, { error: 'All fields are required.' });
        }
        const messages = loadMessages();
        messages.push({ name, email, subject, message, date: new Date().toISOString() });
        saveMessages(messages);
        return sendJson(res, 200, { success: true });
      } catch (err) {
        return sendJson(res, 400, { error: 'Invalid JSON' });
      }
    });
    return;
  }
  // Unknown API route
  sendJson(res, 404, { error: 'Not Found' });
}

// Main HTTP server
const server = http.createServer((req, res) => {
  if (req.url.startsWith('/api/')) {
    handleApi(req, res);
  } else {
    serveStatic(req, res);
  }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});