# Learn Express by Building a Random Joke App

In this course, you will learn basic Express by building a random joke app.

## 0

### --description--

Open a new terminal and change to the project directory, `learn-express-by-building-a-random-joke-app`.

### --tests--

You should run `cd learn-express-by-building-a-random-joke-app` in the terminal.

```js
const cwd = await __helpers.getLastCWD();
const dirRegex = new RegExp(`${project.dashedName}/?$`);
assert.match(
  cwd,
  dirRegex,
  'You should be in the \'learn-express-by-building-a-random-joke-app\' directory.'
);
```

### --seed--

#### --"learn-express-by-building-a-random-joke-app/server.js"--

```js

```

## 1

### --description--

To get started, install the Express npm package by running `npm install express` in the terminal.

### --tests--

You should have `express` installed.

```js
const file = await __helpers.getFile(project.dashedName, 'package.json');
const packageJson = JSON.parse(file);

assert.property(
  packageJson.dependencies,
  'express',
  'Your package.json should have \'express\' in the dependencies object.'
);
```

### --seed--

#### --"learn-express-by-building-a-random-joke-app/server.js"--

```js

```

## 2

### --description--

A `server.js` file has been provided for you to write the project code in.

Import Express by using `require()`, with the import assigned to an `express` variable. After that, create an Express app by calling the Express function and saving it in an `app` variable.

Also, create a `port` variable and set it to `3000`. This is the port the app will run on.

### --tests--

You should create an `express` variable set to `require('express')`.

```js
const file = await __helpers.getFile(project.dashedName, 'server.js');
const code = new __helpers.Tower(file);
const expressVar = code.getVariable('express');

assert.exists(expressVar, 'You should create a variable named \'express\'.');

const declaration = expressVar.ast.declarations[0];
const { callee, arguments: args } = declaration.init;

assert.equal(
  callee.name,
  'require',
  'You should assign the \'require()\' function to the \'express\' variable.'
);
assert.equal(
  args[0].value,
  'express',
  'You should pass the string \'express\' to the \'require()\' function.'
);
```

You should create an `app` variable set to `express()`.

```js
const file = await __helpers.getFile(project.dashedName, 'server.js');
const code = new __helpers.Tower(file);
const appVar = code.getVariable('app');

assert.exists(appVar, 'You should create a variable named \'app\'.');

const declaration = appVar.ast.declarations[0];
const { callee, arguments: args } = declaration.init;

assert.equal(
  callee.name,
  'express',
  'You should assign the \'express()\' function call to the \'app\' variable.'
);
assert.equal(args.length, 0, 'The \'express()\' function call should not take any arguments.');
```

You should create a `port` variable set to `3000`.

```js
const file = await __helpers.getFile(project.dashedName, 'server.js');
const code = new __helpers.Tower(file);
const portVar = code.getVariable('port');

assert.exists(portVar, 'You should create a variable named \'port\'.');

const declaration = portVar.ast.declarations[0];
const { value } = declaration.init;

assert.equal(value, 3000, 'The variable \'port\' should be assigned the value 3000.');
```

### --seed--

#### --"learn-express-by-building-a-random-joke-app/server.js"--

```js

```

## 3

### --description--

Now, start the server by calling `app.listen()` with your `port` variable as the first argument and a callback function that logs a message to the console.

Here is an example:

```js
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
```

Then run `node server.js` in the terminal to start your server.

### --tests--

Your server should be listening on port `3000`.

```js
const isListening = await __helpers.isServerListening(3000);
assert.isTrue(isListening, 'The server should be listening on port 3000.');
```

You should log a message to the console when the server starts.

```js
const { stdout } = await __helpers.awaitExecution(
  ['node', `${project.dashedName}/server.js`],
  'http://localhost:3000'
);

assert.isTrue(stdout.trim().length > 0, 'Your server should log a message to the console when it starts.');
```

### --seed--

#### --"learn-express-by-building-a-random-joke-app/server.js"--

```js
const express = require('express');
const app = express();
const port = 3000;

const jokes = [
  'Why do programmers prefer dark mode? Because light attracts bugs!',
  'There are only 10 kinds of people in the world: those who understand binary and those who don\'t.',
  'I told my computer I needed a break, and it said "No problem, I\'ll go to sleep."',
  'Why do Java developers wear glasses? Because they don\'t see sharp.'
];
```

## 4

### --description--

The server is running but not handling any requests yet. Create a `GET` route for the root path (`/`). Inside the route handler, use `res.send()` to send the message `Welcome to the Random Joke Server! Visit /joke to get a random joke.`

Here is an example route in Express:

```js
app.get('/path', (req, res) => {
  res.send('Hello there');
});
```

`req` represents the incoming request, `res` represents the server response, and `res.send()` sends data back to the client.

*Note: Stop the running server with `Ctrl+C` and restart it with `node server.js` for your changes to take effect.*

### --tests--

Your server should respond with a `200` status code at the root path `/`.

```js
const res = await fetch('http://localhost:3000/');
assert.equal(res.status, 200, 'Your server should respond with a 200 status code at the root path \'/\'.');
```

Your root route should return the message `Welcome to the Random Joke Server! Visit /joke to get a random joke.`

```js
const res = await fetch('http://localhost:3000/');
const text = await res.text();

assert.equal(
  text,
  'Welcome to the Random Joke Server! Visit /joke to get a random joke.',
  'The root path should return the correct welcome message.'
);
```

### --seed--

#### --"learn-express-by-building-a-random-joke-app/server.js"--

```js
const express = require('express');
const app = express();
const port = 3000;

const jokes = [
  'Why do programmers prefer dark mode? Because light attracts bugs!',
  'There are only 10 kinds of people in the world: those who understand binary and those who don\'t.',
  'I told my computer I needed a break, and it said "No problem, I\'ll go to sleep."',
  'Why do Java developers wear glasses? Because they don\'t see sharp.'
];

app.listen(port, () => {
  console.log(`Joke Server running at http://localhost:${port}`);
});
```

## 5

### --description--

Now create a `/joke` `GET` route. Inside the route handler, pick a random joke from the `jokes` array, save it in a `randomJoke` variable, then send it back to the client using `res.send()`.

*Stop the server with `Ctrl+C` and restart it with `node server.js` after making changes.*

### --tests--

Your server should respond with a `200` status code at the `/joke` path.

```js
const res = await fetch('http://localhost:3000/joke');
assert.equal(res.status, 200, 'Your server should respond with a 200 status code at the \'/joke\' path.');
```

Your `/joke` route should return a random joke from the `jokes` array.

```js
const validJokes = [
  'Why do programmers prefer dark mode? Because light attracts bugs!',
  'There are only 10 kinds of people in the world: those who understand binary and those who don\'t.',
  'I told my computer I needed a break, and it said "No problem, I\'ll go to sleep."',
  'Why do Java developers wear glasses? Because they don\'t see sharp.'
];

const fetchJoke = async () => {
  const res = await fetch('http://localhost:3000/joke');
  return await res.text();
};

const results = new Set();

// Fetch multiple times to verify randomness
for (let i = 0; i < 10; i++) {
  const joke = await fetchJoke();
  assert.include(validJokes, joke, 'The returned joke is not in the original jokes array.');
  results.add(joke);
}

// With 4 jokes and 10 requests, at least 2 distinct jokes should appear
assert.isAbove(
  results.size,
  1,
  'The `/joke` route should return a random joke each time it is called.'
);
```

### --seed--

#### --"learn-express-by-building-a-random-joke-app/server.js"--

```js
const express = require('express');
const app = express();
const port = 3000;

const jokes = [
  'Why do programmers prefer dark mode? Because light attracts bugs!',
  'There are only 10 kinds of people in the world: those who understand binary and those who don\'t.',
  'I told my computer I needed a break, and it said "No problem, I\'ll go to sleep."',
  'Why do Java developers wear glasses? Because they don\'t see sharp.'
];

app.get('/', (req, res) => {
  res.send('Welcome to the Random Joke Server! Visit /joke to get a random joke.');
});

app.listen(port, () => {
  console.log(`Joke Server running at http://localhost:${port}`);
});
```

## 6

### --description--

Finally, create a `/about` `GET` route. Inside the route handler, use `res.send()` to send the message `This Random Joke Server was built with Express.js`.

Restart the server after making changes. Your random joke app is now complete!

### --tests--

Your server should respond with a `200` status code at the `/about` path.

```js
const res = await fetch('http://localhost:3000/about');
assert.equal(
  res.status,
  200,
  'Your server should respond with a 200 status code at the \'/about\' path.'
);
```

Your `/about` route should return the message `This Random Joke Server was built with Express.js`.

```js
const res = await fetch('http://localhost:3000/about');
const text = await res.text();

assert.equal(
  text,
  'This Random Joke Server was built with Express.js',
  'The \'/about\' path should return the correct info message.'
);
```

### --seed--

#### --"learn-express-by-building-a-random-joke-app/server.js"--

```js
const express = require('express');
const app = express();
const port = 3000;

const jokes = [
  'Why do programmers prefer dark mode? Because light attracts bugs!',
  'There are only 10 kinds of people in the world: those who understand binary and those who don\'t.',
  'I told my computer I needed a break, and it said "No problem, I\'ll go to sleep."',
  'Why do Java developers wear glasses? Because they don\'t see sharp.'
];

app.get('/', (req, res) => {
  res.send('Welcome to the Random Joke Server! Visit /joke to get a random joke.');
});

app.get('/joke', (req, res) => {
  const randomJoke = jokes[Math.floor(Math.random() * jokes.length)];
  res.send(randomJoke);
});

app.listen(port, () => {
  console.log(`Joke Server running at http://localhost:${port}`);
});
```

## --fcc-end--
