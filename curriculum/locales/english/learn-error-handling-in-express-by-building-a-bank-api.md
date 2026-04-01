# Learn Error Handling in Express by Building a Bank API

Build a Tiny Bank REST API in Express 5, learning how to handle errors gracefully with HTTP status codes, error-handler middleware, health checks, and graceful shutdowns.

## 0

### --description--

In this project, you will build a <dfn title="Representational State Transfer">REST</dfn> API for a tiny bank using Express 5. Along the way you will learn how HTTP status codes communicate success and failure, how Express handles errors, and how to add health checks and graceful shutdowns to a production-ready server.

To get started, open a new terminal and navigate into the project directory:

```bash
cd learn-error-handling-in-express-by-building-a-bank-api
```

### --tests--

The terminal should be in the `learn-error-handling-in-express-by-building-a-bank-api` directory.

```js
const __cwd = await __helpers.getLastCWD();
assert.include(__cwd, 'learn-error-handling-in-express-by-building-a-bank-api', 'Make sure you have run `cd learn-error-handling-in-express-by-building-a-bank-api` in the terminal');
```

## 1

### --description--

Create a new file called `server.js` in the project directory. This will be the entry point for your Tiny Bank API.

Inside it, import `express` using <dfn title="ECMAScript Modules">ESM</dfn> syntax, create an Express application, and define the port the server will listen on:

```js
import express from 'express';

const app = express();
const PORT = 9000;
```

### --tests--

`server.js` should exist in the project directory.

```js
const __exists = await __helpers.fileExists(`${project.dashedName}/server.js`);
assert.isTrue(__exists, '`server.js` was not found — make sure you created the file in the project directory');
```

`server.js` should import `express` using ESM syntax.

```js
assert.match(__file, /import\s+express\s+from\s+['"]express['"]/, '`server.js` should contain `import express from \'express\'`');
```

`server.js` should call `express()` and store the result in a variable named `app`.

```js
const __t = new __helpers.Tower(__file);
const __app = __t.getVariable('app');
assert.isDefined(__app, '`app` variable not found in `server.js`');
assert.match(__app.compact, /express\(\)/, '`app` should be assigned the result of calling `express()`');
```

`server.js` should declare a `PORT` constant with the value `9000`.

```js
const __t = new __helpers.Tower(__file);
const __port = __t.getVariable('PORT');
assert.isDefined(__port, '`PORT` variable not found in `server.js`');
assert.match(__port.compact, /9000/, '`PORT` should be set to `9000`');
```

### --before-all--

```js
const __file = await __helpers.getFile(project.dashedName, 'server.js');
global.__file = __file;
```

### --after-all--

```js
delete global.__file;
```

## 2

### --description--

In `server.js`, add a route that handles `GET` requests to `/` and sends back a plain-text message. Express routes follow this pattern:

```js
app.get('/path', (req, res) => {
  res.send('message');
});
```

Add a `GET /` route that responds with the string `'Tiny Bank API running...'`.

### --tests--

`server.js` should have a `GET` route for `/`.

```js
const __t = new __helpers.Tower(__file);
const __calls = __t.getCalls('app.get');
const __root = __calls.find(c => {
  const args = c.ast?.expression?.arguments;
  return args?.[0]?.value === '/';
});
assert.isDefined(__root, '`server.js` should have a `app.get(\'/\', ...)` route');
```

The `GET /` route should respond with `'Tiny Bank API running...'`.

```js
assert.match(__file, /res\.send\(\s*['"]Tiny Bank API running\.\.\.['"]\s*\)/, 'The root route should call `res.send(\'Tiny Bank API running...\')`');
```

### --before-all--

```js
const __file = await __helpers.getFile(project.dashedName, 'server.js');
global.__file = __file;
```

### --after-all--

```js
delete global.__file;
```

## 3

### --description--

At the bottom of `server.js`, call `app.listen` to start the server. Pass `PORT` as the first argument and a callback that logs a message when the server is ready:

```js
app.listen(PORT, () => {
  console.log(`Tiny Bank API running on http://localhost:${PORT}...`);
});
```

Once you have added the call, start the server in the terminal with `node server.js`.

**NOTE:** Once your server is running, click _Run Tests_.

### --tests--

`server.js` should call `app.listen` with `PORT` as the first argument.

```js
const __t = new __helpers.Tower(__file);
const __listenCalls = __t.getCalls('app.listen');
assert.isAbove(__listenCalls.length, 0, '`server.js` should call `app.listen(...)`');
const __arg = __listenCalls[0].ast?.expression?.arguments?.[0];
assert.equal(__arg?.name, 'PORT', 'The first argument to `app.listen` should be `PORT`');
```

The server should be listening on port `9000`.

```js
const __listening = await __helpers.isServerListening(9000);
assert.isTrue(__listening, 'The server is not listening on port 9000 — make sure you have started it with `node server.js`');
```

### --before-all--

```js
const __file = await __helpers.getFile(project.dashedName, 'server.js');
global.__file = __file;
```

### --after-all--

```js
delete global.__file;
```

## 4

### --description--

Your API needs some data to work with. Create a file called `accounts.json` in the project directory. It will act as your database — a JSON array of three bank accounts, each with an `id`, `owner`, and `balance`:

```json
[
  { "id": 1, "owner": "Alice", "balance": 1000 },
  { "id": 2, "owner": "Bob", "balance": 500 },
  { "id": 3, "owner": "Charlie", "balance": 250 }
]
```

### --tests--

`accounts.json` should exist in the project directory.

```js
const __exists = await __helpers.fileExists(`${project.dashedName}/accounts.json`);
assert.isTrue(__exists, '`accounts.json` was not found — make sure you created the file in the project directory');
```

`accounts.json` should contain an array of 3 accounts.

```js
assert.isArray(__accounts, '`accounts.json` should contain a JSON array');
assert.lengthOf(__accounts, 3, '`accounts.json` should have exactly 3 accounts');
```

Each account should have an `id`, `owner`, and `balance` property.

```js
for (const __acct of __accounts) {
  assert.property(__acct, 'id', 'Each account should have an `id` property');
  assert.property(__acct, 'owner', 'Each account should have an `owner` property');
  assert.property(__acct, 'balance', 'Each account should have a `balance` property');
}
```

The accounts should be Alice with 1000, Bob with 500, and Charlie with 250.

```js
const __alice = __accounts.find(a => a.owner === 'Alice');
const __bob = __accounts.find(a => a.owner === 'Bob');
const __charlie = __accounts.find(a => a.owner === 'Charlie');
assert.isDefined(__alice, 'No account found with owner "Alice"');
assert.isDefined(__bob, 'No account found with owner "Bob"');
assert.isDefined(__charlie, 'No account found with owner "Charlie"');
assert.equal(__alice.balance, 1000, 'Alice\'s balance should be 1000');
assert.equal(__bob.balance, 500, 'Bob\'s balance should be 500');
assert.equal(__charlie.balance, 250, 'Charlie\'s balance should be 250');
```

### --before-all--

```js
const __raw = await __helpers.getFile(project.dashedName, 'accounts.json');
global.__accounts = JSON.parse(__raw);
```

### --after-all--

```js
delete global.__accounts;
```

## 5

### --description--

Create a new file called `db.js`. This module will handle reading and writing `accounts.json` so the rest of your server doesn't have to worry about file I/O.

Import `readFile` and `writeFile` from Node's built-in `fs/promises` module, then export two async functions — `getAccounts` reads and parses `accounts.json`, and `saveAccounts` writes updated data back to it:

```js
import { readFile, writeFile } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DB_PATH = join(__dirname, 'accounts.json');

export async function getAccounts() {
  const data = await readFile(DB_PATH, 'utf8');
  return JSON.parse(data);
}

export async function saveAccounts(accounts) {
  await writeFile(DB_PATH, JSON.stringify(accounts, null, 2));
}
```

### --tests--

`db.js` should exist in the project directory.

```js
const __exists = await __helpers.fileExists(`${project.dashedName}/db.js`);
assert.isTrue(__exists, '`db.js` was not found — make sure you created the file in the project directory');
```

`db.js` should import from `fs/promises` using ESM syntax.

```js
assert.match(__file, /import.+from\s+['"]fs\/promises['"]/, '`db.js` should import from `\'fs/promises\'` using ESM syntax');
```

`db.js` should define and export a `getAccounts` function.

```js
assert.match(__file, /export\s+(async\s+)?function\s+getAccounts|export\s*\{[^}]*getAccounts[^}]*\}/, '`db.js` should export a `getAccounts` function');
```

`db.js` should define and export a `saveAccounts` function.

```js
assert.match(__file, /export\s+(async\s+)?function\s+saveAccounts|export\s*\{[^}]*saveAccounts[^}]*\}/, '`db.js` should export a `saveAccounts` function');
```

### --before-all--

```js
const __file = await __helpers.getFile(project.dashedName, 'db.js');
global.__file = __file;
```

### --after-all--

```js
delete global.__file;
```

## 6

### --description--

Now wire up the database module in `server.js`. Import `getAccounts` and `saveAccounts` from `./db.js`, and add the `express.json()` <dfn title="a function that processes every incoming request before it reaches a route handler">middleware</dfn> so Express can parse JSON request bodies:

```js
import { getAccounts, saveAccounts } from './db.js';

app.use(express.json());
```

Add the import at the top of the file alongside the existing `express` import, and place `app.use(express.json())` before your routes.

### --tests--

`server.js` should import `getAccounts` and `saveAccounts` from `'./db.js'`.

```js
assert.match(__file, /import\s*\{[^}]*getAccounts[^}]*\}\s*from\s*['"]\.\/db\.js['"]/, '`server.js` should import `getAccounts` from `\'./db.js\'`');
assert.match(__file, /import\s*\{[^}]*saveAccounts[^}]*\}\s*from\s*['"]\.\/db\.js['"]/, '`server.js` should import `saveAccounts` from `\'./db.js\'`');
```

`server.js` should use `express.json()` as middleware.

```js
const __t = new __helpers.Tower(__file);
const __useCalls = __t.getCalls('app.use');
const __hasJson = __useCalls.some(c => {
  const arg = c.ast?.expression?.arguments?.[0];
  return __helpers.generate(arg).code.includes('express.json()');
});
assert.isTrue(__hasJson, '`server.js` should call `app.use(express.json())`');
```

### --before-all--

```js
const __file = await __helpers.getFile(project.dashedName, 'server.js');
global.__file = __file;
```

### --after-all--

```js
delete global.__file;
```

## 7

### --description--

By default, Express sends JSON responses as a single compact line. You can make them easier to read during development by telling Express to pretty-print them.

In `server.js`, add the following line after `app.use(express.json())`:

```js
app.set('json spaces', 2);
```

This tells Express to indent JSON responses with 2 spaces whenever `res.json()` is called.

### --tests--

`server.js` should call `app.set('json spaces', 2)`.

```js
const __file = await __helpers.getFile(project.dashedName, 'server.js');
const __t = new __helpers.Tower(__file);
const __setCalls = __t.getCalls('app.set');
const __hasJsonSpaces = __setCalls.some(c => {
  const args = c.ast?.expression?.arguments;
  return args?.[0]?.value === 'json spaces' && args?.[1]?.value === 2;
});
assert.isTrue(__hasJsonSpaces, '`server.js` should call `app.set(\'json spaces\', 2)`');
```

## 8

### --description--

Time to add your first real route. In `server.js`, add a `GET /accounts` route that reads all accounts from the database and responds with them as JSON.

Because `getAccounts()` is an async operation that reads from the file system, you should wrap it in a `try/catch` block to handle any unexpected errors:

```js
app.get('/accounts', async (req, res, next) => {
  try {
    const accounts = await getAccounts();
    res.json(accounts);
  } catch (err) {
    next(err);
  }
});
```

A successful response automatically sends an <dfn title="a three-digit code that tells the client whether the request succeeded or failed">HTTP status code</dfn> of `200 OK`. Notice the `next(err)` in the catch — this passes any error to Express's error-handling pipeline, which you will build in a later lesson.

### --tests--

`server.js` should have a `GET /accounts` route.

```js
const __t = new __helpers.Tower(__file);
const __calls = __t.getCalls('app.get');
const __route = __calls.find(c => c.ast?.expression?.arguments?.[0]?.value === '/accounts');
assert.isDefined(__route, '`server.js` should have an `app.get(\'/accounts\', ...)` route');
```

The `GET /accounts` route should use a `try/catch` block.

```js
assert.match(__file, /app\.get\s*\(\s*['"]\/accounts['"][\s\S]*?try\s*\{[\s\S]*?catch/, 'The `GET /accounts` handler should contain a `try/catch` block');
```

The `GET /accounts` route should call `getAccounts()` and respond with `res.json()`.

```js
assert.match(__file, /getAccounts\s*\(\s*\)/, 'The `GET /accounts` handler should call `getAccounts()`');
assert.match(__file, /res\.json\s*\(/, 'The `GET /accounts` handler should call `res.json(...)`');
```

### --before-all--

```js
const __file = await __helpers.getFile(project.dashedName, 'server.js');
global.__file = __file;
```

### --after-all--

```js
delete global.__file;
```

## 9

### --description--

Add a `GET /accounts/:id` route to `server.js` that looks up a single account by its ID. The `:id` part is a <dfn title="a named segment in the URL path whose value is available on req.params">route parameter</dfn> — Express makes it available as `req.params.id`.

If no account matches the ID, you need to signal a `404 Not Found` error. The pattern is to create a plain `Error`, attach a `status` property to it, and pass it to `next`:

```js
app.get('/accounts/:id', async (req, res, next) => {
  try {
    const accounts = await getAccounts();
    const account = accounts.find(a => a.id === parseInt(req.params.id));

    if (!account) {
      const err = new Error('Account not found');
      err.status = 404;
      throw err;
    }

    res.json(account);
  } catch (err) {
    next(err);
  }
});
```

`404 Not Found` means the requested resource does not exist on the server.

### --tests--

`server.js` should have a `GET /accounts/:id` route.

```js
const __t = new __helpers.Tower(__file);
const __calls = __t.getCalls('app.get');
const __route = __calls.find(c => c.ast?.expression?.arguments?.[0]?.value === '/accounts/:id');
assert.isDefined(__route, '`server.js` should have an `app.get(\'/accounts/:id\', ...)` route');
```

The `GET /accounts/:id` route should use a `try/catch` block.

```js
assert.match(__file, /app\.get\s*\(\s*['"]\/accounts\/:id['"][\s\S]*?try\s*\{[\s\S]*?catch/, 'The `GET /accounts/:id` handler should contain a `try/catch` block');
```

The `GET /accounts/:id` route should create an error with `status` set to `404` when an account is not found.

```js
assert.match(__file, /err\.status\s*=\s*404/, 'The `GET /accounts/:id` handler should set `err.status = 404` when the account is not found');
```

The `GET /accounts/:id` route should call `next(err)` in the `catch` block.

```js
assert.match(__file, /\/accounts\/:id[\s\S]*?catch\s*\(\s*\w+\s*\)\s*\{[\s\S]*?next\s*\(/, 'The `GET /accounts/:id` catch block should call `next(err)`');
```

### --before-all--

```js
const __file = await __helpers.getFile(project.dashedName, 'server.js');
global.__file = __file;
```

### --after-all--

```js
delete global.__file;
```

## 10

### --description--

Add a `POST /transfer` route to `server.js`. This route will eventually move money between two accounts — but for now, just set up the structure: a `try/catch` block and destructure the three fields you expect from the request body:

```js
app.post('/transfer', async (req, res, next) => {
  try {
    const { fromId, toId, amount } = req.body;
  } catch (err) {
    next(err);
  }
});
```

The `express.json()` middleware you added earlier makes `req.body` available as a parsed JavaScript object.

### --tests--

`server.js` should have a `POST /transfer` route.

```js
const __t = new __helpers.Tower(__file);
const __calls = __t.getCalls('app.post');
const __route = __calls.find(c => c.ast?.expression?.arguments?.[0]?.value === '/transfer');
assert.isDefined(__route, '`server.js` should have an `app.post(\'/transfer\', ...)` route');
```

The `POST /transfer` route should use a `try/catch` block.

```js
assert.match(__file, /app\.post\s*\(\s*['"]\/transfer['"][\s\S]*?try\s*\{[\s\S]*?catch/, 'The `POST /transfer` handler should contain a `try/catch` block');
```

The `POST /transfer` route should destructure `fromId`, `toId`, and `amount` from `req.body`.

```js
assert.match(__file, /const\s*\{\s*(?=[\s\S]*fromId)(?=[\s\S]*toId)(?=[\s\S]*amount)[^}]*\}\s*=\s*req\.body/, 'The `POST /transfer` handler should destructure `fromId`, `toId`, and `amount` from `req.body`');
```

### --before-all--

```js
const __file = await __helpers.getFile(project.dashedName, 'server.js');
global.__file = __file;
```

### --after-all--

```js
delete global.__file;
```

## 11

### --description--

Inside the `POST /transfer` `try` block, add a validation check after the destructuring. If any of the three required fields are missing, create an error with `status` set to `400` and throw it:

```js
if (!fromId || !toId || !amount) {
  const err = new Error('Missing required fields: fromId, toId, amount');
  err.status = 400;
  throw err;
}
```

`400 Bad Request` tells the client that the problem is on their side — they sent an incomplete or malformed request. Because this `throw` is inside the `try` block, the `catch` will catch it and pass it to `next(err)`.

### --tests--

The `POST /transfer` route should check that `fromId`, `toId`, and `amount` are all present.

```js
assert.match(__file, /if\s*\(\s*!fromId\s*\|\|\s*!toId\s*\|\|\s*!amount|if\s*\(\s*!fromId\s*\|\|\s*!amount\s*\|\|\s*!toId|if\s*\(\s*!toId\s*\|\|\s*!fromId\s*\|\|\s*!amount/, 'The `POST /transfer` handler should check `!fromId || !toId || !amount`');
```

The `POST /transfer` route should create an error with `status` set to `400` when any required field is missing.

```js
assert.match(__file, /err\.status\s*=\s*400/, 'The `POST /transfer` handler should set `err.status = 400` when required fields are missing');
```

### --before-all--

```js
const __file = await __helpers.getFile(project.dashedName, 'server.js');
global.__file = __file;
```

### --after-all--

```js
delete global.__file;
```

## 12

### --description--

After the required-fields check, add a second validation inside the `POST /transfer` `try` block. If `amount` is zero or negative, that is also a bad request:

```js
if (amount <= 0) {
  const err = new Error('Transfer amount must be positive');
  err.status = 400;
  throw err;
}
```

### --tests--

The `POST /transfer` route should check that `amount` is greater than zero.

```js
assert.match(__file, /if\s*\(\s*amount\s*<=\s*0\s*\)/, 'The `POST /transfer` handler should check `amount <= 0`');
```

The `POST /transfer` route should create a `400` error when `amount` is not positive.

```js
const __amountCheckIdx = __file.indexOf('amount <= 0');
const __snippet = __file.slice(__amountCheckIdx, __amountCheckIdx + 200);
assert.match(__snippet, /err\.status\s*=\s*400/, 'The `amount <= 0` branch should set `err.status = 400`');
```

### --before-all--

```js
const __file = await __helpers.getFile(project.dashedName, 'server.js');
global.__file = __file;
```

### --after-all--

```js
delete global.__file;
```

## 13

### --description--

After the validations in the `POST /transfer` `try` block, fetch all accounts and look up the sender. If no account matches `fromId`, throw a `404` error:

```js
const accounts = await getAccounts();
const sender = accounts.find(a => a.id === fromId);

if (!sender) {
  const err = new Error('Sender account not found');
  err.status = 404;
  throw err;
}
```

### --tests--

The `POST /transfer` route should call `getAccounts()` to fetch accounts.

```js
assert.match(__file, /\/transfer[\s\S]*?getAccounts\s*\(\s*\)/, 'The `POST /transfer` handler should call `getAccounts()`');
```

The `POST /transfer` route should find the sender account by `fromId`.

```js
assert.match(__file, /accounts\.find\s*\([\s\S]*?fromId/, 'The `POST /transfer` handler should call `accounts.find(...)` using `fromId`');
```

The `POST /transfer` route should throw a `404` error if the sender account is not found.

```js
const __senderNotFoundIdx = __file.search(/sender[\s\S]{0,30}404|404[\s\S]{0,60}sender/);
assert.isAbove(__senderNotFoundIdx, -1, 'The `POST /transfer` handler should set `err.status = 404` when the sender is not found');
```

### --before-all--

```js
const __file = await __helpers.getFile(project.dashedName, 'server.js');
global.__file = __file;
```

### --after-all--

```js
delete global.__file;
```

## 14

### --description--

After finding the sender, look up the recipient in the same `accounts` array using `toId`. If no account matches, throw a `404` error:

```js
const recipient = accounts.find(a => a.id === toId);

if (!recipient) {
  const err = new Error('Recipient account not found');
  err.status = 404;
  throw err;
}
```

### --tests--

The `POST /transfer` route should find the recipient account by `toId`.

```js
assert.match(__file, /accounts\.find\s*\([\s\S]*?toId/, 'The `POST /transfer` handler should call `accounts.find(...)` using `toId`');
```

The `POST /transfer` route should throw a `404` error if the recipient account is not found.

```js
const __recipientNotFoundIdx = __file.search(/recipient[\s\S]{0,30}404|404[\s\S]{0,60}recipient/);
assert.isAbove(__recipientNotFoundIdx, -1, 'The `POST /transfer` handler should set `err.status = 404` when the recipient is not found');
```

### --before-all--

```js
const __file = await __helpers.getFile(project.dashedName, 'server.js');
global.__file = __file;
```

### --after-all--

```js
delete global.__file;
```

## 15

### --description--

After finding both accounts, check whether the sender can afford the transfer. If `sender.balance` is less than `amount`, throw a `409 Conflict` error — this status code signals that the request is valid but cannot be completed due to the current state of the resource:

```js
if (sender.balance < amount) {
  const err = new Error('Insufficient funds');
  err.status = 409;
  throw err;
}
```

### --tests--

The `POST /transfer` route should check whether the sender has sufficient funds.

```js
assert.match(__file, /sender\.balance\s*<\s*amount/, 'The `POST /transfer` handler should check `sender.balance < amount`');
```

The `POST /transfer` route should throw a `409` error when the sender has insufficient funds.

```js
assert.match(__file, /err\.status\s*=\s*409/, 'The `POST /transfer` handler should set `err.status = 409` for insufficient funds');
```

### --before-all--

```js
const __file = await __helpers.getFile(project.dashedName, 'server.js');
global.__file = __file;
```

### --after-all--

```js
delete global.__file;
```

## 16

### --description--

All validations have passed — time to perform the actual transfer. Mutate the balances in place, save the updated accounts, then respond with a summary:

```js
sender.balance -= amount;
recipient.balance += amount;

await saveAccounts(accounts);

res.json({
  message: 'Transfer successful',
  senderName: sender.owner,
  recipientName: recipient.owner,
  amountTransferred: amount,
  senderNewBalance: sender.balance,
  recipientNewBalance: recipient.balance
});
```

### --tests--

The `POST /transfer` route should subtract `amount` from the sender's balance and add it to the recipient's balance.

```js
assert.match(__file, /sender\.balance\s*-=\s*amount/, 'The `POST /transfer` handler should subtract `amount` from `sender.balance`');
assert.match(__file, /recipient\.balance\s*\+=\s*amount/, 'The `POST /transfer` handler should add `amount` to `recipient.balance`');
```

The `POST /transfer` route should call `saveAccounts` with the updated accounts array.

```js
assert.match(__file, /saveAccounts\s*\(\s*accounts\s*\)/, 'The `POST /transfer` handler should call `saveAccounts(accounts)`');
```

The `POST /transfer` route should respond with a JSON summary of the transfer.

```js
assert.match(__file, /res\.json\s*\(\s*\{[\s\S]*?message[\s\S]*?Transfer successful/, 'The `POST /transfer` handler should call `res.json(...)` with a summary object containing `message: \'Transfer successful\'`');
```

### --before-all--

```js
const __file = await __helpers.getFile(project.dashedName, 'server.js');
global.__file = __file;
```

### --after-all--

```js
delete global.__file;
```

## 17

### --description--

Before adding an error handler, see what Express does on its own. Make sure your server is running, then use `curl` to request a route that doesn't exist:

```bash
curl http://localhost:9000/does-not-exist
```

Express will return an HTML page that says "Cannot GET /does-not-exist". This is Express's built-in fallback — not very useful for an API client expecting JSON. In the next lesson you will replace this behaviour with a proper error-handler middleware.

### --tests--

You should use `curl` to send a request to a non-existent route on your running server.

```js
const __history = await __helpers.getBashHistory();
assert.match(__history, /curl[\s\S]*localhost:9000/, 'Use `curl` to send a request to your server at `http://localhost:9000`');
```

`server.js` should not yet have a 4-argument error-handler middleware.

```js
const __file = await __helpers.getFile(project.dashedName, 'server.js');
assert.notMatch(__file, /app\.use\s*\(\s*\(\s*err\s*,\s*req\s*,\s*res\s*,\s*next\s*\)/, '`server.js` should not have an error-handler middleware yet — you will add it in the next lesson');
```

## 18

### --description--

Express recognises an error-handling middleware by its signature: it must have exactly **4 arguments** — `err`, `req`, `res`, `next`. At the bottom of `server.js`, after all your routes but before `app.listen`, add this middleware stub:

```js
app.use((err, req, res, next) => {

});
```

The placement matters — Express only passes errors to this function if it is registered after all routes.

### --tests--

`server.js` should have a 4-argument error-handler middleware registered with `app.use`.

```js
assert.match(__file, /app\.use\s*\(\s*\(\s*err\s*,\s*req\s*,\s*res\s*,\s*next\s*\)/, '`server.js` should have an `app.use((err, req, res, next) => {...})` error-handler middleware');
```

The error-handler middleware should appear after all route definitions.

```js
const __lastGetIdx = Math.max(__file.lastIndexOf('app.get'), __file.lastIndexOf('app.post'));
const __handlerIdx = __file.indexOf('app.use((err,') !== -1
  ? __file.indexOf('app.use((err,')
  : __file.search(/app\.use\s*\(\s*\(\s*err/);
assert.isAbove(__handlerIdx, __lastGetIdx, 'The error-handler middleware should be defined after all route handlers');
```

### --before-all--

```js
const __file = await __helpers.getFile(project.dashedName, 'server.js');
global.__file = __file;
```

### --after-all--

```js
delete global.__file;
```

## 19

### --description--

Fill in the error-handler middleware body. Use `err.status` as the response status code, falling back to `500` if the error has no status attached. Respond with a structured JSON error object:

```js
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Internal Server Error',
      status: err.status || 500
    }
  });
});
```

Every error you throw in a route handler will now be caught here and returned to the client as clean JSON instead of an HTML page.

### --tests--

The error-handler middleware should call `res.status()` using `err.status` with a fallback of `500`.

```js
assert.match(__file, /res\.status\s*\(\s*err\.status\s*\|\|\s*500\s*\)/, 'The error handler should call `res.status(err.status || 500)`');
```

The error-handler middleware should respond with a JSON object containing an `error` property with `message` and `status` fields.

```js
assert.match(__file, /res\.status[\s\S]*?\.json\s*\(\s*\{[\s\S]*?error\s*:[\s\S]*?message[\s\S]*?status[\s\S]*?\}/, 'The error handler should call `.json({ error: { message, status } })`');
```

### --before-all--

```js
const __file = await __helpers.getFile(project.dashedName, 'server.js');
global.__file = __file;
```

### --after-all--

```js
delete global.__file;
```

## 20

### --description--

Add a `console.error` call at the top of the error-handler body so every error is logged to the server's output:

```js
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Internal Server Error',
      status: err.status || 500
    }
  });
});
```

Server-side logging is separate from the client response — the client gets clean JSON, while the server log gives you visibility into what went wrong.

### --tests--

The error-handler middleware should call `console.error` to log the error.

```js
const __file = await __helpers.getFile(project.dashedName, 'server.js');
const __handlerIdx = __file.search(/app\.use\s*\(\s*\(\s*err\s*,\s*req\s*,\s*res\s*,\s*next\s*\)/);
const __handlerBody = __file.slice(__handlerIdx, __handlerIdx + 300);
assert.match(__handlerBody, /console\.error\s*\(/, 'The error-handler middleware should call `console.error(...)` to log the error');
```

## 21

### --description--

Add a temporary `GET /broken` route to test that your error handler correctly catches unhandled server errors. This route deliberately creates an error and passes it straight to `next`:

```js
app.get('/broken', (req, res, next) => {
  const err = new Error('Whoops! Something went wrong on the server');
  next(err);
});
```

Add it before your error-handler middleware. You will use it in the next lesson to confirm the handler works, then comment it out.

### --tests--

`server.js` should have a `GET /broken` route.

```js
const __t = new __helpers.Tower(__file);
const __calls = __t.getCalls('app.get');
const __broken = __calls.find(c => c.ast?.expression?.arguments?.[0]?.value === '/broken');
assert.isDefined(__broken, '`server.js` should have an `app.get(\'/broken\', ...)` route');
```

The `GET /broken` route should create an `Error` and call `next(err)`.

```js
assert.match(__file, /\/broken[\s\S]*?new Error[\s\S]*?next\s*\(/, 'The `GET /broken` handler should create a `new Error(...)` and pass it to `next(err)`');
```

### --before-all--

```js
const __file = await __helpers.getFile(project.dashedName, 'server.js');
global.__file = __file;
```

### --after-all--

```js
delete global.__file;
```

## 22

### --description--

Restart your server and use `curl` to hit the `/broken` route. You should receive a `500` JSON response — proof that your error handler is working:

```bash
curl http://localhost:9000/broken
```

Once you've confirmed the response, comment out the entire `/broken` route in `server.js` — it was only needed for testing.

### --tests--

You should have used `curl` to send a request to the `/broken` route.

```js
const __history = await __helpers.getBashHistory();
assert.match(__history, /curl[\s\S]*localhost:9000\/broken/, 'Use `curl http://localhost:9000/broken` to test the error handler');
```

The `GET /broken` route should be commented out in `server.js`.

```js
const __file = await __helpers.getFile(project.dashedName, 'server.js');
assert.notMatch(__file, /^(?!\s*\/\/).*app\.get\s*\(\s*['"]\/broken['"]/m, 'The `GET /broken` route should be commented out in `server.js`');
assert.match(__file, /\/\/.*\/broken|\/\*[\s\S]*?\/broken[\s\S]*?\*\//, 'The `GET /broken` route should be commented out in `server.js`');
```

## 23

### --description--

Express has a built-in <dfn title="detailed output that shows internal operations as they happen">debug</dfn> mode that logs every route registration, middleware call, and request match. Stop your server, then restart it with the `DEBUG` environment variable set:

```bash
DEBUG=express:* node server.js
```

Watch the output as Express starts up — you will see each route and middleware being registered in order. Send a request with `curl` and observe how Express matches it step by step. When you are done exploring, stop the server with `Ctrl+C`.

### --tests--

You should have started the server with the `DEBUG=express:*` environment variable.

```js
const __history = await __helpers.getBashHistory();
assert.match(__history, /DEBUG=express:\*/, 'Start your server with `DEBUG=express:* node server.js` to see Express\'s internal debug output');
```

## 24

### --description--

A <dfn title="an endpoint that reports whether the server is running and ready to accept requests">health check</dfn> route lets monitoring systems and load balancers quickly verify your server is alive. Add a `GET /health` route to `server.js` that responds with the server's status and how long it has been running:

```js
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    uptime: process.uptime()
  });
});
```

`process.uptime()` returns the number of seconds the Node.js process has been running.

### --tests--

`server.js` should have a `GET /health` route.

```js
const __t = new __helpers.Tower(__file);
const __calls = __t.getCalls('app.get');
const __health = __calls.find(c => c.ast?.expression?.arguments?.[0]?.value === '/health');
assert.isDefined(__health, '`server.js` should have an `app.get(\'/health\', ...)` route');
```

The `GET /health` route should respond with an object containing `status: 'ok'` and `uptime`.

```js
assert.match(__file, /['"]\/health['"][\s\S]*?status\s*:\s*['"]ok['"]/, 'The `GET /health` handler should include `status: \'ok\'` in the response');
assert.match(__file, /['"]\/health['"][\s\S]*?process\.uptime\s*\(\s*\)/, 'The `GET /health` handler should include `uptime: process.uptime()` in the response');
```

### --before-all--

```js
const __file = await __helpers.getFile(project.dashedName, 'server.js');
global.__file = __file;
```

### --after-all--

```js
delete global.__file;
```

## 25

### --description--

Enhance the `GET /health` route with two more fields — a `timestamp` so callers know exactly when the check ran, and `memoryUsage` so you can spot memory leaks over time:

```js
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    memoryUsage: process.memoryUsage()
  });
});
```

`process.memoryUsage()` returns an object with fields like `heapUsed` and `heapTotal` in bytes.

### --tests--

The `GET /health` route should include a `timestamp` using `new Date().toISOString()`.

```js
assert.match(__file, /['"]\/health['"][\s\S]*?timestamp\s*:[\s\S]*?new Date\s*\(\s*\)\.toISOString\s*\(\s*\)/, 'The `GET /health` handler should include `timestamp: new Date().toISOString()` in the response');
```

The `GET /health` route should include `memoryUsage` using `process.memoryUsage()`.

```js
assert.match(__file, /['"]\/health['"][\s\S]*?memoryUsage\s*:[\s\S]*?process\.memoryUsage\s*\(\s*\)/, 'The `GET /health` handler should include `memoryUsage: process.memoryUsage()` in the response');
```

### --before-all--

```js
const __file = await __helpers.getFile(project.dashedName, 'server.js');
global.__file = __file;
```

### --after-all--

```js
delete global.__file;
```

## 26

### --description--

To implement a <dfn title="shutting down a server by finishing in-flight requests before stopping, rather than abruptly killing the process">graceful shutdown</dfn>, you first need a reference to the running server. Right now `app.listen(...)` is called without saving its return value.

Update that call to store the server instance in a `const` named `server`:

```js
const server = app.listen(PORT, () => {
  console.log(`Tiny Bank API running on http://localhost:${PORT}...`);
});
```

This gives you a handle you can use to stop the server programmatically in the next lessons.

### --tests--

`server.js` should store the return value of `app.listen(...)` in a variable named `server`.

```js
const __file = await __helpers.getFile(project.dashedName, 'server.js');
const __t = new __helpers.Tower(__file);
const __server = __t.getVariable('server');
assert.isDefined(__server, 'A variable named `server` should be declared in `server.js`');
assert.match(__server.compact, /app\.listen\(/, '`server` should be assigned the return value of `app.listen(...)`');
```

## 27

### --description--

Now use the `server` reference to handle the `SIGTERM` <dfn title="a signal sent by the operating system or a process manager to request that a process shuts down cleanly">signal</dfn>. When a process manager (like Docker or systemd) wants to stop your server, it sends `SIGTERM`. Listen for it and call `server.close()` so existing connections can finish before the process exits:

```js
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Closing server...');
  server.close(() => {
    console.log('Server closed.');
    process.exit(0);
  });
});
```

Add this after the `server` declaration at the bottom of `server.js`.

### --tests--

`server.js` should listen for the `SIGTERM` signal using `process.on`.

```js
assert.match(__file, /process\.on\s*\(\s*['"]SIGTERM['"]/, '`server.js` should call `process.on(\'SIGTERM\', ...)`');
```

The `SIGTERM` handler should call `server.close()`.

```js
const __sigtermIdx = __file.indexOf('SIGTERM');
const __sigtermBlock = __file.slice(__sigtermIdx, __sigtermIdx + 300);
assert.match(__sigtermBlock, /server\.close\s*\(/, 'The `SIGTERM` handler should call `server.close(...)`');
```

### --before-all--

```js
const __file = await __helpers.getFile(project.dashedName, 'server.js');
global.__file = __file;
```

### --after-all--

```js
delete global.__file;
```

## 28

### --description--

Add the same graceful shutdown logic for `SIGINT` — the signal sent when you press `Ctrl+C` in the terminal. Use the same pattern as `SIGTERM`:

```js
process.on('SIGINT', () => {
  console.log('SIGINT received. Closing server...');
  server.close(() => {
    console.log('Server closed.');
    process.exit(0);
  });
});
```

With both signals handled, your server will shut down cleanly whether it is stopped by a process manager or manually from the terminal.

### --tests--

`server.js` should listen for the `SIGINT` signal using `process.on`.

```js
assert.match(__file, /process\.on\s*\(\s*['"]SIGINT['"]/, '`server.js` should call `process.on(\'SIGINT\', ...)`');
```

The `SIGINT` handler should call `server.close()`.

```js
const __sigintIdx = __file.indexOf('SIGINT');
const __sigintBlock = __file.slice(__sigintIdx, __sigintIdx + 300);
assert.match(__sigintBlock, /server\.close\s*\(/, 'The `SIGINT` handler should call `server.close(...)`');
```

### --before-all--

```js
const __file = await __helpers.getFile(project.dashedName, 'server.js');
global.__file = __file;
```

### --after-all--

```js
delete global.__file;
```

## 29

### --description--

Express 5 automatically catches errors thrown inside `async` route handlers and passes them to the error-handling middleware — no `try/catch` or `next(err)` required for unexpected errors.

Simplify the `GET /accounts` route by removing the `try/catch` wrapper entirely:

```js
// Before (Express 4 style)
app.get('/accounts', async (req, res, next) => {
  try {
    const accounts = await getAccounts();
    res.json(accounts);
  } catch (err) {
    next(err);
  }
});

// After (Express 5 style)
app.get('/accounts', async (req, res) => {
  const accounts = await getAccounts();
  res.json(accounts);
});
```

The `next` parameter is no longer needed in this handler because Express 5 handles the rejection automatically.

### --tests--

The `GET /accounts` route should no longer have a `try/catch` block.

```js
const __accountsRouteMatch = __file.match(/app\.get\s*\(\s*['"]\/accounts['"]\s*,[\s\S]*?\)\s*;/);
assert.isNotNull(__accountsRouteMatch, 'Could not find the `GET /accounts` route');
assert.notMatch(__accountsRouteMatch[0], /try\s*\{/, 'The `GET /accounts` handler should not use `try/catch` — Express 5 handles async errors automatically');
```

The `GET /accounts` route should still call `getAccounts()` and `res.json()`.

```js
assert.match(__file, /app\.get\s*\(\s*['"]\/accounts['"][\s\S]*?getAccounts\s*\(\s*\)/, 'The `GET /accounts` handler should still call `getAccounts()`');
assert.match(__file, /app\.get\s*\(\s*['"]\/accounts['"][\s\S]*?res\.json\s*\(/, 'The `GET /accounts` handler should still call `res.json(...)`');
```

### --before-all--

```js
const __file = await __helpers.getFile(project.dashedName, 'server.js');
global.__file = __file;
```

### --after-all--

```js
delete global.__file;
```

## 30

### --description--

Apply the same Express 5 simplification to `GET /accounts/:id`. Remove the `try/catch` block and drop the `next` parameter — intentional errors like the `404` can be thrown directly, and Express 5 will route them to the error handler:

```js
app.get('/accounts/:id', async (req, res) => {
  const accounts = await getAccounts();
  const account = accounts.find(a => a.id === parseInt(req.params.id));

  if (!account) {
    const err = new Error('Account not found');
    err.status = 404;
    throw err;
  }

  res.json(account);
});
```

### --tests--

The `GET /accounts/:id` route should no longer have a `try/catch` block.

```js
const __idRouteIdx = __file.indexOf("'/accounts/:id'") !== -1
  ? __file.indexOf("'/accounts/:id'")
  : __file.indexOf('"/accounts/:id"');
const __idRouteSnippet = __file.slice(__idRouteIdx, __idRouteIdx + 400);
assert.notMatch(__idRouteSnippet, /try\s*\{/, 'The `GET /accounts/:id` handler should not use `try/catch` — Express 5 handles async errors automatically');
```

The `GET /accounts/:id` route should use `throw err` instead of `next(err)` for the not-found error.

```js
assert.notMatch(__file, /\/accounts\/:id[\s\S]*?catch\s*\([\s\S]*?\)\s*\{[\s\S]*?next\s*\(/, 'The `GET /accounts/:id` handler should not have a `catch` block calling `next(err)` — use `throw err` directly');
assert.match(__file, /\/accounts\/:id[\s\S]*?throw\s+err/, 'The `GET /accounts/:id` handler should use `throw err` to surface the 404 error');
```

### --before-all--

```js
const __file = await __helpers.getFile(project.dashedName, 'server.js');
global.__file = __file;
```

### --after-all--

```js
delete global.__file;
```

## 31

### --description--

Apply the final Express 5 refactor to `POST /transfer`. Remove the outer `try/catch` block and the `next` parameter — every `throw err` inside the handler will be caught automatically by Express 5 and forwarded to the error-handler middleware:

```js
app.post('/transfer', async (req, res) => {
  const { fromId, toId, amount } = req.body;

  if (!fromId || !toId || !amount) {
    const err = new Error('Missing required fields: fromId, toId, amount');
    err.status = 400;
    throw err;
  }
  // ... rest of validations and transfer logic using throw err
});
```

Keep all the `throw err` statements for your validation errors — they still work exactly as before, just without a `catch` block wrapping them.

### --tests--

The `POST /transfer` route should no longer have a `try/catch` block.

```js
const __transferIdx = __file.indexOf("'/transfer'") !== -1
  ? __file.indexOf("'/transfer'")
  : __file.indexOf('"/transfer"');
const __transferSnippet = __file.slice(__transferIdx, __transferIdx + 1500);
assert.notMatch(__transferSnippet, /try\s*\{/, 'The `POST /transfer` handler should not use `try/catch` — Express 5 handles async errors automatically');
```

The `POST /transfer` route should not call `next(err)` in a `catch` block.

```js
assert.notMatch(__file, /\/transfer[\s\S]*?catch\s*\([\s\S]*?\)\s*\{[\s\S]*?next\s*\(/, 'The `POST /transfer` handler should not have a `catch` block — use `throw err` directly throughout');
```

The `POST /transfer` route should still use `throw err` for all validation errors.

```js
const __transferIdx2 = __file.indexOf("'/transfer'") !== -1
  ? __file.indexOf("'/transfer'")
  : __file.indexOf('"/transfer"');
const __transferBody = __file.slice(__transferIdx2, __transferIdx2 + 1500);
const __throwCount = (__transferBody.match(/throw\s+err/g) || []).length;
assert.isAtLeast(__throwCount, 4, 'The `POST /transfer` handler should still `throw err` for all validation errors (missing fields, bad amount, sender not found, recipient not found, insufficient funds)');
```

### --before-all--

```js
const __file = await __helpers.getFile(project.dashedName, 'server.js');
global.__file = __file;
```

### --after-all--

```js
delete global.__file;
```

## 32

### --description--

Update the root `GET /` route message to reflect that the server is now running with Express 5:

```js
app.get('/', (req, res) => {
  res.send('Tiny Bank API (Express 5) running...');
});
```

Then restart the server with `node server.js` to pick up all the changes from the refactor.

**NOTE:** Once your server is running, click _Run Tests_.

### --tests--

The `GET /` route should respond with a message that references Express 5.

```js
const __file = await __helpers.getFile(project.dashedName, 'server.js');
assert.match(__file, /res\.send\s*\(\s*['"][^'"]*[Ee]xpress\s*5[^'"]*['"]\s*\)/, 'Update the root `GET /` route to send a message that mentions Express 5');
```

The server should be listening on port `9000`.

```js
const __listening = await __helpers.isServerListening(9000);
assert.isTrue(__listening, 'The server is not listening on port 9000 — restart it with `node server.js`');
```

## 33

### --description--

You have now completed the Express 5 refactor. Here is a summary of what changed:

| Approach | Error handling |
|---|---|
| Before (Express 4 style) | Wrap every `async` handler in `try/catch`, call `next(err)` in the `catch` |
| After (Express 5 style) | Just `throw err` — Express automatically forwards it to the error-handler middleware |

The error-handler middleware itself did not change — it is still needed to format the JSON error response for the client. Check that your final `server.js` has no `try/catch` blocks in route handlers while retaining the error handler, `GET /health`, and both signal handlers.

### --tests--

`server.js` should have no `try/catch` blocks in any route handler.

```js
const __routeSection = __file.slice(0, __file.search(/app\.use\s*\(\s*\(\s*err/));
assert.notMatch(__routeSection, /try\s*\{/, '`server.js` should have no `try/catch` blocks in route handlers after the Express 5 refactor');
```

`server.js` should still have the 4-argument error-handler middleware.

```js
assert.match(__file, /app\.use\s*\(\s*\(\s*err\s*,\s*req\s*,\s*res\s*,\s*next\s*\)/, '`server.js` should still have the error-handler middleware — it is still needed to format error responses');
```

`server.js` should still have `GET /health`, `SIGTERM`, and `SIGINT` handlers.

```js
assert.match(__file, /['"]\/health['"]/, '`server.js` should still have the `GET /health` route');
assert.match(__file, /process\.on\s*\(\s*['"]SIGTERM['"]/, '`server.js` should still handle `SIGTERM`');
assert.match(__file, /process\.on\s*\(\s*['"]SIGINT['"]/, '`server.js` should still handle `SIGINT`');
```

### --before-all--

```js
const __file = await __helpers.getFile(project.dashedName, 'server.js');
global.__file = __file;
```

### --after-all--

```js
delete global.__file;
```

## 34

### --description--

Congratulations — your Tiny Bank API is complete! Do a final manual test of the two key read endpoints to confirm everything works end-to-end with Express 5:

```bash
curl http://localhost:9000/accounts
curl http://localhost:9000/health
```

You built a REST API with structured JSON error responses, HTTP status codes (200, 400, 404, 409, 500), a health check endpoint, graceful shutdown handling, and clean Express 5 async error propagation — all without boilerplate `try/catch` blocks.

### --tests--

You should have used `curl` to test the `GET /accounts` endpoint.

```js
const __history = await __helpers.getBashHistory();
assert.match(__history, /curl[\s\S]*localhost:9000\/accounts(?![\/:])/, 'Use `curl http://localhost:9000/accounts` to verify the endpoint still works');
```

You should have used `curl` to test the `GET /health` endpoint.

```js
const __history = await __helpers.getBashHistory();
assert.match(__history, /curl[\s\S]*localhost:9000\/health/, 'Use `curl http://localhost:9000/health` to verify the health check endpoint');
```

## --fcc-end--
