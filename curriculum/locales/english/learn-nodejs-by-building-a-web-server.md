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

## 3

### --description--

To create a server, use the `createServer` method of the `http` module. Store the returned `http.Server` instance in a variable called `server`.

### --tests--

You should have `const server = http.createServer()` within `server.js`.

```js
assert.fail();
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

## 5

### --description--

To get the server to listen for TCP connections, at the bottom of your file, call the `listen` method on the `server` instance.

### --tests--

You should have `server.listen()` at the bottom of `server.js`.

```js
assert.fail();
```

## 6

### --description--

The `listen` method takes a port number as its first argument. Pass `3001` as the first argument to the `listen` method to bind to port `3001`.

### --tests--

You should have `server.listen(3001)` at the bottom of `server.js`.

```js
assert.fail();
```

## 7

### --description--

Within your terminal, start the server by running `node server.js`.

### --tests--

You should start the server by running `node server.js`.

```js
assert.fail();
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

To make sure your server is working, use the `--verbose` flag with the `curl` command to see more about the operation:

```sh
curl --verbose http://localhost:3001
```

### --tests--

You should run `curl --verbose http://localhost:3001` in the terminal.

```js
assert.fail();
```

## 10

### --description--

Included in the output should be `Connected to localhost (127.0.0.1) port 3001`. This means that the server is running and listening for connections.

Stop the curl command, and stop the server running in the other terminal by pressing `Ctrl + C`.

### --tests--

You should stop the server and the `curl` command.

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

You should run `curl http://localhost:3001` in the terminal.

```js
assert.fail();
```

## 13

### --description--

Yikes! 😅 That is a lot of information. You are probably not interested in all of that. So, log just the `headers` property of the request.

### --tests--

You should log `request.headers` to the console within the `createServer` callback function.

```js
assert.fail();
```

## 14

### --description--

## TODO

- At end of project, teach about commonjs versus es6 modules

## --fcc-end--
