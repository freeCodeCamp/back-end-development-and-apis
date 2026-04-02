# Learn WebSockets by Building a Resource Monitor

Build a live system resource monitor that streams CPU load, RAM usage, and load averages from a Node.js WebSocket server to a browser client.

## 0

### --description--

In this project, you will build a live system resource monitor. A <dfn title="a Node.js server and browser-native API for full-duplex, persistent connections over a single TCP socket">WebSocket</dfn> server will stream real-time CPU load, RAM usage, and load averages to a browser client.

Open a new terminal and navigate into the project directory:

```bash
cd learn-websockets-by-building-a-resource-monitor
```

### --tests--

The terminal working directory should include `learn-websockets-by-building-a-resource-monitor`.

```js
const __cwd = await __helpers.getLastCWD();
assert.include(
  __cwd,
  "learn-websockets-by-building-a-resource-monitor",
  "Change into the project directory first.",
);
```

## 1

### --description--

`package.json` already has the `ws` package installed and `"type": "module"` set. Add a `"start"` script to `package.json` that runs `node server.js`.

### --tests--

`package.json` should have a `"scripts"` object with a `"start"` key.

```js
const __pkg = JSON.parse(
  await __helpers.getFile(project.dashedName, "package.json"),
);
assert.isObject(__pkg.scripts, 'package.json should have a "scripts" field.');
assert.property(
  __pkg.scripts,
  "start",
  'The "scripts" object should have a "start" key.',
);
```

The `"start"` script should be `"node server.js"`.

```js
const __pkg = JSON.parse(
  await __helpers.getFile(project.dashedName, "package.json"),
);
assert.equal(
  __pkg.scripts.start,
  "node server.js",
  'The "start" script should be "node server.js".',
);
```

## 2

### --description--

Create a `server.js` file in the project directory.

### --tests--

A `server.js` file should exist in the project directory.

```js
const __exists = await __helpers.fileExists(`${project.dashedName}/server.js`);
assert.isTrue(__exists, "server.js does not exist — create the file first.");
```

## 3

### --description--

Node.js ships with a built-in <dfn title="Hypertext Transfer Protocol">`http`</dfn> module for creating web servers and an `fs` module for reading files from disk. Import both at the top of `server.js` using ESM syntax, then declare a constant `PORT` set to `3000`.

Next, create an HTTP server using `http.createServer()` and store it in a variable named `server`. The request handler should read `./public/index.html` with `fs.readFile` and write the file contents back to the response with a `200` status and a `Content-Type` of `text/html`:

```js
const server = http.createServer((req, res) => {
  fs.readFile('./public/index.html', (err, data) => {
    if (err) {
      res.writeHead(500);
      res.end('Error loading page');
      return;
    }
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(data);
  });
});
```

### --tests--

`server.js` should import `http` using an ESM `import` statement.

```js
assert.match(
  __file,
  /import\s+http\s+from\s+['"]http['"]/,
  'server.js should have: import http from "http"',
);
```

`server.js` should import `fs` using an ESM `import` statement.

```js
assert.match(
  __file,
  /import\s+fs\s+from\s+['"]fs['"]/,
  'server.js should have: import fs from "fs"',
);
```

`server.js` should declare a `const PORT` equal to `3000`.

```js
const __t = new __helpers.Tower(__file);
const __port = __t.getVariable("PORT");
assert.isDefined(__port, "A variable named PORT should be declared.");
assert.match(__port.compact, /PORT=3000/, "PORT should be set to 3000.");
```

`server.js` should declare a `const server` initialised by calling `http.createServer()`.

```js
const __t = new __helpers.Tower(__file);
const __server = __t.getVariable("server");
assert.isDefined(__server, "A variable named server should be declared.");
assert.match(
  __server.compact,
  /server=http\.createServer\(/,
  "server should be initialised with http.createServer().",
);
```

### --before-all--

```js
const __file = await __helpers.getFile(project.dashedName, "server.js");
global.__file = __file;
```

### --after-all--

```js
delete global.__file;
```

### --seed--

#### --"learn-websockets-by-building-a-resource-monitor/server.js"--

```js
// Starter file — add your code here
```

## 4

### --description--

Start the HTTP server by calling `server.listen` with `PORT` as the first argument and a callback as the second. The callback should log the server URL to the console:

```js
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
```

**NOTE:** Once your server is running, open `http://localhost:3000` in a browser to confirm the resource monitor page loads.

### --tests--

`server.js` should call `server.listen` with `PORT` as the first argument.

```js
const __t = new __helpers.Tower(__file);
const __calls = __t.getCalls("server.listen");
assert.isAbove(__calls.length, 0, "server.listen() should be called in server.js.");
const __firstArg = __calls.at(0).ast.expression.arguments.at(0);
assert.equal(
  __firstArg.name,
  "PORT",
  "The first argument to server.listen should be PORT.",
);
```

The `server.listen` callback should log a message containing the server URL.

```js
assert.match(
  __file,
  /console\.log\(.*localhost.*\$\{PORT\}|console\.log\(.*localhost.*3000/s,
  "The server.listen callback should log the server URL.",
);
```

### --before-all--

```js
const __file = await __helpers.getFile(project.dashedName, "server.js");
global.__file = __file;
```

### --after-all--

```js
delete global.__file;
```

### --seed--

#### --"learn-websockets-by-building-a-resource-monitor/server.js"--

```js
import http from 'http';
import fs from 'fs';

const PORT = 3000;

const server = http.createServer((req, res) => {
  fs.readFile('./public/index.html', (err, data) => {
    if (err) {
      res.writeHead(500);
      res.end('Error loading page');
      return;
    }
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(data);
  });
});
```

## 5

### --description--

<dfn title="WebSocket">WebSocket</dfn> connections begin as ordinary HTTP requests. The browser sends a special HTTP `Upgrade` request — including an `Upgrade: websocket` header — asking the server to switch protocols. If the server agrees, it responds with a `101 Switching Protocols` status and the connection is promoted from HTTP to the WebSocket protocol. This process is called the <dfn title="the initial HTTP request/response that establishes a WebSocket connection">handshake</dfn>.

The `ws` npm package handles the handshake for you. Import `WebSocketServer` from `'ws'` using named ESM syntax:

```js
import { WebSocketServer } from 'ws';
```

### --tests--

`server.js` should import `WebSocketServer` from `'ws'`.

```js
assert.match(
  __file,
  /import\s*\{\s*WebSocketServer\s*\}\s*from\s*['"]ws['"]/,
  'server.js should have: import { WebSocketServer } from "ws"',
);
```

### --before-all--

```js
const __file = await __helpers.getFile(project.dashedName, "server.js");
global.__file = __file;
```

### --after-all--

```js
delete global.__file;
```

### --seed--

#### --"learn-websockets-by-building-a-resource-monitor/server.js"--

```js
import http from 'http';
import fs from 'fs';

const PORT = 3000;

const server = http.createServer((req, res) => {
  fs.readFile('./public/index.html', (err, data) => {
    if (err) {
      res.writeHead(500);
      res.end('Error loading page');
      return;
    }
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(data);
  });
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
```

## 6

### --description--

Create a `WebSocketServer` instance and store it in a constant named `wss`. Pass the existing `server` as the `server` option so the WebSocket server shares the same port and can intercept the HTTP `Upgrade` requests:

```js
const wss = new WebSocketServer({ server });
```

Place this declaration after `http.createServer` and before `server.listen`.

### --tests--

`server.js` should declare a `const wss` initialised with `new WebSocketServer({ server })`.

```js
const __t = new __helpers.Tower(__file);
const __wss = __t.getVariable("wss");
assert.isDefined(__wss, "A variable named wss should be declared.");
assert.match(
  __wss.compact,
  /wss=new WebSocketServer\(/,
  "wss should be initialised with new WebSocketServer(...).",
);
```

The `WebSocketServer` should be passed `{ server }` as its argument.

```js
assert.match(
  __file,
  /new\s+WebSocketServer\s*\(\s*\{\s*server\s*\}\s*\)/,
  "Pass { server } to new WebSocketServer() to share the HTTP port.",
);
```

### --before-all--

```js
const __file = await __helpers.getFile(project.dashedName, "server.js");
global.__file = __file;
```

### --after-all--

```js
delete global.__file;
```

### --seed--

#### --"learn-websockets-by-building-a-resource-monitor/server.js"--

```js
import http from 'http';
import fs from 'fs';
import { WebSocketServer } from 'ws';

const PORT = 3000;

const server = http.createServer((req, res) => {
  fs.readFile('./public/index.html', (err, data) => {
    if (err) {
      res.writeHead(500);
      res.end('Error loading page');
      return;
    }
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(data);
  });
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
```

## 7

### --description--

When a browser completes the WebSocket handshake with the server, `wss` emits a `'connection'` event. The event listener receives the individual `socket` object representing that client's connection.

Register a `'connection'` listener on `wss` that logs `'Client connected'` and accepts a `socket` parameter:

```js
wss.on('connection', (socket) => {
  console.log('Client connected');
});
```

Place this after the `wss` declaration and before `server.listen`.

### --tests--

`server.js` should call `wss.on` with `'connection'` as the first argument.

```js
const __t = new __helpers.Tower(__file);
const __calls = __t.getCalls("wss.on");
assert.isAbove(__calls.length, 0, "wss.on() should be called in server.js.");
const __firstArg = __calls.at(0).ast.expression.arguments.at(0);
assert.equal(
  __firstArg.value,
  "connection",
  "The first argument to wss.on should be 'connection'.",
);
```

The `'connection'` callback should accept a `socket` parameter.

```js
assert.match(
  __file,
  /wss\.on\s*\(\s*['"]connection['"]\s*,\s*\(\s*socket\s*\)/,
  "The connection callback should accept a socket parameter.",
);
```

### --before-all--

```js
const __file = await __helpers.getFile(project.dashedName, "server.js");
global.__file = __file;
```

### --after-all--

```js
delete global.__file;
```

### --seed--

#### --"learn-websockets-by-building-a-resource-monitor/server.js"--

```js
import http from 'http';
import fs from 'fs';
import { WebSocketServer } from 'ws';

const PORT = 3000;

const server = http.createServer((req, res) => {
  fs.readFile('./public/index.html', (err, data) => {
    if (err) {
      res.writeHead(500);
      res.end('Error loading page');
      return;
    }
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(data);
  });
});

const wss = new WebSocketServer({ server });

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
```

## 8

### --description--

Each `socket` object also emits lifecycle events. The `'message'` event fires whenever the client sends data to the server. The callback receives a `Buffer` containing the message, so call `.toString()` to read it as a string.

Inside the `'connection'` callback, add a `'message'` listener on `socket`:

```js
socket.on('message', (data) => {
  console.log('Received:', data.toString());
});
```

### --tests--

`server.js` should call `socket.on` with `'message'` as the first argument inside the connection handler.

```js
assert.match(
  __file,
  /socket\.on\s*\(\s*['"]message['"]/,
  "socket.on('message', ...) should be called inside the connection handler.",
);
```

The `'message'` callback should log the received data as a string.

```js
assert.match(
  __file,
  /data\.toString\(\)/,
  "The message handler should call data.toString() to read the message.",
);
```

### --before-all--

```js
const __file = await __helpers.getFile(project.dashedName, "server.js");
global.__file = __file;
```

### --after-all--

```js
delete global.__file;
```

### --seed--

#### --"learn-websockets-by-building-a-resource-monitor/server.js"--

```js
import http from 'http';
import fs from 'fs';
import { WebSocketServer } from 'ws';

const PORT = 3000;

const server = http.createServer((req, res) => {
  fs.readFile('./public/index.html', (err, data) => {
    if (err) {
      res.writeHead(500);
      res.end('Error loading page');
      return;
    }
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(data);
  });
});

const wss = new WebSocketServer({ server });

wss.on('connection', (socket) => {
  console.log('Client connected');
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
```

## 9

### --description--

The `'close'` event fires when the client disconnects — for example, when the user closes the browser tab. Add a `'close'` listener on `socket` inside the `'connection'` callback:

```js
socket.on('close', () => {
  console.log('Client disconnected');
});
```

### --tests--

`server.js` should call `socket.on` with `'close'` as the first argument inside the connection handler.

```js
assert.match(
  __file,
  /socket\.on\s*\(\s*['"]close['"]/,
  "socket.on('close', ...) should be called inside the connection handler.",
);
```

The `'close'` callback should log `'Client disconnected'`.

```js
assert.match(
  __file,
  /console\.log\s*\(\s*['"]Client disconnected['"]\s*\)/,
  "The close handler should log 'Client disconnected'.",
);
```

### --before-all--

```js
const __file = await __helpers.getFile(project.dashedName, "server.js");
global.__file = __file;
```

### --after-all--

```js
delete global.__file;
```

### --seed--

#### --"learn-websockets-by-building-a-resource-monitor/server.js"--

```js
import http from 'http';
import fs from 'fs';
import { WebSocketServer } from 'ws';

const PORT = 3000;

const server = http.createServer((req, res) => {
  fs.readFile('./public/index.html', (err, data) => {
    if (err) {
      res.writeHead(500);
      res.end('Error loading page');
      return;
    }
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(data);
  });
});

const wss = new WebSocketServer({ server });

wss.on('connection', (socket) => {
  console.log('Client connected');

  socket.on('message', (data) => {
    console.log('Received:', data.toString());
  });
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
```

## 10

### --description--

The `'error'` event fires when an unexpected problem occurs on the socket — such as a broken connection. Add an `'error'` listener on `socket` inside the `'connection'` callback:

```js
socket.on('error', (err) => {
  console.error('Socket error:', err);
});
```

### --tests--

`server.js` should call `socket.on` with `'error'` as the first argument inside the connection handler.

```js
assert.match(
  __file,
  /socket\.on\s*\(\s*['"]error['"]/,
  "socket.on('error', ...) should be called inside the connection handler.",
);
```

The `'error'` callback should call `console.error`.

```js
assert.match(
  __file,
  /socket\.on\s*\(\s*['"]error['"][\s\S]*?console\.error/,
  "The error handler should call console.error.",
);
```

### --before-all--

```js
const __file = await __helpers.getFile(project.dashedName, "server.js");
global.__file = __file;
```

### --after-all--

```js
delete global.__file;
```

### --seed--

#### --"learn-websockets-by-building-a-resource-monitor/server.js"--

```js
import http from 'http';
import fs from 'fs';
import { WebSocketServer } from 'ws';

const PORT = 3000;

const server = http.createServer((req, res) => {
  fs.readFile('./public/index.html', (err, data) => {
    if (err) {
      res.writeHead(500);
      res.end('Error loading page');
      return;
    }
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(data);
  });
});

const wss = new WebSocketServer({ server });

wss.on('connection', (socket) => {
  console.log('Client connected');

  socket.on('message', (data) => {
    console.log('Received:', data.toString());
  });

  socket.on('close', () => {
    console.log('Client disconnected');
  });
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
```

## 11

### --description--

Node.js includes a built-in `os` module with methods for reading system metrics. Import it at the top of `server.js`:

```js
import os from 'os';
```

Then write a function named `getMetrics` that returns an object with the following properties:

- `loadAvg` — the 1, 5, and 15-minute load averages from `os.loadavg()`
- `freeMemMB` — free memory in megabytes, rounded to `0` decimal places
- `totalMemMB` — total memory in megabytes, rounded to `0` decimal places
- `memUsagePct` — used memory as a percentage of total, fixed to `1` decimal place

```js
function getMetrics() {
  return {
    loadAvg: os.loadavg(),
    freeMemMB: (os.freemem() / 1024 / 1024).toFixed(0),
    totalMemMB: (os.totalmem() / 1024 / 1024).toFixed(0),
    memUsagePct: (((os.totalmem() - os.freemem()) / os.totalmem()) * 100).toFixed(1),
  };
}
```

Place `getMetrics` before the `wss` declaration.

### --tests--

`server.js` should import `os` using an ESM `import` statement.

```js
assert.match(
  __file,
  /import\s+os\s+from\s+['"]os['"]/,
  'server.js should have: import os from "os"',
);
```

`server.js` should declare a function named `getMetrics`.

```js
const __t = new __helpers.Tower(__file);
const __fn = __t.getFunction("getMetrics");
assert.isDefined(__fn, "A function named getMetrics should be declared.");
```

`getMetrics` should return an object with a `loadAvg` property sourced from `os.loadavg()`.

```js
assert.match(
  __file,
  /loadAvg\s*:\s*os\.loadavg\(\)/,
  "getMetrics should return { loadAvg: os.loadavg(), ... }.",
);
```

`getMetrics` should return `freeMemMB`, `totalMemMB`, and `memUsagePct` properties.

```js
assert.match(__file, /freeMemMB/, "getMetrics should include freeMemMB.");
assert.match(__file, /totalMemMB/, "getMetrics should include totalMemMB.");
assert.match(__file, /memUsagePct/, "getMetrics should include memUsagePct.");
```

### --before-all--

```js
const __file = await __helpers.getFile(project.dashedName, "server.js");
global.__file = __file;
```

### --after-all--

```js
delete global.__file;
```

### --seed--

#### --"learn-websockets-by-building-a-resource-monitor/server.js"--

```js
import http from 'http';
import fs from 'fs';
import { WebSocketServer } from 'ws';

const PORT = 3000;

const server = http.createServer((req, res) => {
  fs.readFile('./public/index.html', (err, data) => {
    if (err) {
      res.writeHead(500);
      res.end('Error loading page');
      return;
    }
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(data);
  });
});

const wss = new WebSocketServer({ server });

wss.on('connection', (socket) => {
  console.log('Client connected');

  socket.on('message', (data) => {
    console.log('Received:', data.toString());
  });

  socket.on('close', () => {
    console.log('Client disconnected');
  });

  socket.on('error', (err) => {
    console.error('Socket error:', err);
  });
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
```

## 12

### --description--

WebSocket messages are always strings (or binary buffers). To send a JavaScript object, you must first <dfn title="converting a data structure into a string for transmission">serialize</dfn> it. Use `JSON.stringify` to convert the object to a JSON string before calling `socket.send`.

Inside the `'connection'` callback, use `setInterval` to send fresh metrics to the client every `1000` milliseconds. Store the return value in a `const` named `interval`:

```js
const interval = setInterval(() => {
  socket.send(JSON.stringify(getMetrics()));
}, 1000);
```

Place this at the top of the `'connection'` callback, before the event listeners.

### --tests--

`server.js` should call `setInterval` inside the `'connection'` callback and store the result in a variable named `interval`.

```js
assert.match(
  __file,
  /const\s+interval\s*=\s*setInterval\s*\(/,
  "setInterval should be stored in a const named interval.",
);
```

The `setInterval` callback should call `socket.send` with `JSON.stringify(getMetrics())`.

```js
assert.match(
  __file,
  /socket\.send\s*\(\s*JSON\.stringify\s*\(\s*getMetrics\s*\(\s*\)\s*\)\s*\)/,
  "socket.send(JSON.stringify(getMetrics())) should be called inside setInterval.",
);
```

The interval delay should be `1000` milliseconds.

```js
assert.match(
  __file,
  /setInterval\s*\([^,]+,\s*1000\s*\)/,
  "The setInterval delay should be 1000ms.",
);
```

### --before-all--

```js
const __file = await __helpers.getFile(project.dashedName, "server.js");
global.__file = __file;
```

### --after-all--

```js
delete global.__file;
```

### --seed--

#### --"learn-websockets-by-building-a-resource-monitor/server.js"--

```js
import http from 'http';
import fs from 'fs';
import { WebSocketServer } from 'ws';
import os from 'os';

const PORT = 3000;

const server = http.createServer((req, res) => {
  fs.readFile('./public/index.html', (err, data) => {
    if (err) {
      res.writeHead(500);
      res.end('Error loading page');
      return;
    }
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(data);
  });
});

function getMetrics() {
  return {
    loadAvg: os.loadavg(),
    freeMemMB: (os.freemem() / 1024 / 1024).toFixed(0),
    totalMemMB: (os.totalmem() / 1024 / 1024).toFixed(0),
    memUsagePct: (((os.totalmem() - os.freemem()) / os.totalmem()) * 100).toFixed(1),
  };
}

const wss = new WebSocketServer({ server });

wss.on('connection', (socket) => {
  console.log('Client connected');

  socket.on('message', (data) => {
    console.log('Received:', data.toString());
  });

  socket.on('close', () => {
    console.log('Client disconnected');
  });

  socket.on('error', (err) => {
    console.error('Socket error:', err);
  });
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
```

## 13

### --description--

`setInterval` schedules a callback to run repeatedly on Node.js's <dfn title="the mechanism that allows Node.js to perform non-blocking I/O by offloading operations and processing callbacks in a queue">event loop</dfn>. If you never cancel it, the interval keeps firing even after the client has gone — holding a reference to the closed socket and leaking memory.

Call `clearInterval(interval)` at the top of the `'close'` handler to cancel the interval as soon as the client disconnects:

```js
socket.on('close', () => {
  clearInterval(interval);
  console.log('Client disconnected');
});
```

### --tests--

`server.js` should call `clearInterval(interval)` inside the `'close'` handler.

```js
assert.match(
  __file,
  /socket\.on\s*\(\s*['"]close['"][\s\S]*?clearInterval\s*\(\s*interval\s*\)/,
  "clearInterval(interval) should be called inside the socket 'close' handler.",
);
```

### --before-all--

```js
const __file = await __helpers.getFile(project.dashedName, "server.js");
global.__file = __file;
```

### --after-all--

```js
delete global.__file;
```

### --seed--

#### --"learn-websockets-by-building-a-resource-monitor/server.js"--

```js
import http from 'http';
import fs from 'fs';
import { WebSocketServer } from 'ws';
import os from 'os';

const PORT = 3000;

const server = http.createServer((req, res) => {
  fs.readFile('./public/index.html', (err, data) => {
    if (err) {
      res.writeHead(500);
      res.end('Error loading page');
      return;
    }
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(data);
  });
});

function getMetrics() {
  return {
    loadAvg: os.loadavg(),
    freeMemMB: (os.freemem() / 1024 / 1024).toFixed(0),
    totalMemMB: (os.totalmem() / 1024 / 1024).toFixed(0),
    memUsagePct: (((os.totalmem() - os.freemem()) / os.totalmem()) * 100).toFixed(1),
  };
}

const wss = new WebSocketServer({ server });

wss.on('connection', (socket) => {
  console.log('Client connected');

  const interval = setInterval(() => {
    socket.send(JSON.stringify(getMetrics()));
  }, 1000);

  socket.on('message', (data) => {
    console.log('Received:', data.toString());
  });

  socket.on('close', () => {
    console.log('Client disconnected');
  });

  socket.on('error', (err) => {
    console.error('Socket error:', err);
  });
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
```

## 14

### --description--

The server is complete. Now open `public/script.js` to add the browser-side WebSocket client. The helper functions `updateMetrics` and `setStatus` are already provided — do not modify them.

WebSocket URIs use `ws://` for plain connections and `wss://` for <dfn title="Transport Layer Security — encrypts data in transit">TLS</dfn>-encrypted connections (analogous to `http://` and `https://`). Because the server is running locally without TLS, use `ws://`.

Create a `WebSocket` and store it in a constant named `socket`:

```js
const socket = new WebSocket('ws://localhost:3000');
```

### --tests--

`public/script.js` should create a `WebSocket` connection to `ws://localhost:3000` stored in a variable named `socket`.

```js
const __script = await __helpers.getFile(project.dashedName, "public/script.js");
assert.match(
  __script,
  /const\s+socket\s*=\s*new\s+WebSocket\s*\(\s*['"]ws:\/\/localhost:3000['"]\s*\)/,
  "public/script.js should have: const socket = new WebSocket('ws://localhost:3000')",
);
```

### --seed--

#### --"learn-websockets-by-building-a-resource-monitor/server.js"--

```js
import http from 'http';
import fs from 'fs';
import { WebSocketServer } from 'ws';
import os from 'os';

const PORT = 3000;

const server = http.createServer((req, res) => {
  fs.readFile('./public/index.html', (err, data) => {
    if (err) {
      res.writeHead(500);
      res.end('Error loading page');
      return;
    }
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(data);
  });
});

function getMetrics() {
  return {
    loadAvg: os.loadavg(),
    freeMemMB: (os.freemem() / 1024 / 1024).toFixed(0),
    totalMemMB: (os.totalmem() / 1024 / 1024).toFixed(0),
    memUsagePct: (((os.totalmem() - os.freemem()) / os.totalmem()) * 100).toFixed(1),
  };
}

const wss = new WebSocketServer({ server });

wss.on('connection', (socket) => {
  console.log('Client connected');

  const interval = setInterval(() => {
    socket.send(JSON.stringify(getMetrics()));
  }, 1000);

  socket.on('message', (data) => {
    console.log('Received:', data.toString());
  });

  socket.on('close', () => {
    clearInterval(interval);
    console.log('Client disconnected');
  });

  socket.on('error', (err) => {
    console.error('Socket error:', err);
  });
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
```

#### --"learn-websockets-by-building-a-resource-monitor/public/script.js"--

```js
// Helper functions — pre-provided. Do not modify.

function updateMetrics({ loadAvg, freeMemMB, totalMemMB, memUsagePct }) {
  document.getElementById("mem-usage").textContent = memUsagePct;
  document.getElementById("free-mem").textContent = freeMemMB;
  document.getElementById("total-mem").textContent = totalMemMB;
  document.getElementById("load-1").textContent = loadAvg[0].toFixed(2);
  document.getElementById("load-5").textContent = loadAvg[1].toFixed(2);
  document.getElementById("load-15").textContent = loadAvg[2].toFixed(2);
}

function setStatus(text) {
  document.getElementById("status").textContent = text;
}

// Your code below — create a WebSocket connection and handle events.
```

## 15

### --description--

The browser's `WebSocket` object fires `onopen` when the connection is successfully established. Assign a handler to `socket.onopen` that calls `setStatus('Connected')`:

```js
socket.onopen = () => {
  setStatus('Connected');
};
```

### --tests--

`public/script.js` should assign a function to `socket.onopen`.

```js
const __script = await __helpers.getFile(project.dashedName, "public/script.js");
assert.match(
  __script,
  /socket\.onopen\s*=/,
  "socket.onopen should be assigned in public/script.js.",
);
```

The `onopen` handler should call `setStatus('Connected')`.

```js
const __script = await __helpers.getFile(project.dashedName, "public/script.js");
assert.match(
  __script,
  /socket\.onopen\s*=[\s\S]*?setStatus\s*\(\s*['"]Connected['"]\s*\)/,
  "The onopen handler should call setStatus('Connected').",
);
```

### --seed--

#### --"learn-websockets-by-building-a-resource-monitor/public/script.js"--

```js
// Helper functions — pre-provided. Do not modify.

function updateMetrics({ loadAvg, freeMemMB, totalMemMB, memUsagePct }) {
  document.getElementById("mem-usage").textContent = memUsagePct;
  document.getElementById("free-mem").textContent = freeMemMB;
  document.getElementById("total-mem").textContent = totalMemMB;
  document.getElementById("load-1").textContent = loadAvg[0].toFixed(2);
  document.getElementById("load-5").textContent = loadAvg[1].toFixed(2);
  document.getElementById("load-15").textContent = loadAvg[2].toFixed(2);
}

function setStatus(text) {
  document.getElementById("status").textContent = text;
}

// Your code below — create a WebSocket connection and handle events.

const socket = new WebSocket('ws://localhost:3000');
```

## 16

### --description--

The `onmessage` event fires each time the server sends data. The event object has a `data` property containing the raw message string. Use `JSON.parse` to <dfn title="converting a string back into a JavaScript data structure">deserialize</dfn> the JSON and pass the result to `updateMetrics`:

```js
socket.onmessage = (event) => {
  const data = JSON.parse(event.data);
  updateMetrics(data);
};
```

### --tests--

`public/script.js` should assign a function to `socket.onmessage`.

```js
const __script = await __helpers.getFile(project.dashedName, "public/script.js");
assert.match(
  __script,
  /socket\.onmessage\s*=/,
  "socket.onmessage should be assigned in public/script.js.",
);
```

The `onmessage` handler should parse `event.data` with `JSON.parse`.

```js
const __script = await __helpers.getFile(project.dashedName, "public/script.js");
assert.match(
  __script,
  /JSON\.parse\s*\(\s*event\.data\s*\)/,
  "The onmessage handler should call JSON.parse(event.data).",
);
```

The `onmessage` handler should call `updateMetrics` with the parsed data.

```js
const __script = await __helpers.getFile(project.dashedName, "public/script.js");
assert.match(
  __script,
  /updateMetrics\s*\(\s*data\s*\)/,
  "The onmessage handler should call updateMetrics(data).",
);
```

### --seed--

#### --"learn-websockets-by-building-a-resource-monitor/public/script.js"--

```js
// Helper functions — pre-provided. Do not modify.

function updateMetrics({ loadAvg, freeMemMB, totalMemMB, memUsagePct }) {
  document.getElementById("mem-usage").textContent = memUsagePct;
  document.getElementById("free-mem").textContent = freeMemMB;
  document.getElementById("total-mem").textContent = totalMemMB;
  document.getElementById("load-1").textContent = loadAvg[0].toFixed(2);
  document.getElementById("load-5").textContent = loadAvg[1].toFixed(2);
  document.getElementById("load-15").textContent = loadAvg[2].toFixed(2);
}

function setStatus(text) {
  document.getElementById("status").textContent = text;
}

// Your code below — create a WebSocket connection and handle events.

const socket = new WebSocket('ws://localhost:3000');

socket.onopen = () => {
  setStatus('Connected');
};
```

## 17

### --description--

The `onclose` event fires when the WebSocket connection is closed — either by the server shutting down or the network dropping. Assign a handler to `socket.onclose` that calls `setStatus('Disconnected')`:

```js
socket.onclose = () => {
  setStatus('Disconnected');
};
```

### --tests--

`public/script.js` should assign a function to `socket.onclose`.

```js
const __script = await __helpers.getFile(project.dashedName, "public/script.js");
assert.match(
  __script,
  /socket\.onclose\s*=/,
  "socket.onclose should be assigned in public/script.js.",
);
```

The `onclose` handler should call `setStatus('Disconnected')`.

```js
const __script = await __helpers.getFile(project.dashedName, "public/script.js");
assert.match(
  __script,
  /socket\.onclose\s*=[\s\S]*?setStatus\s*\(\s*['"]Disconnected['"]\s*\)/,
  "The onclose handler should call setStatus('Disconnected').",
);
```

### --seed--

#### --"learn-websockets-by-building-a-resource-monitor/public/script.js"--

```js
// Helper functions — pre-provided. Do not modify.

function updateMetrics({ loadAvg, freeMemMB, totalMemMB, memUsagePct }) {
  document.getElementById("mem-usage").textContent = memUsagePct;
  document.getElementById("free-mem").textContent = freeMemMB;
  document.getElementById("total-mem").textContent = totalMemMB;
  document.getElementById("load-1").textContent = loadAvg[0].toFixed(2);
  document.getElementById("load-5").textContent = loadAvg[1].toFixed(2);
  document.getElementById("load-15").textContent = loadAvg[2].toFixed(2);
}

function setStatus(text) {
  document.getElementById("status").textContent = text;
}

// Your code below — create a WebSocket connection and handle events.

const socket = new WebSocket('ws://localhost:3000');

socket.onopen = () => {
  setStatus('Connected');
};

socket.onmessage = (event) => {
  const data = JSON.parse(event.data);
  updateMetrics(data);
};
```

## 18

### --description--

The `onerror` event fires when the connection encounters an error before it can close normally. Assign a handler to `socket.onerror` that logs the error to the console:

```js
socket.onerror = (err) => {
  console.error('WebSocket error:', err);
};
```

The resource monitor is now complete. Run `npm start` to start the server, then open `http://localhost:3000` in a browser. You should see live CPU load averages and memory usage updating every second.

### --tests--

`public/script.js` should assign a function to `socket.onerror`.

```js
const __script = await __helpers.getFile(project.dashedName, "public/script.js");
assert.match(
  __script,
  /socket\.onerror\s*=/,
  "socket.onerror should be assigned in public/script.js.",
);
```

The `onerror` handler should call `console.error`.

```js
const __script = await __helpers.getFile(project.dashedName, "public/script.js");
assert.match(
  __script,
  /socket\.onerror\s*=[\s\S]*?console\.error\s*\(/,
  "The onerror handler should call console.error.",
);
```

### --seed--

#### --"learn-websockets-by-building-a-resource-monitor/public/script.js"--

```js
// Helper functions — pre-provided. Do not modify.

function updateMetrics({ loadAvg, freeMemMB, totalMemMB, memUsagePct }) {
  document.getElementById("mem-usage").textContent = memUsagePct;
  document.getElementById("free-mem").textContent = freeMemMB;
  document.getElementById("total-mem").textContent = totalMemMB;
  document.getElementById("load-1").textContent = loadAvg[0].toFixed(2);
  document.getElementById("load-5").textContent = loadAvg[1].toFixed(2);
  document.getElementById("load-15").textContent = loadAvg[2].toFixed(2);
}

function setStatus(text) {
  document.getElementById("status").textContent = text;
}

// Your code below — create a WebSocket connection and handle events.

const socket = new WebSocket('ws://localhost:3000');

socket.onopen = () => {
  setStatus('Connected');
};

socket.onmessage = (event) => {
  const data = JSON.parse(event.data);
  updateMetrics(data);
};

socket.onclose = () => {
  setStatus('Disconnected');
};
```

## --fcc-end--
