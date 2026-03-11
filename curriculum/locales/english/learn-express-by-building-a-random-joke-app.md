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

To get started with the project, you need to install the Express npm package first by running `npm install express` in the terminal. 

### --tests--

You should have express installed.

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

You should create a variable named `express`.

```js
const file = await __helpers.getFile(project.dashedName, 'server.js');
const code = new __helpers.Tower(file);
const expressVar = code.getVariable('express');
assert.exists(expressVar, 'You should create a variable named express');
```

Your `express` variable should be set to `require('express')`.

```js
const file = await __helpers.getFile(project.dashedName, 'server.js');
const code = new __helpers.Tower(file);
const expressVar = code.getVariable('express');

const { kind } = expressVar.ast;
const declaration = expressVar.ast.declarations[0];
const { name } = declaration.id;
const { callee, arguments: args } = declaration.init;

assert.include(
  ['const', 'let', 'var'], 
  kind,
  'The variable \'express\' should be declared using \'const\', \'let\', or \'var\'.'
);
assert.equal(name, "express", 'The variable name should be \'express\'');
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

You should create an `app` variable and set it to `express()`.

```js
const file = await __helpers.getFile(project.dashedName, 'server.js');
const code = new __helpers.Tower(file);
const appVar = code.getVariable('app');

const { kind } = appVar.ast;
const declaration = appVar.ast.declarations[0];
const { name } = declaration.id;
const { callee, arguments: args } = declaration.init;

assert.include(
  ['const', 'let', 'var'], 
  kind, 
  'The variable \'app\' should be declared using \'const\', \'let\', or \'var\'.'
);
assert.equal(name, 'app', 'The variable name should be \'app\'.');
assert.equal(
  callee.name,
  'express',
  'You should assign the \'express()\' function call to the \'app\' variable.'
);
assert.equal(args.length, 0, 'The \'express()\' function call should not take any arguments.');
```

You should create a `port` variable and set it to `3000`.

```js
const file = await __helpers.getFile(project.dashedName, 'server.js');
const code = new __helpers.Tower(file);
const portVar = code.getVariable('port');

const { kind } = portVar.ast;
const declaration = portVar.ast.declarations[0];
const { name } = declaration.id;
const { value } = declaration.init;

assert.include(
  ['const', 'let', 'var'], 
  kind, 
  'The variable \'port\' should be declared using \'const\', \'let\', or \'var\'.'
);
assert.equal(name, 'port', 'The variable name should be \'port\'.');
assert.equal(value, 3000, 'The variable \'port\' should be assigned the value 3000.');
```

### --seed--

#### --"learn-express-by-building-a-random-joke-app/server.js"--

```js

```

## 3

### --description--

Now, listen for connections on your `port` variable by calling the `app.listen()` method with `port` as the first argument. Inside the callback function, log a message to the console to verify the server is running.

Here's an example usage of `app.listen()`:

```js
app.listen(3000, () => {
  console.log('Server is running on port 3000')
})
```

Finally, open your terminal and run `node server.js` to start your server. This will make your app listen on the port you specified.

### --tests--

The server should be listneing on port `3000`.

```js
const isListening = await __helpers.isServerListening(3000);
assert.isTrue(isListening, 'The server should be listening on port 3000');
```

You should log a message to the console when the server starts.

```js
const { stdout } = await __helpers.awaitExecution(
  ['node', `${project.dashedName}/server.js`],
  'http://localhost:3000'
);

assert.isTrue(stdout.trim().length > 0, 'Your server should log a message to the console.');
```

### --seed--

#### --"learn-express-by-building-a-random-joke-app/server.js"--

```javascript

```

## 4

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

*Note: If your server is currently running, you'll need to stop it with `Ctrl+C` and restart it using `node server.js` so your new changes can take effect.*

### --tests--

You should create a `GET` route for the root path by using `app.get()`.

```js
const res = await fetch('http://localhost:3000/');
assert.equal(res.status, 200, 'Your server should respond with a 200 status code at the root path \'/\'');
```

Your route should return the message `Welcome to the Random Joke Server! Visit /joke to get a random joke.`.

```js
const res = await fetch('http://localhost:3000/');
const text = await res.text();

assert.equal(
  text, 
  'Welcome to the Random Joke Server! Visit /joke to get a random joke.',
  'The root path should return a correct welcome message.'
);
```

### --seed--

#### --"learn-express-by-building-a-random-joke-app/server.js"--

```javascript

```

## 5

### --description--

To start serving the jokes randomly, create a `/joke` `GET` route. Inside the route handler, pick a random joke from the jokes array, save it in a variable `randomJoke`, then send that joke back to the client by using `res.send()`.

Don't forget to stop the running server with `Ctrl+C` and restart it by running `node server.js` so your new changes take effect.

### --tests--

You should create a `GET` route for `/joke` by using `app.get()`.

```js
const res = await fetch('http://localhost:3000/joke');
assert.equal(res.status, 200, 'Your server should respond with a 200 status code at the \'/joke\' path.');
```

Your `/joke` route should return a random joke from the jokes array.

```js
const validJokes = [
  'Why do programmers prefer dark mode? Because light attracts bugs!',
  'There are only 10 kinds of people in the world: those who understand binary and those who don’t.',
  'I told my computer I needed a break, and it said "No problem, I’ll go to sleep."',
  'Why do Java developers wear glasses? Because they don’t see sharp.'
];

// fetch the joke endpoint 
const fetchJoke = async () => {
  const res = await fetch('http://localhost:3000/joke');
  return await res.text();
};

const results = new Set();

// fetch multiple times, up to 10 times to give randomness a chance to produce different results
for (let i = 0; i < 10; i++) {
  const joke = await fetchJoke();
  
  // every fetched joke has to be from the valid list
  assert.include(validJokes, joke, 'The returned joke is not in the original jokes array.');
  results.add(joke);
}

// Since there are 4 jokes, fetching 10 times should yield at least 2 distinct jokes if it's truly random
assert.isAbove(
  results.size,
  1,
  'The \`/joke\` route should return a random joke each time it is called.'
);
```

### --seed--

#### --"learn-express-by-building-a-random-joke-app/server.js"--

```javascript

```

## 6

### --description--

Finally, create a `GET` route called `/about` to display a short information about the random joke server. It should log the message `This Random Joke Server was built with Express.js`.

Make sure you restart the server.

With that, your random jokes application is complete!

### --tests--

You should create a `GET` route for `/about` by using `app.get()`.

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
const text = await res.text()
assert.equal(
  text,
  'This Random Joke Server was built with Express.js',
  'The \'/about\' path should return a correct info message.'
);
```

### --seed--

#### --"learn-express-by-building-a-random-joke-app/server.js"--

```javascript

```

## --fcc-end--