# Build a Chat App

```json
{"tags": ["Certification Project"]}
```

Build a real-time multi-client chat server using Node.js WebSockets.

## 0

### --description--

In this project, you will implement the server side of a real-time chat application using Node.js.

The boilerplate gives you:

- `public/index.html` — a complete chat UI (no edits needed)
- `public/script.js` — a complete browser WebSocket client (no edits needed)
- `server.js` — the imports and `PORT` constant are already written; you must implement the rest

Open a terminal, navigate into the project directory, and install the dependencies:

```bash
cd build-a-chat-app
npm install
```

In `server.js`, complete the following:

**1.** Create an HTTP server using `http.createServer` that reads `./public/index.html` and responds with status `200` and `Content-Type: text/html`. Store it in a variable named `server`.

**2.** Create a `WebSocketServer` from the `ws` package, passing `{ server }` as the option, and store it in `wss`.

**3.** Register a `'connection'` listener on `wss`. The listener receives the socket and the upgrade request as arguments: `wss.on('connection', (socket, req) => { ... })`. Inside:

- Parse the connecting client's username from the URL query string:
  ```js
  const username = new URL(req.url, 'http://localhost').searchParams.get('username');
  ```
- Immediately broadcast a system message to **all** connected clients:
  ```json
  { "type": "system", "text": "<username> joined" }
  ```
- Register a `'message'` listener on `socket`. Parse the incoming JSON `{ username, text }` and broadcast `{ type: 'chat', username, text }` to **all** connected clients (including the sender).
- Register a `'close'` listener on `socket`. Broadcast `{ type: 'system', text: '<username> left' }` to all remaining connected clients.

To broadcast to all connected clients, iterate over `wss.clients`:

```js
wss.clients.forEach(client => {
  if (client.readyState === WebSocket.OPEN) {
    client.send(JSON.stringify(payload));
  }
});
```

**4.** Start the server by calling `server.listen(PORT, callback)`. The callback should log:

```
Chat server running at http://localhost:3001
```

Once your server is running, open `http://localhost:3001` in a browser to use the chat UI.

**NOTE:** Click _Run Tests_ only after starting the server with `npm start`.

### --tests--

The server should be listening on port 3001.

```js
const __listening = await __helpers.isServerListening(3001);
assert.isTrue(__listening, 'Server is not running on port 3001. Start the server with npm start.');
```

A `GET /` request should respond with status `200` and a `Content-Type` of `text/html`.

```js
const __res = await fetch('http://localhost:3001/');
assert.equal(__res.status, 200, 'GET / should return status 200');
assert.include(
  __res.headers.get('content-type'),
  'text/html',
  'Response Content-Type should include text/html'
);
```

A WebSocket client should be able to connect to the server.

```js
await new Promise((resolve, reject) => {
  const __ws = new __WS('ws://localhost:3001?username=Tester');
  __ws.once('open', () => { __ws.close(); resolve(); });
  __ws.once('error', (err) => reject(new Error(`WebSocket connection failed: ${err.message}`)));
  setTimeout(() => reject(new Error('WebSocket connection timed out')), 3000);
});
```

When a client connects, all existing clients should receive a `{ type: 'system' }` message whose `text` includes the connecting client's username.

```js
const __observer = new __WS('ws://localhost:3001?username=Observer');
await new Promise(res => __observer.once('open', res));

const __joinMsg = await new Promise((resolve, reject) => {
  const __timer = setTimeout(() => reject(new Error('Timed out waiting for join message')), 3000);
  __observer.on('message', function __handler(data) {
    const __msg = JSON.parse(data.toString());
    if (__msg.type === 'system' && __msg.text.includes('Alice')) {
      clearTimeout(__timer);
      __observer.off('message', __handler);
      resolve(__msg);
    }
  });
  const __alice = new __WS('ws://localhost:3001?username=Alice');
  __alice.once('open', () => __alice.close());
});

__observer.close();
assert.equal(__joinMsg.type, 'system', 'Join message should have type "system"');
assert.include(__joinMsg.text, 'Alice', 'Join message text should include the username');
```

When a client sends a message, all connected clients — including the sender — should receive `{ type: 'chat', username, text }`.

```js
const __alice = new __WS('ws://localhost:3001?username=Alice');
const __bob   = new __WS('ws://localhost:3001?username=Bob');
await Promise.all([
  new Promise(res => __alice.once('open', res)),
  new Promise(res => __bob.once('open', res))
]);

function __waitForChat(ws, senderName) {
  return new Promise((resolve, reject) => {
    const __timer = setTimeout(() => reject(new Error(`Timed out waiting for chat from ${senderName}`)), 3000);
    ws.on('message', function __h(data) {
      const __m = JSON.parse(data.toString());
      if (__m.type === 'chat' && __m.username === senderName) {
        clearTimeout(__timer);
        ws.off('message', __h);
        resolve(__m);
      }
    });
  });
}

const [__aliceGot, __bobGot] = await Promise.all([
  __waitForChat(__alice, 'Alice'),
  __waitForChat(__bob, 'Alice'),
  Promise.resolve(__alice.send(JSON.stringify({ username: 'Alice', text: 'Hello everyone!' })))
]);

__alice.close();
__bob.close();

assert.equal(__aliceGot.type, 'chat', 'Sender should receive their own message with type "chat"');
assert.equal(__aliceGot.text, 'Hello everyone!', 'Sender should receive the correct message text');
assert.equal(__bobGot.type, 'chat', 'Other clients should receive the message with type "chat"');
assert.equal(__bobGot.text, 'Hello everyone!', 'Other clients should receive the correct message text');
```

When a client disconnects, remaining clients should receive a `{ type: 'system' }` message whose `text` includes the disconnected client's username.

```js
const __alice = new __WS('ws://localhost:3001?username=Alice');
const __bob   = new __WS('ws://localhost:3001?username=Bob');
await Promise.all([
  new Promise(res => __alice.once('open', res)),
  new Promise(res => __bob.once('open', res))
]);

const __leaveMsg = await new Promise((resolve, reject) => {
  const __timer = setTimeout(() => reject(new Error('Timed out waiting for leave message')), 3000);
  __bob.on('message', function __handler(data) {
    const __msg = JSON.parse(data.toString());
    if (__msg.type === 'system' && __msg.text.includes('Alice')) {
      clearTimeout(__timer);
      __bob.off('message', __handler);
      resolve(__msg);
    }
  });
  __alice.close();
});

__bob.close();
assert.equal(__leaveMsg.type, 'system', 'Leave message should have type "system"');
assert.include(__leaveMsg.text, 'Alice', 'Leave message text should include the disconnected username');
```

### --before-each--

```js
const { WebSocket: __WS } = await import(`${ROOT}/build-a-chat-app/node_modules/ws/index.js`);
```

### --seed--

#### --"build-a-chat-app/server.js"--

```js
import http from 'http';
import fs from 'fs';
import { WebSocketServer } from 'ws';

const PORT = 3001;
```

#### --"build-a-chat-app/public/index.html"--

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Chat App</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      font-family: system-ui, sans-serif;
      background: #f0f2f5;
      display: flex;
      flex-direction: column;
      align-items: center;
      min-height: 100vh;
      padding: 1.5rem;
    }

    h1 { font-size: 1.5rem; margin-bottom: 0.5rem; color: #1a1a2e; }

    #status-bar {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 1rem;
      font-size: 0.875rem;
      color: #555;
    }

    #status-dot {
      width: 10px; height: 10px;
      border-radius: 50%;
      background: #ccc;
      transition: background 0.3s;
    }
    #status-dot.connected { background: #22c55e; }
    #status-dot.disconnected { background: #ef4444; }

    #chat-container {
      background: #fff;
      border-radius: 12px;
      box-shadow: 0 2px 12px rgba(0,0,0,0.08);
      width: 100%;
      max-width: 600px;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    #messages {
      padding: 1rem;
      height: 380px;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      border-bottom: 1px solid #e5e7eb;
    }

    .msg { line-height: 1.4; }

    .msg.system {
      font-style: italic;
      color: #888;
      font-size: 0.85rem;
      text-align: center;
    }

    .msg.chat .username {
      font-weight: 600;
      color: #4f46e5;
      margin-right: 0.35rem;
    }

    #input-area {
      padding: 0.75rem 1rem;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .input-row { display: flex; gap: 0.5rem; }

    input[type="text"] {
      flex: 1;
      padding: 0.5rem 0.75rem;
      border: 1px solid #d1d5db;
      border-radius: 8px;
      font-size: 0.95rem;
      outline: none;
      transition: border-color 0.2s;
    }
    input[type="text"]:focus { border-color: #4f46e5; }

    #username-input { max-width: 180px; flex: none; }

    button {
      padding: 0.5rem 1rem;
      background: #4f46e5;
      color: #fff;
      border: none;
      border-radius: 8px;
      font-size: 0.95rem;
      cursor: pointer;
      transition: background 0.2s;
    }
    button:hover { background: #4338ca; }
    button:disabled { background: #a5b4fc; cursor: default; }
  </style>
</head>
<body>
  <h1>&#128172; Chat App</h1>
  <div id="status-bar">
    <div id="status-dot"></div>
    <span id="status">Disconnected</span>
  </div>

  <div id="chat-container">
    <div id="messages"></div>
    <div id="input-area">
      <div class="input-row">
        <input id="username-input" type="text" placeholder="Username" maxlength="20" value="Camper" />
        <button id="connect-btn">Connect</button>
      </div>
      <div class="input-row">
        <input id="message-input" type="text" placeholder="Type a message…" disabled />
        <button id="send-btn" disabled>Send</button>
      </div>
    </div>
  </div>

  <script src="script.js"></script>
</body>
</html>
```

#### --"build-a-chat-app/public/script.js"--

```js
const statusDot = document.getElementById('status-dot');
const statusText = document.getElementById('status');
const messages = document.getElementById('messages');
const usernameInput = document.getElementById('username-input');
const messageInput = document.getElementById('message-input');
const connectBtn = document.getElementById('connect-btn');
const sendBtn = document.getElementById('send-btn');

let socket = null;

function appendMessage({ type, username, text }) {
  const el = document.createElement('div');
  el.classList.add('msg', type);
  if (type === 'chat') {
    el.innerHTML = `<span class="username">${escapeHtml(username)}:</span>${escapeHtml(text)}`;
  } else {
    el.textContent = text;
  }
  messages.appendChild(el);
  messages.scrollTop = messages.scrollHeight;
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function setConnected(connected) {
  statusDot.className = connected ? 'connected' : 'disconnected';
  statusText.textContent = connected ? 'Connected' : 'Disconnected';
  messageInput.disabled = !connected;
  sendBtn.disabled = !connected;
  connectBtn.textContent = connected ? 'Disconnect' : 'Connect';
  usernameInput.disabled = connected;
}

connectBtn.addEventListener('click', () => {
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.close();
    return;
  }
  const username = usernameInput.value.trim() || 'Anonymous';
  socket = new WebSocket(`ws://localhost:3001?username=${encodeURIComponent(username)}`);

  socket.onopen = () => setConnected(true);

  socket.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      appendMessage(data);
    } catch {
      // ignore malformed messages
    }
  };

  socket.onclose = () => {
    setConnected(false);
    socket = null;
  };

  socket.onerror = () => {
    setConnected(false);
  };
});

function sendMessage() {
  const text = messageInput.value.trim();
  const username = usernameInput.value.trim() || 'Anonymous';
  if (!text || !socket || socket.readyState !== WebSocket.OPEN) return;
  socket.send(JSON.stringify({ username, text }));
  messageInput.value = '';
}

sendBtn.addEventListener('click', sendMessage);
messageInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') sendMessage();
});
```

## --fcc-end--
