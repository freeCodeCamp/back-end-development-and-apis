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

Restart your server, and make a request to it. You no longer need to add a timeout to your `curl` command, because your sever is responding with something.

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
package.json
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
  response.end(request.url);
});

server.listen(3001);
```

## 22

### --description--

Restart your server, and make a request to it.

### --tests--

You should restart the server, and make a request to it.

```js
// CURL the server, and check the output is the new URL
assert.fail();
```

## 23

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

## 24

### --description--

Import the `join` function from the `path` module.

### --tests--

You should have `const { join } = require("path")` at the top of `server.js`.

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
  const { join } = require("path");
  const url = request.url === "/" ? "/index.html" : request.url;
  response.end(url, "utf-8");
  const filePath = join("public", url);
});

server.listen(3001);
```

## 25

### --description--

Change your `response.end` function to send the `filePath` variable.

### --tests--

You should have `response.end(filePath, "utf-8")` within the `createServer` callback function.

```js
assert.fail();
```

You should define `filePath` before calling `response.end`.

```js
assert.fail();
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

## 26

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

## 27

### --description--

Whilst sending the file path to the client is fun, it is not what you want to do. You want to send the file itself.

First, you need to read the file from the _file system_. Use the `readFile` function from the `fs` module, and pass the `filePath` variable as the first argument:

```js
fs.readFile("relative/path/to/file");
```

### --tests--

You should have `readFile(filePath)` within the `createServer` callback function.

```js
// TODO: Consider allowing both `fs.readFile` and `readFile`
assert.fail();
```

## 28

### --description--

Import the `readFile` function from the `fs` module.

### --tests--

You should have `const { readFile } = require("fs")` at the top of `server.js`.

```js
assert.fail();
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

## 29

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
assert.fail();
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

## 30

### --description--

If there is an error reading the file, the first callback argument will be an `ErrnoException` object. Write an `if` statement to check if there is an error reading the file. If there is, log the error to the console and return from the function.

### --tests--

You should have `if (error) { console.error(error); return; }` within the `readFile` callback function.

```js
assert.fail();
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

## 31

### --description--

If there is no error reading the file, the first callback argument will be `null`, and the second argument will be the file data. Change the `response.end` function to send the file data to the client.

### --tests--

You should have `response.end(file, "utf-8")` within the `readFile` callback function.

```js
assert.fail();
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

## 32

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

## 33

### --description--

Make a request to a path that does not exist.

### --tests--

You should make a request to a path that does not exist.

```js
assert.fail();
```

## 34

### --description--

You should see an error in the terminal. This is because the `readFile` function is trying to read a file that does not exist. Also, your `curl` command is hanging, because your server is not responding with anything.

Instead of returning from the function when there is an error reading the file, add another `response.end` to send the `error` to the client.

### --tests--

You should have `response.end(error, "utf-8")` within the `readFile` callback function.

```js
assert.fail();
```

## 35

### --description--

Restart your server, and make a request to an invalid path.

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

## 36

### --description--

Your server crashed! 😱 This is because you are trying to send the `error` to the client, but the `error` is an object, and the `response.end` function only accepts a string or a buffer:

```bash
TypeError [ERR_INVALID_ARG_TYPE]: The "chunk" argument must be of type string or an instance of Buffer or Uint8Array. Received an instance of Error
```

Instead of trying ot send the whole `Error` object, send the `error.message` value.

### --tests--

You should have `response.end(error.message, "utf-8")` within the `readFile` callback function.

```js
assert.fail();
```

## 37

### --description--

Restart your server, and make a request to an invalid path.

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

## 38

### --description--

That is better. However, you have a small bug in your code. `response.end` is being called twice. This is because you are calling `response.end` within the `readFile` `if` statement, and then again outside it. This is not a problem now, but is something that could cause confusion in the future.

Return from the function after calling `response.end` within the `if` statement.

### --tests--

You should return from the function after calling `response.end` within the `if` statement.

```js
assert.fail();
```

## 39

### --description--

Restart your server, and make a request to an invalid path to make sure everything still works as intended.

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

## 40

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
assert.fail();
```

## 41

### --description--

Restart your server, and make a request to an invalid path to make sure everything still works as intended.

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

## 42

### --description--

There is some more information you should be sending to the client with your responses:

1. The `Content-Type` header should be set to the correct media type for the file being sent. For example, `text/html` for `.html` files, `image/png` for `.png` files, and `text/css` for `.css` files.
2. The HTTP status code should be set to `200` for successful responses, and `404` for not found responses.

This information is sent in the `response.writeHead` function, which commonly takes two arguments: the status code, and an object containing the headers.

For now, just send a `200` status code when the request file exists, and a `404` status code when it does not.

### --tests--

You should have `response.writeHead(404)` within the `if` statement.

```js
assert.fail();
```

You should have `response.writeHead(200)` after the `if` statement.

```js
assert.fail();
```

## 43

### --description--

Restart your server, and use `curl` with the verbose flag to make a request to an invalid path to see an HTTP status code of `404`:

```bash
< HTTP/1.1 404 Not Found
```

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

## 44

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

You should have `const mimeTypes = { ... }` at the top of your file.

```js
assert.fail();
```

`mimeTypes` should have a key of `".html"` with a value of `"text/html"`.

```js
assert.fail();
```

`mimeTypes` should have a key of `".css"` with a value of `"text/css"`.

```js
assert.fail();
```

`mimeTypes` should have a key of `".png"` with a value of `"image/png"`.

```js
assert.fail();
```

`mimeTypes` should have a key of `".js"` with a value of `"text/javascript"`.

```js
assert.fail();
```

## 45

### --description--

To get the file extension, you can use the `path` module's `extname` function:

```js
console.log(extname("path/to/file.html")); // .html
```

Import the `extname` function from the `path` module, and use it to get the file extension from the `filePath` variable. Store the result in a variable called `ext`.

### --tests--

You should have `const { extname } = require("path")` at the top of your file.

```js
assert.fail();
```

You should have `const ext = extname(filePath)` within the `createServer` callback function.

```js
assert.fail();
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

## 46

### --description--

Declare a `contentType` variable before the first `readFile`, and set it to the value of the `mimeTypes` object at the `ext` key. If there is no mapping for the file extension, set the `contentType` variable to `"application/octet-stream"`. This is a generic media type for binary data.

### --tests--

You should have `const contentType = mimeTypes[ext] || "application/octet-stream"` within the `createServer` callback function.

```js
assert.fail();
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

## 47

### --description--

Now, for the 404 `writeHead` call, hard-code a second argument of `{ "Content-Type": "text/html" }` to set the `Content-Type` header of the response. Then, for the 200 `writeHead` call, add a second argument of `{ "Content-Type": contentType }` to set the `Content-Type` header of the response.

### --tests--

You should have `response.writeHead(404, { "Content-Type": "text/html" })` within the `if` statement.

```js
assert.fail();
```

You should have `response.writeHead(200, { "Content-Type": contentType })` after the `if` statement.

```js
assert.fail();
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

## 48

### --description--

Restart your server, and make a request to it to see the `Content-Type` header in the response.

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

## 49

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
assert.fail();
```

## 50

### --description--

The `listen` method of the `Server` instance takes a callback function as its second argument. This callback function is called when the server is ready to accept connections.

Add a callback to the `listen` method, and log the following message to the console:

```markdown
Server is listening on port 3001
```

### --tests--

You should have `server.listen(3001, () => console.log("Server is listening on port 3001"))` at the end of your file.

```js
assert.fail();
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

## 51

### --description--

Lastly, the topic of _CommonJS_ versus _ESM_ is a big one. You will learn more about this throughout the curriculum. For now, you should know that the `import` and `export` syntax is used in ESM, and the `require` and `module.exports` syntax is used in CommonJS. CommonJS is the default module system in Node.js, and ESM is a newer module system that is more common in the browser.

Convert all your `require` statements to `import` statements.

### --tests--

You should have `import http from "http"`.

```js
assert.fail();
```

You should have `import { join, extname } from "path"`.

```js
assert.fail();
```

You should have `import { readFile } from "fs"`.

```js
assert.fail();
```

You should not have any `require` statements in your file.

```js
assert.fail();
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

## 52

### --description--

Try to restart your server. You will see an error.

### --tests--

You should restart the server, and see an error.

```js
assert.fail();
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

## 53

### --description--

```bash
(node:164499) Warning: To load an ES module, set "type": "module" in the package.json or use the .mjs extension.
```

This is because Node.js defaults to CommonJS modules, and you are using ESM. You can fix this by renaming your file to `server.mjs`, or by adding `"type": "module"` to the `package.json` file.

To avoid having to change many file names, most projects use the `package.json` approach. Do the same.

### --tests--

You should have `"type": "module"` in your `package.json` file.

```js
assert.fail();
```

## 54

### --description--

Restart your server, and make a request to it to see if everything still works as intended.

### --tests--

You should restart the server, and make a request to it.

```js
// CURL the server, and check the output is the new URL
assert.fail();
```

### --seed--

#### --"learn-nodejs-by-building-a-web-server/package.json"--

```json
{
  "type": "module"
}
```

## 55

### --description--

You have completed the project! You have built a web server from scratch, and learned about the HTTP protocol, the `http` module, the `fs` module, the `path` module, and the `mimetype` of files.

When you are done, submit your project by entering `done` in the terminal.

### --tests--

You should type `done` in the terminal.

```js
assert.fail();
```

## TODO

- Maybe add bit at end about leaving `console.log`s in code, and how it impacts performance
- Maybe discuss security implications of "getting" `mime` from extension
  - Not a factor when all files are controlled by server

## --fcc-end--
