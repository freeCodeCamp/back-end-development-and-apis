# Learn Express by Building a Random Joke App

In this course, you will learn basic Express by building a random joke app.

## 0

### --description--

To get started with the project, you need to install the Express npm package first by running `npm install express` in the terminal. 

### --tests--

You should run `npm install` in the terminal.

```js
await new Promise(res => setTimeout(res, 1000));
const lastCommand = await __helpers.getLastCommand();
assert.equal(lastCommand.replace(/\s+/g, ' ').trim(), 'npm install express');
```

You should be in the learn-express-by-building-a-random-joke-app folder in your terminal when you run it

```js
await new Promise(res => setTimeout(res, 1000));
const cwdFile = await __helpers.getCWD();
const cwd = cwdFile.split('\n').filter(Boolean).pop();
assert.include(cwd, 'learn-express-by-building-a-random-joke-app');
```

### --seed--

#### --"server.js"--

```js

```

## 1

### --description--

Next, import Express by using `require()`, with the import assigned to an `express` variable. After that, create an Express app by calling the Express function and saving it in an `app` variable.

Also, create a `port` variable and set it to `3000`. This is the port the app will run on.

### --tests--

You should create a variable named `express`.

```js
const file = await __helpers.getFile("learn-express-by-building-a-random-joke-app", "server.js");
const code = new __helpers.Tower(file);
const expressVar = code.getVariable("express");
assert.exists(expressVar);
```

Your `express` variable should be set to `require('express')`.

```js
const file = await __helpers.getFile("learn-express-by-building-a-random-joke-app", "server.js");
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
const file = await __helpers.getFile("learn-express-by-building-a-random-joke-app", "server.js");
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
const file = await __helpers.getFile("learn-express-by-building-a-random-joke-app", "server.js");
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

#### --"server.js"--

```js

```

## 2

### --description--

Now, you should listen for server connections on the `port`. To do this, use `app.listen()` to start the server and log a message to the console when it’s running.

Here's an example usage of `app.listen()`:

```js
app.listen(3000, () => {
  console.log('Server is running on port 3000')
})
```

### --tests--

You should call the `listen` method on your `app` variable.

```js
const file = await __helpers.getFile("learn-express-by-building-a-random-joke-app", "server.js");
const code = new __helpers.Tower(file);
const listenCalls = code.getCalls("app.listen");
assert.isAtLeast(listenCalls.length, 1);

const listenCall = listenCalls[0];
const portArg = listenCall.ast.expression.arguments[0];
assert.strictEqual(portArg.name, 'port');
```

You should log `Joke Server running at http://localhost:${port}` to the console when the server starts.

```js
const file = await __helpers.getFile("learn-express-by-building-a-random-joke-app", "server.js");
const codeStructure = new __helpers.Tower(file);
const listenCall = codeStructure.getCalls("app.listen")[0];

const callbackNode = listenCall.ast.expression.arguments[1];
const callbackTower = new __helpers.Tower(callbackNode);
const logCall = callbackTower.getCalls("console.log")[0];
const arg = logCall.ast.expression.arguments[0];
console.log("Arg: ", arg)

if (arg.type === 'TemplateLiteral') {
  assert.strictEqual(arg.quasis[0].value.raw, 'Joke Server running at http://localhost:');
  assert.strictEqual(arg.expressions[0].name, 'port');
} else if (arg.type === 'BinaryExpression') {
  assert.strictEqual(arg.left.value, 'Joke Server running at http://localhost:');
  assert.strictEqual(arg.right.name, 'port');
} else {
  assert.fail("You should use a template literal or string concatenation to log the message to the console.");
}
```

### --seed--

#### --"server.js"--

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
const file = await __helpers.getFile("learn-express-by-building-a-random-joke-app", "server.js");
const code = new __helpers.Tower(file);
const getCalls = code.getCalls("app.get");

const rootGetCall = getCalls.find(call => 
  call.compact.includes("app.get('/',") || 
  call.compact.includes('app.get("/",')
);
assert.exists(rootGetCall);
```

Your route handler should have `req` and `res` as parameters.

```js
const file = await __helpers.getFile("learn-express-by-building-a-random-joke-app", "server.js");
const code = new __helpers.Tower(file);
const getCalls = code.getCalls("app.get");

const rootGetCall = getCalls.find(call => 
  call.compact.includes("app.get('/',") || 
  call.compact.includes('app.get("/",')
);

const handlerNode = rootGetCall.ast.expression.arguments[1];
assert.equal(handlerNode.params[0].name, 'req');
assert.equal(handlerNode.params[1].name, 'res');
```

You should use `res.send` to send the message `Welcome to the Random Joke Server! Visit /joke to get a random joke.`.

```js
const file = await __helpers.getFile("learn-express-by-building-a-random-joke-app", "server.js");
const code = new __helpers.Tower(file);
const rootGetCall = code.getCalls("app.get").find(call => 
  call.compact.includes("app.get('/',") || 
  call.compact.includes('app.get("/",')
);

const handlerTower = new __helpers.Tower(rootGetCall.ast.expression.arguments[1]);
const sendCall = handlerTower.getCalls("res.send")[0];
assert.equal(sendCall.ast.expression.arguments[0].value, 'Welcome to the Random Joke Server! Visit /joke to get a random joke.');
```

### --seed--

#### --"server.js"--

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
const file = await __helpers.getFile("learn-express-by-building-a-random-joke-app", "server.js");
const code = new __helpers.Tower(file);
const jokeCall = code.getCalls("app.get").find(call => 
  call.compact.match(/app\.get\(["']\/joke["'],/)
);
assert.exists(jokeCall);
```

Your `/joke` route handler should have `req` and `res` as parameters.

```js
const file = await __helpers.getFile("learn-express-by-building-a-random-joke-app", "server.js");
const code = new __helpers.Tower(file);
const jokeCall = code.getCalls("app.get").find(call => 
  call.compact.match(/app\.get\(["']\/joke["'],/)
);

const handlerNode = jokeCall.ast.expression.arguments[1];
assert.strictEqual(handlerNode.params[0].name, 'req');
assert.strictEqual(handlerNode.params[1].name, 'res');
```

You should define a variable named `randomJoke` that picks a joke randomly from the `jokes` array inside the handler.

```js
const file = await __helpers.getFile("learn-express-by-building-a-random-joke-app", "server.js");
const code = new __helpers.Tower(file);
const jokeCall = code.getCalls("app.get").find(call => 
  call.compact.match(/app\.get\(["']\/joke["'],/)
);

const handlerTower = new __helpers.Tower(jokeCall.ast.expression.arguments[1]);
const randomJokeVar = handlerTower.getVariable("randomJoke");
assert.exists(randomJokeVar);

assert.match(randomJokeVar.compact, /(const|let|var)\s+randomJoke\s*=\s*jokes\[Math\.floor\(Math\.random\(\)\*jokes\.length\)\];?/);
```

You should send the `randomJoke` to the client with `res.send()`.

```js
const file = await __helpers.getFile("learn-express-by-building-a-random-joke-app", "server.js");
const code = new __helpers.Tower(file);
const jokeCall = code.getCalls("app.get").find(call => 
  call.compact.match(/app\.get\(["']\/joke["'],/)
);

const handlerTower = new __helpers.Tower(jokeCall.ast.expression.arguments[1]);
const sendCall = handlerTower.getCalls("res.send")[0];
assert.strictEqual(sendCall.ast.expression.arguments[0].name, 'randomJoke');
```

### --seed--

#### --"server.js"--

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
const file = await __helpers.getFile("learn-express-by-building-a-random-joke-app", "server.js");
const code = new __helpers.Tower(file);
const aboutCall = code.getCalls("app.get").find(call => 
  call.compact.match(/app\.get\(["']\/about["'],/)
);
assert.exists(aboutCall);
```

Your route handler should have `req` and `res` as parameters.

```js
const file = await __helpers.getFile("learn-express-by-building-a-random-joke-app", "server.js");
const code = new __helpers.Tower(file);
const aboutCall = code.getCalls("app.get").find(call => 
  call.compact.match(/app\.get\(["']\/about["'],/)
);

const handlerNode = aboutCall.ast.expression.arguments[1];
assert.strictEqual(handlerNode.params[0].name, 'req');
assert.strictEqual(handlerNode.params[1].name, 'res');
```

You should use `res.send` to send the message `This Random Joke Server was built with Express.js`.

```js
const file = await __helpers.getFile("learn-express-by-building-a-random-joke-app", "server.js");
const code = new __helpers.Tower(file);
const aboutCall = code.getCalls("app.get").find(call => 
  call.compact.match(/app\.get\(["']\/about["'],/)
);

const handlerTower = new __helpers.Tower(aboutCall.ast.expression.arguments[1]);
const sendCall = handlerTower.getCalls("res.send")[0];
assert.strictEqual(sendCall.ast.expression.arguments[0].value, 'This Random Joke Server was built with Express.js');
```

### --seed--

#### --"server.js"--

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