# Learn Nodejs by Building a Web Server

In this project, you will use the Nodejs API to create a web server to serve a client application

## 0

### --description--

In this project, you will use Nodejs' built-in `http` module to create a web server that serves a client application.

For the duration of this project, you will be working within the `learn-nodejs-by-building-a-web-server/` directory.

Open a new terminal, and change into the `learn-nodejs-by-building-a-web-server/` directory.

### --tests--

You should be within the `learn-nodejs-by-building-a-web-server/` directory.

```js
assert.fail();
```

## 1

### --description--

You have been started with a few files for the client application within the `public/` directory.

Create a `server.js` file to house the server code.

### --tests--

You should create a `learn-nodejs-by-building-a-web-server/server.js` file.

```js
assert.fail();
```

## 2

### --description--

Previously, you learnt how to import your JavaScript module using the `require` function:

```js
const myModule = require("./path/to/my-module/index");
```

You can also use the `require` function to import built-in modules. For example, to import the `fs` module used to interact with the file system:

```js
const fs = require("fs");
```

Within the `server.js` file, import the `http` module, and store it in a variable called `http`.

### --tests--

You should have `const http = require("http")` within `server.js`.

```js
assert.fail();
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
assert.fail();
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
assert.fail();
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
assert.fail();
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
assert.fail();
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

### --tests--

You should start the server by running `node server.js`.

```js
assert.fail();
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

### --tests--

You should make a request to `http://localhost:3001` using the `curl` command.

```js
assert.fail();
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
assert.fail();
```

## 10

### --description--

Included in the output should be `Connected to localhost (127.0.0.1) port 3001`. This means that the server is running and listening for connections.

In order to use changes made to your server, you need to restart the server once the changes have been made to the script. Stop the server running in the other terminal by pressing `Ctrl + C`.

### --tests--

You should stop the server.

```js
assert.fail();
```

## 11

### --description--

To find out more about what is happening when a request is made to the server, log the `request` object to the console within the `createServer` callback function.

### --tests--

You should log the `request` object to the console within the `createServer` callback function.

```js
assert.fail();
```

## 12

### --description--

Within the other terminal, use `curl` again to make an empty request again.

### --hints--

#### 0

When you log the `request` object to the console, you will see a lot of information.

### --tests--

You should run `curl --max-time 2 http://localhost:3001` in the terminal.

```js
// --verbose and --max-time are optional
assert.fail();
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

## 13

### --description--

Yikes! 😅 That is a lot of information. You are probably not interested in all of that. So, log just the `headers` property of the request.

Request headers are a set of key-value pairs that contain information about the request, such as the `User-Agent` (the client application making the request), `Accept` (the media types the client can understand), and `Accept-Language` (the language the client prefers for the response).

### --tests--

You should log `request.headers` to the console within the `createServer` callback function.

```js
assert.fail();
```

## 14

### --description--

Restart your server by stopping it with `Ctrl + C` and then running `node server.js` again.

### --tests--

You should restart the server.

```js
// CURL the server, and check the output is the new headers
assert.fail();
```

## 15

### --description--

Within the other terminal, use `curl` again to make an empty request again.

### --tests--

You should run `curl --max-time 2 http://localhost:3001` in the terminal.

```js
// flags are optional
assert.fail();
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

## 16

### --description--

A URL (Uniform Resource Locator) is a reference to a web resource that specifies its location on a computer network and a mechanism for retrieving it. The URL contains the name of the protocol to be used to access the resource and a resource name.

Along with the `headers`, you will be using the `url` property of the `request` object to determine which resource the client is requesting.

Log the `url` property of the `request` object to the console.

### --tests--

You should log `request.url` to the console within the `createServer` callback function.

```js
assert.fail();
```

## 17

### --description--

Restart your server, and make a request to it.

### --tests--

You should restart the server, and make a request to it.

```js
// CURL the server, and check the output is the new URL
assert.fail();
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

## 18

### --description--

As previously noted, requests are hanging, because your server does not respond with anything.

Use the `response.end` function to send the request `url` back to the client:

```js
response.end("Data to send back to the client");
```

### --tests--

You should have `response.end(request.url)` within the `createServer` callback function.

```js
assert.fail();
```

## 19

### --description--

Restart your server, and make a request to it.

### --tests--

You should restart the server, and make a request to it.

```js
// CURL the server, and check the output is the new URL
assert.fail();
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

## 20

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
server.js
```

When users visit a certain URL, your server should respond with the correct page - `http://localhost:3001/products` should get the response `./public/products.html`.

Create a variable called `url` and set it equal to `"/index.html"` if `request.url` is `/`, else set it equal to `request.url`.

### --tests--

You should have `const url = request.url === "/" ? "/index.html" : request.url` within the `createServer` callback function.

```js
assert.fail();
```

## 21

### --description--

The `response.end` function takes a second argument that is the encoding of the data being sent. This helps the client to understand how to interpret the data.

Send the value of the `url` variable, and set the encoding to `"utf-8"`.

### --tests--

You should have `response.end(url, "utf-8")` within the `createServer` callback function.

```js
assert.fail();
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

## TODO

- At end of project, teach about commonjs versus es6 modules
  - Start by renaming file to `server.mjs`
  - Then, use `npm init` with `type: "module"` in `package.json`

## --fcc-end--
