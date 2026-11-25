
import http from 'http';
import fs from 'fs';
import { WebSocketServer } from 'ws';

const PORT = 3001;

// 1. Create HTTP server
const server = http.createServer((req, res) => {
  fs.readFile('./public/index.html', (err, data) => {
    if (err) {
      res.writeHead(500);
      res.end('Error loading index.html');
      return;
    }

    res.writeHead(200, {
      'Content-Type': 'text/html'
    });

    res.end(data);
  });
});

// 2. Create WebSocket server
const wss = new WebSocketServer({ server });

// 3. Listen for client connections
wss.on('connection', (socket, req) => {

  // 4. Get username from URL query parameters
  const username = new URL(
    req.url,
    'http://localhost'
  ).searchParams.get('username');

  // Helper function to broadcast messages to all connected clients
  const broadcast = (message) => {
    const data = JSON.stringify(message);

    wss.clients.forEach((client) => {
      if (client.readyState === 1) {
        client.send(data);
      }
    });
  };

  // 5. Broadcast user joined message
  broadcast({
    type: 'system',
    text: `${username} joined`
  });

  // 6. Listen for incoming chat messages
  socket.on('message', (message) => {
    const { username, text } = JSON.parse(message.toString());

    broadcast({
      type: 'chat',
      username,
      text
    });
  });

  // 7. Broadcast when a user disconnects
  socket.on('close', () => {
    broadcast({
      type: 'system',
      text: `${username} left`
    });
  });

});

// 8. Start HTTP and WebSocket server
server.listen(PORT, () => {
  console.log(`Chat server running at http://localhost:${PORT}`);
});

