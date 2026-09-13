import http from 'http';
import fs from 'fs';
import { WebSocketServer, WebSocket } from 'ws';

const PORT = 3001;

// 1. Plain HTTP server: always responds with the chat UI page.
const server = http.createServer((req, res) => {
  fs.readFile('./public/index.html', (err, data) => {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading index.html');
    }
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(data);
  });
});

// 2. WebSocketServer reuses the same HTTP server, so both the page and the
// WebSocket upgrade requests are served from one port.
const wss = new WebSocketServer({ server });

// Sends `payload` to every currently-connected client.
function broadcast(payload) {
  const message = JSON.stringify(payload);
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}

// 3. A new client connected.
wss.on('connection', (socket, req) => {
  // 4. Read the username from the connection URL (e.g. ?username=Alice) and
  // stash it on the socket itself, since 'close' won't have `req` again.
  const username = new URL(req.url, 'http://localhost').searchParams.get(
    'username',
  );
  socket.username = username;

  broadcast({ type: 'system', text: `${username} joined` });

  // 5. A chat message arrived from this client.
  socket.on('message', (raw) => {
    const { username, text } = JSON.parse(raw);
    broadcast({ type: 'chat', username, text });
  });

  // 6. This client disconnected.
  socket.on('close', () => {
    broadcast({ type: 'system', text: `${socket.username} left` });
  });
});

// 7. Start listening.
server.listen(PORT, () => {
  console.log(`Chat server running at http://localhost:${PORT}`);
});
