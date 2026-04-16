# Learn Express Middleware by Building a Submission Form

You will learn application-level and router-level middleware by building a structured submission form.

## 0

### --description--

In this project, you will build a structured <dfn title="a web application framework for Node.js">Express</dfn> API that demonstrates how <dfn title="functions that have access to the request object, response object, and the next function in the application's request-response cycle">middleware</dfn> works — including application-level middleware, router-level middleware, and custom error-handling middleware.

Open a new terminal and navigate into the project directory.

### --tests--

The terminal working directory should include `learn-express-middleware-by-building-a-submission-form`.

```js
const __cwd = await __helpers.getLastCWD();
assert.include(
  __cwd,
  "learn-express-middleware-by-building-a-submission-form",
  "Change into the project directory first.",
);
```

## 1

### --description--

The `package.json` already has `express` installed and `"type": "module"` set. Add a `"start"` script to `package.json` that runs `node server.js`.

### --tests--

`package.json` should have a `"scripts"` object with a `"start"` key.

```js
const __pkg = JSON.parse(
  await __helpers.getFile(project.dashedName, "package.json"),
);
assert.isObject(__pkg.scripts, 'package.json should have a "scripts" field.');
assert.property(
  __pkg.scripts,
  "start",
  'The "scripts" object should have a "start" key.',
);
```

The `"start"` script should be `"node server.js"`.

```js
const __pkg = JSON.parse(
  await __helpers.getFile(project.dashedName, "package.json"),
);
assert.equal(
  __pkg.scripts.start,
  "node server.js",
  'The "start" script should be "node server.js".',
);
```

## 2

### --description--

Create a `server.js` file in the project directory.

### --tests--

A `server.js` file should exist in the project directory.

```js
const __exists = await __helpers.fileExists(`${project.dashedName}/server.js`);
assert.isTrue(__exists, "server.js does not exist — create the file first.");
```

## 3

### --description--

In `server.js`, import `express` using ESM syntax, and create an Express app instance stored in a variable named `app`.

### --tests--

`server.js` should import `express` using an ESM `import` statement.

```js
assert.match(
  __file,
  /import\s+express\s+from\s+['"]express['"]/,
  'server.js should have: import express from "express"',
);
```

`server.js` should declare a `const app` initialised by calling `express()`.

```js
const __t = new __helpers.Tower(__file);
const __app = __t.getVariable("app");
assert.isDefined(__app, "A variable named app should be declared.");
assert.match(
  __app.compact,
  /app=express\(\)/,
  "app should be initialised with express().",
);
```

### --before-each--

```js
const __file = await __helpers.getFile(project.dashedName, "server.js");
```

## 4

### --description--

In `server.js`, call `app.listen` with `3000` as the first argument and a callback that logs the server URL to the console.

### --tests--

`server.js` should call `app.listen` with `3000` as the first argument.

```js
const __file = await __helpers.getFile(project.dashedName, "server.js");
const __t = new __helpers.Tower(__file);
const __calls = __t.getCalls("app.listen");
assert.isAbove(
  __calls.length,
  0,
  "app.listen() should be called in server.js.",
);
const __firstArg = __calls.at(0).ast.expression.arguments.at(0);
assert.equal(
  __firstArg.value,
  3000,
  "The first argument to app.listen should be the number 3000.",
);
```

The `app.listen` callback should output a message containing the server URL when the server starts.

```js
const { stdout } = await __helpers.awaitExecution(
  ["node", `${project.dashedName}/server.js`],
  "http://localhost:3000",
  { dataTimeout: 3000, fetchTimeout: 3000 },
);
assert.match(
  stdout,
  /localhost.*3000|3000.*localhost/,
  "The app.listen callback should output the server URL.",
);
```

## 5

### --description--

<dfn title="a function that has access to the request object, the response object, and the next function in the application's request-response cycle">Middleware</dfn> in Express is registered with the `.use()` method. A middleware function either sends a response - ending the cycle - or calls the `next` function to pass control to the next middleware in the stack.

```js
app.use((req, res, next) => {});
```

In `server.js`, register a logger middleware using `app.use` that logs the request method and URL, then calls `next()`.

### --tests--

`server.js` should call `app.use` with a middleware function.

```js
const __t = new __helpers.Tower(__file);
const __calls = __t.getCalls("app.use");
assert.isAbove(__calls.length, 0, "app.use() should be called in server.js.");
```

The middleware should log `req.method` and `req.url`.

```js
assert.match(
  __file,
  /req\.method/,
  "The middleware should reference req.method.",
);
assert.match(__file, /req\.url/, "The middleware should reference req.url.");
```

The middleware should call `next()`.

```js
assert.match(__file, /next\(\)/, "The middleware should call next().");
```

### --before-each--

```js
const __file = await __helpers.getFile(project.dashedName, "server.js");
```

## 6

### --description--

Express ships with <dfn title="middleware bundled directly into Express, requiring no extra installation">built-in middleware</dfn> for common tasks.

```js
app.use(express.middleware());
```

In `server.js`, mount the `json` middleware to parse incoming JSON request bodies into `req.body`.

### --tests--

`server.js` should have `app.use(express.json())`.

```js
const __file = await __helpers.getFile(project.dashedName, "server.js");
assert.match(
  __file,
  /app\.use\(\s*express\.json\(\s*\)\s*\)/,
  "server.js should call app.use(express.json()).",
);
```

## 7

### --description--

Mount `express.urlencoded({ extended: true })` as middleware in `server.js` to parse <dfn title="a format used by HTML forms to encode field names and values">URL-encoded</dfn> request bodies - the default format submitted by HTML `<form>` elements.

The `extended` option enables parsing more complex JSON formats.

### --tests--

`server.js` should use `express.urlencoded({ extended: true })` as middleware with `app.use`.

```js
const __file = await __helpers.getFile(project.dashedName, "server.js");
assert.match(
  __file,
  /app\.use\(\s*express\.urlencoded\(\s*\{\s*extended\s*:\s*true\s*\}\s*\)\s*\)/,
  "server.js should call app.use(express.urlencoded({ extended: true })).",
);
```

## 8

### --description--

Rather than defining all routes directly in `server.js`, you will use an Express <dfn title="an isolated mini-application that can handle routes and middleware independently, then be mounted onto the main app">Router</dfn> to keep API routes in a dedicated file. Create the file `routes/api.routes.js` inside the project directory.

### --tests--

A `routes/api.routes.js` file should exist inside the project directory.

```js
const __exists = await __helpers.fileExists(
  `${project.dashedName}/routes/api.routes.js`,
);
assert.isTrue(
  __exists,
  "routes/api.routes.js does not exist — create the file first.",
);
```

## 9

### --description--

In `routes/api.routes.js`, import the named export `Router` from `express` and use it to create a router instance stored in a variable named `router`.

### --tests--

`routes/api.routes.js` should import `Router` from `express` using an ESM `import` statement.

```js
assert.match(
  __file,
  /import\s+.*\bRouter\b.*\s+from\s+['"]express['"]/,
  'api.routes.js should import Router from "express".',
);
```

`routes/api.routes.js` should declare a `const router` initialised by calling `Router()`.

```js
const __t = new __helpers.Tower(__file);
const __router = __t.getVariable("router");
assert.isDefined(__router, "A variable named router should be declared.");
assert.match(
  __router.compact,
  /router=Router\(\)/,
  "router should be initialised with Router().",
);
```

### --before-each--

```js
const __file = await __helpers.getFile(
  project.dashedName,
  "routes/api.routes.js",
);
```

## 10

### --description--

In `routes/api.routes.js`, add a `GET /` route on `router` that responds with the default status of `200` and the text `'API is available!'`.

### --tests--

`routes/api.routes.js` should define a `GET /` route on `router`.

```js
const __t = new __helpers.Tower(__file);
const __calls = __t.getCalls("router.get");
const __rootRoute = __calls.find((c) => {
  const __arg = c.ast?.expression?.arguments?.[0];
  return __arg?.value === "/";
});
assert.isDefined(
  __rootRoute,
  'router.get("/", ...) should be defined in api.routes.js.',
);
```

The `GET /` route handler should send a `200` response with the text `'API is available!'`.

```js
const { mkdir, writeFile, rm } = await import("fs/promises");
const { join } = await import("path");

const __testDir = join(ROOT, project.dashedName, "__test");
await mkdir(__testDir, { recursive: true });

const __routesContent = __file;
const __routesWithExport = /export\s+default\s+router/.test(__routesContent)
  ? __routesContent
  : __routesContent.trimEnd() + "\nexport default router;\n";

await writeFile(join(__testDir, "api.routes.js"), __routesWithExport);
await writeFile(
  join(__testDir, "runner.js"),
  `import express from "express";
import router from "./api.routes.js";
const app = express();
app.use(router);
const server = app.listen(3002, async () => {
  try {
    const res = await fetch("http://localhost:3002/");
    const text = await res.text();
    console.log("RESULT:" + JSON.stringify({ status: res.status, text }));
  } catch (e) {
    console.error("ERROR:" + e.message);
  } finally {
    server.close(() => process.exit(0));
  }
});
`,
);

const { stdout } = await __helpers.awaitExecution(
  ["node", `${project.dashedName}/__test/runner.js`],
  "http://localhost:3002/",
  { expectedData: "RESULT:", dataTimeout: 5000, fetchTimeout: 5000 },
);

await rm(__testDir, { recursive: true, force: true });

const __line = stdout.split("\n").find((l) => l.startsWith("RESULT:"));
assert.exists(
  __line,
  "The GET / handler did not respond — check your route definition.",
);
const __result = JSON.parse(__line.slice("RESULT:".length));
assert.equal(__result.status, 200, "GET / should respond with status 200.");
assert.equal(
  __result.text,
  "API is available!",
  'GET / should respond with the text "API is available!".',
);
```

### --before-each--

```js
const __file = await __helpers.getFile(
  project.dashedName,
  "routes/api.routes.js",
);
```

## 11

### --description--

Export `router` as the default export from `routes/api.routes.js` so `server.js` can import it.

### --tests--

`routes/api.routes.js` should export `router` as the default export.

```js
const __file = await __helpers.getFile(
  project.dashedName,
  "routes/api.routes.js",
);
assert.match(
  __file,
  /export\s+default\s+router/,
  "api.routes.js should have: export default router",
);
```

## 12

### --description--

In the same way middleware can be mounted to an express app, a `Router` can be mounted, and a base path can be provided too:

```js
app.use("/base/path", router);
```

In `server.js`, import `apiRouter` from `routes/api.routes.js` and mount it to the app at the `/api` path.

### --tests--

`server.js` should import `apiRouter` from `./routes/api.routes.js`.

```js
const __t = new __helpers.Tower(__file);
const __imports = __t.ast.body.filter((n) => n.type === "ImportDeclaration");
const __apiRouterImport = __imports.find(
  (n) =>
    n.specifiers.some(
      (s) =>
        s.type === "ImportDefaultSpecifier" && s.local.name === "apiRouter",
    ) && n.source.value === "./routes/api.routes.js",
);
assert.isDefined(
  __apiRouterImport,
  'server.js should import apiRouter from "./routes/api.routes.js".',
);
```

`server.js` should mount `apiRouter` at the `/api` path using `app.use`.

```js
const __t = new __helpers.Tower(__file);
const __calls = __t.getCalls("app.use");
const __mounted = __calls.find((c) => {
  const __args = c.ast?.expression?.arguments;
  return __args?.[0]?.value === "/api" && __args?.[1]?.name === "apiRouter";
});
assert.isDefined(
  __mounted,
  'server.js should call app.use("/api", apiRouter).',
);
```

### --before-each--

```js
const __file = await __helpers.getFile(project.dashedName, "server.js");
```

## 13

### --description--

Start the server with `npm start` and verify it boots without errors.

**NOTE:** Keep the server running, then click _Run Tests_.

### --tests--

The server should be listening on port `3000`.

```js
const __isListening = await __helpers.isServerListening(3000);
assert.isTrue(
  __isListening,
  "The server is not running on port 3000. Run npm start first.",
);
```

## 14

### --description--

When you call the `NextFunction` parameter of a route handler with an error object, Express skips all remaining regular middleware and routes, and jumps directly to the nearest <dfn title="a special Express middleware with four parameters: err, req, res, next — used to handle errors passed via next(err)">error-handling middleware</dfn>:

```js
app.get("/", (req, res, next) => {
  next(new Error("Throw"));
});
```

In `routes/api.routes.js`, add a `GET /crash` route that creates a new `Error` with the message `'Database connection failed.'` and passes it to the . Do not set a status on the error - it should default to `500`.

### --tests--

`routes/api.routes.js` should define a `GET /crash` route on `router`.

```js
const __t = new __helpers.Tower(__file);
const __calls = __t.getCalls("router.get");
const __crashRoute = __calls.find((c) => {
  const __arg = c.ast?.expression?.arguments?.[0];
  return __arg?.value === "/crash";
});
assert.isDefined(
  __crashRoute,
  'router.get("/crash", ...) should be defined in api.routes.js.',
);
```

The `/crash` route handler should create a `new Error` with message `'Database connection failed.'` and pass it to `next`.

```js
assert.match(
  __file,
  /new\s+Error\(['"]Database connection failed\.['"]\)/,
  'The /crash handler should create new Error("Database connection failed.").',
);
assert.match(
  __file,
  /next\(\s*err\s*\)/,
  "The /crash handler should call next(err).",
);
```

### --before-each--

```js
const __file = await __helpers.getFile(
  project.dashedName,
  "routes/api.routes.js",
);
```

## 15

### --description--

You can attach a specific HTTP status directly to an error object - the error handler will read it to send the correct response code:

```js
app.get("/", (req, res, next) => {
  const err = new Error("Unauthorized");
  err.status = 403;
  next(err);
});
```

In `routes/api.routes.js`, add a `GET /bad-request` route that creates an `Error` with the message `'Client-side data is missing.'`, sets `err.status` to `400`, and passes it to `next`.

### --tests--

`routes/api.routes.js` should define a `GET /bad-request` route on `router`.

```js
const __t = new __helpers.Tower(__file);
const __calls = __t.getCalls("router.get");
const __badRoute = __calls.find((c) => {
  const __arg = c.ast?.expression?.arguments?.[0];
  return __arg?.value === "/bad-request";
});
assert.isDefined(
  __badRoute,
  'router.get("/bad-request", ...) should be defined in api.routes.js.',
);
```

The `/bad-request` handler should set the error `status` to `400`.

```js
assert.match(
  __file,
  /\.status\s*=\s*400/,
  "The /bad-request handler should set err.status = 400.",
);
```

The `/bad-request` handler should create a `new Error` with message `'Client-side data is missing.'` and pass it to `next`.

```js
assert.match(
  __file,
  /new\s+Error\(['"]Client-side data is missing\.['"]\)/,
  'The /bad-request handler should create new Error("Client-side data is missing.").',
);
```

### --before-each--

```js
const __file = await __helpers.getFile(
  project.dashedName,
  "routes/api.routes.js",
);
```

## 16

### --description--

Create a new directory and file `middleware/error.middleware.js` inside the project directory.

### --tests--

A `middleware/error.middleware.js` file should exist in the project directory.

```js
const __exists = await __helpers.fileExists(
  `${project.dashedName}/middleware/error.middleware.js`,
);
assert.isTrue(
  __exists,
  "middleware/error.middleware.js does not exist — create the file first.",
);
```

## 17

### --description--

Within `middleware/error.middleware.js`, declare a function `notFoundHandler` that is a <dfn title="middleware that runs when no prior route matched the request URL, used to generate a 404 response">catch-all 404 handler</dfn>. It should create a new `Error` whose message includes `req.originalUrl`, set `error.status` to `404`, and call `next(error)`.

### --hints--

#### 0

```js
function notFoundHandler(req, res, next) {
  const error = new Error(`Cannot find ${req.originalUrl}`);
  error.status = 404;
  next(error);
}
```

### --tests--

`middleware/error.middleware.js` should declare a `notFoundHandler` function.

```js
const __t = new __helpers.Tower(__file);
const __fn = __t.getVariable("notFoundHandler");
assert.isDefined(__fn, "A variable named notFoundHandler should be declared.");
```

The `notFoundHandler` should create a `new Error` that includes `req.originalUrl`.

```js
assert.match(
  __file,
  /new\s+Error\(.*req\.originalUrl/,
  "notFoundHandler should create an error message using req.originalUrl.",
);
```

The `notFoundHandler` should set `error.status` to `404` and call `next` with the error.

```js
assert.match(
  __file,
  /\.status\s*=\s*404/,
  "notFoundHandler should set error.status = 404.",
);
assert.match(
  __file,
  /next\(\s*error\s*\)/,
  "notFoundHandler should call next(error).",
);
```

### --before-each--

```js
const __file = await __helpers.getFile(
  project.dashedName,
  "middleware/error.middleware.js",
);
```

## 18

### --description--

Express identifies an error handler by its **four parameters**: `err, req, res, next`. Any middleware with that signature is treated as an error handler and only called when an error is passed to `next`.

In `middleware/error.middleware.js`, declare `finalErrorHandler` with four parameters. It should derive the HTTP status from `err.status || 500`, log the error, and respond with a JSON body containing `error: true`, the `status`, and a `message`. For `500` responses, use the generic message `'Internal Server Error (Check Server Logs)'`; otherwise use `err.message`.

### --tests--

`middleware/error.middleware.js` should declare a `finalErrorHandler` function with four parameters.

```js
const __t = new __helpers.Tower(__file);
const __fn = __t.getVariable("finalErrorHandler");
assert.isDefined(
  __fn,
  "A variable named finalErrorHandler should be declared.",
);
assert.match(
  __file,
  /finalErrorHandler\s*=\s*\(\s*err\s*,\s*req\s*,\s*res\s*,\s*next\s*\)/,
  "finalErrorHandler should have four parameters: err, req, res, next.",
);
```

`finalErrorHandler` should derive `status` from `err.status || 500`.

```js
assert.match(
  __file,
  /err\.status\s*\|\|\s*500/,
  "finalErrorHandler should use err.status || 500 to determine the status code.",
);
```

`finalErrorHandler` should send a JSON response with `error: true`, `status`, and `message` properties.

```js
assert.match(
  __file,
  /res\.status\(status\)\.json\(/,
  "finalErrorHandler should call res.status(status).json(...).",
);
assert.match(
  __file,
  /error\s*:\s*true/,
  "The JSON response should include error: true.",
);
```

`finalErrorHandler` should use a generic message `'Internal Server Error (Check Server Logs)'` when `status` is `500`, and `err.message` otherwise.

```js
assert.match(
  __file,
  /Internal Server Error \(Check Server Logs\)/,
  "finalErrorHandler should use a generic message for 500 errors.",
);
assert.match(
  __file,
  /err\.message/,
  "finalErrorHandler should use err.message for non-500 errors.",
);
```

### --before-each--

```js
const __file = await __helpers.getFile(
  project.dashedName,
  "middleware/error.middleware.js",
);
```

## 19

### --description--

Export both `notFoundHandler` and `finalErrorHandler` as named exports from `middleware/error.middleware.js`.

### --tests--

`middleware/error.middleware.js` should export `notFoundHandler` as a named export.

```js
assert.match(
  __file,
  /export\s*\{[^}]*\bnotFoundHandler\b[^}]*\}/,
  "error.middleware.js should export notFoundHandler as a named export.",
);
```

`middleware/error.middleware.js` should export `finalErrorHandler` as a named export.

```js
assert.match(
  __file,
  /export\s*\{[^}]*\bfinalErrorHandler\b[^}]*\}/,
  "error.middleware.js should export finalErrorHandler as a named export.",
);
```

### --before-each--

```js
const __file = await __helpers.getFile(
  project.dashedName,
  "middleware/error.middleware.js",
);
```

## 20

### --description--

In `server.js`, import `notFoundHandler` and `finalErrorHandler` from `./middleware/error.middleware.js` and mount them using `app.use` - in order, **after** `apiRouter`. `notFoundHandler` must come before `finalErrorHandler`, since it generates the 404 error that `finalErrorHandler` then catches.

### --tests--

`server.js` should import `notFoundHandler` and `finalErrorHandler` from `./middleware/error.middleware.js`.

```js
assert.match(
  __file,
  /import\s*\{[^}]*\bnotFoundHandler\b[^}]*\}\s*from\s*['"]\.\/middleware\/error\.middleware\.js['"]/,
  'server.js should import notFoundHandler from "./middleware/error.middleware.js".',
);
assert.match(
  __file,
  /import\s*\{[^}]*\bfinalErrorHandler\b[^}]*\}\s*from\s*['"]\.\/middleware\/error\.middleware\.js['"]/,
  'server.js should import finalErrorHandler from "./middleware/error.middleware.js".',
);
```

`server.js` should mount `notFoundHandler` with `app.use`.

```js
const __t = new __helpers.Tower(__file);
const __calls = __t.getCalls("app.use");
const __nfh = __calls.find((c) => {
  const __arg = c.ast?.expression?.arguments?.[0];
  return __arg?.name === "notFoundHandler";
});
assert.isDefined(__nfh, "server.js should call app.use(notFoundHandler).");
```

`server.js` should mount `finalErrorHandler` with `app.use`.

```js
const __t = new __helpers.Tower(__file);
const __calls = __t.getCalls("app.use");
const __feh = __calls.find((c) => {
  const __arg = c.ast?.expression?.arguments?.[0];
  return __arg?.name === "finalErrorHandler";
});
assert.isDefined(__feh, "server.js should call app.use(finalErrorHandler).");
```

### --before-each--

```js
const __file = await __helpers.getFile(project.dashedName, "server.js");
```

## 21

### --description--

Your middleware stack is complete. (Re)start the server with `npm start`, then click _Run Tests_ to verify all four routes respond correctly:

| URL                    | Expected status                        |
| ---------------------- | -------------------------------------- |
| `GET /api`             | `200` — `'API is available!'`          |
| `GET /api/crash`       | `500` — JSON with `error: true`        |
| `GET /api/bad-request` | `400` — JSON with the specific message |
| `GET /nonsense`        | `404` — JSON with `error: true`        |

**NOTE:** Keep the server running, then click _Run Tests_.

### --tests--

`GET /api` should respond with status `200` and the text `'API is available!'`.

```js
const __res = await fetch(`${__url}api`);
assert.equal(__res.status, 200, "GET /api should respond with status 200.");
const __text = await __res.text();
assert.equal(
  __text,
  "API is available!",
  'GET /api response body should be "API is available!".',
);
```

`GET /api/crash` should respond with status `500` and a JSON body containing `error: true`.

```js
const __res = await fetch(`${__url}api/crash`);
assert.equal(
  __res.status,
  500,
  "GET /api/crash should respond with status 500.",
);
const __json = await __res.json();
assert.isTrue(
  __json.error,
  "GET /api/crash response body should have error: true.",
);
```

`GET /api/bad-request` should respond with status `400` and the message `'Client-side data is missing.'`.

```js
const __res = await fetch(`${__url}api/bad-request`);
assert.equal(
  __res.status,
  400,
  "GET /api/bad-request should respond with status 400.",
);
const __json = await __res.json();
assert.equal(
  __json.message,
  "Client-side data is missing.",
  "GET /api/bad-request response body should have the correct message.",
);
```

`GET /nonsense` should respond with status `404` and a JSON body containing `error: true`.

```js
const __res = await fetch(`${__url}nonsense`);
assert.equal(
  __res.status,
  404,
  "GET /nonsense should respond with status 404.",
);
const __json = await __res.json();
assert.isTrue(
  __json.error,
  "GET /nonsense response body should have error: true.",
);
```

### --before-each--

```js
const __url = "http://localhost:3000/";
```

## --fcc-end--
