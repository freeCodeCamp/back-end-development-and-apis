# Learn Nodejs by Building a Web Server

You will learn the Node.js http module by building a web server to serve a multi-page client application.

## 0

### --description--

In this project, you will use Nodejs' built-in `http` module to create a web server that serves a client application.

For the duration of this project, you will be working within the `learn-nodejs-by-building-a-web-server/` directory.

Open a new terminal, and change into the `learn-nodejs-by-building-a-web-server/` directory.

### --tests--

You should be within the `learn-nodejs-by-building-a-web-server/` directory.

```js
const cwd = await __helpers.getLastCWD();
assert.include(cwd, project.dashedName);
```

## 1

### --description--

You have been started with a few files for the client application within the `public/` directory.

Create a `server.js` file to house the server code.

### --tests--

You should create a `learn-nodejs-by-building-a-web-server/server.js` file.

```js
const fileExists = await __helpers.fileExists(
  join(project.dashedName, "server.js"),
);
assert.isTrue(fileExists, "The server.js file does not exist");
```

## 2

### --description--

Within the `server.js` file, import the `http` module, and store it in a variable called `http`.

### --tests--

You should have `const http = require("http")` within `server.js`.

```js
const file = await __helpers.getFile(project.dashedName, "server.js");
const t = new __helpers.Tower(file);
const http = t.getVariable("http");
assert.equal(http.compact, 'const http=require("http");');
```

### --seed--

#### --cmd--

```bash
touch learn-nodejs-by-building-a-web-server/server.js
```

## 3

### --description--

To create a server, use the `createServer` method of the `http` module. Store the returned `http.Server` instance in a variable called `server`.

### --tests--

You should have `const server = http.createServer()` within `server.js`.

```js
const file = await __helpers.getFile(project.dashedName, "server.js");
const t = new __helpers.Tower(file);
const server = t.getVariable("server");
assert.equal(server.compact, "const server=http.createServer();");
```

### --seed--

#### --"learn-nodejs-by-building-a-web-server/server.js"--

```js
const http = require("http");
```

## 4

### --description--

The `createServer` method takes a callback function as an argument. This callback function will be called whenever a request is made to the server.

Pass a callback function to the `createServer` method. The callback function should take two arguments: `request` and `response`.

### --tests--

You should have `http.createServer((request, response) => {})` within `server.js`.

```js
const file = await __helpers.getFile(project.dashedName, "server.js");
const t = new __helpers.Tower(file);
const server = t.getVariable("server");
const http_createServer_calls = server.getCalls("http.createServer");
const http_createServer = http_createServer_calls.at(0);
const arg1 = http_createServer.ast?.init?.arguments.at(0);
const [request, response] = arg1?.params;
assert.equal(request.name, "request");
assert.equal(response.name, "response");
```

### --seed--

#### --"learn-nodejs-by-building-a-web-server/server.js"--

```js
const http = require("http");

const server = http.createServer();
```

## 5

### --description--

To get the server to listen for <dfn title="Transmission Control Protocol">TCP</dfn> connections, at the bottom of your file, call the `listen` method on the `server` instance.

### --tests--

You should have `server.listen()` at the bottom of `server.js`.

```js
const file = await __helpers.getFile(project.dashedName, "server.js");
const t = new __helpers.Tower(file);
const server_listen = t.getCalls("server.listen");
assert.equal(server_listen.length, 1);
```

### --seed--

#### --"learn-nodejs-by-building-a-web-server/server.js"--

```js
const http = require("http");

const server = http.createServer((request, response) => {});
```

## 6

### --description--

The `listen` method takes a port number as its first argument. Pass `3001` as the first argument to the `listen` method to bind to port `3001`.

### --tests--

You should have `server.listen(3001)` at the bottom of `server.js`.

```js
const file = await __helpers.getFile(project.dashedName, "server.js");
const t = new __helpers.Tower(file);
const server_listen = t.getCalls("server.listen");
const arg = server_listen.at(0).ast.expression.arguments.at(0);
assert.equal(arg.value, 3001);
```

### --seed--

#### --"learn-nodejs-by-building-a-web-server/server.js"--

```js
const http = require("http");

const server = http.createServer((request, response) => {});

server.listen();
```

## 7

### --description--

Within your terminal, start the server by running `node server.js`.

**NOTE:** Once your server is running, click the _Run Tests_ button.

### --tests--

You should start the server by running `node server.js`.

```js
const isListening = await __helpers.isServerListening(3001);
assert.isTrue(isListening, "The server is not listening on port 3001");
```

### --seed--

#### --"learn-nodejs-by-building-a-web-server/server.js"--

```js
const http = require("http");

const server = http.createServer((request, response) => {});

server.listen(3001);
```

## 8

### --description--

To test your server, you can either open your browser and navigate to `http://localhost:3001`, or use the `curl` command in your terminal.

Within a new terminal, use the `curl` command to make a request to `http://localhost:3001`:

```sh
curl http://localhost:3001
```

When you have made the request, click the _Run Tests_ button.

### --tests--

You should make a request to `http://localhost:3001` using the `curl` command.

```js
const temp = await __helpers.getTemp();
assert.include(temp, "curl http://localhost:3001");
```

## 9

### --description--

Your `curl` command is hanging, because your server is not responding with anything. Stop it by pressing `Ctrl + C` in the terminal you called `curl`.

To make sure your server is working, use the `--verbose` flag with the `curl` command to see more about the operation, and use the `--max-time` flag with a value of `2` to set a maximum time for the request to complete:

```sh
curl --verbose --max-time 2 http://localhost:3001
```

### --tests--

You should run `curl --verbose --max-time 2 http://localhost:3001` in the terminal.

```js
await new Promise((resolve) => {
  setTimeout(() => {
    resolve();
  }, 2100);
});
const lastCommand = await __helpers.getLastCommand();
assert.include(
  lastCommand,
  "curl --verbose --max-time 2 http://localhost:3001",
);
```

## 10

### --description--

Included in the output should be `Connected to localhost (127.0.0.1) port 3001`. This means that the server is running and listening for connections.

In order to use changes made to your server, you need to restart the server once the changes have been made to the script. Stop the server running in the other terminal by pressing `Ctrl + C`.

### --tests--

You should stop the server.

```js
const isListening = await __helpers.isServerListening(3001);
assert.isFalse(isListening, "The server is still listening on port 3001");
```

## 11

### --description--

To find out more about what is happening when a request is made to the server, log the `request` object to the console within the `createServer` callback function.

### --tests--

You should log the `request` object to the console within the `createServer` callback function.

```js
const { mkdir, writeFile, cp } = await import("fs/promises");
await mkdir(join(ROOT, "__test"), { recursive: true });

await cp(join(ROOT, project.dashedName), join(ROOT, "__test"), {
  recursive: true,
});

const file = await __helpers.getFile(project.dashedName, "server.js");
const t = new __helpers.Tower(file);
const server_listen = t.getCalls("server.listen");
const arg = server_listen.at(0).ast.expression.arguments.at(0);
arg.value = 3002;

const testServerPath = join(ROOT, "__test", "server.js");

await writeFile(testServerPath, t.generate);

const expectedData = "IncomingMessage {";
const { stdout } = await __helpers.awaitExecution(
  ["node", testServerPath],
  "http://localhost:3002",
  { expectedData },
);
assert.include(stdout, expectedData);
```

### --after-all--

```js
const { rm } = await import("fs/promises");
await rm(join(ROOT, "__test"), { recursive: true, force: true });
```

## 12

### --description--

Restart your server again.

**Note**: Once running, click the "Rust Tests" button.

### --tests--

You should start the server by running `node server.js`.

```js
const isListening = await __helpers.isServerListening(3001);
assert.isTrue(isListening, "The server is not listening on port 3001");
```

## 13

### --description--

Within the other terminal, use `curl` again to make an empty request again.

### --hints--

#### 0

When you log the `request` object to the console, you will see a lot of information.

### --tests--

You should run `curl --max-time 2 http://localhost:3001` in the terminal.

```js
const lastCommand = await __helpers.getLastCommand();
const [command, ...args] = __helpers.parseCli(lastCommand);
assert.equal(command, "curl");
assert.include(args, "http://localhost:3001");
```

### --seed--

#### --"learn-nodejs-by-building-a-web-server/server.js"--

```js
const http = require("http");

const server = http.createServer((request, response) => {
  console.log(request);
});

server.listen(3001);
```

## 14

### --description--

Yikes! 😅 The server terminal is showing a lot of information. You are probably not interested in all of that. So, log just the `headers` property of the request.

Request headers are a set of key-value pairs that contain information about the request, such as the `User-Agent` (the client application making the request), `Accept` (the media types the client can understand), and `Accept-Language` (the language the client prefers for the response).

### --tests--

You should log `request.headers` to the console within the `createServer` callback function.

```js
const { mkdir, writeFile, cp } = await import("fs/promises");
await mkdir(join(ROOT, "__test"), { recursive: true });

await cp(join(ROOT, project.dashedName), join(ROOT, "__test"), {
  recursive: true,
});

const file = await __helpers.getFile(project.dashedName, "server.js");
const t = new __helpers.Tower(file);
const server_listen = t.getCalls("server.listen");
const arg = server_listen.at(0).ast.expression.arguments.at(0);
arg.value = 3002;

const testServerPath = join(ROOT, "__test", "server.js");

await writeFile(testServerPath, t.generate);

const expectedData = "host:";
const { stdout } = await __helpers.awaitExecution(
  ["node", testServerPath],
  "http://localhost:3002",
  { expectedData },
);
assert.notInclude(stdout, "IncomingMessage {");
```

### --after-all--

```js
const { rm } = await import("fs/promises");
await rm(join(ROOT, "__test"), { recursive: true, force: true });
```

## 15

### --description--

Restart your server by stopping it with `Ctrl + C` and then running `node server.js` again.

### --tests--

You should restart the server.

```js
try {
  fetch("http://localhost:3001");
  // Server does not respond, so catch the error
} catch (_e) {}
await new Promise((resolve) => {
  setTimeout(() => {
    resolve();
  }, 50);
});
const temp = await __helpers.getTemp();
assert.include(temp, "IncomingMessage {");
```

## 16

### --description--

Within the other terminal, use `curl` again to make an empty request again.

### --tests--

You should run `curl --max-time 2 http://localhost:3001` in the terminal.

```js
const lastCommand = await __helpers.getLastCommand();
const [command, ...args] = __helpers.parseCli(lastCommand);
assert.equal(command, "curl");
assert.include(args, "http://localhost:3001");
```

### --seed--

#### --"learn-nodejs-by-building-a-web-server/server.js"--

```js
const http = require("http");

const server = http.createServer((request, response) => {
  console.log(request.headers);
});

server.listen(3001);
```

## 17

### --description--

A URL (Uniform Resource Locator) is a reference to a web resource that specifies its location on a computer network and a mechanism for retrieving it. The URL contains the name of the protocol to be used to access the resource and a resource name.

Along with the `headers`, you will be using the `url` property of the `request` object to determine which resource the client is requesting.

Log the `url` property of the `request` object to the console.

### --tests--

You should log `request.url` to the console within the `createServer` callback function.

```js
const file = await __helpers.getFile(project.dashedName, "server.js");
const t = new __helpers.Tower(file);
const server = t.getVariable("server");
const http_createServer = server.getCalls("http.createServer").at(0);
const callback = http_createServer.ast.init.arguments[0];
const cbTower = new __helpers.Tower(callback);
const logs = cbTower.getCalls("console.log");
assert.isTrue(logs.some((l) => l.generate.includes("request.url")));
```

## 18

### --description--

Restart your server by stopping it with `Ctrl + C` and then running `node server.js` again. Within a new terminal, use `curl` to make a request to `http://localhost:3001/test-url`.

**NOTE:** Once you have made the request, click the _Run Tests_ button.

### --tests--

You should restart the server, and make a request to it.

```js
const temp = await __helpers.getTemp();
assert.include(temp, "curl http://localhost:3001/test-url");
```

### --seed--

#### --"learn-nodejs-by-building-a-web-server/server.js"--

```js
const http = require("http");

const server = http.createServer((request, response) => {
  console.log(request.headers);
  console.log(request.url);
});

server.listen(3001);
```

## 19

### --description--

As previously noted, requests are hanging, because your server does not respond with anything.

Use the `response.end` function to send the request `url` back to the client:

```js
response.end("Data to send back to the client");
```

### --tests--

You should have `response.end(request.url)` within the `createServer` callback function.

```js
const file = await __helpers.getFile(project.dashedName, "server.js");
const t = new __helpers.Tower(file);
const server = t.getVariable("server");
const http_createServer = server.getCalls("http.createServer").at(0);
const callback = http_createServer.ast.init.arguments[0];
const cbTower = new __helpers.Tower(callback);
const ends = cbTower.getCalls("response.end");
assert.equal(ends.at(0).compact, "response.end(request.url);");
```

## 20

### --description--

Restart your server, and make a request to `http://localhost:3001/hello`. You no longer need to add a timeout to your `curl` command, because your sever is responding with something.

### --tests--

You should restart the server, and make a request to it.

```js
const temp = await __helpers.getTemp();
assert.include(temp, "curl http://localhost:3001/hello");
```

### --seed--

#### --"learn-nodejs-by-building-a-web-server/server.js"--

```js
const http = require("http");

const server = http.createServer((request, response) => {
  console.log(request.headers);
  console.log(request.url);
  response.end(request.url);
});

server.listen(3001);
```

## 21

### --description--

Your project has the following file structure:

```markdown
public/
├── index.html
├── products.html
├── about.html
├── 404.html
├── forrest1.png
├── forrest2.png
├── forrest3.png
└── style.css
package.json
server.js
```

When users visit a certain URL, your server should respond with the correct page - `http://localhost:3001/products` should get the response `./public/products.html`.

Create a variable called `url` and set it equal to `"/index.html"` if `request.url` is `/`, else set it equal to `request.url`.

### --tests--

You should have `const url = request.url === "/" ? "/index.html" : request.url` within the `createServer` callback function.

```js
const file = await __helpers.getFile(project.dashedName, "server.js");
const t = new __helpers.Tower(file);
const server = t.getVariable("server");
const http_createServer = server.getCalls("http.createServer").at(0);
const callback = http_createServer.ast.init.arguments[0];
const cbTower = new __helpers.Tower(callback);
const urlVar = cbTower.getVariable("url");
assert.include(
  urlVar.compact,
  'const url=request.url==="/"?"/index.html":request.url',
);
```

## 22

### --description--

The `response.end` function takes a second argument that is the encoding of the data being sent. This helps the client to understand how to interpret the data.

Send the value of the `url` variable, and set the encoding to `"utf-8"`.

### --tests--

You should have `response.end(url, "utf-8")` within the `createServer` callback function.

```js
const file = await __helpers.getFile(project.dashedName, "server.js");
const t = new __helpers.Tower(file);
const server = t.getVariable("server");
const http_createServer = server.getCalls("http.createServer").at(0);
const callback = http_createServer.ast.init.arguments[0];
const cbTower = new __helpers.Tower(callback);
const ends = cbTower.getCalls("response.end");
assert.equal(ends.at(0).compact, 'response.end(url,"utf-8");');
```

### --seed--

#### --"learn-nodejs-by-building-a-web-server/server.js"--

```js
const http = require("http");

const server = http.createServer((request, response) => {
  console.log(request.headers);
  console.log(request.url);
  const url = request.url === "/" ? "/index.html" : request.url;
  response.end(request.url);
});

server.listen(3001);
```

## 23

### --description--

Restart your server by stopping it with `Ctrl + C` and then running `node server.js` again. Within a new terminal, use `curl` to make a request to `http://localhost:3001/`.

### --tests--

You should restart the server, and make a request to it.

```js
const temp = await __helpers.getTemp();
assert.include(temp, "curl http://localhost:3001/");
```

## 24

### --description--

Looking back at your project file structure:

<details>
  <summary>File Structure:</summary>
```markdown
public/
├── index.html
├── products.html
├── about.html
├── 404.html
├── forrest1.png
├── forrest2.png
├── forrest3.png
└── style.css
package.json
server.js
```

</details>

You can see `public/` needs to be prepended to the `url` variable to get the correct file path. Whilst you could use string concatenation, it is better to use the `path` module's `join` function to join the directory with the `url` variable:

```js
const fullPath = path.join("first", "second", "third");
console.log(fullPath); // first/second/third
```

Create a `filePath` variable, and assign it the value of joining `"public"` with `url`.

### --tests--

You should have `const filePath = join("public", url)` within the `createServer` callback function.

```js
const file = await __helpers.getFile(project.dashedName, "server.js");
const t = new __helpers.Tower(file);
const server = t.getVariable("server");
const http_createServer = server.getCalls("http.createServer").at(0);
const callback = http_createServer.ast.init.arguments[0];
const cbTower = new __helpers.Tower(callback);
const filePathVar = cbTower.getVariable("filePath");
assert.equal(filePathVar.compact, 'const filePath=join("public",url);');
```

### --seed--

#### --"learn-nodejs-by-building-a-web-server/server.js"--

```js
const http = require("http");

const server = http.createServer((request, response) => {
  console.log(request.headers);
  console.log(request.url);
  const url = request.url === "/" ? "/index.html" : request.url;
  response.end(url, "utf-8");
});

server.listen(3001);
```

## 25

### --description--

Import the `join` function from the `path` module.

### --tests--

You should have `const { join } = require("path")` at the top of `server.js`.

```js
const file = await __helpers.getFile(project.dashedName, "server.js");
const t = new __helpers.Tower(file);
const joinVar = t.getVariable("join");
assert.include(joinVar.compact, 'const{join}=require("path")');
```

### --seed--

#### --"learn-nodejs-by-building-a-web-server/server.js"--

```js
const http = require("http");

const server = http.createServer((request, response) => {
  console.log(request.headers);
  console.log(request.url);
  const { join } = require("path");
  const url = request.url === "/" ? "/index.html" : request.url;
  response.end(url, "utf-8");
  const filePath = join("public", url);
});

server.listen(3001);
```

## 26

### --description--

Change your `response.end` function to send the `filePath` variable.

### --tests--

You should have `response.end(filePath, "utf-8")` within the `createServer` callback function.

```js
const file = await __helpers.getFile(project.dashedName, "server.js");
const t = new __helpers.Tower(file);
const server = t.getVariable("server");
const http_createServer = server.getCalls("http.createServer").at(0);
const callback = http_createServer.ast.init.arguments[0];
const cbTower = new __helpers.Tower(callback);
const ends = cbTower.getCalls("response.end");
assert.equal(ends.at(0).compact, 'response.end(filePath,"utf-8");');
```

You should define `filePath` before calling `response.end`.

```js
const file = await __helpers.getFile(project.dashedName, "server.js");
const t = new __helpers.Tower(file);
const server = t.getVariable("server");
const http_createServer = server.getCalls("http.createServer").at(0);
const callback = http_createServer.ast.init.arguments[0];
const cbTower = new __helpers.Tower(callback);
const filePathVar = cbTower.getVariable("filePath");
const ends = cbTower.getCalls("response.end");
assert.isBelow(filePathVar.ast.start, ends.at(0).ast.start);
```

### --seed--

#### --"learn-nodejs-by-building-a-web-server/server.js"--

```js
const http = require("http");
const { join } = require("path");

const server = http.createServer((request, response) => {
  console.log(request.headers);
  console.log(request.url);
  const url = request.url === "/" ? "/index.html" : request.url;
  response.end(url, "utf-8");
  const filePath = join("public", url);
});

server.listen(3001);
```

## 27

### --description--

Restart your server, and make a request to `http://localhost:3001/index.html`.

### --tests--

You should restart the server, and make a request to it.

```js
const temp = await __helpers.getTemp();
assert.include(temp, "curl http://localhost:3001/index.html");
```

### --seed--

#### --"learn-nodejs-by-building-a-web-server/server.js"--

```js
const http = require("http");
const { join } = require("path");

const server = http.createServer((request, response) => {
  console.log(request.headers);
  console.log(request.url);
  const url = request.url === "/" ? "/index.html" : request.url;
  const filePath = join("public", url);
  response.end(filePath, "utf-8");
});

server.listen(3001);
```

## 28

### --description--

Whilst sending the file path to the client is fun, it is not what you want to do. You want to send the file itself.

First, you need to read the file from the _file system_. Use the `readFile` function from the `fs` module, and pass the `filePath` variable as the first argument:

```js
fs.readFile("relative/path/to/file");
```

### --tests--

You should have `readFile(filePath)` within the `createServer` callback function.

```js
const file = await __helpers.getFile(project.dashedName, "server.js");
const t = new __helpers.Tower(file);
const server = t.getVariable("server");
const http_createServer = server.getCalls("http.createServer").at(0);
const callback = http_createServer.ast.init.arguments[0];
const cbTower = new __helpers.Tower(callback);
const readFiles = cbTower.getCalls("readFile");
assert.equal(readFiles.at(0).compact, "readFile(filePath);");
```

## 29

### --description--

Import the `readFile` function from the `fs` module.

### --tests--

You should have `const { readFile } = require("fs")` at the top of `server.js`.

```js
const file = await __helpers.getFile(project.dashedName, "server.js");
const t = new __helpers.Tower(file);
const readFileVar = t.getVariable("readFile");
assert.include(readFileVar.compact, 'const{readFile}=require("fs")');
```

### --seed--

#### --"learn-nodejs-by-building-a-web-server/server.js"--

```js
const http = require("http");
const { join } = require("path");

const server = http.createServer((request, response) => {
  console.log(request.headers);
  console.log(request.url);
  const url = request.url === "/" ? "/index.html" : request.url;
  const filePath = join("public", url);
  response.end(filePath, "utf-8");

  readFile(filePath);
});

server.listen(3001);
```

## 30

### --description--

The `readFile` function takes a callback function as its second argument. This callback function will be called once the file has been read:

```js
readFile("relative/path/to/file", (error, data) => {
  if (error) {
    console.error(error);
    return;
  }
  console.log(data);
});
```

Pass a callback function to the `readFile` function. The callback function should take two arguments: `error` and `file`.

### --tests--

You should have `readFile(filePath, (error, file) => {})` within the `createServer` callback function.

```js
const file = await __helpers.getFile(project.dashedName, "server.js");
const t = new __helpers.Tower(file);
const server = t.getVariable("server");
const http_createServer = server.getCalls("http.createServer").at(0);
const callback = http_createServer.ast.init.arguments[0];
const cbTower = new __helpers.Tower(callback);
const readFiles = cbTower.getCalls("readFile");
const arg2 = readFiles.at(0).ast.expression.arguments[1];
assert.equal(arg2.params[0].name, "error");
assert.equal(arg2.params[1].name, "file");
```

### --seed--

#### --"learn-nodejs-by-building-a-web-server/server.js"--

```js
const http = require("http");
const { join } = require("path");
const { readFile } = require("fs");

const server = http.createServer((request, response) => {
  console.log(request.headers);
  console.log(request.url);
  const url = request.url === "/" ? "/index.html" : request.url;
  const filePath = join("public", url);
  response.end(filePath, "utf-8");

  readFile(filePath);
});

server.listen(3001);
```

## 31

### --description--

If there is an error reading the file, the first callback argument will be an `ErrnoException` object. Write an `if` statement to check if there is an error reading the file. If there is, log the error to the console and return from the function.

### --tests--

You should have `if (error) { console.error(error); return; }` within the `readFile` callback function.

```js
const file = await __helpers.getFile(project.dashedName, "server.js");
const t = new __helpers.Tower(file);
const server = t.getVariable("server");
const http_createServer = server.getCalls("http.createServer").at(0);
const callback = http_createServer.ast.init.arguments[0];
const cbTower = new __helpers.Tower(callback);
const readFiles = cbTower.getCalls("readFile");
const readFileCallback = readFiles.at(0).ast.expression.arguments[1];
const rfcbTower = new __helpers.Tower(readFileCallback);
const errorIf = rfcbTower
  .getIfStatements()
  .find((i) => i.test.name === "error");
assert.isDefined(
  errorIf,
  "You should have an if statement checking for 'error'",
);
assert.include(rfcbTower.compact, "if(error){console.error(error);return;}");
```

### --seed--

#### --"learn-nodejs-by-building-a-web-server/server.js"--

```js
const http = require("http");
const { join } = require("path");
const { readFile } = require("fs");

const server = http.createServer((request, response) => {
  console.log(request.headers);
  console.log(request.url);
  const url = request.url === "/" ? "/index.html" : request.url;
  const filePath = join("public", url);
  response.end(filePath, "utf-8");

  readFile(filePath, (error, file) => {});
});

server.listen(3001);
```

## 32

### --description--

If there is no error reading the file, the first callback argument will be `null`, and the second argument will be the file data. Change the `response.end` function to send the file data to the client.

### --tests--

You should have `response.end(file, "utf-8")` within the `readFile` callback function.

```js
const file = await __helpers.getFile(project.dashedName, "server.js");
const t = new __helpers.Tower(file);
const server = t.getVariable("server");
const http_createServer = server.getCalls("http.createServer").at(0);
const callback = http_createServer.ast.init.arguments[0];
const cbTower = new __helpers.Tower(callback);
const readFiles = cbTower.getCalls("readFile");
const readFileCallback = readFiles.at(0).ast.expression.arguments[1];
const rfcbTower = new __helpers.Tower(readFileCallback);
const ends = rfcbTower.getCalls("response.end");
assert.isTrue(
  ends.some((e) => e.compact === 'response.end(file,"utf-8");'),
  'You should have response.end(file, "utf-8") within the readFile callback function.',
);
```

### --seed--

#### --"learn-nodejs-by-building-a-web-server/server.js"--

```js
const http = require("http");
const { join } = require("path");
const { readFile } = require("fs");

const server = http.createServer((request, response) => {
  console.log(request.headers);
  console.log(request.url);
  const url = request.url === "/" ? "/index.html" : request.url;
  const filePath = join("public", url);
  response.end(filePath, "utf-8");

  readFile(filePath, (error, file) => {
    if (error) {
      console.error(error);
      return;
    }
  });
});

server.listen(3001);
```

## 33

### --description--

Restart your server, and make a request to it.

### --tests--

You should restart the server, and make a request to it.

```js
const temp = await __helpers.getTemp();
assert.include(temp, "curl http://localhost:3001/");
```

### --seed--

#### --"learn-nodejs-by-building-a-web-server/server.js"--

```js
const http = require("http");
const { join } = require("path");
const { readFile } = require("fs");

const server = http.createServer((request, response) => {
  console.log(request.headers);
  console.log(request.url);
  const url = request.url === "/" ? "/index.html" : request.url;
  const filePath = join("public", url);

  readFile(filePath, (error, file) => {
    if (error) {
      console.error(error);
      return;
    }
    response.end(file, "utf-8");
  });
});

server.listen(3001);
```

## 34

### --description--

Make a request to a path that does not exist.

### --tests--

You should make a request to a path that does not exist.

```js
const lastCommand = await __helpers.getLastCommand();
const [command, ...args] = __helpers.parseCli(lastCommand);
assert.equal(command, "curl");
const urlArg = args.find((a) => a.startsWith("http"));
assert.notEqual(urlArg, "http://localhost:3001/");
assert.notEqual(urlArg, "http://localhost:3001/index.html");
```

## 35

### --description--

You should see an error in the terminal. This is because the `readFile` function is trying to read a file that does not exist. Also, your `curl` command is hanging, because your server is not responding with anything.

Instead of returning from the function when there is an error reading the file, add another `response.end` to send the `error` to the client.

### --tests--

You should have `response.end(error, "utf-8")` within the `readFile` callback function.

```js
const file = await __helpers.getFile(project.dashedName, "server.js");
const t = new __helpers.Tower(file);
const server = t.getVariable("server");
const http_createServer = server.getCalls("http.createServer").at(0);
const callback = http_createServer.ast.init.arguments[0];
const cbTower = new __helpers.Tower(callback);
const readFiles = cbTower.getCalls("readFile");
const readFileCallback = readFiles.at(0).ast.expression.arguments[1];
const rfcbTower = new __helpers.Tower(readFileCallback);
const errorIf = rfcbTower
  .getIfStatements()
  .find((i) => i.test.name === "error");
const ifTower = new __helpers.Tower(errorIf.consequent);
const ends = ifTower.getCalls("response.end");
assert.isTrue(
  ends.some((e) => e.compact === 'response.end(error,"utf-8");'),
  'You should have response.end(error, "utf-8") within the if block.',
);
```

## 36

### --description--

Restart your server, and make a request to an invalid path.

### --tests--

You should restart the server, and make a request to it.

```js
const temp = await __helpers.getTemp();
assert.include(temp, "curl http://localhost:3001/");
```

### --seed--

#### --"learn-nodejs-by-building-a-web-server/server.js"--

```js
const http = require("http");
const { join } = require("path");
const { readFile } = require("fs");

const server = http.createServer((request, response) => {
  console.log(request.headers);
  console.log(request.url);
  const url = request.url === "/" ? "/index.html" : request.url;
  const filePath = join("public", url);

  readFile(filePath, (error, file) => {
    if (error) {
      console.error(error);
      response.end(error, "utf-8");
    }
    response.end(file, "utf-8");
  });
});

server.listen(3001);
```

## 37

### --description--

Your server crashed! 😱 This is because you are trying to send the `error` to the client, but the `error` is an object, and the `response.end` function only accepts a string or a buffer:

```bash
TypeError [ERR_INVALID_ARG_TYPE]: The "chunk" argument must be of type string or an instance of Buffer or Uint8Array. Received an instance of Error
```

Instead of trying ot send the whole `Error` object, send the `error.message` value.

### --tests--

You should have `response.end(error.message, "utf-8")` within the `readFile` callback function.

```js
const file = await __helpers.getFile(project.dashedName, "server.js");
const t = new __helpers.Tower(file);
const server = t.getVariable("server");
const http_createServer = server.getCalls("http.createServer").at(0);
const callback = http_createServer.ast.init.arguments[0];
const cbTower = new __helpers.Tower(callback);
const readFiles = cbTower.getCalls("readFile");
const readFileCallback = readFiles.at(0).ast.expression.arguments[1];
const rfcbTower = new __helpers.Tower(readFileCallback);
const errorIf = rfcbTower
  .getIfStatements()
  .find((i) => i.test.name === "error");
const ifTower = new __helpers.Tower(errorIf.consequent);
const ends = ifTower.getCalls("response.end");
assert.isTrue(
  ends.some((e) => e.compact === 'response.end(error.message,"utf-8");'),
  'You should have response.end(error.message, "utf-8") within the if block.',
);
```

## 38

### --description--

Restart your server, and make a request to an invalid path.

### --tests--

You should restart the server, and make a request to it.

```js
const lastCommand = await __helpers.getLastCommand();
const [command, ...args] = __helpers.parseCli(lastCommand);
assert.equal(command, "curl");
const urlArg = args.find((a) => a.startsWith("http"));
assert.isTrue(
  urlArg.includes("localhost:3001/"),
  "You should curl the server at port 3001",
);
assert.notEqual(
  urlArg,
  "http://localhost:3001/",
  "You should curl an invalid path",
);
assert.notEqual(
  urlArg,
  "http://localhost:3001/index.html",
  "You should curl an invalid path",
);
```

### --seed--

#### --"learn-nodejs-by-building-a-web-server/server.js"--

```js
const http = require("http");
const { join } = require("path");
const { readFile } = require("fs");

const server = http.createServer((request, response) => {
  console.log(request.headers);
  console.log(request.url);
  const url = request.url === "/" ? "/index.html" : request.url;
  const filePath = join("public", url);

  readFile(filePath, (error, file) => {
    if (error) {
      console.error(error);
      response.end(error.message, "utf-8");
    }
    response.end(file, "utf-8");
  });
});

server.listen(3001);
```

## 39

### --description--

That is better. However, you have a small bug in your code. `response.end` is being called twice. This is because you are calling `response.end` within the `readFile` `if` statement, and then again outside it. This is not a problem now, but is something that could cause confusion in the future.

Return from the function after calling `response.end` within the `if` statement.

### --tests--

You should return from the function after calling `response.end` within the `if` statement.

```js
const file = await __helpers.getFile(project.dashedName, "server.js");
const t = new __helpers.Tower(file);
const server = t.getVariable("server");
const http_createServer = server.getCalls("http.createServer").at(0);
const callback = http_createServer.ast.init.arguments[0];
const cbTower = new __helpers.Tower(callback);
const readFiles = cbTower.getCalls("readFile");
const readFileCallback = readFiles.at(0).ast.expression.arguments[1];
const rfcbTower = new __helpers.Tower(readFileCallback);
const errorIf = rfcbTower
  .getIfStatements()
  .find((i) => i.test.name === "error");
const body = errorIf.consequent.body;
const lastStatement = body[body.length - 1];
assert.equal(
  lastStatement.type,
  "ReturnStatement",
  "You should return from the function after calling response.end within the if statement.",
);
```

## 40

### --description--

Restart your server, and make a request to an invalid path to make sure everything still works as intended.

### --tests--

You should restart the server, and make a request to it.

```js
const lastCommand = await __helpers.getLastCommand();
const [command, ...args] = __helpers.parseCli(lastCommand);
assert.equal(command, "curl");
const urlArg = args.find((a) => a.startsWith("http"));
assert.isTrue(
  urlArg.includes("localhost:3001/"),
  "You should curl the server at port 3001",
);
assert.notEqual(
  urlArg,
  "http://localhost:3001/",
  "You should curl an invalid path",
);
assert.notEqual(
  urlArg,
  "http://localhost:3001/index.html",
  "You should curl an invalid path",
);
```

### --seed--

#### --"learn-nodejs-by-building-a-web-server/server.js"--

```js
const http = require("http");
const { join } = require("path");
const { readFile } = require("fs");

const server = http.createServer((request, response) => {
  console.log(request.headers);
  console.log(request.url);
  const url = request.url === "/" ? "/index.html" : request.url;
  const filePath = join("public", url);

  readFile(filePath, (error, file) => {
    if (error) {
      console.error(error);
      response.end(error.message, "utf-8");
      return;
    }
    response.end(file, "utf-8");
  });
});

server.listen(3001);
```

## 41

### --description--

At this point, you can go to your browser, and navigate to `http://localhost:3001` to see the `index.html` file, and click on the navigation links to see the other pages.

Navigating to `http://localhost:3001/a` will show the error message `ENOENT: no such file or directory, open 'public/a'`. This is not very user-friendly. Instead, you should send the custom `404.html` page within `public/` when the file does not exist.

On `error`, read the `public/404.html` file, and send it to the client, instead of the `error.message`.

### --hints--

#### 0

You will end up nesting one `readFile` function within another.

#### 1

You do not need to handle the `404.html` error case, because you are hard-coding the file path.

#### 2

You should still return from the first callback function after reading the `404.html` file.

### --tests--

You should have `readFile("public/404.html", (error, file) => {response.end(file, "utf-8")})` within the `if` statement.

```js
const file = await __helpers.getFile(project.dashedName, "server.js");
const t = new __helpers.Tower(file);
const server = t.getVariable("server");
const http_createServer = server.getCalls("http.createServer").at(0);
const callback = http_createServer.ast.init.arguments[0];
const cbTower = new __helpers.Tower(callback);
const readFiles = cbTower.getCalls("readFile");
const readFileCallback = readFiles.at(0).ast.expression.arguments[1];
const rfcbTower = new __helpers.Tower(readFileCallback);
const errorIf = rfcbTower
  .getIfStatements()
  .find((i) => i.test.name === "error");
const ifTower = new __helpers.Tower(errorIf.consequent);
const nestedReadFiles = ifTower.getCalls("readFile");
assert.isTrue(
  nestedReadFiles.some((r) => r.compact.includes('"public/404.html"')),
  'You should have readFile("public/404.html", ...) within the if statement.',
);
const nestedCallback = nestedReadFiles.at(0).ast.expression.arguments[1];
const ncbTower = new __helpers.Tower(nestedCallback);
assert.isTrue(
  ncbTower
    .getCalls("response.end")
    .some((e) => e.compact === 'response.end(file,"utf-8");'),
  'You should have response.end(file, "utf-8") within the nested readFile callback.',
);
```

## 42

### --description--

Restart your server, and make a request to an invalid path to make sure everything still works as intended.

### --tests--

You should restart the server, and make a request to it.

```js
const lastCommand = await __helpers.getLastCommand();
const [command, ...args] = __helpers.parseCli(lastCommand);
assert.equal(command, "curl");
const urlArg = args.find((a) => a.startsWith("http"));
assert.isTrue(
  urlArg.includes("localhost:3001/"),
  "You should curl the server at port 3001",
);
assert.notEqual(
  urlArg,
  "http://localhost:3001/",
  "You should curl an invalid path",
);
assert.notEqual(
  urlArg,
  "http://localhost:3001/index.html",
  "You should curl an invalid path",
);
```

### --seed--

#### --"learn-nodejs-by-building-a-web-server/server.js"--

```js
const http = require("http");
const { join } = require("path");
const { readFile } = require("fs");

const server = http.createServer((request, response) => {
  console.log(request.headers);
  console.log(request.url);
  const url = request.url === "/" ? "/index.html" : request.url;
  const filePath = join("public", url);

  readFile(filePath, (error, file) => {
    if (error) {
      console.error(error);
      readFile("public/404.html", (error, file) => {
        response.end(file, "utf-8");
      });
      return;
    }
    response.end(file, "utf-8");
  });
});

server.listen(3001);
```

## 43

### --description--

There is some more information you should be sending to the client with your responses:

1. The `Content-Type` header should be set to the correct media type for the file being sent. For example, `text/html` for `.html` files, `image/png` for `.png` files, and `text/css` for `.css` files.
2. The HTTP status code should be set to `200` for successful responses, and `404` for not found responses.

This information is sent in the `response.writeHead` function, which commonly takes two arguments: the status code, and an object containing the headers.

For now, just send a `200` status code when the request file exists, and a `404` status code when it does not.

### --tests--

You should have `response.writeHead(404)` within the `if` statement.

```js
const file = await __helpers.getFile(project.dashedName, "server.js");
const t = new __helpers.Tower(file);
const server = t.getVariable("server");
const http_createServer = server.getCalls("http.createServer").at(0);
const callback = http_createServer.ast.init.arguments[0];
const cbTower = new __helpers.Tower(callback);
const readFiles = cbTower.getCalls("readFile");
const readFileCallback = readFiles.at(0).ast.expression.arguments[1];
const rfcbTower = new __helpers.Tower(readFileCallback);
const errorIf = rfcbTower
  .getIfStatements()
  .find((i) => i.test.name === "error");
const ifTower = new __helpers.Tower(errorIf.consequent);
const nestedReadFiles = ifTower.getCalls("readFile");
const nestedCallback = nestedReadFiles.at(0).ast.expression.arguments[1];
const ncbTower = new __helpers.Tower(nestedCallback);
assert.isTrue(
  ncbTower
    .getCalls("response.writeHead")
    .some((w) => w.compact.includes("404")),
  "You should have response.writeHead(404) within the nested readFile callback.",
);
```

You should have `response.writeHead(200)` after the `if` statement.

```js
const file = await __helpers.getFile(project.dashedName, "server.js");
const t = new __helpers.Tower(file);
const server = t.getVariable("server");
const http_createServer = server.getCalls("http.createServer").at(0);
const callback = http_createServer.ast.init.arguments[0];
const cbTower = new __helpers.Tower(callback);
const readFiles = cbTower.getCalls("readFile");
const readFileCallback = readFiles.at(0).ast.expression.arguments[1];
const rfcbTower = new __helpers.Tower(readFileCallback);
const successWrites = rfcbTower.getCalls("response.writeHead");
assert.isTrue(
  successWrites.some((w) => w.compact.includes("200")),
  "You should have response.writeHead(200) after the if statement.",
);
```

## 44

### --description--

Restart your server, and use `curl` with the verbose flag to make a request to an invalid path to see an HTTP status code of `404`:

```bash
< HTTP/1.1 404 Not Found
```

### --tests--

You should restart the server, and make a request to it.

```js
const lastCommand = await __helpers.getLastCommand();
const [command, ...args] = __helpers.parseCli(lastCommand);
assert.equal(command, "curl");
assert.isTrue(
  args.includes("-v") || args.includes("--verbose"),
  "You should use the verbose flag",
);
const urlArg = args.find((a) => a.startsWith("http"));
assert.isTrue(
  urlArg.includes("localhost:3001/"),
  "You should curl the server at port 3001",
);
assert.notEqual(
  urlArg,
  "http://localhost:3001/",
  "You should curl an invalid path",
);
assert.notEqual(
  urlArg,
  "http://localhost:3001/index.html",
  "You should curl an invalid path",
);
```

### --seed--

#### --"learn-nodejs-by-building-a-web-server/server.js"--

```js
const http = require("http");
const { join } = require("path");
const { readFile } = require("fs");

const server = http.createServer((request, response) => {
  console.log(request.headers);
  console.log(request.url);
  const url = request.url === "/" ? "/index.html" : request.url;
  const filePath = join("public", url);

  readFile(filePath, (error, file) => {
    if (error) {
      console.error(error);
      readFile("public/404.html", (error, file) => {
        response.writeHead(404);
        response.end(file, "utf-8");
      });
      return;
    }
    response.writeHead(200);
    response.end(file, "utf-8");
  });
});

server.listen(3001);
```

## 45

### --description--

Setting the `Content-Type` header is a bit more involved. You need to determine the media type of the file being sent, and set the `Content-Type` header to the correct value. The simple way to determine a file type is to use the file extension, and map it to a media type.

Declare a `mimeTypes` variable before the first `readFile`, and set it to an object with keys of file extensions, and values of media types:

<!-- prettier-ignore -->
```markdown
.css  -> text/css
.js   -> text/javascript
.html -> text/html
.png  -> image/png
```

The word `MIME` comes from _Multipurpose Internet Mail Extensions_.

### --tests--

You should have `const mimeTypes = { ... }` within the `createServer` callback function.

```js
const file = await __helpers.getFile(project.dashedName, "server.js");
const t = new __helpers.Tower(file);
const server = t.getVariable("server");
const http_createServer = server.getCalls("http.createServer").at(0);
const callback = http_createServer.ast.init.arguments[0];
const cbTower = new __helpers.Tower(callback);
const mimeTypes = cbTower.getVariable("mimeTypes");
assert.isDefined(
  mimeTypes,
  "You should have a mimeTypes variable within the createServer callback",
);
```

`mimeTypes` should have a key of `".html"` with a value of `"text/html"`.

```js
const file = await __helpers.getFile(project.dashedName, "server.js");
const t = new __helpers.Tower(file);
const server = t.getVariable("server");
const http_createServer = server.getCalls("http.createServer").at(0);
const callback = http_createServer.ast.init.arguments[0];
const cbTower = new __helpers.Tower(callback);
const mimeTypes = cbTower.getVariable("mimeTypes");
const html = mimeTypes.getProperty(".html");
assert.equal(html.compact, '".html":"text/html"');
```

`mimeTypes` should have a key of `".css"` with a value of `"text/css"`.

```js
const file = await __helpers.getFile(project.dashedName, "server.js");
const t = new __helpers.Tower(file);
const server = t.getVariable("server");
const http_createServer = server.getCalls("http.createServer").at(0);
const callback = http_createServer.ast.init.arguments[0];
const cbTower = new __helpers.Tower(callback);
const mimeTypes = cbTower.getVariable("mimeTypes");
const css = mimeTypes.getProperty(".css");
assert.equal(css.compact, '".css":"text/css"');
```

`mimeTypes` should have a key of `".png"` with a value of `"image/png"`.

```js
const file = await __helpers.getFile(project.dashedName, "server.js");
const t = new __helpers.Tower(file);
const server = t.getVariable("server");
const http_createServer = server.getCalls("http.createServer").at(0);
const callback = http_createServer.ast.init.arguments[0];
const cbTower = new __helpers.Tower(callback);
const mimeTypes = cbTower.getVariable("mimeTypes");
const png = mimeTypes.getProperty(".png");
assert.equal(png.compact, '".png":"image/png"');
```

`mimeTypes` should have a key of `".js"` with a value of `"text/javascript"`.

```js
const file = await __helpers.getFile(project.dashedName, "server.js");
const t = new __helpers.Tower(file);
const server = t.getVariable("server");
const http_createServer = server.getCalls("http.createServer").at(0);
const callback = http_createServer.ast.init.arguments[0];
const cbTower = new __helpers.Tower(callback);
const mimeTypes = cbTower.getVariable("mimeTypes");
const js = mimeTypes.getProperty(".js");
assert.equal(js.compact, '".js":"text/javascript"');
```

## 46

### --description--

To get the file extension, you can use the `path` module's `extname` function:

```js
console.log(extname("path/to/file.html")); // .html
```

Import the `extname` function from the `path` module, and use it to get the file extension from the `filePath` variable. Store the result in a variable called `ext`.

### --tests--

You should have `const { extname } = require("path")` at the top of your file.

```js
const file = await __helpers.getFile(project.dashedName, "server.js");
const t = new __helpers.Tower(file);
const pathImport =
  t.getVariable("{join,extname}") ||
  t.getVariable("{extname,join}") ||
  t.getVariable("{extname}");
assert.isTrue(
  pathImport.compact.includes('require("path")'),
  'You should import extname from "path"',
);
```

You should have `const ext = extname(filePath)` within the `createServer` callback function.

```js
const file = await __helpers.getFile(project.dashedName, "server.js");
const t = new __helpers.Tower(file);
const server = t.getVariable("server");
const http_createServer = server.getCalls("http.createServer").at(0);
const callback = http_createServer.ast.init.arguments[0];
const cbTower = new __helpers.Tower(callback);
const ext = cbTower.getVariable("ext");
assert.equal(ext.compact, "const ext=extname(filePath);");
```

### --seed--

#### --"learn-nodejs-by-building-a-web-server/server.js"--

```js
const http = require("http");
const { join } = require("path");
const { readFile } = require("fs");

const server = http.createServer((request, response) => {
  const { extname } = require("path");
  console.log(request.headers);
  console.log(request.url);
  const url = request.url === "/" ? "/index.html" : request.url;
  const filePath = join("public", url);

  const mimeTypes = {
    ".html": "text/html",
    ".css": "text/css",
    ".png": "image/png",
    ".js": "text/javascript",
  };

  readFile(filePath, (error, file) => {
    if (error) {
      console.error(error);
      readFile("public/404.html", (error, file) => {
        response.writeHead(404);
        response.end(file, "utf-8");
      });
      return;
    }
    response.writeHead(200);
    response.end(file, "utf-8");
  });
});

server.listen(3001);
```

## 47

### --description--

Declare a `contentType` variable before the first `readFile`, and set it to the value of the `mimeTypes` object at the `ext` key. If there is no mapping for the file extension, set the `contentType` variable to `"application/octet-stream"`. This is a generic media type for binary data.

### --tests--

You should have `const contentType = mimeTypes[ext] || "application/octet-stream"` within the `createServer` callback function.

```js
const file = await __helpers.getFile(project.dashedName, "server.js");
const t = new __helpers.Tower(file);
const server = t.getVariable("server");
const http_createServer = server.getCalls("http.createServer").at(0);
const callback = http_createServer.ast.init.arguments[0];
const cbTower = new __helpers.Tower(callback);
const contentType = cbTower.getVariable("contentType");
assert.equal(
  contentType.compact,
  'const contentType=mimeTypes[ext]||"application/octet-stream";',
);
```

### --seed--

#### --"learn-nodejs-by-building-a-web-server/server.js"--

```js
const http = require("http");
const { join, extname } = require("path");
const { readFile } = require("fs");

const server = http.createServer((request, response) => {
  console.log(request.headers);
  console.log(request.url);
  const url = request.url === "/" ? "/index.html" : request.url;
  const filePath = join("public", url);

  const mimeTypes = {
    ".html": "text/html",
    ".css": "text/css",
    ".png": "image/png",
    ".js": "text/javascript",
  };

  const ext = extname(filePath);

  readFile(filePath, (error, file) => {
    if (error) {
      console.error(error);
      readFile("public/404.html", (error, file) => {
        response.writeHead(404, { "Content-Type": "text/html" });
        response.end(file, "utf-8");
      });
      return;
    }
    response.writeHead(200, { "Content-Type": contentType });
    response.end(file, "utf-8");
  });
});

server.listen(3001);
```

## 48

### --description--

Now, for the 404 `writeHead` call, hard-code a second argument of `{ "Content-Type": "text/html" }` to set the `Content-Type` header of the response. Then, for the 200 `writeHead` call, add a second argument of `{ "Content-Type": contentType }` to set the `Content-Type` header of the response.

### --tests--

You should have `response.writeHead(404, { "Content-Type": "text/html" })` within the `if` statement.

```js
const file = await __helpers.getFile(project.dashedName, "server.js");
const t = new __helpers.Tower(file);
const server = t.getVariable("server");
const http_createServer = server.getCalls("http.createServer").at(0);
const callback = http_createServer.ast.init.arguments[0];
const cbTower = new __helpers.Tower(callback);
const readFiles = cbTower.getCalls("readFile");
const readFileCallback = readFiles.at(0).ast.expression.arguments[1];
const rfcbTower = new __helpers.Tower(readFileCallback);
const errorIf = rfcbTower
  .getIfStatements()
  .find((i) => i.test.name === "error");
const ifTower = new __helpers.Tower(errorIf.consequent);
const nestedReadFiles = ifTower.getCalls("readFile");
const nestedCallback = nestedReadFiles.at(0).ast.expression.arguments[1];
const ncbTower = new __helpers.Tower(nestedCallback);
const head = ncbTower.getCalls("response.writeHead").at(0);
assert.equal(
  head.compact,
  'response.writeHead(404,{"Content-Type":"text/html"});',
);
```

You should have `response.writeHead(200, { "Content-Type": contentType })` after the `if` statement.

```js
const file = await __helpers.getFile(project.dashedName, "server.js");
const t = new __helpers.Tower(file);
const server = t.getVariable("server");
const http_createServer = server.getCalls("http.createServer").at(0);
const callback = http_createServer.ast.init.arguments[0];
const cbTower = new __helpers.Tower(callback);
const readFiles = cbTower.getCalls("readFile");
const readFileCallback = readFiles.at(0).ast.expression.arguments[1];
const rfcbTower = new __helpers.Tower(readFileCallback);
const successWrites = rfcbTower.getCalls("response.writeHead");
assert.isTrue(
  successWrites.some(
    (w) =>
      w.compact === 'response.writeHead(200,{"Content-Type":contentType});',
  ),
  'You should have response.writeHead(200, {"Content-Type": contentType}) after the if statement.',
);
```

### --seed--

#### --"learn-nodejs-by-building-a-web-server/server.js"--

```js
const http = require("http");
const { join, extname } = require("path");
const { readFile } = require("fs");

const server = http.createServer((request, response) => {
  console.log(request.headers);
  console.log(request.url);
  const url = request.url === "/" ? "/index.html" : request.url;
  const filePath = join("public", url);

  const mimeTypes = {
    ".html": "text/html",
    ".css": "text/css",
    ".png": "image/png",
    ".js": "text/javascript",
  };

  const ext = extname(filePath);
  const contentType = mimeTypes[ext] || "application/octet-stream";

  readFile(filePath, (error, file) => {
    if (error) {
      console.error(error);
      readFile("public/404.html", (error, file) => {
        response.writeHead(404);
        response.end(file, "utf-8");
      });
      return;
    }
    response.writeHead(200);
    response.end(file, "utf-8");
  });
});

server.listen(3001);
```

## 49

### --description--

Restart your server, and make a request to it to see the `Content-Type` header in the response.

### --tests--

You should restart the server, and make a request to it.

```js
const lastCommand = await __helpers.getLastCommand();
const [command, ...args] = __helpers.parseCli(lastCommand);
assert.equal(command, "curl");
const urlArg = args.find((a) => a.startsWith("http"));
assert.isTrue(
  urlArg.includes("localhost:3001/"),
  "You should curl the server at port 3001",
);
```

### --seed--

#### --"learn-nodejs-by-building-a-web-server/server.js"--

```js
const http = require("http");
const { join, extname } = require("path");
const { readFile } = require("fs");

const server = http.createServer((request, response) => {
  console.log(request.headers);
  console.log(request.url);
  const url = request.url === "/" ? "/index.html" : request.url;
  const filePath = join("public", url);

  const mimeTypes = {
    ".html": "text/html",
    ".css": "text/css",
    ".png": "image/png",
    ".js": "text/javascript",
  };

  const ext = extname(filePath);
  const contentType = mimeTypes[ext] || "application/octet-stream";

  readFile(filePath, (error, file) => {
    if (error) {
      console.error(error);
      readFile("public/404.html", (error, file) => {
        response.writeHead(404, { "Content-Type": "text/html" });
        response.end(file, "utf-8");
      });
      return;
    }
    response.writeHead(200, { "Content-Type": contentType });
    response.end(file, "utf-8");
  });
});

server.listen(3001);
```

## 50

### --description--

With that, your web server is complete! Now, you can do some improvements:

- File extensions are case-insensitive on some systems
  - You should convert the file extension to lowercase before using it to get the `contentType`.
- It is not clear when your server has started to listen for connections
  - You should log a message to the console when the server is ready for connections.
- It is more common for JavaScript files to be written as an ESM (ECMAScript Module) than a CommonJS module
  - You will learn more about this soon!

Start by converting the file extension to lowercase.

### --tests--

You should have `const ext = extname(filePath).toLowerCase()` within the `createServer` callback function.

```js
const file = await __helpers.getFile(project.dashedName, "server.js");
const t = new __helpers.Tower(file);
const server = t.getVariable("server");
const http_createServer = server.getCalls("http.createServer").at(0);
const callback = http_createServer.ast.init.arguments[0];
const cbTower = new __helpers.Tower(callback);
const ext = cbTower.getVariable("ext");
assert.equal(ext.compact, "const ext=extname(filePath).toLowerCase();");
```

## 51

### --description--

The `listen` method of the `Server` instance takes a callback function as its second argument. This callback function is called when the server is ready to accept connections.

Add a callback to the `listen` method, and log the following message to the console:

```markdown
Server is listening on port 3001
```

### --tests--

You should have `server.listen(3001, () => console.log("Server is listening on port 3001"))` at the end of your file.

```js
const file = await __helpers.getFile(project.dashedName, "server.js");
const t = new __helpers.Tower(file);
const listen = t.getCalls("server.listen").at(0);
assert.isTrue(
  listen.compact.includes(
    '()=>console.log("Server is listening on port 3001")',
  ),
  'You should log "Server is listening on port 3001" in the listen callback',
);
```

### --seed--

#### --"learn-nodejs-by-building-a-web-server/server.js"--

```js
const http = require("http");
const { join, extname } = require("path");
const { readFile } = require("fs");

const server = http.createServer((request, response) => {
  console.log(request.headers);
  console.log(request.url);
  const url = request.url === "/" ? "/index.html" : request.url;
  const filePath = join("public", url);

  const mimeTypes = {
    ".html": "text/html",
    ".css": "text/css",
    ".png": "image/png",
    ".js": "text/javascript",
  };

  const ext = extname(filePath).toLowerCase();
  const contentType = mimeTypes[ext] || "application/octet-stream";

  readFile(filePath, (error, file) => {
    if (error) {
      console.error(error);
      readFile("public/404.html", (error, file) => {
        response.writeHead(404, { "Content-Type": "text/html" });
        response.end(file, "utf-8");
      });
      return;
    }
    response.writeHead(200, { "Content-Type": contentType });
    response.end(file, "utf-8");
  });
});

server.listen(3001);
```

## 52

### --description--

Lastly, the topic of _CommonJS_ versus _ESM_ is a big one. You will learn more about this throughout the curriculum. For now, you should know that the `import` and `export` syntax is used in ESM, and the `require` and `module.exports` syntax is used in CommonJS. CommonJS is the default module system in Node.js, and ESM is a newer module system that is more common in the browser.

Convert all your `require` statements to `import` statements.

### --tests--

You should have `import http from "http"`.

```js
const file = await __helpers.getFile(project.dashedName, "server.js");
const t = new __helpers.Tower(file);
const httpImport = t.getVariable("http");
assert.equal(httpImport.compact, 'import http from"http";');
```

You should have `import { join, extname } from "path"`.

```js
const file = await __helpers.getFile(project.dashedName, "server.js");
const t = new __helpers.Tower(file);
const pathImport =
  t.getVariable("{join,extname}") || t.getVariable("{extname,join}");
assert.equal(pathImport.compact, 'import{join,extname}from"path";');
```

You should have `import { readFile } from "fs"`.

```js
const file = await __helpers.getFile(project.dashedName, "server.js");
const t = new __helpers.Tower(file);
const fsImport = t.getVariable("{readFile}");
assert.equal(fsImport.compact, 'import{readFile}from"fs";');
```

You should not have any `require` statements in your file.

```js
const file = await __helpers.getFile(project.dashedName, "server.js");
const t = new __helpers.Tower(file);
assert.isFalse(
  file.includes("require("),
  "You should not have any require statements",
);
```

### --seed--

#### --"learn-nodejs-by-building-a-web-server/server.js"--

```js
const http = require("http");
const { join, extname } = require("path");
const { readFile } = require("fs");

const server = http.createServer((request, response) => {
  console.log(request.headers);
  console.log(request.url);
  const url = request.url === "/" ? "/index.html" : request.url;
  const filePath = join("public", url);

  const mimeTypes = {
    ".html": "text/html",
    ".css": "text/css",
    ".png": "image/png",
    ".js": "text/javascript",
  };

  const ext = extname(filePath).toLowerCase();
  const contentType = mimeTypes[ext] || "application/octet-stream";

  readFile(filePath, (error, file) => {
    if (error) {
      console.error(error);
      readFile("public/404.html", (error, file) => {
        response.writeHead(404, { "Content-Type": "text/html" });
        response.end(file, "utf-8");
      });
      return;
    }
    response.writeHead(200, { "Content-Type": contentType });
    response.end(file, "utf-8");
  });
});

server.listen(3001, () => console.log("Server is listening on port 3001"));
```

## 53

### --description--

Try to restart your server. You will see an error.

### --tests--

You should restart the server, and see an error.

```js
const __isListening = await __helpers.isServerListening(3001);
assert.isFalse(
  __isListening,
  "The server should fail to start — it is still listening when it should not be",
);
```

### --seed--

#### --"learn-nodejs-by-building-a-web-server/server.js"--

```js
import http from "http";
import { join, extname } from "path";
import { readFile } from "fs";

const server = http.createServer((request, response) => {
  console.log(request.headers);
  console.log(request.url);
  const url = request.url === "/" ? "/index.html" : request.url;
  const filePath = join("public", url);

  const mimeTypes = {
    ".html": "text/html",
    ".css": "text/css",
    ".png": "image/png",
    ".js": "text/javascript",
  };

  const ext = extname(filePath).toLowerCase();
  const contentType = mimeTypes[ext] || "application/octet-stream";

  readFile(filePath, (error, file) => {
    if (error) {
      console.error(error);
      readFile("public/404.html", (error, file) => {
        response.writeHead(404, { "Content-Type": "text/html" });
        response.end(file, "utf-8");
      });
      return;
    }
    response.writeHead(200, { "Content-Type": contentType });
    response.end(file, "utf-8");
  });
});

server.listen(3001, () => console.log("Server is listening on port 3001"));
```

## 54

### --description--

```bash
(node:164499) Warning: To load an ES module, set "type": "module" in the package.json or use the .mjs extension.
```

This is because Node.js defaults to CommonJS modules, and you are using ESM. You can fix this by renaming your file to `server.mjs`, or by adding `"type": "module"` to the `package.json` file.

To avoid having to change many file names, most projects use the `package.json` approach. Do the same.

### --tests--

You should have `"type": "module"` in your `package.json` file.

```js
const __packageJson = JSON.parse(
  await __helpers.getFile(project.dashedName, "package.json"),
);
assert.equal(
  __packageJson.type,
  "module",
  'package.json should have "type": "module"',
);
```

## 55

### --description--

Restart your server, and make a request to it to see if everything still works as intended.

### --tests--

Your server should be running.

```js
const __isListening = await __helpers.isServerListening(3001);
assert.isTrue(__isListening, "The server is not listening on port 3001");
```

You should make a `curl` request to `http://localhost:3001`.

```js
const __lastCommand = await __helpers.getLastCommand();
const [__cmd, ...__args] = __helpers.parseCli(__lastCommand);
assert.equal(__cmd, "curl");
assert.include(__args, "http://localhost:3001");
```

### --seed--

#### --"learn-nodejs-by-building-a-web-server/package.json"--

```json
{
  "type": "module"
}
```

## 56

### --description--

Currently, you still have two `console.log` calls in your code. These are useful for debugging, but they are not useful for production. They can slow down your server, because logging to the console is a synchronous operation.

To see their impact, you can perform a load test on your server using `wrk`. First install it with:

```bash
sudo apt install -y wrk
```

### --tests--

You should install `wrk` with `sudo apt install -y wrk`.

```js
const __lastCommand = await __helpers.getLastCommand();
assert.include(
  __lastCommand,
  "sudo apt install -y wrk",
  "You should install wrk using sudo apt install -y wrk",
);
```

## 57

### --description--

Ensure your server is running, then run the following command in its own terminal:

```bash
wrk -t2 -c5 -d5s http://localhost:3001
```

That uses two threads with 5 concurrent connections for 5 seconds.

### --tests--

Your server should be running.

```js
const __isListening = await __helpers.isServerListening(3001);
assert.isTrue(__isListening, "The server is not listening on port 3001");
```

You should run `wrk -t2 -c5 -d5s http://localhost:3001`.

```js
const __lastCommand = await __helpers.getLastCommand();
assert.include(
  __lastCommand,
  "wrk -t2 -c5 -d5s http://localhost:3001",
  "You should run the wrk load test command",
);
```

## 58

### --description--

Now, remove the two `console.log` calls in your server code, and re-run the same `wrk` command.

### --tests--

You should not have any `console.log` calls within `server.js`.

```js
const __file = await __helpers.getFile(project.dashedName, "server.js");
const __t = new __helpers.Tower(__file);
const __server = __t.getVariable("server");
const __createServer = __server.getCalls("http.createServer").at(0);
const __callback = __createServer.ast.init.arguments[0];
const __cbTower = new __helpers.Tower(__callback);
const __logs = __cbTower.getCalls("console.log");
assert.equal(
  __logs.length,
  0,
  "You should not have any console.log calls within the createServer callback",
);
```

You should run `wrk -t2 -c5 -d5s http://localhost:3001`.

```js
const __lastCommand = await __helpers.getLastCommand();
assert.include(
  __lastCommand,
  "wrk -t2 -c5 -d5s http://localhost:3001",
  "You should re-run the wrk load test command",
);
```

## 59

### --description--

You should see a significant increase in the number of requests per second. This is because the `console.log` calls are no longer slowing down your server.

You have completed the project! You have built a web server from scratch, and learned about the HTTP protocol, the `http` module, the `fs` module, the `path` module, and the `mimetype` of files.

When you are done, submit your project by entering `done` in the terminal.

### --seed--

#### --"learn-nodejs-by-building-a-web-server/server.js"--

```js
import http from "http";
import { join, extname } from "path";
import { readFile } from "fs";

const server = http.createServer((request, response) => {
  const url = request.url === "/" ? "/index.html" : request.url;
  const filePath = join("public", url);

  const mimeTypes = {
    ".html": "text/html",
    ".css": "text/css",
    ".png": "image/png",
    ".js": "text/javascript",
  };

  const ext = extname(filePath).toLowerCase();
  const contentType = mimeTypes[ext] || "application/octet-stream";

  readFile(filePath, (error, file) => {
    if (error) {
      readFile("public/404.html", (error, file) => {
        response.writeHead(404, { "Content-Type": "text/html" });
        response.end(file, "utf-8");
      });
      return;
    }
    response.writeHead(200, { "Content-Type": contentType });
    response.end(file, "utf-8");
  });
});

server.listen(3001, () => console.log("Server is listening on port 3001"));
```

### --tests--

You should type `done` in the terminal.

```js
const __temp = await __helpers.getTemp();
assert.include(
  __temp,
  "done",
  "You should type 'done' in the terminal to submit your project",
);
```

## --fcc-end--
