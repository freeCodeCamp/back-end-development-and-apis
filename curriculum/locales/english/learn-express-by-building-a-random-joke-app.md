# Learn Express by Building a Random Joke App

In this course, you will learn basic Express by building a random joke app.

## 0

### --description--

To get started with the project, you need to install the Express npm package first by running `npm install express` in the terminal. 

### --tests--

You should run `npm install express` in the terminal.

```js
const lastCommand = await __helpers.getLastCommand();
assert.equal(lastCommand.trim(), 'npm install express');
```

You should be in the `learn-express-by-building-a-random-joke-app` folder in your terminal.

```js
const cwdFile = await __helpers.getCWD();
const cwd = cwdFile.split('\n').filter(Boolean).pop();
assert.include(cwd, project.dashedName);
```

### --seed--

#### --"learn-express-by-building-a-random-joke-app/server.js"--

```js

```

## 1

### --description--

Next, import Express by using `require()`, with the import assigned to an `express` variable. After that, create an Express app by calling the Express function and saving it in an `app` variable.

Also, create a `port` variable and set it to `3000`. This is the port the app will run on.

### --tests--

You should create a variable named `express`.

```js
const file = await __helpers.getFile(project.dashedName, "server.js");
const code = new __helpers.Tower(file);
const expressVar = code.getVariable("express");
assert.exists(expressVar);
```

Your `express` variable should be set to `require('express')`.

```js
const file = await __helpers.getFile(project.dashedName, "server.js");
const code = new __helpers.Tower(file);
const expressVar = code.getVariable("express");

const { kind } = expressVar.ast;
const declaration = expressVar.ast.declarations[0];
const { name } = declaration.id;
const { callee, arguments: args } = declaration.init;

assert.include(["const", "let", "var"], kind);
assert.equal(name, "express");
assert.equal(callee.name, "require");
assert.equal(args[0].value, "express");
```

You should create an `app` variable and set it to `express()`.

```js
const file = await __helpers.getFile(project.dashedName, "server.js");
const code = new __helpers.Tower(file);
const appVar = code.getVariable("app");

const { kind } = appVar.ast;
const declaration = appVar.ast.declarations[0];
const { name } = declaration.id;
const { callee, arguments: args } = declaration.init;

assert.include(["const", "let", "var"], kind);
assert.equal(name, "app");
assert.equal(callee.name, "express");
assert.equal(args.length, 0);
```

You should create a `port` variable and set it to `3000`.

```js
const file = await __helpers.getFile(project.dashedName, "server.js");
const code = new __helpers.Tower(file);
const portVar = code.getVariable("port");

const { kind } = portVar.ast;
const declaration = portVar.ast.declarations[0];
const { name } = declaration.id;
const { value } = declaration.init;

assert.include(["const", "let", "var"], kind);
assert.equal(name, "port");
assert.equal(value, 3000);
```

### --seed--

#### --"learn-express-by-building-a-random-joke-app/server.js"--

```js

```

## 2

### --description--

Now, listen for connections on your `port` variable by calling the `app.listen()` method with `port` as the first argument. Inside the callback function, log a message to the console to verify the server is running.

Here's an example usage of `app.listen()`:

```js
app.listen(3000, () => {
  console.log('Server is running on port 3000')
})
```

### --tests--

You should call the `listen` method on your `app` variable.

```js
const isListening = await __helpers.isServerListening(3000);
assert.isTrue(isListening);
```

You should log a message to the console when the server starts.

```js
const file = await __helpers.getFile(project.dashedName, "server.js");
assert.match(file, /app\.listen\s*\(\s*port\s*,\s*(?:function\s*\(\s*\)|\(\s*\)\s*=>)\s*\{\s*console\.log\s*\(\s*[^)]*\)/);
```

### --seed--

#### --"learn-express-by-building-a-random-joke-app/server.js"--

```javascript
const express = require('express');
const app = express();
const port = 3000;
```

## 3

### --description--

The jokes that will be returned randomly are provided in a `jokes` array. Before creating the route that serves those jokes, you first need to define a home route.

Here's an example route in Express:

```js
app.get('/', (req, res) => {
  res.send('Here is the index...')
})
```

This route listens for `GET` requests at the root URL (`/`) and sends back a response from the server.
`req` represents the incoming request, `res` represents the server response, and `res.send()` sends data back to the client.

Create a `GET` route for the root path. Inside the route handler, use `res.send()` to send the message `Welcome to the Random Joke Server! Visit /joke to get a random joke.`.

### --tests--

You should create a `GET` route for the root path by using `app.get()`.

```js
const res = await fetch('http://localhost:3000/');
assert.equal(res.status, 200);
```

Your route should return the message `Welcome to the Random Joke Server! Visit /joke to get a random joke.`.

```js
const res = await fetch('http://localhost:3000/');
const text = await res.text();

assert.equal(text, 'Welcome to the Random Joke Server! Visit /joke to get a random joke.');
```

### --seed--

#### --"learn-express-by-building-a-random-joke-app/server.js"--

```javascript
const express = require('express');
const app = express();
const port = 3000;

const jokes = [
  'Why do programmers prefer dark mode? Because light attracts bugs!',
  'There are only 10 kinds of people in the world: those who understand binary and those who don’t.',
  'I told my computer I needed a break, and it said "No problem, I’ll go to sleep."',
  'Why do Java developers wear glasses? Because they don’t see sharp.'
]

app.listen(port, () => {
  console.log(`Joke Server running at http://localhost:${port}`)
})
```

## 4

### --description--

To start serving the jokes randomly, create a `/joke` `GET` route. Inside the route handler, pick a random joke from the jokes array, save it in a variable `randomJoke`, then send that joke back to the client by using `res.send()`.

### --tests--

You should create a `GET` route for `/joke` by using `app.get()`.

```js
const res = await fetch('http://localhost:3000/joke');
assert.equal(res.status, 200);
```

Your `/joke` route handler should have `req` and `res` as parameters.

```js
const file = await __helpers.getFile(project.dashedName, "server.js");
const jokes = file.match(/const\s+jokes\s*=\s*\[([\s\S]*?)\]/);
const jokesString = jokes[1];

const res = await fetch('http://localhost:3000/joke');
const text = await res.text();

assert.include(validJokesString, text);
```

### --seed--

#### --"learn-express-by-building-a-random-joke-app/server.js"--

```javascript
const express = require('express');
const app = express();
const port = 3000;

const jokes = [
  'Why do programmers prefer dark mode? Because light attracts bugs!',
  'There are only 10 kinds of people in the world: those who understand binary and those who don’t.',
  'I told my computer I needed a break, and it said "No problem, I’ll go to sleep."',
  'Why do Java developers wear glasses? Because they don’t see sharp.'
]

app.get('/', (req, res) => {
  res.send('Welcome to the Random Joke Server! Visit /joke to get a random joke.')
})

app.listen(port, () => {
  console.log(`Joke Server running at http://localhost:${port}`)
})
```

## 5

### --description--

Finally, create a `GET` route called `/about` to display a short information about the random joke server. It should log the message `This Random Joke Server was built with Express.js`.

### --tests--

You should create a `GET` route for `/about` by using `app.get()`.

```js
const res = await fetch('http://localhost:3000/about');
assert.equal(res.status, 200);
```

Your route handler should have `req` and `res` as parameters.

```js
const res = await fetch('http://localhost:3000/about');
const text = await res.text()
assert.equal(text, 'This Random Joke Server was built with Express.js');
```

### --seed--

#### --"learn-express-by-building-a-random-joke-app/server.js"--

```javascript
const express = require('express');
const app = express();
const port = 3000;

const jokes = [
  'Why do programmers prefer dark mode? Because light attracts bugs!',
  'There are only 10 kinds of people in the world: those who understand binary and those who don’t.',
  'I told my computer I needed a break, and it said "No problem, I’ll go to sleep."',
  'Why do Java developers wear glasses? Because they don’t see sharp.'
]

app.get('/', (req, res) => {
  res.send('Welcome to the Random Joke Server! Visit /joke to get a random joke.')
})

app.get('/joke', (req, res) => {
  const randomJoke = jokes[Math.floor(Math.random() * jokes.length)]
  res.send(randomJoke)
})

app.listen(port, () => {
  console.log(`Joke Server running at http://localhost:${port}`)
})
```

## --fcc-end--