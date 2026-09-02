# Build a Submission Form

You will learn application-level and router-level middleware by building a structured submission form.

## 0

### --description--

In this project, you will build a structured <dfn title="a web application framework for Node.js">Express</dfn> API that demonstrates how <dfn title="functions that have access to the request object, response object, and the next function in the application's request-response cycle">middleware</dfn> works - including application-level middleware, router-level middleware, and custom error-handling middleware.

Open a new terminal and navigate into the project directory.

### --tests--

The terminal working directory should include `build-a-submission-form`.

```js
const __cwd = await __helpers.getLastCWD();
assert.include(
  __cwd,
  "build-a-submission-form",
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
assert.isTrue(__exists, "server.js does not exist - create the file first.");
```

## 3

### --description--

In `server.js`, import `express` using ESM syntax, and create an Express app instance stored in a variable named `app`.

### --tests--

`server.js` should import `express` using an ESM `import` statement.

```js
assert.isTrue(
  __i.hasDefaultImport("express", "express"),
  'server.js should have: import express from "express"',
);
```

`server.js` should declare a `const app` initialised by calling `express()`.

```js
const __app = __i.getDeclarator("app");
assert.exists(__app, "A variable named app should be declared.");
assert.equal(
  __app.init?.type,
  "CallExpression",
  "app should be initialised by calling express().",
);
assert.equal(
  __i.argText(__app.init?.callee),
  "express",
  "app should be initialised with express().",
);
```

### --before-each--

```js
const __file = await __helpers.getFile(project.dashedName, "server.js");
const __i = new __helpers.Inspector(__file);
```

## 4

### --description--

In `server.js`, call `app.listen` with `3000` as the first argument and a callback that logs the server URL to the console.

### --tests--

`server.js` should call `app.listen` with `3000` as the first argument.

```js
const __file = await __helpers.getFile(project.dashedName, "server.js");
const __i = new __helpers.Inspector(__file);
const __calls = __i.getCalls("app.listen");
assert.isAbove(
  __calls.length,
  0,
  "app.listen() should be called in server.js.",
);
const __firstArg = __calls.at(0)?.arguments?.at(0);
assert.exists(__firstArg, "Pass the port as the first argument to app.listen.");
assert.equal(
  __firstArg.value,
  3000,
  "The first argument to app.listen should be the number 3000.",
);
assert.isTrue(
  __i.hasCallback(__calls.at(0)),
  "Pass a callback as the second argument to app.listen.",
);
```

The `app.listen` callback should output a message containing the server URL when the server starts.

```js
const { stdout } = await __helpers.awaitExecution(
  ["node", `${project.dashedName}/server.js`],
  "http://localhost:3000",
  { dataTimeout: 3000, fetchTimeout: 3000 },
);
assert.include(
  stdout.toLowerCase(),
  "localhost",
  "The app.listen callback should output the server URL.",
);
assert.include(
  stdout,
  "3000",
  "The app.listen callback should output the port the server listens on.",
);
```

## 5

### --description--

<dfn title="a function that has access to the request object, the response object, and the next function in the application's request-response cycle">Middleware</dfn> in Express is registered with the `.use()` method. A middleware function either sends a response - ending the cycle - or calls the `next` function to pass control to the next middleware in the stack.

```js
app.use((req, res, next) => {});
```

`req`, `res`, and `next` are just conventional parameter names. Express does not require these exact names. What matters is their position: the first parameter is always a `Request` object, the second is always a `Response` object, and the third is always the `NextFunction` callback function.

In `server.js`, register a logger middleware using `app.use` that logs the request method and URL, then calls `next()`.

### --tests--

`server.js` should call `app.use` with a middleware function that takes three parameters.

```js
assert.isAbove(
  __i.getCalls("app.use").length,
  0,
  "app.use() should be called in server.js.",
);
assert.exists(
  __middlewareSrc,
  "Pass a middleware function taking three parameters to app.use.",
);
```

The middleware should log the request method and URL.

```js
assert.exists(
  __middlewareSrc,
  "Pass a middleware function taking three parameters to app.use.",
);
const logger = eval(`(${__middlewareSrc})`);
const __logged = await __helpers.captureLogs(() =>
  logger(
    __helpers.mockReq({ method: "PATCH", url: "/logger-check" }),
    __helpers.mockRes(),
    __helpers.mockNext(),
  ),
);
assert.include(
  __logged,
  "PATCH",
  "The middleware should log the request method.",
);
assert.include(
  __logged,
  "/logger-check",
  "The middleware should log the request URL.",
);
```

The middleware should call `next()`.

```js
assert.exists(
  __middlewareSrc,
  "Pass a middleware function taking three parameters to app.use.",
);
const logger = eval(`(${__middlewareSrc})`);
const __next = __helpers.mockNext();
await __helpers.captureLogs(() =>
  logger(__helpers.mockReq(), __helpers.mockRes(), __next),
);
assert.isTrue(__next.called, "The middleware should call next().");
assert.isNotOk(
  __next.error,
  "The logger middleware should call next() with no arguments.",
);
```

### --before-each--

```js
const __file = await __helpers.getFile(project.dashedName, "server.js");
const __i = new __helpers.Inspector(__file);
// The logger is the middleware function mounted with `app.use`. Express
// identifies middleware by position, not by parameter name, so match on the
// three parameters rather than on what they are called.
const __middleware = __i
  .getCalls("app.use")
  .flatMap((c) => __i.getCallbacks(c))
  .find((fn) => fn.params.length === 3);
const __middlewareSrc = __middleware ? __i.generateCode(__middleware) : null;
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
const __mounted = __i.getCalls("app.use").map((c) => c.arguments?.at(0));
const __json = __mounted.find(
  (a) =>
    a?.type === "CallExpression" && __i.argText(a.callee) === "express.json",
);
assert.exists(__json, "server.js should call app.use(express.json()).");
```

### --before-each--

```js
const __file = await __helpers.getFile(project.dashedName, "server.js");
const __i = new __helpers.Inspector(__file);
```

## 7

### --description--

Mount `express.urlencoded({ extended: true })` as middleware in `server.js` to parse <dfn title="a format used by HTML forms to encode field names and values">URL-encoded</dfn> request bodies - the default format submitted by HTML `<form>` elements.

The `extended` option enables parsing more complex JSON formats.

### --tests--

`server.js` should use `express.urlencoded({ extended: true })` as middleware with `app.use`.

```js
const __mounted = __i.getCalls("app.use").map((c) => c.arguments?.at(0));
const __urlencoded = __mounted.find(
  (a) =>
    a?.type === "CallExpression" &&
    __i.argText(a.callee) === "express.urlencoded",
);
assert.exists(
  __urlencoded,
  "server.js should call app.use(express.urlencoded(...)).",
);
const __options = __urlencoded.arguments?.at(0);
assert.equal(
  __options?.type,
  "ObjectExpression",
  "Pass an options object to express.urlencoded().",
);
const __extended = __options.properties.find(
  (property) => (property.key?.name ?? property.key?.value) === "extended",
);
assert.strictEqual(
  __extended?.value?.value,
  true,
  "The options object should set extended to true.",
);
```

### --before-each--

```js
const __file = await __helpers.getFile(project.dashedName, "server.js");
const __i = new __helpers.Inspector(__file);
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
  "routes/api.routes.js does not exist - create the file first.",
);
```

## 9

### --description--

In `routes/api.routes.js`, import the named export `Router` from `express` and use it to create a router instance stored in a variable named `router`.

### --tests--

`routes/api.routes.js` should import `Router` from `express` using an ESM `import` statement.

```js
assert.isTrue(
  __i.hasNamedImport("Router", "express"),
  'api.routes.js should import Router from "express".',
);
```

`routes/api.routes.js` should declare a `const router` initialised by calling `Router()`.

```js
const __router = __i.getDeclarator("router");
assert.exists(__router, "A variable named router should be declared.");
assert.equal(
  __router.init?.type,
  "CallExpression",
  "router should be initialised by calling Router().",
);
// Follow the import, so `import { Router as makeRouter }` works too.
const __local = __i.getImportLocal("Router", "express") ?? "Router";
assert.equal(
  __i.argText(__router.init?.callee),
  __local,
  "router should be initialised with Router().",
);
```

### --before-each--

```js
const __file = await __helpers.getFile(
  project.dashedName,
  "routes/api.routes.js",
);
const __i = new __helpers.Inspector(__file);
```

## 10

### --description--

In `routes/api.routes.js`, add a `GET /` route on `router` that responds with the default status of `200` and the text `'API is available!'`.

### --tests--

`routes/api.routes.js` should define a `GET /` route on `router`.

```js
assert.exists(
  __route("get", "/"),
  'router.get("/", ...) should be defined in api.routes.js.',
);
```

The `GET /` route handler should send a `200` response with the text `'API is available!'`.

```js
const { mkdir, writeFile, rm } = await import("fs/promises");
const { join } = await import("path");

const __testDir = join(ROOT, project.dashedName, "__test");
await mkdir(__testDir, { recursive: true });

// The default export comes in a later lesson, so add one when it is missing.
const __routesWithExport = __i.hasDefaultExport()
  ? __file
  : __file.trimEnd() + "\nexport default router;\n";

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
  "The GET / handler did not respond - check your route definition.",
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
const __i = new __helpers.Inspector(__file);
const __route = (method, path) =>
  __i
    .getCalls(`router.${method}`)
    .find((c) => __i.argText(c.arguments?.at(0)) === path);
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
const __i = new __helpers.Inspector(__file);
assert.isTrue(
  __i.hasDefaultExport("router"),
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
assert.isTrue(
  __i.hasDefaultImport("apiRouter", "./routes/api.routes.js"),
  'server.js should import apiRouter from "./routes/api.routes.js".',
);
```

`server.js` should mount `apiRouter` at the `/api` path using `app.use`.

```js
const __mounted = __i.getCalls("app.use").find((c) => {
  const __args = c.arguments ?? [];
  return (
    __i.argText(__args.at(0)) === "/api" &&
    __i.argText(__args.at(1)) === "apiRouter"
  );
});
assert.exists(__mounted, 'server.js should call app.use("/api", apiRouter).');
```

### --before-each--

```js
const __file = await __helpers.getFile(project.dashedName, "server.js");
const __i = new __helpers.Inspector(__file);
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

When you call the `NextFunction` parameter of a route handler with an error object, Express skips all remaining regular middleware and routes, and jumps directly to the nearest <dfn title="a special Express middleware with four parameters: err, req, res, next - used to handle errors passed via next(err)">error-handling middleware</dfn>:

```js
app.get("/", (req, res, next) => {
  next(new Error("Throw"));
});
```

In `routes/api.routes.js`, add a `GET /crash` route that creates a new `Error` with the message `'Database connection failed.'` and passes it to the `NextFunction` callback. Do not set a status on the error - it should default to `500`.

### --tests--

`routes/api.routes.js` should define a `GET /crash` route on `router`.

```js
assert.exists(
  __route("get", "/crash"),
  'router.get("/crash", ...) should be defined in api.routes.js.',
);
```

The `/crash` route handler should create a `new Error` with message `'Database connection failed.'` and pass it to `next`.

```js
const __src = __handlerSrc("get", "/crash");
assert.exists(__src, 'Define the GET "/crash" route handler.');
const crashHandler = eval(`(${__src})`);
const __next = __helpers.mockNext();
await __helpers.captureLogs(() =>
  crashHandler(
    __helpers.mockReq({ url: "/crash", originalUrl: "/api/crash" }),
    __helpers.mockRes(),
    __next,
  ),
);
assert.isTrue(
  __next.called,
  "The /crash handler should pass the error to next.",
);
assert.instanceOf(
  __next.error,
  Error,
  "The /crash handler should pass a new Error to next.",
);
assert.strictEqual(
  __next.error.message,
  "Database connection failed.",
  'The /crash handler should create new Error("Database connection failed.").',
);
assert.isUndefined(
  __next.error.status,
  "The /crash error should not set a status - it defaults to 500.",
);
```

### --before-each--

```js
const __file = await __helpers.getFile(
  project.dashedName,
  "routes/api.routes.js",
);
const __i = new __helpers.Inspector(__file);
const __route = (method, path) =>
  __i
    .getCalls(`router.${method}`)
    .find((c) => __i.argText(c.arguments?.at(0)) === path);
// The route handler is the last function passed to router[method](path, ...).
const __handlerSrc = (method, path) => {
  const __fn = __i.getCallbacks(__route(method, path)).at(-1);
  return __fn ? __i.generateCode(__fn) : null;
};
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
assert.exists(
  __route("get", "/bad-request"),
  'router.get("/bad-request", ...) should be defined in api.routes.js.',
);
```

The `/bad-request` handler should set the error `status` to `400`.

```js
const __src = __handlerSrc("get", "/bad-request");
assert.exists(__src, 'Define the GET "/bad-request" route handler.');
const badRequestHandler = eval(`(${__src})`);
const __next = __helpers.mockNext();
await __helpers.captureLogs(() =>
  badRequestHandler(
    __helpers.mockReq({ url: "/bad-request", originalUrl: "/api/bad-request" }),
    __helpers.mockRes(),
    __next,
  ),
);
assert.instanceOf(
  __next.error,
  Error,
  "The /bad-request handler should pass a new Error to next.",
);
assert.strictEqual(
  __next.error.status,
  400,
  "The /bad-request handler should set err.status = 400.",
);
```

The `/bad-request` handler should create a `new Error` with message `'Client-side data is missing.'` and pass it to `next`.

```js
const __src = __handlerSrc("get", "/bad-request");
assert.exists(__src, 'Define the GET "/bad-request" route handler.');
const badRequestHandler = eval(`(${__src})`);
const __next = __helpers.mockNext();
await __helpers.captureLogs(() =>
  badRequestHandler(
    __helpers.mockReq({ url: "/bad-request", originalUrl: "/api/bad-request" }),
    __helpers.mockRes(),
    __next,
  ),
);
assert.isTrue(
  __next.called,
  "The /bad-request handler should pass the error to next.",
);
assert.instanceOf(
  __next.error,
  Error,
  "The /bad-request handler should pass a new Error to next.",
);
assert.strictEqual(
  __next.error.message,
  "Client-side data is missing.",
  'The /bad-request handler should create new Error("Client-side data is missing.").',
);
```

### --before-each--

```js
const __file = await __helpers.getFile(
  project.dashedName,
  "routes/api.routes.js",
);
const __i = new __helpers.Inspector(__file);
const __route = (method, path) =>
  __i
    .getCalls(`router.${method}`)
    .find((c) => __i.argText(c.arguments?.at(0)) === path);
// The route handler is the last function passed to router[method](path, ...).
const __handlerSrc = (method, path) => {
  const __fn = __i.getCallbacks(__route(method, path)).at(-1);
  return __fn ? __i.generateCode(__fn) : null;
};
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
  "middleware/error.middleware.js does not exist - create the file first.",
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

`middleware/error.middleware.js` should declare a `notFoundHandler` function with three parameters.

```js
assert.exists(
  __handlerSrc,
  "Declare a notFoundHandler function in middleware/error.middleware.js.",
);
const notFoundHandler = eval(`(${__handlerSrc})`);
assert.isFunction(notFoundHandler, "notFoundHandler should be a function.");
assert.lengthOf(
  __handler.params,
  3,
  "notFoundHandler should have three parameters: req, res, next.",
);
```

The `notFoundHandler` should create a `new Error` that includes `req.originalUrl`.

```js
assert.exists(
  __handlerSrc,
  "Declare a notFoundHandler function in middleware/error.middleware.js.",
);
const notFoundHandler = eval(`(${__handlerSrc})`);
const __next = await __passTo(notFoundHandler, "/does-not-exist");
assert.isTrue(__next.called, "notFoundHandler should call next.");
assert.instanceOf(
  __next.error,
  Error,
  "notFoundHandler should pass a new Error to next.",
);
assert.include(
  __next.error.message,
  "/does-not-exist",
  "The error message should include req.originalUrl.",
);
```

The `notFoundHandler` should set `error.status` to `404` and call `next` with the error.

```js
assert.exists(
  __handlerSrc,
  "Declare a notFoundHandler function in middleware/error.middleware.js.",
);
const notFoundHandler = eval(`(${__handlerSrc})`);
const __next = await __passTo(notFoundHandler, "/missing");
assert.isTrue(__next.called, "notFoundHandler should call next(error).");
assert.instanceOf(
  __next.error,
  Error,
  "notFoundHandler should call next with the error it created.",
);
assert.strictEqual(
  __next.error.status,
  404,
  "notFoundHandler should set error.status = 404.",
);
```

### --before-each--

```js
const __file = await __helpers.getFile(
  project.dashedName,
  "middleware/error.middleware.js",
);
const __i = new __helpers.Inspector(__file);
const __handler = __i.getFunction("notFoundHandler");
const __handlerSrc = __handler ? __i.generateCode(__handler) : null;
const __mockRes = () => ({
  send() {},
  statusCode: 200,
  status(code) {
    this.statusCode = code;
    return this;
  },
  json(body) {
    this.body = body;
    return this;
  },
});
// Call the handler with a request for `originalUrl`, and report what it passed
// to `next`.
const __passTo = async (handler, originalUrl) => {
  const next = (error) => {
    next.called = true;
    next.error = error;
  };
  next.called = false;
  await handler({ originalUrl, method: "GET" }, __mockRes(), next);
  return next;
};
```

## 18

### --description--

Express identifies an error handler by its **four parameters**: `err, req, res, next`. Any middleware with that signature is treated as an error handler and only called when an error is passed to `next`.

In `middleware/error.middleware.js`, declare `finalErrorHandler` with four parameters. It should derive the HTTP response status from `err.status || 500`, log the error, and respond with a JSON body containing `error: true`, the `status`, and a `message`. For `500` responses, use the generic message `'Internal Server Error (Check Server Logs)'`; otherwise use `err.message`.

### --tests--

`middleware/error.middleware.js` should declare a `finalErrorHandler` function with four parameters.

```js
assert.exists(
  __handlerSrc,
  "Declare a finalErrorHandler function in middleware/error.middleware.js.",
);
const finalErrorHandler = eval(`(${__handlerSrc})`);
assert.isFunction(finalErrorHandler, "finalErrorHandler should be a function.");
assert.lengthOf(
  __handler.params,
  4,
  "finalErrorHandler should have four parameters: err, req, res, next.",
);
```

`finalErrorHandler` should derive the response `status` from `err.status || 500`.

```js
assert.exists(
  __handlerSrc,
  "Declare a finalErrorHandler function in middleware/error.middleware.js.",
);
const finalErrorHandler = eval(`(${__handlerSrc})`);
const __client = await __respondTo(
  finalErrorHandler,
  __errorWith("Cannot find /nope", 404),
);
assert.strictEqual(
  __client.statusCode,
  404,
  "finalErrorHandler should respond with err.status when the error has one.",
);
const __server = await __respondTo(finalErrorHandler, __errorWith("Boom"));
assert.strictEqual(
  __server.statusCode,
  500,
  "finalErrorHandler should respond with 500 when the error has no status.",
);
```

`finalErrorHandler` should send a JSON response with `error: true`, `status`, and `message` properties.

```js
assert.exists(
  __handlerSrc,
  "Declare a finalErrorHandler function in middleware/error.middleware.js.",
);
const finalErrorHandler = eval(`(${__handlerSrc})`);
const __res = await __respondTo(
  finalErrorHandler,
  __errorWith("Name is required", 400),
);
assert.isObject(
  __res.body,
  "finalErrorHandler should respond with res.status(status).json(...).",
);
assert.strictEqual(
  __res.body.error,
  true,
  "The JSON response should include error: true.",
);
assert.strictEqual(
  __res.body.status,
  400,
  "The JSON response should include the status.",
);
assert.isString(
  __res.body.message,
  "The JSON response should include a message.",
);
```

`finalErrorHandler` should use a generic message `'Internal Server Error (Check Server Logs)'` when `status` is `500`, and `err.message` otherwise.

```js
assert.exists(
  __handlerSrc,
  "Declare a finalErrorHandler function in middleware/error.middleware.js.",
);
const finalErrorHandler = eval(`(${__handlerSrc})`);
const __client = await __respondTo(
  finalErrorHandler,
  __errorWith("Name is required", 400),
);
assert.isObject(
  __client.body,
  "finalErrorHandler should respond with res.status(status).json(...).",
);
assert.strictEqual(
  __client.body.message,
  "Name is required",
  "finalErrorHandler should use err.message for non-500 errors.",
);
const __server = await __respondTo(
  finalErrorHandler,
  __errorWith("Database connection lost"),
);
assert.isObject(
  __server.body,
  "finalErrorHandler should respond with res.status(status).json(...).",
);
assert.strictEqual(
  __server.body.message,
  "Internal Server Error (Check Server Logs)",
  "finalErrorHandler should use a generic message for 500 errors.",
);
```

### --before-each--

```js
const __file = await __helpers.getFile(
  project.dashedName,
  "middleware/error.middleware.js",
);
const __i = new __helpers.Inspector(__file);
const __handler = __i.getFunction("finalErrorHandler");
const __handlerSrc = __handler ? __i.generateCode(__handler) : null;
const __mockRes = () => ({
  send() {},
  statusCode: 200,
  status(code) {
    this.statusCode = code;
    return this;
  },
  json(body) {
    this.body = body;
    return this;
  },
});
const __errorWith = (message, status) => {
  const error = new Error(message);
  if (status) {
    error.status = status;
  }
  return error;
};
// Call the handler with `err`, and report the response it built.
const __respondTo = async (handler, err) => {
  const res = __mockRes();
  await handler(
    err,
    { originalUrl: "/api/submissions", method: "POST", body: {} },
    res,
    () => {},
  );
  return res;
};
```

## 19

### --description--

Export both `notFoundHandler` and `finalErrorHandler` as named exports from `middleware/error.middleware.js`.

### --tests--

`middleware/error.middleware.js` should export `notFoundHandler` as a named export.

```js
const __i = new __helpers.Inspector(__file);
assert.isTrue(
  __i.hasNamedExport("notFoundHandler"),
  "error.middleware.js should export notFoundHandler as a named export.",
);
```

`middleware/error.middleware.js` should export `finalErrorHandler` as a named export.

```js
const __i = new __helpers.Inspector(__file);
assert.isTrue(
  __i.hasNamedExport("finalErrorHandler"),
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
assert.isTrue(
  __i.hasNamedImport("notFoundHandler", "./middleware/error.middleware.js"),
  'server.js should import notFoundHandler from "./middleware/error.middleware.js".',
);
assert.isTrue(
  __i.hasNamedImport("finalErrorHandler", "./middleware/error.middleware.js"),
  'server.js should import finalErrorHandler from "./middleware/error.middleware.js".',
);
```

`server.js` should mount `notFoundHandler` with `app.use`.

```js
assert.exists(__nfh, "server.js should call app.use(notFoundHandler).");
```

`server.js` should mount `finalErrorHandler` with `app.use`.

```js
const __feh = __i
  .getCalls("app.use")
  .find((c) => __i.argText(c.arguments?.at(0)) === "finalErrorHandler");
assert.exists(__feh, "server.js should call app.use(finalErrorHandler).");
assert.isAbove(
  __feh.start,
  __nfh?.start ?? -1,
  "Mount finalErrorHandler after notFoundHandler.",
);
```

### --before-each--

```js
const __file = await __helpers.getFile(project.dashedName, "server.js");
const __i = new __helpers.Inspector(__file);
const __nfh = __i
  .getCalls("app.use")
  .find((c) => __i.argText(c.arguments?.at(0)) === "notFoundHandler");
```

## 21

### --description--

Your middleware stack is complete. (Re)start the server with `npm start`, then click _Run Tests_ to verify all four routes respond correctly:

| URL                    | Expected status                        |
| ---------------------- | -------------------------------------- |
| `GET /api`             | `200` - `'API is available!'`          |
| `GET /api/crash`       | `500` - JSON with `error: true`        |
| `GET /api/bad-request` | `400` - JSON with the specific message |
| `GET /nonsense`        | `404` - JSON with `error: true`        |

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
