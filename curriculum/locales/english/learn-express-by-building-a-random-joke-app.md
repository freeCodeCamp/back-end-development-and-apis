# Learn Express by Building a Random Joke App

In this course, you will learn basic Express by building a random joke app.

## 0

### --description--

To get started, you need to import Express by using `require()`, then create an Express app by calling the Express function and saving it in an `app` variable.

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
assert.match(expressVar.compact, /const\s+express\s*=\s*require\(["']express["']\);?/);
```

You should create an `app` variable and set it to `express()`.

```js
const file = await __helpers.getFile("learn-express-by-building-a-random-joke-app", "server.js");
const code = new __helpers.Tower(file);
const appVar = code.getVariable("app");
assert.match(appVar.compact, /const\s+app\s*=\s*express\(\);?/);
```

You should create a `port` variable and set it to `3000`.

```js
const file = await __helpers.getFile("learn-express-by-building-a-random-joke-app", "server.js");
const code = new __helpers.Tower(file);
const portVar = code.getVariable("port");
assert.match(portVar.compact, /const\s+port\s*=\s*3000;?/);
```

### --seed--

#### --"server.js"--

```js

```

## 1

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

assert.match(rootGetCall.compact, /app\.get\(["']\/["'],(\(req,res\)=>|function\(req,res\))/);
```

You should use `res.send` to send the message `Welcome to the Random Joke Server! Visit /joke to get a random joke.`.

```js
const file = await __helpers.getFile("learn-express-by-building-a-random-joke-app", "server.js");
const code = new __helpers.Tower(file);
const getCalls = code.getCalls("app.get");
const rootGetCall = getCalls.find(call => 
  call.compact.includes("app.get('/',") || 
  call.compact.includes('app.get("/",')
);
assert.match(rootGetCall.compact, /res\.send\(["'`]Welcome to the Random Joke Server! Visit \/joke to get a random joke\.["'`]\)/);
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
```

## 2

### --description--

To start serving the jokes randomly, create a `/joke` `GET` route. Inside the route handler, pick a random joke from the jokes array, save it in a variable `randomJoke`, then send that joke back to the client by using `res.send()`.

### --tests--

You should create a `GET` route for `/joke` by using `app.get()`.

```js
const file = await __helpers.getFile("learn-express-by-building-a-random-joke-app", "server.js");
const code = new __helpers.Tower(file);
const getCalls = code.getCalls("app.get");

const rootGetCall = getCalls.find(call => 
  call.compact.includes("app.get('/joke',") || 
  call.compact.includes('app.get("/joke",')
);
assert.exists(rootGetCall);
```

Your `/joke` route handler should have `req` and `res` as parameters.

```js
const file = await __helpers.getFile("learn-express-by-building-a-random-joke-app", "server.js");
const code = new __helpers.Tower(file);
const getCalls = code.getCalls("app.get");

const rootGetCall = getCalls.find(call => 
  call.compact.includes("app.get('/joke',") || 
  call.compact.includes('app.get("/joke",')
);

assert.match(rootGetCall.compact, /app\.get\(["']\/joke["'],(\(req,res\)=>|function\(req,res\))/);
```

You should use `res.send` to send the message `Welcome to the Random Joke Server! Visit /joke to get a random joke.`.

```js
const file = await __helpers.getFile("learn-express-by-building-a-random-joke-app", "server.js");
const code = new __helpers.Tower(file);
const getCalls = code.getCalls("app.get");
const rootGetCall = getCalls.find(call => 
  call.compact.includes("app.get('/',") || 
  call.compact.includes('app.get("/",')
);
assert.match(rootGetCall.compact, /res\.send\(["'`]Welcome to the Random Joke Server! Visit \/joke to get a random joke\.["'`]\)/);
```

You should define a variable named `randomJoke` that picks a joke randomly from the `jokes` array inside the handler.

```js
const file = await __helpers.getFile("learn-express-by-building-a-random-joke-app", "server.js");
const code = new __helpers.Tower(file);
const jokeRoute = code.getCalls("app.get").find(c => c.compact.includes("'/joke'"));

const handlerNode = jokeRoute.ast.expression.arguments[1];
const handlerTower = new __helpers.Tower(handlerNode);

const randomJokeVar = handlerTower.getVariable("randomJoke");
assert.exists(randomJokeVar);

assert.match(randomJokeVar.compact, /const\s+randomJoke\s*=\s*jokes\[Math\.floor\(Math\.random\(\)\*jokes\.length\)\];?/);
```

You should send the `randomJoke` to the client with `res.send()`.

```js
const file = await __helpers.getFile("learn-express-by-building-a-random-joke-app", "server.js");
const code = new __helpers.Tower(file);
const jokeRoute = code.getCalls("app.get").find(c => c.compact.includes("'/joke'"));
const handlerTower = new __helpers.Tower(jokeRoute.ast.expression.arguments[1]);

assert.match(handlerTower.compact, /res\.send\(randomJoke\);?/);
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
```

## --fcc-end--
