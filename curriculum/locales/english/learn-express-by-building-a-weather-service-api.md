# Learn Express by Building a Weather Service API

In this course, you will learn Express routing, route parameters, response methods, chainable route handlers, modular routing with `express.Router`, and serving static files — all by building a weather service API.

## 0

### --description--

Open a new terminal and run `cd learn-express-by-building-a-weather-service-api` to navigate into the project directory.

In this project, you will build a weather service API with <dfn title="Express.js is a minimal and flexible Node.js web application framework">Express</dfn>. Along the way you will learn routing, route parameters, response methods, chainable route handlers, modular routing with `express.Router`, and serving static files.

### --tests--

You should be in the `learn-express-by-building-a-weather-service-api` directory.

```js
const __cwd = await __helpers.getLastCWD();
const __dirRegex = new RegExp(`${project.dashedName}/?$`);
assert.match(__cwd, __dirRegex, "You should be in the 'learn-express-by-building-a-weather-service-api' directory.");
```

## 1

### --description--

Create a new file called `index.js` in the project directory. This is where you will write your server code.

Express is imported using `require()` and initialised by calling it as a function. Here is an example:

```js
const express = require('express');
const app = express();
```

In `index.js`, import Express and assign it to a variable called `express`. Then create an Express application by calling `express()` and storing the result in a variable called `app`. Finally, declare a `PORT` variable set to `3000`.

### --tests--

`index.js` should require `express` and assign it to an `express` variable.

```js
const __t = new __helpers.Tower(global.__file);
const __expressVar = __t.getVariable('express');
assert.exists(__expressVar, "You should create a variable named 'express'.");
assert.match(__helpers.generate(__expressVar.ast.declarations[0].init).code, /require\(['"]express['"]\)/, "The 'express' variable should be set to require('express').");
```

`index.js` should call `express()` and assign the result to an `app` variable.

```js
const __t = new __helpers.Tower(global.__file);
const __appVar = __t.getVariable('app');
assert.exists(__appVar, "You should create a variable named 'app'.");
const __init = __appVar.ast.declarations[0].init;
assert.equal(__init.callee.name, 'express', "The 'app' variable should be set to 'express()'.");
assert.equal(__init.arguments.length, 0, "The 'express()' call should take no arguments.");
```

`index.js` should declare a `PORT` variable set to `3000`.

```js
const __t = new __helpers.Tower(global.__file);
const __portVar = __t.getVariable('PORT');
assert.exists(__portVar, "You should create a variable named 'PORT'.");
const __val = __portVar.ast.declarations[0].init.value;
assert.equal(__val, 3000, "The 'PORT' variable should be set to 3000.");
```

### --before-all--

```js
global.__file = await __helpers.getFile(project.dashedName, 'index.js');
```

### --after-all--

```js
delete global.__file;
```

## 2

### --description--

Now that you have an Express app, you need to tell it to start listening for incoming requests. Use `app.listen()` to bind the server to a port:

```js
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
```

In `index.js`, call `app.listen()` with `PORT` as the first argument and a callback that logs a message to the console. Then run `node index.js` in the terminal to start your server.

**NOTE:** Once your server is running, click _Run Tests_.

### --tests--

`index.js` should call `app.listen()` with `PORT` as the first argument.

```js
const __t = new __helpers.Tower(global.__file);
const __calls = __t.getCalls('app.listen');
assert.isAbove(__calls.length, 0, "You should call 'app.listen()' in 'index.js'.");
const __firstArg = __calls.at(0).ast.expression.arguments.at(0);
assert.equal(__firstArg?.name, 'PORT', "The first argument to 'app.listen()' should be 'PORT'.");
```

Your server should be listening on port `3000`.

```js
const __isListening = await __helpers.isServerListening(3000);
assert.isTrue(__isListening, 'Your server should be listening on port 3000. Run `node index.js` to start it.');
```

### --before-all--

```js
global.__file = await __helpers.getFile(project.dashedName, 'index.js');
```

### --after-all--

```js
delete global.__file;
```

### --seed--

#### --"learn-express-by-building-a-weather-service-api/index.js"--

```js
const express = require('express');

const app = express();
const PORT = 3000;
```

## 3

### --description--

Your server is running but not handling any requests yet. In Express, you define a <dfn title="A route matches an HTTP method and URL path to a handler function">route</dfn> using methods like `app.get()`. The handler receives `req` (the request) and `res` (the response). Use `res.json()` to send a JSON response:

```js
app.get('/example', (req, res) => {
  res.json({ message: 'Hello!' });
});
```

In `index.js`, add a `GET /api/info` route. Inside the handler, use `res.json()` to respond with an object that has at least a `name` property describing your API.

**NOTE:** Stop your server with `Ctrl+C`, restart it with `node index.js`, then click _Run Tests_.

### --tests--

Your server should respond to `GET /api/info` with a `200` status code.

```js
const __res = await fetch('http://localhost:3000/api/info');
assert.equal(__res.status, 200, "GET /api/info should return a 200 status code.");
```

`GET /api/info` should respond with JSON that has at least a `name` property.

```js
const __res = await fetch('http://localhost:3000/api/info');
const __contentType = __res.headers.get('content-type') ?? '';
assert.include(__contentType, 'application/json', "GET /api/info should respond with a JSON content-type header.");
const __data = await __res.json();
assert.property(__data, 'name', "The JSON response from GET /api/info should have a 'name' property.");
```

### --seed--

#### --"learn-express-by-building-a-weather-service-api/index.js"--

```js
const express = require('express');

const app = express();
const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
```

## 4

### --description--

Previously, you used `res.json()` to send a structured JSON response. For plain text or HTML, Express provides `res.send()` instead:

```js
app.get('/', (req, res) => {
  res.send('Welcome to my API!');
});
```

In `index.js`, add a `GET /` route that uses `res.send()` to respond with a plain-text welcome message of your choice.

**NOTE:** Restart your server with `node index.js` after making changes, then click _Run Tests_.

### --tests--

Your server should respond to `GET /` with a `200` status code.

```js
const __res = await fetch('http://localhost:3000/');
assert.equal(__res.status, 200, "GET / should return a 200 status code.");
```

`GET /` should respond with plain text, not JSON.

```js
const __res = await fetch('http://localhost:3000/');
const __contentType = __res.headers.get('content-type') ?? '';
assert.notInclude(__contentType, 'application/json', "GET / should use res.send() to respond with plain text, not res.json().");
const __body = await __res.text();
assert.isAbove(__body.trim().length, 0, "GET / should respond with a non-empty body.");
```

### --seed--

#### --"learn-express-by-building-a-weather-service-api/index.js"--

```js
const express = require('express');

const app = express();
const PORT = 3000;

app.get('/api/info', (req, res) => {
  res.json({ name: 'Weather Service API', version: '1.0.0' });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
```

## 5

### --description--

So far you have used `res.json()` and `res.send()` to respond to requests. Express also lets you explicitly set the <dfn title="A three-digit code indicating the result of an HTTP request">HTTP status code</dfn> by chaining `res.status()` before a response method:

```js
app.get('/api/status', (req, res) => {
  res.status(200).json({ status: 'ok' });
});
```

In `index.js`, add a `GET /api/status` route that uses `res.status(200).json()` to respond with a JSON object containing a `status` property.

**NOTE:** Restart your server with `node index.js`, then click _Run Tests_.

### --tests--

Your server should respond to `GET /api/status` with a `200` status code.

```js
const __res = await fetch('http://localhost:3000/api/status');
assert.equal(__res.status, 200, "GET /api/status should return a 200 status code.");
```

`GET /api/status` should respond with a JSON object that has a `status` property.

```js
const __res = await fetch('http://localhost:3000/api/status');
const __data = await __res.json();
assert.property(__data, 'status', "The response from GET /api/status should have a 'status' property.");
```

### --seed--

#### --"learn-express-by-building-a-weather-service-api/index.js"--

```js
const express = require('express');

const app = express();
const PORT = 3000;

app.get('/', (req, res) => {
  res.send('Welcome to the Weather Service API!');
});

app.get('/api/info', (req, res) => {
  res.json({ name: 'Weather Service API', version: '1.0.0' });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
```

## 6

### --description--

Another useful response method is `res.redirect()`, which sends the client to a different URL. This is handy for renaming routes without breaking old links:

```js
app.get('/old-path', (req, res) => {
  res.redirect('/new-path');
});
```

In `index.js`, add a `GET /docs` route that redirects to `/api/info`.

**NOTE:** Restart your server with `node index.js`, then click _Run Tests_.

### --tests--

`index.js` should contain a `GET /docs` route that calls `res.redirect`.

```js
const __file = await __helpers.getFile(project.dashedName, 'index.js');
assert.match(__file, /res\.redirect\s*\(/, "Your 'GET /docs' handler should call 'res.redirect()'.");
assert.match(__file, /['"]\/api\/info['"]/, "You should redirect to '/api/info'.");
```

`GET /docs` should ultimately respond with the same JSON as `GET /api/info`.

```js
const __docsRes = await fetch('http://localhost:3000/docs');
assert.equal(__docsRes.status, 200, "GET /docs should eventually resolve to a 200 response after redirecting.");
const __data = await __docsRes.json();
assert.property(__data, 'name', "Following the redirect from GET /docs should return the /api/info JSON.");
```

### --seed--

#### --"learn-express-by-building-a-weather-service-api/index.js"--

```js
const express = require('express');

const app = express();
const PORT = 3000;

app.get('/', (req, res) => {
  res.send('Welcome to the Weather Service API!');
});

app.get('/api/info', (req, res) => {
  res.json({ name: 'Weather Service API', version: '1.0.0' });
});

app.get('/api/status', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
```

## 7

### --description--

So far all your route paths have been static strings. Express also supports <dfn title="Named URL segments that capture values from the request path">route parameters</dfn> — placeholders prefixed with `:` that are captured and made available on `req.params`:

```js
app.get('/api/greet/:name', (req, res) => {
  const { name } = req.params;
  res.json({ greeting: `Hello, ${name}!` });
});
```

In `index.js`, add a `GET /api/greet/:name` route that reads the `:name` parameter from `req.params` and includes it somewhere in a JSON response.

**NOTE:** Restart your server with `node index.js`, then click _Run Tests_.

### --tests--

`GET /api/greet/:name` should respond with a `200` status code.

```js
const __res = await fetch('http://localhost:3000/api/greet/Alice');
assert.equal(__res.status, 200, "GET /api/greet/:name should return a 200 status code.");
```

`GET /api/greet/:name` should reflect the `:name` parameter in the JSON response.

```js
const __resAlice = await fetch('http://localhost:3000/api/greet/Alice');
const __dataAlice = await __resAlice.json();
assert.match(JSON.stringify(__dataAlice), /Alice/, "The response for GET /api/greet/Alice should include 'Alice'.");

const __resBob = await fetch('http://localhost:3000/api/greet/Bob');
const __dataBob = await __resBob.json();
assert.match(JSON.stringify(__dataBob), /Bob/, "The response for GET /api/greet/Bob should include 'Bob'.");
```

### --seed--

#### --"learn-express-by-building-a-weather-service-api/index.js"--

```js
const express = require('express');

const app = express();
const PORT = 3000;

app.get('/', (req, res) => {
  res.send('Welcome to the Weather Service API!');
});

app.get('/api/info', (req, res) => {
  res.json({ name: 'Weather Service API', version: '1.0.0' });
});

app.get('/api/status', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.get('/docs', (req, res) => {
  res.redirect('/api/info');
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
```

## 8

### --description--

When multiple HTTP methods share the same path, you can use `app.route()` to attach them all in one place — this is called a <dfn title="Chaining multiple HTTP method handlers onto a single route path">chainable route handler</dfn>:

```js
app.route('/api/data')
  .get((req, res) => {
    res.json({ message: 'GET /api/data' });
  });
```

In `index.js`, use `app.route('/api/data')` and chain a `.get()` handler onto it that responds with a JSON body.

**NOTE:** Restart your server with `node index.js`, then click _Run Tests_.

### --tests--

`index.js` should use `app.route()` to define the `/api/data` route.

```js
const __file = await __helpers.getFile(project.dashedName, 'index.js');
assert.match(__file, /app\.route\s*\(\s*['"]\/api\/data['"]\s*\)/, "You should use 'app.route('/api/data')' in 'index.js'.");
```

`GET /api/data` should respond with a `200` status and a JSON body.

```js
const __res = await fetch('http://localhost:3000/api/data');
assert.equal(__res.status, 200, "GET /api/data should return a 200 status code.");
const __contentType = __res.headers.get('content-type') ?? '';
assert.include(__contentType, 'application/json', "GET /api/data should respond with JSON.");
```

### --seed--

#### --"learn-express-by-building-a-weather-service-api/index.js"--

```js
const express = require('express');

const app = express();
const PORT = 3000;

app.get('/', (req, res) => {
  res.send('Welcome to the Weather Service API!');
});

app.get('/api/info', (req, res) => {
  res.json({ name: 'Weather Service API', version: '1.0.0' });
});

app.get('/api/status', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.get('/docs', (req, res) => {
  res.redirect('/api/info');
});

app.get('/api/greet/:name', (req, res) => {
  const { name } = req.params;
  res.json({ greeting: `Hello, ${name}!` });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
```

## 9

### --description--

The real power of `app.route()` is that you can keep chaining additional HTTP method handlers for the same path, keeping related code together:

```js
app.route('/api/data')
  .get((req, res) => {
    res.json({ message: 'GET /api/data' });
  })
  .post((req, res) => {
    res.status(201).json({ message: 'POST /api/data', created: true });
  });
```

In `index.js`, chain a `.post()` handler onto your existing `app.route('/api/data')` call. The handler should respond with a `201` status code and a JSON body.

**NOTE:** Restart your server with `node index.js`, then click _Run Tests_.

### --tests--

`index.js` should chain a `.post()` handler onto `app.route('/api/data')`.

```js
const __file = await __helpers.getFile(project.dashedName, 'index.js');
assert.match(__file, /app\.route\s*\(\s*['"]\/api\/data['"]\s*\)[\s\S]*?\.post\s*\(/, "You should chain a '.post()' handler onto 'app.route('/api/data')'.");
```

`POST /api/data` should respond with a `201` status code and a JSON body.

```js
const __res = await fetch('http://localhost:3000/api/data', { method: 'POST' });
assert.equal(__res.status, 201, "POST /api/data should return a 201 status code.");
const __contentType = __res.headers.get('content-type') ?? '';
assert.include(__contentType, 'application/json', "POST /api/data should respond with JSON.");
```

### --seed--

#### --"learn-express-by-building-a-weather-service-api/index.js"--

```js
const express = require('express');

const app = express();
const PORT = 3000;

app.get('/', (req, res) => {
  res.send('Welcome to the Weather Service API!');
});

app.get('/api/info', (req, res) => {
  res.json({ name: 'Weather Service API', version: '1.0.0' });
});

app.get('/api/status', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.get('/docs', (req, res) => {
  res.redirect('/api/info');
});

app.get('/api/greet/:name', (req, res) => {
  const { name } = req.params;
  res.json({ greeting: `Hello, ${name}!` });
});

app.route('/api/data')
  .get((req, res) => {
    res.json({ message: 'GET /api/data', data: [] });
  });

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
```

## 10

### --description--

As your API grows, keeping all routes in `index.js` becomes unwieldy. Express provides `express.Router()` to create <dfn title="A mini Express application that handles a subset of routes and can be mounted at a path">modular routers</dfn> — self-contained route handlers that can be organised in separate files:

```js
const express = require('express');
const router = express.Router();
```

Create a new file called `weather.js` in the project directory. In it, require `express` and create a router by calling `express.Router()`, storing the result in a variable called `router`.

### --tests--

`weather.js` should require `express`.

```js
assert.match(global.__file, /require\s*\(\s*['"]express['"]\s*\)/, "weather.js should require 'express'.");
```

`weather.js` should call `express.Router()` and assign the result to a `router` variable.

```js
const __t = new __helpers.Tower(global.__file);
const __routerVar = __t.getVariable('router');
assert.exists(__routerVar, "You should create a variable named 'router' in weather.js.");
assert.match(__helpers.generate(__routerVar.ast.declarations[0].init).code, /express\.Router\s*\(\s*\)/, "The 'router' variable should be set to 'express.Router()'.");
```

### --before-all--

```js
global.__file = await __helpers.getFile(project.dashedName, 'weather.js');
```

### --after-all--

```js
delete global.__file;
```

## 11

### --description--

Now that you have a `router`, you can add routes to it just like you did with `app` — using `router.get()`, `router.post()`, and so on. Routes defined on a router are relative to wherever the router is eventually mounted.

In `weather.js`, first define a `SUPPORTED_CITIES` array containing a list of city name strings (e.g. `'London'`, `'Tokyo'`). Then add a `GET /` route on the router that responds with the array using `res.json()`.

### --tests--

`weather.js` should define a `SUPPORTED_CITIES` array.

```js
assert.match(global.__file, /SUPPORTED_CITIES/, "weather.js should define a 'SUPPORTED_CITIES' variable.");
assert.match(global.__file, /\[[\s\S]*?['"](?:New York|London|Tokyo|Chicago|Los Angeles)['"][\s\S]*?\]/, "SUPPORTED_CITIES should be an array containing at least one city string.");
```

`weather.js` should add a `GET /` route on the router that responds with the cities list.

```js
const __t = new __helpers.Tower(global.__file);
const __calls = __t.getCalls('router.get');
assert.isAbove(__calls.length, 0, "You should call 'router.get()' in weather.js.");
const __rootCall = __calls.find(c => {
  const __arg = c.ast?.expression?.arguments?.[0];
  return __arg?.value === '/';
});
assert.exists(__rootCall, "You should define a 'router.get('/')' route.");
```

### --before-all--

```js
global.__file = await __helpers.getFile(project.dashedName, 'weather.js');
```

### --after-all--

```js
delete global.__file;
```

### --seed--

#### --"learn-express-by-building-a-weather-service-api/weather.js"--

```js
const express = require('express');
const router = express.Router();
```

## 12

### --description--

For another file to use your router, you need to export it. In Node.js, `module.exports` is used to expose values from a module:

```js
module.exports = router;
```

At the bottom of `weather.js`, export the `router` using `module.exports`.

### --tests--

`weather.js` should export the `router` using `module.exports`.

```js
const __file = await __helpers.getFile(project.dashedName, 'weather.js');
assert.match(__file, /module\.exports\s*=\s*router/, "weather.js should contain 'module.exports = router'.");
```

### --seed--

#### --"learn-express-by-building-a-weather-service-api/weather.js"--

```js
const express = require('express');
const router = express.Router();

const SUPPORTED_CITIES = ['New York', 'Chicago', 'Los Angeles', 'Tokyo', 'London'];

router.get('/', (req, res) => {
  res.json({ supportedCities: SUPPORTED_CITIES });
});
```

## 13

### --description--

With `weather.js` exporting its router, you can now import and <dfn title="Attaching a router to the main Express app at a specific base path">mount</dfn> it in `index.js`. Use `app.use()` with a base path to forward all matching requests to the router:

```js
const weatherRouter = require('./weather');
app.use('/api/weather', weatherRouter);
```

Any route defined on `weatherRouter` will be prefixed with `/api/weather` — so a `router.get('/')` inside `weather.js` becomes `GET /api/weather` on the main app.

In `index.js`, require `./weather` and mount it at `/api/weather` using `app.use()`. Then restart the server and click _Run Tests_.

### --tests--

`index.js` should require `./weather` and assign it to a variable.

```js
assert.match(global.__indexFile, /require\s*\(\s*['"]\.\/weather['"]\s*\)/, "index.js should require './weather'.");
```

`index.js` should mount the weather router at `/api/weather` using `app.use()`.

```js
assert.match(global.__indexFile, /app\.use\s*\(\s*['"]\/api\/weather['"]/, "index.js should call 'app.use('/api/weather', ...)' to mount the weather router.");
```

`GET /api/weather` should respond with a `200` status and a JSON body containing the cities list.

```js
const __res = await fetch('http://localhost:3000/api/weather');
assert.equal(__res.status, 200, "GET /api/weather should return a 200 status code.");
const __data = await __res.json();
assert.isArray(Object.values(__data)[0], "GET /api/weather should respond with a JSON object containing an array of cities.");
```

### --before-all--

```js
global.__indexFile = await __helpers.getFile(project.dashedName, 'index.js');
```

### --after-all--

```js
delete global.__indexFile;
```

### --seed--

#### --"learn-express-by-building-a-weather-service-api/weather.js"--

```js
const express = require('express');
const router = express.Router();

const SUPPORTED_CITIES = ['New York', 'Chicago', 'Los Angeles', 'Tokyo', 'London'];

router.get('/', (req, res) => {
  res.json({ supportedCities: SUPPORTED_CITIES });
});

module.exports = router;
```

#### --"learn-express-by-building-a-weather-service-api/index.js"--

```js
const express = require('express');

const app = express();
const PORT = 3000;

app.get('/', (req, res) => {
  res.send('Welcome to the Weather Service API!');
});

app.get('/api/info', (req, res) => {
  res.json({ name: 'Weather Service API', version: '1.0.0' });
});

app.get('/api/status', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.get('/docs', (req, res) => {
  res.redirect('/api/info');
});

app.get('/api/greet/:name', (req, res) => {
  const { name } = req.params;
  res.json({ greeting: `Hello, ${name}!` });
});

app.route('/api/data')
  .get((req, res) => {
    res.json({ message: 'GET /api/data', data: [] });
  })
  .post((req, res) => {
    res.status(201).json({ message: 'POST /api/data', created: true });
  });

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
```

## 14

### --description--

The weather router is mounted and working. Now add a second route to it for fetching weather by city name. Route parameters work the same on a router as they do on `app` — prefix the segment with `:`:

```js
router.get('/:city', (req, res) => {
  const { city } = req.params;
  res.json({ city, temperature: 20, description: 'placeholder' });
});
```

In `weather.js`, add a `GET /:city` route on the router. For now, respond with a placeholder JSON object that includes the `city` value from `req.params`.

**NOTE:** Restart your server with `node index.js`, then click _Run Tests_.

### --tests--

`weather.js` should define a `router.get('/:city')` route.

```js
const __t = new __helpers.Tower(global.__file);
const __calls = __t.getCalls('router.get');
const __cityRoute = __calls.find(c => {
  const __arg = c.ast?.expression?.arguments?.[0];
  return __arg?.value === '/:city';
});
assert.exists(__cityRoute, "You should define a 'router.get('/:city')' route in weather.js.");
```

`GET /api/weather/London` should respond with a `200` status and a JSON body.

```js
const __res = await fetch('http://localhost:3000/api/weather/London');
assert.equal(__res.status, 200, "GET /api/weather/London should return a 200 status code.");
const __contentType = __res.headers.get('content-type') ?? '';
assert.include(__contentType, 'application/json', "GET /api/weather/London should respond with JSON.");
```

### --before-all--

```js
global.__file = await __helpers.getFile(project.dashedName, 'weather.js');
```

### --after-all--

```js
delete global.__file;
```

### --seed--

#### --"learn-express-by-building-a-weather-service-api/index.js"--

```js
const express = require('express');
const weatherRouter = require('./weather');

const app = express();
const PORT = 3000;

app.use('/api/weather', weatherRouter);

app.get('/', (req, res) => {
  res.send('Welcome to the Weather Service API!');
});

app.get('/api/info', (req, res) => {
  res.json({ name: 'Weather Service API', version: '1.0.0' });
});

app.get('/api/status', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.get('/docs', (req, res) => {
  res.redirect('/api/info');
});

app.get('/api/greet/:name', (req, res) => {
  const { name } = req.params;
  res.json({ greeting: `Hello, ${name}!` });
});

app.route('/api/data')
  .get((req, res) => {
    res.json({ message: 'GET /api/data', data: [] });
  })
  .post((req, res) => {
    res.status(201).json({ message: 'POST /api/data', created: true });
  });

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
```

## 15

### --description--

Now replace the placeholder response in the `/:city` handler with a real <dfn title="A server-to-server HTTP request made from within your application">machine-to-machine fetch call</dfn>. Node.js has a built-in `fetch()` — mark the handler `async` and `await` the response:

```js
router.get('/:city', async (req, res) => {
  const { city } = req.params;
  const response = await fetch(`https://weather-proxy.freecodecamp.rocks/api/city/${city}`);
  const data = await response.json();
  res.json({
    city: data.name,
    temperature: data.main.temp,
    description: data.weather[0].description,
  });
});
```

In `weather.js`, update the `/:city` handler to `async`, call `fetch()` against the proxy URL with the city name, and respond with a JSON object containing at least `city`, `temperature`, and `description` extracted from the API response.

**NOTE:** Restart your server with `node index.js`, then click _Run Tests_.

### --tests--

`weather.js` should use `fetch()` to call an external API inside the `/:city` handler.

```js
const __file = await __helpers.getFile(project.dashedName, 'weather.js');
assert.match(__file, /fetch\s*\(/, "The '/:city' handler in weather.js should call 'fetch()' to get weather data.");
assert.match(__file, /async/, "The '/:city' handler should be an async function.");
```

`GET /api/weather/London` should respond with a JSON body containing `city`, `temperature`, and `description` fields.

```js
const __res = await fetch('http://localhost:3000/api/weather/London');
assert.equal(__res.status, 200, "GET /api/weather/London should return a 200 status code.");
const __data = await __res.json();
assert.property(__data, 'city', "The response should have a 'city' property.");
assert.property(__data, 'temperature', "The response should have a 'temperature' property.");
assert.property(__data, 'description', "The response should have a 'description' property.");
```

### --seed--

#### --"learn-express-by-building-a-weather-service-api/weather.js"--

```js
const express = require('express');
const router = express.Router();

const SUPPORTED_CITIES = ['New York', 'Chicago', 'Los Angeles', 'Tokyo', 'London'];

router.get('/', (req, res) => {
  res.json({ supportedCities: SUPPORTED_CITIES });
});

router.get('/:city', (req, res) => {
  const { city } = req.params;
  res.json({ city, temperature: 20, description: 'placeholder' });
});

module.exports = router;
```

## 16

### --description--

Right now, if the external API fails or an unsupported city is requested, the unhandled error will crash the request. Wrap the fetch logic in a `try/catch` and use `res.status(404).json()` to send a helpful error response:

```js
router.get('/:city', async (req, res) => {
  const { city } = req.params;
  try {
    const response = await fetch(`https://weather-proxy.freecodecamp.rocks/api/city/${city}`);
    if (!response.ok) throw new Error(`Status ${response.status}`);
    const data = await response.json();
    res.json({ city: data.name, temperature: data.main.temp, description: data.weather[0].description });
  } catch (error) {
    res.status(404).json({ error: `Could not fetch weather data for "${city}".` });
  }
});
```

In `weather.js`, wrap the entire `fetch()` logic in a `try/catch`. In the `catch` block, respond with a `404` status and a JSON object that has an `error` property.

**NOTE:** Restart your server with `node index.js`, then click _Run Tests_.

### --tests--

`weather.js` should wrap the `fetch()` call in a `try/catch` block.

```js
const __file = await __helpers.getFile(project.dashedName, 'weather.js');
assert.match(__file, /try\s*\{/, "The '/:city' handler should use a try/catch block.");
assert.match(__file, /catch\s*\(/, "The '/:city' handler should have a catch block to handle errors.");
```

`GET /api/weather/NotARealCity` should respond with a `404` status and a JSON body containing an `error` property.

```js
const __res = await fetch('http://localhost:3000/api/weather/NotARealCity');
assert.equal(__res.status, 404, "GET /api/weather/NotARealCity should return a 404 status code.");
const __data = await __res.json();
assert.property(__data, 'error', "The error response should have an 'error' property.");
```

### --seed--

#### --"learn-express-by-building-a-weather-service-api/weather.js"--

```js
const express = require('express');
const router = express.Router();

const BASE_URL = 'https://weather-proxy.freecodecamp.rocks/api/city';
const SUPPORTED_CITIES = ['New York', 'Chicago', 'Los Angeles', 'Tokyo', 'London'];

router.get('/', (req, res) => {
  res.json({ supportedCities: SUPPORTED_CITIES });
});

router.get('/:city', async (req, res) => {
  const { city } = req.params;
  const response = await fetch(`${BASE_URL}/${city}`);
  const data = await response.json();
  res.json({
    city: data.name,
    country: data.sys.country,
    temperature: data.main.temp,
    description: data.weather[0].description,
    iconUrl: data.weather[0].icon
  });
});

module.exports = router;
```

## 17

### --description--

Your API handles data routes well. Now let's serve the front-end UI. Express's built-in `express.static()` <dfn title="A function that runs on every request before route handlers, used for cross-cutting concerns like logging or serving files">middleware</dfn> automatically serves any file found in a directory you specify:

```js
const path = require('path');

app.use(express.static(path.join(__dirname, 'public')));
```

`path.join(__dirname, 'public')` builds an absolute path to your `public/` folder regardless of where the process is started from. Place this `app.use()` call **before** your route definitions.

In `index.js`, require `path`, then add the `express.static` middleware pointing at the `public` directory. Restart the server and click _Run Tests_.

### --tests--

`index.js` should call `express.static` to serve files from the `public` directory.

```js
const __file = await __helpers.getFile(project.dashedName, 'index.js');
assert.match(__file, /express\.static\s*\(/, "index.js should call 'express.static()' to serve static files.");
assert.match(__file, /public/, "The static middleware should point to the 'public' directory.");
```

Static files in `public/` should be served — `GET /index.html` should return a `200` with an HTML content-type.

```js
const __res = await fetch('http://localhost:3000/index.html');
assert.equal(__res.status, 200, "GET /index.html should return a 200 status code when static middleware is set up.");
const __contentType = __res.headers.get('content-type') ?? '';
assert.include(__contentType, 'text/html', "GET /index.html should be served as HTML.");
```

### --seed--

#### --"learn-express-by-building-a-weather-service-api/index.js"--

```js
const express = require('express');
const weatherRouter = require('./weather');

const app = express();
const PORT = 3000;

app.use('/api/weather', weatherRouter);

app.get('/', (req, res) => {
  res.send('Welcome to the Weather Service API!');
});

app.get('/api/info', (req, res) => {
  res.json({ name: 'Weather Service API', version: '1.0.0' });
});

app.get('/api/status', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.get('/docs', (req, res) => {
  res.redirect('/api/info');
});

app.get('/api/greet/:name', (req, res) => {
  const { name } = req.params;
  res.json({ greeting: `Hello, ${name}!` });
});

app.route('/api/data')
  .get((req, res) => {
    res.json({ message: 'GET /api/data', data: [] });
  })
  .post((req, res) => {
    res.status(201).json({ message: 'POST /api/data', created: true });
  });

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
```

## 18

### --description--

Previously, `GET /` responded with a plain-text string via `res.send()`. Now that you have `express.static` in place and an HTML file ready in `public/`, update the route to send the file directly using `res.sendFile()`:

```js
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
```

`res.sendFile()` sends a file as the HTTP response and automatically sets the correct `Content-Type` header.

In `index.js`, update the `GET /` handler to use `res.sendFile()` to serve `public/index.html`. Restart your server and click _Run Tests_.

### --tests--

`index.js` should use `res.sendFile()` in the `GET /` route handler.

```js
const __file = await __helpers.getFile(project.dashedName, 'index.js');
assert.match(__file, /res\.sendFile\s*\(/, "The 'GET /' handler should use 'res.sendFile()' to serve the HTML file.");
assert.match(__file, /index\.html/, "You should send 'public/index.html' using 'res.sendFile()'.");
```

`GET /` should respond with a `200` status and an HTML content-type.

```js
const __res = await fetch('http://localhost:3000/');
assert.equal(__res.status, 200, "GET / should return a 200 status code.");
const __contentType = __res.headers.get('content-type') ?? '';
assert.include(__contentType, 'text/html', "GET / should now respond with HTML, not plain text.");
```

### --seed--

#### --"learn-express-by-building-a-weather-service-api/index.js"--

```js
const express = require('express');
const path = require('path');
const weatherRouter = require('./weather');

const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.use('/api/weather', weatherRouter);

app.get('/', (req, res) => {
  res.send('Welcome to the Weather Service API!');
});

app.get('/api/info', (req, res) => {
  res.json({ name: 'Weather Service API', version: '1.0.0' });
});

app.get('/api/status', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.get('/docs', (req, res) => {
  res.redirect('/api/info');
});

app.get('/api/greet/:name', (req, res) => {
  const { name } = req.params;
  res.json({ greeting: `Hello, ${name}!` });
});

app.route('/api/data')
  .get((req, res) => {
    res.json({ message: 'GET /api/data', data: [] });
  })
  .post((req, res) => {
    res.status(201).json({ message: 'POST /api/data', created: true });
  });

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
```

## 19

### --description--

Your weather service API is almost complete! As a finishing touch, update the `GET /api/info` route to include an `endpoints` array in its response — a self-documenting list of the routes your API exposes:

```js
app.get('/api/info', (req, res) => {
  res.json({
    name: 'Weather Service API',
    version: '1.0.0',
    endpoints: ['/api/weather/:city', '/api/greet/:name', '/api/data']
  });
});
```

In `index.js`, update the `GET /api/info` handler to include an `endpoints` array with at least one entry. Then restart your server and click _Run Tests_ to verify the complete API is working end-to-end. Congratulations — you have built a weather service API with Express!

### --tests--

`GET /api/info` should respond with a JSON body that includes an `endpoints` array.

```js
const __res = await fetch('http://localhost:3000/api/info');
assert.equal(__res.status, 200, "GET /api/info should return a 200 status code.");
const __data = await __res.json();
assert.property(__data, 'endpoints', "The /api/info response should include an 'endpoints' property.");
assert.isArray(__data.endpoints, "The 'endpoints' property should be an array.");
assert.isAbove(__data.endpoints.length, 0, "The 'endpoints' array should contain at least one entry.");
```

The complete API should still serve weather data correctly — `GET /api/weather/London` should return `city`, `temperature`, and `description`.

```js
const __res = await fetch('http://localhost:3000/api/weather/London');
assert.equal(__res.status, 200, "GET /api/weather/London should still return 200.");
const __data = await __res.json();
assert.property(__data, 'city', "The weather response should still have a 'city' property.");
assert.property(__data, 'temperature', "The weather response should still have a 'temperature' property.");
assert.property(__data, 'description', "The weather response should still have a 'description' property.");
```

### --seed--

#### --"learn-express-by-building-a-weather-service-api/index.js"--

```js
const express = require('express');
const path = require('path');
const weatherRouter = require('./weather');

const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.use('/api/weather', weatherRouter);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/api/info', (req, res) => {
  res.json({ name: 'Weather Service API', version: '1.0.0' });
});

app.get('/api/status', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.get('/docs', (req, res) => {
  res.redirect('/api/info');
});

app.get('/api/greet/:name', (req, res) => {
  const { name } = req.params;
  res.json({ greeting: `Hello, ${name}!` });
});

app.route('/api/data')
  .get((req, res) => {
    res.json({ message: 'GET /api/data', data: [] });
  })
  .post((req, res) => {
    res.status(201).json({ message: 'POST /api/data', created: true });
  });

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
```

## --fcc-end--
