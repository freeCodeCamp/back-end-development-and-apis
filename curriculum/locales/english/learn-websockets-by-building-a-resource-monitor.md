# Learn WebSockets by Building a Resource Monitor

You will learn Node.js WebSockets and real-time data streaming by building a system resource monitor.

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

The boilerplate has a `package.json` and `server.js` file. Whilst Nodejs does come with a `WebSocket` implementation, it is just a browser-compatible implmentation of the protocol, and does not handle the initial HTTP handshake. To create a WebSocket server, you will use the popular `ws` npm package, which provides a simple API for handling WebSocket connections.

Install `ws` as a dependency:

```bash
npm install ws
```

### --tests--

`ws` should be listed as a dependency in `package.json`.

```js
const __pkg = JSON.parse(
  await __helpers.getFile(project.dashedName, "package.json"),
);
assert.property(
  __pkg.dependencies,
  "ws",
  "The 'ws' package should be listed as a dependency.",
);
```

## 2

### --description--

Add a `"start"` script to `package.json` that runs `node server.js`.

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

## 3

### --description--

Create a `server.js` file in the project directory.

### --tests--

A `server.js` file should exist in the project directory.

```js
const __exists = await __helpers.fileExists(`${project.dashedName}/server.js`);
assert.isTrue(__exists, "server.js does not exist — create the file first.");
```

## 4

### --description--

Use Nodejs' built-in `http` and `fs` modules to create an HTTP server using `http.createServer()` and store it in a variable named `server`. The request handler should read `./public/index.html` with `fs.readFile` and write the file contents back to the response with a `200` status and a `Content-Type` of `text/html`.

### --hints--

#### 0

```js
const server = http.createServer((req, res) => {
  fs.readFile("./public/index.html", (err, data) => {
    if (err) {
      res.writeHead(500);
      res.end("Error loading page");
      return;
    }
    res.writeHead(200, { "Content-Type": "text/html" });
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

### --before-each--

```js
const __file = await __helpers.getFile(project.dashedName, "server.js");
```

### --seed--

#### --"learn-websockets-by-building-a-resource-monitor/server.js"--

```js

```

## 5

### --description--

Declare a constant `PORT` set to `3000`, then start the HTTP server by calling `server.listen(PORT, callback)`. The callback should log the server URL to the console.

**NOTE:** Once your server is running, open `http://localhost:3000` in a browser to confirm the resource monitor page loads.

### --tests--

`server.js` should call `server.listen` with `PORT` as the first argument.

```js
const __t = new __helpers.Tower(__file);
const __calls = __t.getCalls("server.listen");
assert.isAbove(
  __calls.length,
  0,
  "server.listen() should be called in server.js.",
);
const __firstArg = __calls.at(0).ast.expression.arguments.at(0);
assert.equal(
  __firstArg.name,
  "PORT",
  "The first argument to server.listen should be PORT.",
);
```

The `server.listen` callback should log a message containing the server URL.

```js
const __t = new __helpers.Tower(__file);
const __listenCalls = __t.getCalls("server.listen");
assert.isAbove(__listenCalls.length, 0, "server.listen() should be called.");
const __listenCb = __listenCalls.at(0).ast.expression.arguments.at(1);
const __listenT = new __helpers.Tower(__listenCb);
const __logCalls = __listenT.getCalls("console.log");
assert.isAbove(
  __logCalls.length,
  0,
  "The server.listen callback should log a message.",
);
assert.match(
  __logCalls.at(0).compact,
  /localhost/,
  "The server.listen callback should log the server URL.",
);
```

### --before-each--

```js
const __file = await __helpers.getFile(project.dashedName, "server.js");
```

### --seed--

#### --"learn-websockets-by-building-a-resource-monitor/server.js"--

```js
import http from "http";
import fs from "fs";

const server = http.createServer((req, res) => {
  fs.readFile("./public/index.html", (err, data) => {
    if (err) {
      res.writeHead(500);
      res.end("Error loading page");
      return;
    }
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(data);
  });
});
```

## 6

### --description--

<dfn title="WebSocket">WebSocket</dfn> connections begin as ordinary HTTP requests. The browser sends a special HTTP `Upgrade` request — including an `Upgrade: websocket` header — asking the server to switch protocols. If the server agrees, it responds with a `101 Switching Protocols` status and the connection is promoted from HTTP to the WebSocket protocol. This process is called the <dfn title="the initial HTTP request/response that establishes a WebSocket connection">handshake</dfn>.

The `ws` npm package handles the handshake for you. Import `WebSocketServer` from `'ws'` using named ESM syntax:

```js
import { WebSocketServer } from "ws";
```

### --tests--

`server.js` should import `WebSocketServer` from `'ws'`.

```js
const __t = new __helpers.Tower(__file);
const __wsImport = __t.ast.body.find(
  (n) =>
    n.type === "ImportDeclaration" &&
    n.source.value === "ws" &&
    n.specifiers.some(
      (s) => s.type === "ImportSpecifier" && s.imported.name === "WebSocketServer",
    ),
);
assert.isDefined(
  __wsImport,
  'server.js should have: import { WebSocketServer } from "ws"',
);
```

### --before-each--

```js
const __file = await __helpers.getFile(project.dashedName, "server.js");
```

### --seed--

#### --"learn-websockets-by-building-a-resource-monitor/server.js"--

```js
import http from "http";
import fs from "fs";

const PORT = 3000;

const server = http.createServer((req, res) => {
  fs.readFile("./public/index.html", (err, data) => {
    if (err) {
      res.writeHead(500);
      res.end("Error loading page");
      return;
    }
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(data);
  });
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
```

## 7

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
const __t = new __helpers.Tower(__file);
const __wss = __t.getVariable("wss");
const __newExpr = __wss.ast.declarations[0].init;
const __arg = __newExpr?.arguments?.at(0);
const __serverProp = __arg?.properties?.find((p) => p.key?.name === "server");
assert.isDefined(
  __serverProp,
  "Pass { server } to new WebSocketServer() to share the HTTP port.",
);
```

### --before-each--

```js
const __file = await __helpers.getFile(project.dashedName, "server.js");
```

### --seed--

#### --"learn-websockets-by-building-a-resource-monitor/server.js"--

```js
import http from "http";
import fs from "fs";
import { WebSocketServer } from "ws";

const PORT = 3000;

const server = http.createServer((req, res) => {
  fs.readFile("./public/index.html", (err, data) => {
    if (err) {
      res.writeHead(500);
      res.end("Error loading page");
      return;
    }
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(data);
  });
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
```

## 8

### --description--

When a browser completes the WebSocket handshake with the server, `wss` emits a `'connection'` event. The event listener receives the individual `socket` object representing that client's connection.

Register a `'connection'` listener on `wss` that logs `'Client connected'` and accepts a `socket` parameter:

```js
wss.on("connection", (socket) => {
  console.log("Client connected");
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
const __t = new __helpers.Tower(__file);
const __wssOnCalls = __t.getCalls("wss.on");
assert.isAbove(__wssOnCalls.length, 0, "wss.on() should be called.");
const __connCb = __wssOnCalls.at(0).ast.expression.arguments.at(1);
assert.equal(
  __connCb?.params?.at(0)?.name,
  "socket",
  "The connection callback should accept a socket parameter.",
);
```

### --before-each--

```js
const __file = await __helpers.getFile(project.dashedName, "server.js");
```

### --seed--

#### --"learn-websockets-by-building-a-resource-monitor/server.js"--

```js
import http from "http";
import fs from "fs";
import { WebSocketServer } from "ws";

const PORT = 3000;

const server = http.createServer((req, res) => {
  fs.readFile("./public/index.html", (err, data) => {
    if (err) {
      res.writeHead(500);
      res.end("Error loading page");
      return;
    }
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(data);
  });
});

const wss = new WebSocketServer({ server });

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
```

## 9

### --description--

Each `socket` object also emits lifecycle events. The `'message'` event fires whenever the client sends data to the server. The callback receives a `Buffer` containing the message, so call `.toString()` to read it as a string.

Inside the `'connection'` callback, add a `'message'` listener on `socket`:

```js
socket.on("message", (data) => {
  console.log("Received:", data.toString());
});
```

### --tests--

`server.js` should call `socket.on` with `'message'` as the first argument inside the connection handler.

```js
const __t = new __helpers.Tower(__file);
const __connCb = __t.getCalls("wss.on").at(0).ast.expression.arguments.at(1);
const __connT = new __helpers.Tower(__connCb);
const __msgCalls = __connT
  .getCalls("socket.on")
  .filter((c) => c.ast.expression.arguments.at(0)?.value === "message");
assert.isAbove(
  __msgCalls.length,
  0,
  "socket.on('message', ...) should be called inside the connection handler.",
);
```

The `'message'` callback should log the received data as a string.

```js
const __t = new __helpers.Tower(__file);
const __connCb = __t.getCalls("wss.on").at(0).ast.expression.arguments.at(1);
const __connT = new __helpers.Tower(__connCb);
const __msgCalls = __connT
  .getCalls("socket.on")
  .filter((c) => c.ast.expression.arguments.at(0)?.value === "message");
assert.isAbove(
  __msgCalls.length,
  0,
  "socket.on('message', ...) should be called.",
);
const __msgCb = __msgCalls.at(0).ast.expression.arguments.at(1);
const __msgT = new __helpers.Tower(__msgCb);
const __toStringCalls = __msgT.getCalls("data.toString");
assert.isAbove(
  __toStringCalls.length,
  0,
  "The message handler should call data.toString() to read the message.",
);
```

### --before-each--

```js
const __file = await __helpers.getFile(project.dashedName, "server.js");
```

### --seed--

#### --"learn-websockets-by-building-a-resource-monitor/server.js"--

```js
import http from "http";
import fs from "fs";
import { WebSocketServer } from "ws";

const PORT = 3000;

const server = http.createServer((req, res) => {
  fs.readFile("./public/index.html", (err, data) => {
    if (err) {
      res.writeHead(500);
      res.end("Error loading page");
      return;
    }
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(data);
  });
});

const wss = new WebSocketServer({ server });

wss.on("connection", (socket) => {
  console.log("Client connected");
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
```

## 10

### --description--

The `'close'` event fires when the client disconnects — for example, when the user closes the browser tab. Add a `'close'` listener on `socket` inside the `'connection'` callback:

```js
socket.on("close", () => {
  console.log("Client disconnected");
});
```

### --tests--

`server.js` should call `socket.on` with `'close'` as the first argument inside the connection handler.

```js
const __t = new __helpers.Tower(__file);
const __connCb = __t.getCalls("wss.on").at(0).ast.expression.arguments.at(1);
const __connT = new __helpers.Tower(__connCb);
const __closeCalls = __connT
  .getCalls("socket.on")
  .filter((c) => c.ast.expression.arguments.at(0)?.value === "close");
assert.isAbove(
  __closeCalls.length,
  0,
  "socket.on('close', ...) should be called inside the connection handler.",
);
```

The `'close'` callback should log `'Client disconnected'`.

```js
const __t = new __helpers.Tower(__file);
const __connCb = __t.getCalls("wss.on").at(0).ast.expression.arguments.at(1);
const __connT = new __helpers.Tower(__connCb);
const __closeCalls = __connT
  .getCalls("socket.on")
  .filter((c) => c.ast.expression.arguments.at(0)?.value === "close");
assert.isAbove(
  __closeCalls.length,
  0,
  "socket.on('close', ...) should be called.",
);
const __closeCb = __closeCalls.at(0).ast.expression.arguments.at(1);
const __closeT = new __helpers.Tower(__closeCb);
const __logCalls = __closeT.getCalls("console.log");
assert.isAbove(
  __logCalls.length,
  0,
  "The close handler should log 'Client disconnected'.",
);
assert.equal(
  __logCalls.at(0).ast.expression.arguments.at(0)?.value,
  "Client disconnected",
  "The close handler should log 'Client disconnected'.",
);
```

### --before-each--

```js
const __file = await __helpers.getFile(project.dashedName, "server.js");
```

### --seed--

#### --"learn-websockets-by-building-a-resource-monitor/server.js"--

```js
import http from "http";
import fs from "fs";
import { WebSocketServer } from "ws";

const PORT = 3000;

const server = http.createServer((req, res) => {
  fs.readFile("./public/index.html", (err, data) => {
    if (err) {
      res.writeHead(500);
      res.end("Error loading page");
      return;
    }
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(data);
  });
});

const wss = new WebSocketServer({ server });

wss.on("connection", (socket) => {
  console.log("Client connected");

  socket.on("message", (data) => {
    console.log("Received:", data.toString());
  });
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
```

## 11

### --description--

The `'error'` event fires when an unexpected problem occurs on the socket — such as a broken connection. Add an `'error'` listener on `socket` inside the `'connection'` callback:

```js
socket.on("error", (err) => {
  console.error("Socket error:", err);
});
```

### --tests--

`server.js` should call `socket.on` with `'error'` as the first argument inside the connection handler.

```js
const __t = new __helpers.Tower(__file);
const __connCb = __t.getCalls("wss.on").at(0).ast.expression.arguments.at(1);
const __connT = new __helpers.Tower(__connCb);
const __errCalls = __connT
  .getCalls("socket.on")
  .filter((c) => c.ast.expression.arguments.at(0)?.value === "error");
assert.isAbove(
  __errCalls.length,
  0,
  "socket.on('error', ...) should be called inside the connection handler.",
);
```

The `'error'` callback should call `console.error`.

```js
const __t = new __helpers.Tower(__file);
const __connCb = __t.getCalls("wss.on").at(0).ast.expression.arguments.at(1);
const __connT = new __helpers.Tower(__connCb);
const __errCalls = __connT
  .getCalls("socket.on")
  .filter((c) => c.ast.expression.arguments.at(0)?.value === "error");
assert.isAbove(
  __errCalls.length,
  0,
  "socket.on('error', ...) should be called.",
);
const __errCb = __errCalls.at(0).ast.expression.arguments.at(1);
const __errT = new __helpers.Tower(__errCb);
const __consoleErrCalls = __errT.getCalls("console.error");
assert.isAbove(
  __consoleErrCalls.length,
  0,
  "The error handler should call console.error.",
);
```

### --before-each--

```js
const __file = await __helpers.getFile(project.dashedName, "server.js");
```

### --seed--

#### --"learn-websockets-by-building-a-resource-monitor/server.js"--

```js
import http from "http";
import fs from "fs";
import { WebSocketServer } from "ws";

const PORT = 3000;

const server = http.createServer((req, res) => {
  fs.readFile("./public/index.html", (err, data) => {
    if (err) {
      res.writeHead(500);
      res.end("Error loading page");
      return;
    }
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(data);
  });
});

const wss = new WebSocketServer({ server });

wss.on("connection", (socket) => {
  console.log("Client connected");

  socket.on("message", (data) => {
    console.log("Received:", data.toString());
  });

  socket.on("close", () => {
    console.log("Client disconnected");
  });
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
```

## 12

### --description--

Node.js includes a built-in `os` module with methods for reading system metrics. Import it at the top of `server.js`:

```js
import os from "os";
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
    memUsagePct: (
      ((os.totalmem() - os.freemem()) / os.totalmem()) *
      100
    ).toFixed(1),
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
const __t = new __helpers.Tower(__file);
const __fn = __t.getFunction("getMetrics");
assert.match(
  __fn.compact,
  /loadAvg:os\.loadavg\(\)/,
  "getMetrics should return { loadAvg: os.loadavg(), ... }.",
);
```

`getMetrics` should return `freeMemMB`, `totalMemMB`, and `memUsagePct` properties.

```js
const __t = new __helpers.Tower(__file);
const __fn = __t.getFunction("getMetrics");
assert.match(__fn.compact, /freeMemMB/, "getMetrics should include freeMemMB.");
assert.match(
  __fn.compact,
  /totalMemMB/,
  "getMetrics should include totalMemMB.",
);
assert.match(
  __fn.compact,
  /memUsagePct/,
  "getMetrics should include memUsagePct.",
);
```

### --before-each--

```js
const __file = await __helpers.getFile(project.dashedName, "server.js");
```

### --seed--

#### --"learn-websockets-by-building-a-resource-monitor/server.js"--

```js
import http from "http";
import fs from "fs";
import { WebSocketServer } from "ws";

const PORT = 3000;

const server = http.createServer((req, res) => {
  fs.readFile("./public/index.html", (err, data) => {
    if (err) {
      res.writeHead(500);
      res.end("Error loading page");
      return;
    }
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(data);
  });
});

const wss = new WebSocketServer({ server });

wss.on("connection", (socket) => {
  console.log("Client connected");

  socket.on("message", (data) => {
    console.log("Received:", data.toString());
  });

  socket.on("close", () => {
    console.log("Client disconnected");
  });

  socket.on("error", (err) => {
    console.error("Socket error:", err);
  });
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
```

## 13

### --description--

WebSocket messages are always strings (or binary buffers). To send a JavaScript object, you must first <dfn title="converting a data structure into a string for transmission">serialize</dfn> it. Use `JSON.stringify` to convert the object to a JSON string before calling `socket.send`.

Inside the `'connection'` callback, use `setInterval` to call `socket.send` with the serialized result of `getMetrics()` every `1000` milliseconds. Store the interval ID in a `const` named `interval`. Place this at the top of the callback, before the event listeners.

### --tests--

`server.js` should call `setInterval` inside the `'connection'` callback and store the result in a variable named `interval`.

```js
const __t = new __helpers.Tower(__file);
const __connCb = __t.getCalls("wss.on").at(0).ast.expression.arguments.at(1);
const __connT = new __helpers.Tower(__connCb);
const __interval = __connT.getVariable("interval");
assert.isDefined(
  __interval,
  "setInterval should be stored in a const named interval.",
);
assert.match(
  __interval.compact,
  /setInterval\(/,
  "interval should be initialized with setInterval().",
);
```

The `setInterval` callback should call `socket.send` with `JSON.stringify(getMetrics())`.

```js
const __t = new __helpers.Tower(__file);
const __connCb = __t.getCalls("wss.on").at(0).ast.expression.arguments.at(1);
const __connT = new __helpers.Tower(__connCb);
const __interval = __connT.getVariable("interval");
const __setIntervalInit = __interval.ast.declarations[0].init;
const __intervalCb = __setIntervalInit?.arguments?.at(0);
const __intervalT = new __helpers.Tower(__intervalCb);
const __sendCalls = __intervalT.getCalls("socket.send");
assert.isAbove(
  __sendCalls.length,
  0,
  "socket.send() should be called inside setInterval.",
);
assert.match(
  __sendCalls.at(0).compact,
  /JSON\.stringify\(getMetrics\(\)\)/,
  "socket.send(JSON.stringify(getMetrics())) should be called inside setInterval.",
);
```

The interval delay should be `1000` milliseconds.

```js
const __t = new __helpers.Tower(__file);
const __connCb = __t.getCalls("wss.on").at(0).ast.expression.arguments.at(1);
const __connT = new __helpers.Tower(__connCb);
const __interval = __connT.getVariable("interval");
const __setIntervalInit = __interval.ast.declarations[0].init;
const __delay = __setIntervalInit?.arguments?.at(1);
assert.equal(__delay?.value, 1000, "The setInterval delay should be 1000ms.");
```

### --before-each--

```js
const __file = await __helpers.getFile(project.dashedName, "server.js");
```

### --seed--

#### --"learn-websockets-by-building-a-resource-monitor/server.js"--

```js
import http from "http";
import fs from "fs";
import { WebSocketServer } from "ws";
import os from "os";

const PORT = 3000;

const server = http.createServer((req, res) => {
  fs.readFile("./public/index.html", (err, data) => {
    if (err) {
      res.writeHead(500);
      res.end("Error loading page");
      return;
    }
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(data);
  });
});

function getMetrics() {
  return {
    loadAvg: os.loadavg(),
    freeMemMB: (os.freemem() / 1024 / 1024).toFixed(0),
    totalMemMB: (os.totalmem() / 1024 / 1024).toFixed(0),
    memUsagePct: (
      ((os.totalmem() - os.freemem()) / os.totalmem()) *
      100
    ).toFixed(1),
  };
}

const wss = new WebSocketServer({ server });

wss.on("connection", (socket) => {
  console.log("Client connected");

  socket.on("message", (data) => {
    console.log("Received:", data.toString());
  });

  socket.on("close", () => {
    console.log("Client disconnected");
  });

  socket.on("error", (err) => {
    console.error("Socket error:", err);
  });
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
```

## 14

### --description--

`setInterval` schedules a callback to run repeatedly on Node.js's <dfn title="the mechanism that allows Node.js to perform non-blocking I/O by offloading operations and processing callbacks in a queue">event loop</dfn>. If you never cancel it, the interval keeps firing even after the client has gone — holding a reference to the closed socket and leaking memory.

Update the `'close'` handler to cancel the interval as soon as the client disconnects. Call `clearInterval` with the `interval` ID before logging the disconnect message.

### --tests--

`server.js` should call `clearInterval(interval)` inside the `'close'` handler.

```js
const __t = new __helpers.Tower(__file);
const __connCb = __t.getCalls("wss.on").at(0).ast.expression.arguments.at(1);
const __connT = new __helpers.Tower(__connCb);
const __closeCalls = __connT
  .getCalls("socket.on")
  .filter((c) => c.ast.expression.arguments.at(0)?.value === "close");
assert.isAbove(
  __closeCalls.length,
  0,
  "socket.on('close', ...) should be called.",
);
const __closeCb = __closeCalls.at(0).ast.expression.arguments.at(1);
const __closeT = new __helpers.Tower(__closeCb);
const __clearCalls = __closeT.getCalls("clearInterval");
assert.isAbove(
  __clearCalls.length,
  0,
  "clearInterval(interval) should be called inside the socket 'close' handler.",
);
assert.equal(
  __clearCalls.at(0).ast.expression.arguments.at(0)?.name,
  "interval",
  "clearInterval should be called with interval.",
);
```

### --before-each--

```js
const __file = await __helpers.getFile(project.dashedName, "server.js");
```

### --seed--

#### --"learn-websockets-by-building-a-resource-monitor/server.js"--

```js
import http from "http";
import fs from "fs";
import { WebSocketServer } from "ws";
import os from "os";

const PORT = 3000;

const server = http.createServer((req, res) => {
  fs.readFile("./public/index.html", (err, data) => {
    if (err) {
      res.writeHead(500);
      res.end("Error loading page");
      return;
    }
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(data);
  });
});

function getMetrics() {
  return {
    loadAvg: os.loadavg(),
    freeMemMB: (os.freemem() / 1024 / 1024).toFixed(0),
    totalMemMB: (os.totalmem() / 1024 / 1024).toFixed(0),
    memUsagePct: (
      ((os.totalmem() - os.freemem()) / os.totalmem()) *
      100
    ).toFixed(1),
  };
}

const wss = new WebSocketServer({ server });

wss.on("connection", (socket) => {
  console.log("Client connected");

  const interval = setInterval(() => {
    socket.send(JSON.stringify(getMetrics()));
  }, 1000);

  socket.on("message", (data) => {
    console.log("Received:", data.toString());
  });

  socket.on("close", () => {
    console.log("Client disconnected");
  });

  socket.on("error", (err) => {
    console.error("Socket error:", err);
  });
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
```

## 15

### --description--

The server is complete. Now open `public/script.js` to add the browser-side WebSocket client. The helper functions `updateMetrics` and `setStatus` are already provided — do not modify them.

WebSocket URIs use `ws://` for plain connections and `wss://` for <dfn title="Transport Layer Security — encrypts data in transit">TLS</dfn>-encrypted connections (analogous to `http://` and `https://`). Because the server is running locally without TLS, use `ws://`.

Create a `WebSocket` and store it in a constant named `socket`:

```js
const socket = new WebSocket("ws://localhost:3000");
```

### --tests--

`public/script.js` should create a `WebSocket` connection to `ws://localhost:3000` stored in a variable named `socket`.

```js
const __t = new __helpers.Tower(__script);
const __socket = __t.getVariable("socket");
assert.isDefined(__socket, "A variable named socket should be declared.");
const __init = __socket.ast.declarations[0].init;
assert.equal(
  __init?.callee?.name,
  "WebSocket",
  "socket should be initialized with new WebSocket().",
);
assert.equal(
  __init?.arguments?.at(0)?.value,
  "ws://localhost:3000",
  "WebSocket should connect to ws://localhost:3000.",
);
```

### --before-each--

```js
const __script = await __helpers.getFile(
  project.dashedName,
  "public/script.js",
);
```

### --seed--

#### --"learn-websockets-by-building-a-resource-monitor/server.js"--

```js
import http from "http";
import fs from "fs";
import { WebSocketServer } from "ws";
import os from "os";

const PORT = 3000;

const server = http.createServer((req, res) => {
  fs.readFile("./public/index.html", (err, data) => {
    if (err) {
      res.writeHead(500);
      res.end("Error loading page");
      return;
    }
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(data);
  });
});

function getMetrics() {
  return {
    loadAvg: os.loadavg(),
    freeMemMB: (os.freemem() / 1024 / 1024).toFixed(0),
    totalMemMB: (os.totalmem() / 1024 / 1024).toFixed(0),
    memUsagePct: (
      ((os.totalmem() - os.freemem()) / os.totalmem()) *
      100
    ).toFixed(1),
  };
}

const wss = new WebSocketServer({ server });

wss.on("connection", (socket) => {
  console.log("Client connected");

  const interval = setInterval(() => {
    socket.send(JSON.stringify(getMetrics()));
  }, 1000);

  socket.on("message", (data) => {
    console.log("Received:", data.toString());
  });

  socket.on("close", () => {
    clearInterval(interval);
    console.log("Client disconnected");
  });

  socket.on("error", (err) => {
    console.error("Socket error:", err);
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

## 16

### --description--

The browser's `WebSocket` object fires `onopen` when the connection is successfully established. Assign a handler to `socket.onopen` that calls `setStatus('Connected')`:

```js
socket.onopen = () => {
  setStatus("Connected");
};
```

### --tests--

`public/script.js` should assign a function to `socket.onopen`.

```js
const __t = new __helpers.Tower(__script);
const __onopenStmt = __t.ast.body.find(
  (n) =>
    n.type === "ExpressionStatement" &&
    n.expression.type === "AssignmentExpression" &&
    n.expression.left?.object?.name === "socket" &&
    n.expression.left?.property?.name === "onopen",
);
assert.isDefined(
  __onopenStmt,
  "socket.onopen should be assigned in public/script.js.",
);
```

The `onopen` handler should call `setStatus('Connected')`.

```js
const __t = new __helpers.Tower(__script);
const __onopenStmt = __t.ast.body.find(
  (n) =>
    n.type === "ExpressionStatement" &&
    n.expression.type === "AssignmentExpression" &&
    n.expression.left?.object?.name === "socket" &&
    n.expression.left?.property?.name === "onopen",
);
assert.isDefined(__onopenStmt, "socket.onopen should be assigned.");
const __onopenT = new __helpers.Tower(__onopenStmt.expression.right);
const __setStatusCalls = __onopenT.getCalls("setStatus");
assert.isAbove(
  __setStatusCalls.length,
  0,
  "The onopen handler should call setStatus.",
);
assert.equal(
  __setStatusCalls.at(0).ast.expression.arguments.at(0)?.value,
  "Connected",
  "The onopen handler should call setStatus('Connected').",
);
```

### --before-each--

```js
const __script = await __helpers.getFile(
  project.dashedName,
  "public/script.js",
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

const socket = new WebSocket("ws://localhost:3000");
```

## 17

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
const __t = new __helpers.Tower(__script);
const __onmsgStmt = __t.ast.body.find(
  (n) =>
    n.type === "ExpressionStatement" &&
    n.expression.type === "AssignmentExpression" &&
    n.expression.left?.object?.name === "socket" &&
    n.expression.left?.property?.name === "onmessage",
);
assert.isDefined(
  __onmsgStmt,
  "socket.onmessage should be assigned in public/script.js.",
);
```

The `onmessage` handler should parse `event.data` with `JSON.parse`.

```js
const __t = new __helpers.Tower(__script);
const __onmsgStmt = __t.ast.body.find(
  (n) =>
    n.type === "ExpressionStatement" &&
    n.expression.type === "AssignmentExpression" &&
    n.expression.left?.object?.name === "socket" &&
    n.expression.left?.property?.name === "onmessage",
);
assert.isDefined(__onmsgStmt, "socket.onmessage should be assigned.");
const __onmsgT = new __helpers.Tower(__onmsgStmt.expression.right);
const __dataVar = __onmsgT.getVariable("data");
assert.match(
  __dataVar.compact,
  /JSON\.parse\(event\.data\)/,
  "The onmessage handler should call JSON.parse(event.data).",
);
```

The `onmessage` handler should call `updateMetrics` with the parsed data.

```js
const __t = new __helpers.Tower(__script);
const __onmsgStmt = __t.ast.body.find(
  (n) =>
    n.type === "ExpressionStatement" &&
    n.expression.type === "AssignmentExpression" &&
    n.expression.left?.object?.name === "socket" &&
    n.expression.left?.property?.name === "onmessage",
);
assert.isDefined(__onmsgStmt, "socket.onmessage should be assigned.");
const __onmsgT = new __helpers.Tower(__onmsgStmt.expression.right);
const __updateCalls = __onmsgT.getCalls("updateMetrics");
assert.isAbove(
  __updateCalls.length,
  0,
  "The onmessage handler should call updateMetrics.",
);
assert.equal(
  __updateCalls.at(0).ast.expression.arguments.at(0)?.name,
  "data",
  "The onmessage handler should call updateMetrics(data).",
);
```

### --before-each--

```js
const __script = await __helpers.getFile(
  project.dashedName,
  "public/script.js",
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

const socket = new WebSocket("ws://localhost:3000");

socket.onopen = () => {
  setStatus("Connected");
};
```

## 18

### --description--

The `onclose` event fires when the WebSocket connection is closed — either by the server shutting down or the network dropping. Assign a handler to `socket.onclose` that calls `setStatus('Disconnected')`:

```js
socket.onclose = () => {
  setStatus("Disconnected");
};
```

### --tests--

`public/script.js` should assign a function to `socket.onclose`.

```js
const __t = new __helpers.Tower(__script);
const __oncloseStmt = __t.ast.body.find(
  (n) =>
    n.type === "ExpressionStatement" &&
    n.expression.type === "AssignmentExpression" &&
    n.expression.left?.object?.name === "socket" &&
    n.expression.left?.property?.name === "onclose",
);
assert.isDefined(
  __oncloseStmt,
  "socket.onclose should be assigned in public/script.js.",
);
```

The `onclose` handler should call `setStatus('Disconnected')`.

```js
const __t = new __helpers.Tower(__script);
const __oncloseStmt = __t.ast.body.find(
  (n) =>
    n.type === "ExpressionStatement" &&
    n.expression.type === "AssignmentExpression" &&
    n.expression.left?.object?.name === "socket" &&
    n.expression.left?.property?.name === "onclose",
);
assert.isDefined(__oncloseStmt, "socket.onclose should be assigned.");
const __oncloseT = new __helpers.Tower(__oncloseStmt.expression.right);
const __setStatusCalls = __oncloseT.getCalls("setStatus");
assert.isAbove(
  __setStatusCalls.length,
  0,
  "The onclose handler should call setStatus.",
);
assert.equal(
  __setStatusCalls.at(0).ast.expression.arguments.at(0)?.value,
  "Disconnected",
  "The onclose handler should call setStatus('Disconnected').",
);
```

### --before-each--

```js
const __script = await __helpers.getFile(
  project.dashedName,
  "public/script.js",
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

const socket = new WebSocket("ws://localhost:3000");

socket.onopen = () => {
  setStatus("Connected");
};

socket.onmessage = (event) => {
  const data = JSON.parse(event.data);
  updateMetrics(data);
};
```

## 19

### --description--

The `onerror` event fires when the connection encounters an error before it can close normally. Assign a handler to `socket.onerror` that logs the error to the console:

```js
socket.onerror = (err) => {
  console.error("WebSocket error:", err);
};
```

The resource monitor is now complete. Run `npm start` to start the server, then open `http://localhost:3000` in a browser. You should see live CPU load averages and memory usage updating every second.

### --tests--

`public/script.js` should assign a function to `socket.onerror`.

```js
const __t = new __helpers.Tower(__script);
const __onerrorStmt = __t.ast.body.find(
  (n) =>
    n.type === "ExpressionStatement" &&
    n.expression.type === "AssignmentExpression" &&
    n.expression.left?.object?.name === "socket" &&
    n.expression.left?.property?.name === "onerror",
);
assert.isDefined(
  __onerrorStmt,
  "socket.onerror should be assigned in public/script.js.",
);
```

The `onerror` handler should call `console.error`.

```js
const __t = new __helpers.Tower(__script);
const __onerrorStmt = __t.ast.body.find(
  (n) =>
    n.type === "ExpressionStatement" &&
    n.expression.type === "AssignmentExpression" &&
    n.expression.left?.object?.name === "socket" &&
    n.expression.left?.property?.name === "onerror",
);
assert.isDefined(__onerrorStmt, "socket.onerror should be assigned.");
const __onerrorT = new __helpers.Tower(__onerrorStmt.expression.right);
const __consoleErrCalls = __onerrorT.getCalls("console.error");
assert.isAbove(
  __consoleErrCalls.length,
  0,
  "The onerror handler should call console.error.",
);
```

### --before-each--

```js
const __script = await __helpers.getFile(
  project.dashedName,
  "public/script.js",
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

const socket = new WebSocket("ws://localhost:3000");

socket.onopen = () => {
  setStatus("Connected");
};

socket.onmessage = (event) => {
  const data = JSON.parse(event.data);
  updateMetrics(data);
};

socket.onclose = () => {
  setStatus("Disconnected");
};
```

## --fcc-end--
