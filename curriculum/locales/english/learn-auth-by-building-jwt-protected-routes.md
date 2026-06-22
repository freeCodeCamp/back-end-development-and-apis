# Learn Auth by Building JWT Protected Routes

You will learn JSON Web Token authentication and role-based authorization by building a secure Express API with register, login, logout, and protected routes.

## 0

### --description--

In this project, you will build an Express API that authenticates users with <dfn title="JSON Web Token - a signed, self-contained token used to prove a user's identity between requests">JWT</dfn>s and protects routes based on a user's role.

The project directory already contains a minimal server in `index.js` that mounts `helmet` and `express.json()`, plus a `package.json` and a `.env` file. You will build the data layer, token helpers, routes, and middleware around it.

Open a new terminal and navigate into the `learn-auth-by-building-jwt-protected-routes` directory.

### --tests--

The terminal working directory should include `learn-auth-by-building-jwt-protected-routes`.

```js
const __cwd = await __helpers.getLastCWD();
assert.include(
  __cwd,
  project.dashedName,
  "Run `cd learn-auth-by-building-jwt-protected-routes`.",
);
```

## 1

### --description--

Your API needs two libraries that are not yet installed:

- bcryptjs - to hash and compare passwords.
- jsonwebtoken - to issue and validate tokens.

In the terminal, install both packages as dependencies:

```bash
npm install bcryptjs jsonwebtoken
```

### --tests--

`bcryptjs` should be listed in the `dependencies` of `package.json`.

```js
const __pkg = JSON.parse(
  await __helpers.getFile(project.dashedName, "package.json"),
);
assert.isObject(__pkg.dependencies, "package.json should have dependencies.");
assert.property(
  __pkg.dependencies,
  "bcryptjs",
  "Run `npm install bcryptjs jsonwebtoken` to add bcryptjs.",
);
```

`jsonwebtoken` should be listed in the `dependencies` of `package.json`.

```js
const __pkg = JSON.parse(
  await __helpers.getFile(project.dashedName, "package.json"),
);
assert.property(
  __pkg.dependencies,
  "jsonwebtoken",
  "Run `npm install bcryptjs jsonwebtoken` to add jsonwebtoken.",
);
```

## 2

### --description--

Instead of a database, this project stores users in a JSON file. Create a `data/users.json` file, and set its contents to an empty array:

```json
[]
```

### --tests--

A `data/users.json` file should exist in the project directory.

```js
const __exists = await __helpers.fileExists(
  `${project.dashedName}/data/users.json`,
);
assert.isTrue(
  __exists,
  "data/users.json does not exist - create the file first.",
);
```

`data/users.json` should contain an empty array.

```js
const __raw = await __helpers.getFile(project.dashedName, "data/users.json");
const __data = JSON.parse(__raw);
assert.isArray(__data, "data/users.json should contain a JSON array.");
assert.lengthOf(__data, 0, "The array in data/users.json should be empty.");
```

## 3

### --description--

Create a `utils/db.js` file. This module will read and write the users file.

In Node.js, `import.meta.dirname` holds the absolute path of the current module's directory, which you can join with a relative path:

```js
import path from "path";
const FILE = path.join(import.meta.dirname, "../data/example.json");
```

In `utils/db.js`, import the built-in `fs` and `path` modules, then declare a `const DB_PATH` that points to `../data/users.json` relative to the module directory.

### --tests--

A `utils/db.js` file should exist in the project directory.

```js
const __exists = await __helpers.fileExists(
  `${project.dashedName}/utils/db.js`,
);
assert.isTrue(__exists, "utils/db.js does not exist - create the file first.");
```

`utils/db.js` should import the `fs` and `path` modules.

```js
const __file = await __helpers.getFile(project.dashedName, "utils/db.js");
assert.match(
  __file,
  /import\s+fs\s+from\s+["']fs["']/,
  'utils/db.js should have: import fs from "fs"',
);
assert.match(
  __file,
  /import\s+path\s+from\s+["']path["']/,
  'utils/db.js should have: import path from "path"',
);
```

`utils/db.js` should declare `DB_PATH` joining `import.meta.dirname` with `"../data/users.json"`.

```js
const __file = await __helpers.getFile(project.dashedName, "utils/db.js");
assert.match(
  __file,
  /const\s+DB_PATH\s*=\s*path\.join\(\s*import\.meta\.dirname\s*,\s*["']\.\.\/data\/users\.json["']\s*\)/,
  'DB_PATH should be path.join(import.meta.dirname, "../data/users.json").',
);
```

## 4

### --description--

In `utils/db.js`, export a function named `readUsers` that returns the array of stored users.

It should read `DB_PATH` synchronously as a UTF-8 string and `.trim()` it. If the result is empty, return an empty array; otherwise return the parsed JSON:

```js
const data = fs.readFileSync(DB_PATH, "utf-8").trim();
if (!data) return [];
```

### --tests--

`utils/db.js` should export a `readUsers` function.

```js
assert.match(
  __file,
  /export\s+function\s+readUsers\s*\(\s*\)/,
  "utils/db.js should export a function named readUsers.",
);
```

`readUsers` should read `DB_PATH` with `fs.readFileSync`.

```js
assert.match(
  __file,
  /fs\.readFileSync\(\s*DB_PATH\s*,\s*["']utf-8["']\s*\)/,
  'readUsers should call fs.readFileSync(DB_PATH, "utf-8").',
);
```

`readUsers` should return an empty array when the file is empty and parse the JSON otherwise.

```js
assert.match(
  __file,
  /if\s*\(\s*!\s*data\s*\)\s*return\s*\[\s*\]/,
  "readUsers should return [] when there is no data.",
);
assert.match(
  __file,
  /return\s+JSON\.parse\(\s*data\s*\)/,
  "readUsers should return JSON.parse(data).",
);
```

### --before-each--

```js
const __file = await __helpers.getFile(project.dashedName, "utils/db.js");
```

### --hints--

#### 1

Use `fs.readFileSync(DB_PATH, "utf-8")` and chain `.trim()` to remove surrounding whitespace before checking whether the file is empty.

#### 2

```js
export function readUsers() {
  const data = fs.readFileSync(DB_PATH, "utf-8").trim();
  if (!data) return [];
  return JSON.parse(data);
}
```

## 5

### --description--

In `utils/db.js`, export a function named `writeUsers` that accepts a `users` array and writes it back to `DB_PATH`.

Use `fs.writeFileSync` with `JSON.stringify(users, null, 2)` so the file stays human-readable.

### --tests--

`utils/db.js` should export a `writeUsers` function that accepts `users`.

```js
assert.match(
  __file,
  /export\s+function\s+writeUsers\s*\(\s*users\s*\)/,
  "utils/db.js should export a function writeUsers(users).",
);
```

`writeUsers` should write `JSON.stringify(users, null, 2)` to `DB_PATH`.

```js
assert.match(
  __file,
  /fs\.writeFileSync\(\s*DB_PATH\s*,\s*JSON\.stringify\(\s*users\s*,\s*null\s*,\s*2\s*\)\s*\)/,
  "writeUsers should call fs.writeFileSync(DB_PATH, JSON.stringify(users, null, 2)).",
);
```

### --before-each--

```js
const __file = await __helpers.getFile(project.dashedName, "utils/db.js");
```

## 6

### --description--

In `utils/db.js`, export two lookup helpers:

- `findByEmail(email)` - returns the first user whose `email` matches, or `null`.
- `findById(id)` - returns the first user whose `id` matches, or `null`.

Each should call `readUsers()` and use `Array.prototype.find`:

```js
return readUsers().find((u) => u.email === email) || null;
```

### --tests--

`utils/db.js` should export a `findByEmail` function that finds a user by `email`.

```js
assert.match(
  __file,
  /export\s+function\s+findByEmail\s*\(\s*email\s*\)/,
  "utils/db.js should export a function findByEmail(email).",
);
assert.match(
  __file,
  /readUsers\(\s*\)\.find\(\s*\(?\s*u\s*\)?\s*=>\s*u\.email\s*===\s*email\s*\)/,
  "findByEmail should use readUsers().find((u) => u.email === email).",
);
```

`utils/db.js` should export a `findById` function that finds a user by `id`.

```js
assert.match(
  __file,
  /export\s+function\s+findById\s*\(\s*id\s*\)/,
  "utils/db.js should export a function findById(id).",
);
assert.match(
  __file,
  /readUsers\(\s*\)\.find\(\s*\(?\s*u\s*\)?\s*=>\s*u\.id\s*===\s*id\s*\)/,
  "findById should use readUsers().find((u) => u.id === id).",
);
```

Both lookups should fall back to `null` when no user matches.

```js
const __matches = __file.match(/\|\|\s*null/g) || [];
assert.isAtLeast(
  __matches.length,
  2,
  "Both findByEmail and findById should return null when no user is found.",
);
```

### --before-each--

```js
const __file = await __helpers.getFile(project.dashedName, "utils/db.js");
```

## 7

### --description--

A JWT is signed with a secret key that only your server knows. The same secret is used to verify tokens on later requests, so it must never be committed to source control or shared.

The `.env` file already defines `PORT`. Add a `JWT_SECRET` variable to `.env` and set it to any long, random string.

```bash
JWT_SECRET=replace_with_a_long_random_string
```

### --tests--

`.env` should define a non-empty `JWT_SECRET` variable.

```js
const __env = await __helpers.getFile(project.dashedName, ".env");
assert.match(
  __env,
  /^\s*JWT_SECRET\s*=\s*\S+/m,
  ".env should define JWT_SECRET with a non-empty value.",
);
```

## 8

### --description--

Create a `utils/jwt.js` file. This module wraps the `jsonwebtoken` library.

`jwt.sign(payload, secret, options)` returns a signed token. The `expiresIn` option sets how long the token stays valid:

```js
jwt.sign({ id: 1 }, "secret", { expiresIn: "1h" });
```

In `utils/jwt.js`, import the default export of `jsonwebtoken` as `jwt`, then export a function `signToken(payload)` that signs the `payload` with `process.env.JWT_SECRET` and an `expiresIn` of `"1d"`.

### --tests--

A `utils/jwt.js` file should exist in the project directory.

```js
const __exists = await __helpers.fileExists(
  `${project.dashedName}/utils/jwt.js`,
);
assert.isTrue(__exists, "utils/jwt.js does not exist - create the file first.");
```

`utils/jwt.js` should import the default export of `jsonwebtoken` as `jwt`.

```js
const __file = await __helpers.getFile(project.dashedName, "utils/jwt.js");
assert.match(
  __file,
  /import\s+jwt\s+from\s+["']jsonwebtoken["']/,
  'utils/jwt.js should have: import jwt from "jsonwebtoken"',
);
```

`utils/jwt.js` should export `signToken(payload)` that signs with the secret and a `"1d"` expiry.

```js
const __file = await __helpers.getFile(project.dashedName, "utils/jwt.js");
assert.match(
  __file,
  /export\s+function\s+signToken\s*\(\s*payload\s*\)/,
  "utils/jwt.js should export a function signToken(payload).",
);
assert.match(
  __file,
  /jwt\.sign\(\s*payload\s*,\s*process\.env\.JWT_SECRET\s*,\s*\{\s*expiresIn\s*:\s*["']1d["']\s*\}\s*\)/,
  'signToken should call jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1d" }).',
);
```

### --hints--

#### 1

The payload is whatever you pass in; the secret comes from the environment variable you added to `.env`.

#### 2

```js
export function signToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1d" });
}
```

## 9

### --description--

`jwt.verify(token, secret)` returns the decoded payload if the token is valid, but **throws** if the token is invalid or expired.

In `utils/jwt.js`, export a function `verifyToken(token)` that returns the decoded payload when valid, and `null` when verification throws. Wrap the call in a `try`/`catch`:

```js
try {
  return jwt.verify(token, process.env.JWT_SECRET);
} catch {
  return null;
}
```

### --tests--

`utils/jwt.js` should export a `verifyToken(token)` function.

```js
assert.match(
  __file,
  /export\s+function\s+verifyToken\s*\(\s*token\s*\)/,
  "utils/jwt.js should export a function verifyToken(token).",
);
```

`verifyToken` should verify the token with `jwt.verify` and the secret.

```js
assert.match(
  __file,
  /jwt\.verify\(\s*token\s*,\s*process\.env\.JWT_SECRET\s*\)/,
  "verifyToken should call jwt.verify(token, process.env.JWT_SECRET).",
);
```

`verifyToken` should return `null` when verification throws.

```js
assert.match(
  __file,
  /catch\s*(\([^)]*\))?\s*\{[\s\S]*?return\s+null/,
  "verifyToken should catch the error and return null.",
);
```

### --before-each--

```js
const __file = await __helpers.getFile(project.dashedName, "utils/jwt.js");
```

## 10

### --description--

Create a `routes/auth.js` file to hold the authentication routes.

An Express <dfn title="an isolated mini-application that handles its own routes and middleware, then is mounted onto the main app">Router</dfn> lets you group related routes in their own file. Import `express`, create a router instance, and export it as the default export:

```js
import express from "express";
const router = express.Router();
export default router;
```

Set this up in `routes/auth.js`.

### --tests--

A `routes/auth.js` file should exist in the project directory.

```js
const __exists = await __helpers.fileExists(
  `${project.dashedName}/routes/auth.js`,
);
assert.isTrue(
  __exists,
  "routes/auth.js does not exist - create the file first.",
);
```

`routes/auth.js` should import `express` and create a `router` with `express.Router()`.

```js
const __file = await __helpers.getFile(project.dashedName, "routes/auth.js");
assert.match(
  __file,
  /import\s+express\s+from\s+["']express["']/,
  'routes/auth.js should have: import express from "express"',
);
const __t = new __helpers.Tower(__file);
const __router = __t.getVariable("router");
assert.match(
  __router.compact,
  /router=express\.Router\(\)/,
  "router should be initialised with express.Router().",
);
```

`routes/auth.js` should export `router` as the default export.

```js
const __file = await __helpers.getFile(project.dashedName, "routes/auth.js");
assert.match(
  __file,
  /export\s+default\s+router/,
  "routes/auth.js should have: export default router",
);
```

## 11

### --description--

Add a `POST /register` route to the router. Make the handler `async`, since hashing the password later will be asynchronous.

The handler should read `email` and `password` from `req.body`. If either is missing, respond with status `400` and the JSON message `"Email and password are required"`. If a user with that email already exists, respond with status `409` and the message `"Email already in use"`.

Import `findByEmail` from `../utils/db.js` to perform the lookup.

### --tests--

`routes/auth.js` should import `findByEmail` from `../utils/db.js`.

```js
assert.match(
  __file,
  /import\s*\{[^}]*\bfindByEmail\b[^}]*\}\s*from\s*["']\.\.\/utils\/db\.js["']/,
  'routes/auth.js should import { findByEmail } from "../utils/db.js".',
);
```

`routes/auth.js` should define an `async` `POST /register` route that reads `email` and `password` from `req.body`.

```js
assert.match(
  __file,
  /router\.post\(\s*["']\/register["']\s*,\s*async/,
  'routes/auth.js should define router.post("/register", async ...).',
);
assert.match(
  __file,
  /const\s*\{\s*email\s*,\s*password\s*\}\s*=\s*req\.body/,
  "The handler should destructure email and password from req.body.",
);
```

A missing `email` or `password` should respond with status `400`.

```js
assert.match(
  __file,
  /if\s*\(\s*!\s*email\s*\|\|\s*!\s*password\s*\)/,
  "The handler should check if (!email || !password).",
);
assert.match(
  __file,
  /\.status\(\s*400\s*\)/,
  "A missing field should respond with status 400.",
);
assert.match(
  __file,
  /Email and password are required/,
  'The 400 response should include the message "Email and password are required".',
);
```

A duplicate email should respond with status `409`.

```js
assert.match(
  __file,
  /findByEmail\(\s*email\s*\)/,
  "The handler should call findByEmail(email).",
);
assert.match(
  __file,
  /\.status\(\s*409\s*\)/,
  "A duplicate email should respond with status 409.",
);
assert.match(
  __file,
  /Email already in use/,
  'The 409 response should include the message "Email already in use".',
);
```

### --before-each--

```js
const __file = await __helpers.getFile(project.dashedName, "routes/auth.js");
```

### --hints--

#### 1

Register the route with `router.post("/register", async (req, res) => { ... })`.

#### 2

Guard clauses keep the handler readable - return early on the `400` case, then on the `409` case, before doing any real work.

#### 3

```js
const { email, password } = req.body;
if (!email || !password) {
  return res.status(400).json({ message: "Email and password are required" });
}
if (findByEmail(email)) {
  return res.status(409).json({ message: "Email already in use" });
}
```

## 12

### --description--

Now create the user. **Never store a plain-text password** - hash it first. `bcrypt.hash(password, saltRounds)` returns a promise of the hash:

```js
const passwordHash = await bcrypt.hash(password, 10);
```

In the `/register` handler, hash the password, then build a new user object with:

- `id` - a unique id from `randomUUID()`
- `email`
- `passwordHash`
- `provider` - `"local"`
- `role` - `"user"`

Push the new user onto the array from `readUsers()` and persist it with `writeUsers()`.

Import `bcrypt` from `bcryptjs`, `randomUUID` from `crypto`, and add `readUsers` and `writeUsers` to your import from `../utils/db.js`.

### --tests--

`routes/auth.js` should import `bcrypt` from `bcryptjs` and `randomUUID` from `crypto`.

```js
assert.match(
  __file,
  /import\s+bcrypt\s+from\s+["']bcryptjs["']/,
  'routes/auth.js should have: import bcrypt from "bcryptjs"',
);
assert.match(
  __file,
  /import\s*\{\s*randomUUID\s*\}\s*from\s*["']crypto["']/,
  'routes/auth.js should have: import { randomUUID } from "crypto"',
);
```

`routes/auth.js` should import `readUsers` and `writeUsers` from `../utils/db.js`.

```js
assert.match(
  __file,
  /import\s*\{[^}]*\breadUsers\b[^}]*\}\s*from\s*["']\.\.\/utils\/db\.js["']/,
  "routes/auth.js should import readUsers from ../utils/db.js.",
);
assert.match(
  __file,
  /import\s*\{[^}]*\bwriteUsers\b[^}]*\}\s*from\s*["']\.\.\/utils\/db\.js["']/,
  "routes/auth.js should import writeUsers from ../utils/db.js.",
);
```

The handler should hash the password with `bcrypt.hash(password, 10)`.

```js
assert.match(
  __file,
  /await\s+bcrypt\.hash\(\s*password\s*,\s*10\s*\)/,
  "The handler should await bcrypt.hash(password, 10).",
);
```

The new user should use `randomUUID()` for `id`, and set `provider` to `"local"` and `role` to `"user"`.

```js
assert.match(
  __file,
  /id\s*:\s*randomUUID\(\s*\)/,
  "The new user's id should be randomUUID().",
);
assert.match(
  __file,
  /provider\s*:\s*["']local["']/,
  'The new user should have provider: "local".',
);
assert.match(
  __file,
  /role\s*:\s*["']user["']/,
  'The new user should have role: "user".',
);
```

The handler should persist the user with `writeUsers`.

```js
assert.match(
  __file,
  /writeUsers\(/,
  "The handler should call writeUsers to save the new user.",
);
```

### --before-each--

```js
const __file = await __helpers.getFile(project.dashedName, "routes/auth.js");
```

### --hints--

#### 1

`bcrypt.hash` is asynchronous, so `await` it inside your `async` handler.

#### 2

```js
const passwordHash = await bcrypt.hash(password, 10);
const users = readUsers();
const newUser = {
  id: randomUUID(),
  email,
  passwordHash,
  provider: "local",
  role: "user",
};
users.push(newUser);
writeUsers(users);
```

## 13

### --description--

Once the user is saved, issue a token so they are logged in immediately after registering.

Import `signToken` from `../utils/jwt.js`. Sign a token whose payload contains the new user's `id`, `email`, and `role`, then respond with status `201` and a JSON body containing a `message` and the `token`.

Finally, wrap the whole handler body in a `try`/`catch`. In the `catch`, respond with status `500` and the JSON message `err.message`.

### --tests--

`routes/auth.js` should import `signToken` from `../utils/jwt.js`.

```js
assert.match(
  __file,
  /import\s*\{\s*signToken\s*\}\s*from\s*["']\.\.\/utils\/jwt\.js["']/,
  'routes/auth.js should import { signToken } from "../utils/jwt.js".',
);
```

The handler should sign a token and respond with status `201` and the token.

```js
assert.match(
  __file,
  /signToken\(\s*\{[\s\S]*?role[\s\S]*?\}\s*\)/,
  "The handler should call signToken with a payload containing the user's role.",
);
assert.match(
  __file,
  /\.status\(\s*201\s*\)\.json\(\s*\{[\s\S]*?token[\s\S]*?\}\s*\)/,
  "The handler should respond with res.status(201).json({ ..., token }).",
);
```

The handler should be wrapped in `try`/`catch` and respond with status `500` on error.

```js
assert.match(__file, /try\s*\{/, "The handler should use a try block.");
assert.match(
  __file,
  /catch\s*\([^)]*\)\s*\{[\s\S]*?\.status\(\s*500\s*\)/,
  "The catch block should respond with status 500.",
);
assert.match(
  __file,
  /err\.message/,
  "The 500 response should send err.message.",
);
```

### --before-each--

```js
const __file = await __helpers.getFile(project.dashedName, "routes/auth.js");
```

### --hints--

#### 1

The token payload should hold just enough to identify the user on later requests - their `id`, `email`, and `role`. Never put the password or its hash in a token.

#### 2

```js
const token = signToken({
  id: newUser.id,
  email: newUser.email,
  role: newUser.role,
});
res.status(201).json({ message: "User registered successfully", token });
```

#### 3

Wrap everything from reading `req.body` to sending the response in `try { ... } catch (err) { res.status(500).json({ message: err.message }); }`.

## 14

### --description--

Add a `POST /login` route. Like `/register`, make the handler `async` and wrap its body in `try`/`catch` (respond with `500` and `err.message` on error).

Read `email` and `password` from `req.body`, and respond with status `400` and `"Email and password are required"` if either is missing.

Then look up the user with `findByEmail(email)`. If no user is found, respond with status `401` and the JSON message `"Invalid credentials"`.

> **NOTE:** Use the same generic `"Invalid credentials"` message whether the email or the password is wrong, so an attacker cannot tell which emails are registered.

### --tests--

`routes/auth.js` should define an `async` `POST /login` route.

```js
assert.match(
  __file,
  /router\.post\(\s*["']\/login["']\s*,\s*async/,
  'routes/auth.js should define router.post("/login", async ...).',
);
```

The login handler should look up the user with `findByEmail`.

```js
assert.match(
  __file,
  /findByEmail\(\s*email\s*\)/,
  "The login handler should call findByEmail(email).",
);
```

A missing user should respond with status `401` and `"Invalid credentials"`.

```js
assert.match(
  __file,
  /\.status\(\s*401\s*\)/,
  "An unknown user should respond with status 401.",
);
assert.match(
  __file,
  /Invalid credentials/,
  'The 401 response should include the message "Invalid credentials".',
);
```

### --before-each--

```js
const __file = await __helpers.getFile(project.dashedName, "routes/auth.js");
```

## 15

### --description--

Now verify the password. `bcrypt.compare(plainText, hash)` returns a promise that resolves to `true` when they match:

```js
const match = await bcrypt.compare(password, user.passwordHash);
```

In the `/login` handler, compare the submitted `password` with the stored `user.passwordHash`. If they do not match, respond with status `401` and `"Invalid credentials"`.

When they match, sign a token containing the user's `id`, `email`, and `role`, then respond with a JSON body containing a `message` of `"Login successful"` and the `token`.

### --tests--

The login handler should compare the password with `bcrypt.compare(password, user.passwordHash)`.

```js
assert.match(
  __file,
  /await\s+bcrypt\.compare\(\s*password\s*,\s*user\.passwordHash\s*\)/,
  "The login handler should await bcrypt.compare(password, user.passwordHash).",
);
```

On success, the handler should sign a token and respond with `"Login successful"` and the `token`.

```js
assert.match(
  __file,
  /Login successful/,
  'The success response should include the message "Login successful".',
);
assert.match(
  __file,
  /res\.json\(\s*\{[\s\S]*?token[\s\S]*?\}\s*\)/,
  "The success response should send a JSON body containing the token.",
);
```

### --before-each--

```js
const __file = await __helpers.getFile(project.dashedName, "routes/auth.js");
```

### --hints--

#### 1

Reuse the `signToken` helper you imported earlier, passing the same shape of payload you used when registering.

#### 2

```js
const match = await bcrypt.compare(password, user.passwordHash);
if (!match) {
  return res.status(401).json({ message: "Invalid credentials" });
}
const token = signToken({ id: user.id, email: user.email, role: user.role });
res.json({ message: "Login successful", token });
```

## 16

### --description--

The auth router is ready to mount. A router is mounted on the app just like middleware, with an optional base path:

```js
app.use("/base/path", router);
```

In `index.js`, import the default export of `./routes/auth.js` as `authRoutes`, then mount it at the `/api/auth` path so the routes become `POST /api/auth/register` and `POST /api/auth/login`.

### --tests--

`index.js` should import `authRoutes` from `./routes/auth.js`.

```js
assert.match(
  __file,
  /import\s+authRoutes\s+from\s+["']\.\/routes\/auth\.js["']/,
  'index.js should have: import authRoutes from "./routes/auth.js"',
);
```

`index.js` should mount `authRoutes` at the `/api/auth` path.

```js
const __t = new __helpers.Tower(__file);
const __calls = __t.getCalls("app.use");
const __mounted = __calls.find((c) => {
  const __args = c.ast?.expression?.arguments;
  return (
    __args?.[0]?.value === "/api/auth" && __args?.[1]?.name === "authRoutes"
  );
});
assert.isDefined(
  __mounted,
  'index.js should call app.use("/api/auth", authRoutes).',
);
```

### --before-each--

```js
const __file = await __helpers.getFile(project.dashedName, "index.js");
```

## 17

### --description--

Protected routes need a way to identify the caller. Create a `middleware/authenticate.js` file with a default-exported middleware function `authenticate(req, res, next)`.

Clients send their token in the `Authorization` header using the `Bearer` scheme:

```
Authorization: Bearer <token>
```

In the middleware, read `req.headers.authorization`. If it is missing or does not start with `"Bearer "`, respond with status `401` and the JSON message `"No token provided"`. Otherwise, extract the token by splitting the header on the space and taking the second part.

### --tests--

A `middleware/authenticate.js` file should exist in the project directory.

```js
const __exists = await __helpers.fileExists(
  `${project.dashedName}/middleware/authenticate.js`,
);
assert.isTrue(
  __exists,
  "middleware/authenticate.js does not exist - create the file first.",
);
```

`middleware/authenticate.js` should default-export an `authenticate(req, res, next)` function.

```js
const __file = await __helpers.getFile(
  project.dashedName,
  "middleware/authenticate.js",
);
assert.match(
  __file,
  /export\s+default\s+function\s+authenticate\s*\(\s*req\s*,\s*res\s*,\s*next\s*\)/,
  "middleware/authenticate.js should export default function authenticate(req, res, next).",
);
```

A missing or non-`Bearer` `Authorization` header should respond with status `401`.

```js
const __file = await __helpers.getFile(
  project.dashedName,
  "middleware/authenticate.js",
);
assert.match(
  __file,
  /req\.headers\.authorization/,
  "authenticate should read req.headers.authorization.",
);
assert.match(
  __file,
  /startsWith\(\s*["']Bearer ["']\s*\)/,
  'authenticate should check authHeader.startsWith("Bearer ").',
);
assert.match(
  __file,
  /\.status\(\s*401\s*\)/,
  "A missing token should respond with status 401.",
);
assert.match(
  __file,
  /No token provided/,
  'The 401 response should include the message "No token provided".',
);
```

`authenticate` should extract the token from the header.

```js
const __file = await __helpers.getFile(
  project.dashedName,
  "middleware/authenticate.js",
);
assert.match(
  __file,
  /\.split\(\s*["'] ["']\s*\)\s*\[\s*1\s*\]/,
  'authenticate should extract the token with authHeader.split(" ")[1].',
);
```

### --hints--

#### 1

The header value looks like `"Bearer eyJ..."`. Reject anything that is missing or does not begin with `"Bearer "`, then split on the space to get the token.

#### 2

```js
export default function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }
  const token = authHeader.split(" ")[1];
  // ...verify the token next
}
```

## 18

### --description--

Now verify the extracted token. Import `verifyToken` from `../utils/jwt.js`.

In `authenticate`, pass the token to `verifyToken`. If it returns a falsy value, the token is invalid or expired - respond with status `401` and the JSON message `"Invalid or expired token"`. Otherwise, attach the decoded payload to `req.user` and call `next()` to continue to the route handler.

### --tests--

`middleware/authenticate.js` should import `verifyToken` from `../utils/jwt.js`.

```js
assert.match(
  __file,
  /import\s*\{\s*verifyToken\s*\}\s*from\s*["']\.\.\/utils\/jwt\.js["']/,
  'authenticate.js should import { verifyToken } from "../utils/jwt.js".',
);
```

`authenticate` should verify the token and respond with `401` when it is invalid.

```js
assert.match(
  __file,
  /verifyToken\(\s*token\s*\)/,
  "authenticate should call verifyToken(token).",
);
assert.match(
  __file,
  /Invalid or expired token/,
  'An invalid token should respond with the message "Invalid or expired token".',
);
```

`authenticate` should set `req.user` to the decoded payload and call `next()`.

```js
assert.match(
  __file,
  /req\.user\s*=\s*decoded/,
  "authenticate should assign the decoded payload to req.user.",
);
assert.match(
  __file,
  /next\(\s*\)/,
  "authenticate should call next() when the token is valid.",
);
```

### --before-each--

```js
const __file = await __helpers.getFile(
  project.dashedName,
  "middleware/authenticate.js",
);
```

### --hints--

#### 1

`verifyToken` already returns `null` on failure, so a simple truthiness check is enough.

#### 2

```js
const decoded = verifyToken(token);
if (!decoded) {
  return res.status(401).json({ message: "Invalid or expired token" });
}
req.user = decoded;
next();
```

## 19

### --description--

You can protect a route by passing middleware as an argument before the handler. Express runs them in order, so `authenticate` runs first and only calls the handler if the token is valid:

```js
router.get("/path", authenticate, (req, res) => {});
```

In `routes/auth.js`, import the default export of `../middleware/authenticate.js` as `authenticate`. Add a protected `GET /profile` route that responds with a JSON body of `{ user: req.user }`.

### --tests--

`routes/auth.js` should import `authenticate` from `../middleware/authenticate.js`.

```js
assert.match(
  __file,
  /import\s+authenticate\s+from\s+["']\.\.\/middleware\/authenticate\.js["']/,
  'routes/auth.js should import authenticate from "../middleware/authenticate.js".',
);
```

`routes/auth.js` should define a `GET /profile` route protected by `authenticate`.

```js
const __t = new __helpers.Tower(__file);
const __calls = __t.getCalls("router.get");
const __profile = __calls.find((c) => {
  const __args = c.ast?.expression?.arguments;
  return (
    __args?.[0]?.value === "/profile" && __args?.[1]?.name === "authenticate"
  );
});
assert.isDefined(
  __profile,
  'routes/auth.js should define router.get("/profile", authenticate, ...).',
);
```

The `/profile` handler should respond with `{ user: req.user }`.

```js
assert.match(
  __file,
  /res\.json\(\s*\{\s*user\s*:\s*req\.user\s*\}\s*\)/,
  "The /profile handler should respond with res.json({ user: req.user }).",
);
```

### --before-each--

```js
const __file = await __helpers.getFile(project.dashedName, "routes/auth.js");
```

## 20

### --description--

JWTs are stateless, so the server cannot "delete" a token to log a user out. Instead, you keep a list of invalidated tokens and reject any token on that list.

Create a `utils/token-blacklist.js` file. Declare a module-level `const blacklist = new Set()`, then export two functions:

- `blacklistToken(token)` - adds the token to the set.
- `isBlacklisted(token)` - returns whether the token is in the set.

### --tests--

A `utils/token-blacklist.js` file should exist in the project directory.

```js
const __exists = await __helpers.fileExists(
  `${project.dashedName}/utils/token-blacklist.js`,
);
assert.isTrue(
  __exists,
  "utils/token-blacklist.js does not exist - create the file first.",
);
```

`utils/token-blacklist.js` should declare a `blacklist` backed by a `Set`.

```js
const __file = await __helpers.getFile(
  project.dashedName,
  "utils/token-blacklist.js",
);
assert.match(
  __file,
  /const\s+blacklist\s*=\s*new\s+Set\(\s*\)/,
  "token-blacklist.js should declare const blacklist = new Set().",
);
```

`utils/token-blacklist.js` should export `blacklistToken(token)` that adds to the set.

```js
const __file = await __helpers.getFile(
  project.dashedName,
  "utils/token-blacklist.js",
);
assert.match(
  __file,
  /export\s+function\s+blacklistToken\s*\(\s*token\s*\)/,
  "token-blacklist.js should export function blacklistToken(token).",
);
assert.match(
  __file,
  /blacklist\.add\(\s*token\s*\)/,
  "blacklistToken should call blacklist.add(token).",
);
```

`utils/token-blacklist.js` should export `isBlacklisted(token)` that checks the set.

```js
const __file = await __helpers.getFile(
  project.dashedName,
  "utils/token-blacklist.js",
);
assert.match(
  __file,
  /export\s+function\s+isBlacklisted\s*\(\s*token\s*\)/,
  "token-blacklist.js should export function isBlacklisted(token).",
);
assert.match(
  __file,
  /blacklist\.has\(\s*token\s*\)/,
  "isBlacklisted should return blacklist.has(token).",
);
```

## 21

### --description--

Wire the blacklist into your authentication check. In `middleware/authenticate.js`, import `isBlacklisted` from `../utils/token-blacklist.js`.

After extracting the token but before verifying it, check `isBlacklisted(token)`. If the token has been blacklisted, respond with status `401` and the JSON message `"Token has been invalidated. Log in again."`.

### --tests--

`middleware/authenticate.js` should import `isBlacklisted` from `../utils/token-blacklist.js`.

```js
assert.match(
  __file,
  /import\s*\{\s*isBlacklisted\s*\}\s*from\s*["']\.\.\/utils\/token-blacklist\.js["']/,
  'authenticate.js should import { isBlacklisted } from "../utils/token-blacklist.js".',
);
```

`authenticate` should reject a blacklisted token with status `401`.

```js
assert.match(
  __file,
  /if\s*\(\s*isBlacklisted\(\s*token\s*\)\s*\)/,
  "authenticate should check if (isBlacklisted(token)).",
);
assert.match(
  __file,
  /Token has been invalidated/,
  'A blacklisted token should respond with "Token has been invalidated. Log in again.".',
);
```

### --before-each--

```js
const __file = await __helpers.getFile(
  project.dashedName,
  "middleware/authenticate.js",
);
```

## 22

### --description--

Add a protected `POST /logout` route to `routes/auth.js`. Import `blacklistToken` from `../utils/token-blacklist.js`.

Protect the route with `authenticate`. In the handler, read the token from the `Authorization` header (split on the space and take the second part), pass it to `blacklistToken`, and respond with the JSON message `"Logged out successfully"`.

### --tests--

`routes/auth.js` should import `blacklistToken` from `../utils/token-blacklist.js`.

```js
assert.match(
  __file,
  /import\s*\{\s*blacklistToken\s*\}\s*from\s*["']\.\.\/utils\/token-blacklist\.js["']/,
  'routes/auth.js should import { blacklistToken } from "../utils/token-blacklist.js".',
);
```

`routes/auth.js` should define a `POST /logout` route protected by `authenticate`.

```js
const __t = new __helpers.Tower(__file);
const __calls = __t.getCalls("router.post");
const __logout = __calls.find((c) => {
  const __args = c.ast?.expression?.arguments;
  return (
    __args?.[0]?.value === "/logout" && __args?.[1]?.name === "authenticate"
  );
});
assert.isDefined(
  __logout,
  'routes/auth.js should define router.post("/logout", authenticate, ...).',
);
```

The `/logout` handler should blacklist the request's token.

```js
assert.match(
  __file,
  /blacklistToken\(\s*token\s*\)/,
  "The /logout handler should call blacklistToken(token).",
);
assert.match(
  __file,
  /Logged out successfully/,
  'The /logout response should include the message "Logged out successfully".',
);
```

### --before-each--

```js
const __file = await __helpers.getFile(project.dashedName, "routes/auth.js");
```

### --hints--

#### 1

The handler can read the same `Authorization` header the middleware used: `req.headers.authorization.split(" ")[1]`.

#### 2

```js
router.post("/logout", authenticate, (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  blacklistToken(token);
  res.json({ message: "Logged out successfully" });
});
```

## 23

### --description--

Authentication proves _who_ a user is; <dfn title="deciding whether an authenticated user is allowed to perform an action, often based on their role">authorization</dfn> decides _what_ they are allowed to do.

Create a `middleware/authorize.js` file. Default-export a function `authorizeRole(role)` that **returns** a middleware function. This pattern - a function that returns middleware - lets you configure the middleware per route, e.g. `authorizeRole("admin")`.

```js
export default function requireSomething(value) {
  return (req, res, next) => {};
}
```

The returned middleware should respond with status `403` and the JSON message `"Access denied"` when there is no `req.user` or the user's `role` does not match `role`. Otherwise it should call `next()`.

### --tests--

`middleware/authorize.js` should exist and default-export `authorizeRole(role)`.

```js
const __exists = await __helpers.fileExists(
  `${project.dashedName}/middleware/authorize.js`,
);
assert.isTrue(
  __exists,
  "middleware/authorize.js does not exist - create the file first.",
);
const __file = await __helpers.getFile(
  project.dashedName,
  "middleware/authorize.js",
);
assert.match(
  __file,
  /export\s+default\s+function\s+authorizeRole\s*\(\s*role\s*\)/,
  "authorize.js should export default function authorizeRole(role).",
);
```

`authorizeRole` should return a middleware function.

```js
const __file = await __helpers.getFile(
  project.dashedName,
  "middleware/authorize.js",
);
assert.match(
  __file,
  /return\s*\(\s*req\s*,\s*res\s*,\s*next\s*\)\s*=>/,
  "authorizeRole should return a (req, res, next) => {} middleware function.",
);
```

The returned middleware should respond with `403` unless `req.user.role` matches `role`.

```js
const __file = await __helpers.getFile(
  project.dashedName,
  "middleware/authorize.js",
);
assert.match(
  __file,
  /!\s*req\.user\s*\|\|\s*req\.user\.role\s*!==\s*role/,
  "The middleware should check if (!req.user || req.user.role !== role).",
);
assert.match(
  __file,
  /\.status\(\s*403\s*\)/,
  "A role mismatch should respond with status 403.",
);
assert.match(
  __file,
  /Access denied/,
  'The 403 response should include the message "Access denied".',
);
```

### --hints--

#### 1

The outer function captures the required `role`. The inner function it returns is the actual Express middleware and has access to `role` through closure.

#### 2

```js
export default function authorizeRole(role) {
  return (req, res, next) => {
    if (!req.user || req.user.role !== role) {
      return res.status(403).json({ message: "Access denied" });
    }
    next();
  };
}
```

## 24

### --description--

Create a `routes/admin.js` file for admin-only routes. You can stack middleware on a single route - Express runs them left to right:

```js
router.get("/path", first, second, handler);
```

In `routes/admin.js`:

- Import `express`, `authenticate` from `../middleware/authenticate.js`, `authorizeRole` from `../middleware/authorize.js`, and `readUsers` from `../utils/db.js`.
- Create a `router` with `express.Router()`.
- Add a `GET /users` route guarded by both `authenticate` and `authorizeRole("admin")`. The handler should map over `readUsers()` to **strip the `passwordHash`** from every user, then respond with `{ users }`.
- Export `router` as the default export.

To remove a property while keeping the rest, destructure it out:

```js
readUsers().map(({ passwordHash, ...user }) => user);
```

### --tests--

A `routes/admin.js` file should exist in the project directory.

```js
const __exists = await __helpers.fileExists(
  `${project.dashedName}/routes/admin.js`,
);
assert.isTrue(
  __exists,
  "routes/admin.js does not exist - create the file first.",
);
```

`routes/admin.js` should import `authenticate`, `authorizeRole`, and `readUsers`.

```js
const __file = await __helpers.getFile(project.dashedName, "routes/admin.js");
assert.match(
  __file,
  /import\s+authenticate\s+from\s+["']\.\.\/middleware\/authenticate\.js["']/,
  "routes/admin.js should import authenticate.",
);
assert.match(
  __file,
  /import\s+authorizeRole\s+from\s+["']\.\.\/middleware\/authorize\.js["']/,
  "routes/admin.js should import authorizeRole.",
);
assert.match(
  __file,
  /import\s*\{\s*readUsers\s*\}\s*from\s*["']\.\.\/utils\/db\.js["']/,
  "routes/admin.js should import { readUsers } from ../utils/db.js.",
);
```

`routes/admin.js` should define `GET /users` guarded by `authenticate` and `authorizeRole("admin")`.

```js
const __file = await __helpers.getFile(project.dashedName, "routes/admin.js");
assert.match(
  __file,
  /router\.get\(\s*["']\/users["']\s*,\s*authenticate\s*,\s*authorizeRole\(\s*["']admin["']\s*\)/,
  'routes/admin.js should define router.get("/users", authenticate, authorizeRole("admin"), ...).',
);
```

The handler should strip `passwordHash` from each user and respond with `{ users }`.

```js
const __file = await __helpers.getFile(project.dashedName, "routes/admin.js");
assert.match(
  __file,
  /\.map\(\s*\(?\s*\{\s*passwordHash\s*,\s*\.\.\.\s*user\s*\}\s*\)?\s*=>\s*user\s*\)/,
  "The handler should map readUsers() stripping passwordHash from each user.",
);
assert.match(
  __file,
  /res\.json\(\s*\{\s*users\s*\}\s*\)/,
  "The handler should respond with res.json({ users }).",
);
```

`routes/admin.js` should export `router` as the default export.

```js
const __file = await __helpers.getFile(project.dashedName, "routes/admin.js");
assert.match(
  __file,
  /export\s+default\s+router/,
  "routes/admin.js should have: export default router",
);
```

## 25

### --description--

Mount the admin router. In `index.js`, import the default export of `./routes/admin.js` as `adminRoutes` and mount it at the `/api/admin` path, so the route becomes `GET /api/admin/users`.

### --tests--

`index.js` should import `adminRoutes` from `./routes/admin.js`.

```js
assert.match(
  __file,
  /import\s+adminRoutes\s+from\s+["']\.\/routes\/admin\.js["']/,
  'index.js should have: import adminRoutes from "./routes/admin.js"',
);
```

`index.js` should mount `adminRoutes` at the `/api/admin` path.

```js
const __t = new __helpers.Tower(__file);
const __calls = __t.getCalls("app.use");
const __mounted = __calls.find((c) => {
  const __args = c.ast?.expression?.arguments;
  return (
    __args?.[0]?.value === "/api/admin" && __args?.[1]?.name === "adminRoutes"
  );
});
assert.isDefined(
  __mounted,
  'index.js should call app.use("/api/admin", adminRoutes).',
);
```

### --before-each--

```js
const __file = await __helpers.getFile(project.dashedName, "index.js");
```

## 26

### --description--

Your authentication API is complete. The `"start"` script loads `.env` with `node --env-file .env`, so `PORT` and `JWT_SECRET` are available. Start the server:

```bash
npm start
```

**NOTE:** Keep the server running, then click _Run Tests_. The tests exercise the full flow against `http://localhost:8080`:

| Request                                  | Expected                             |
| ---------------------------------------- | ------------------------------------ |
| `POST /api/auth/register`                | `201` + a `token`                    |
| `POST /api/auth/login`                   | `200` + a `token`                    |
| `GET /api/auth/profile` (no token)       | `401`                                |
| `GET /api/auth/profile` (valid token)    | `200` + the user                     |
| `GET /api/admin/users` (user token)      | `403`                                |
| `GET /api/admin/users` (admin token)     | `200` + users without `passwordHash` |
| `POST /api/auth/logout` then reuse token | `200`, then `401`                    |

### --tests--

`POST /api/auth/register` should respond with status `201` and a token.

```js
const __email = `reg_${Date.now()}_${Math.random().toString(36).slice(2)}@test.dev`;
const __res = await fetch(`${__url}api/auth/register`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ email: __email, password: "Password123!" }),
});
assert.equal(__res.status, 201, "Register should respond with status 201.");
const __json = await __res.json();
assert.isString(__json.token, "Register should return a token string.");
```

`POST /api/auth/login` should respond with status `200` and a token for valid credentials.

```js
const __email = `login_${Date.now()}_${Math.random().toString(36).slice(2)}@test.dev`;
await fetch(`${__url}api/auth/register`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ email: __email, password: "Password123!" }),
});
const __res = await fetch(`${__url}api/auth/login`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ email: __email, password: "Password123!" }),
});
assert.equal(__res.status, 200, "Login should respond with status 200.");
const __json = await __res.json();
assert.isString(__json.token, "Login should return a token string.");
```

`GET /api/auth/profile` without a token should respond with status `401`.

```js
const __res = await fetch(`${__url}api/auth/profile`);
assert.equal(
  __res.status,
  401,
  "GET /api/auth/profile without a token should respond with status 401.",
);
```

`GET /api/auth/profile` with a valid token should respond with status `200` and the user.

```js
const __email = `prof_${Date.now()}_${Math.random().toString(36).slice(2)}@test.dev`;
const __reg = await fetch(`${__url}api/auth/register`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ email: __email, password: "Password123!" }),
});
const { token: __token } = await __reg.json();
const __res = await fetch(`${__url}api/auth/profile`, {
  headers: { Authorization: `Bearer ${__token}` },
});
assert.equal(
  __res.status,
  200,
  "GET /api/auth/profile with a valid token should respond with status 200.",
);
const __json = await __res.json();
assert.equal(
  __json.user.email,
  __email,
  "The profile response should contain the authenticated user's email.",
);
```

`GET /api/admin/users` with a normal user's token should respond with status `403`.

```js
const __email = `deny_${Date.now()}_${Math.random().toString(36).slice(2)}@test.dev`;
const __reg = await fetch(`${__url}api/auth/register`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ email: __email, password: "Password123!" }),
});
const { token: __token } = await __reg.json();
const __res = await fetch(`${__url}api/admin/users`, {
  headers: { Authorization: `Bearer ${__token}` },
});
assert.equal(
  __res.status,
  403,
  "A non-admin user should be denied access to /api/admin/users with status 403.",
);
```

`GET /api/admin/users` with an admin token should respond with `200` and users that omit `passwordHash`.

```js
const { createRequire } = await import("module");
const { join } = await import("path");
const __require = createRequire(join(ROOT, project.dashedName, "package.json"));
const __jwt = __require("jsonwebtoken");
const __env = await __helpers.getFile(project.dashedName, ".env");
const __secret = __env.match(/JWT_SECRET\s*=\s*(.+)/)[1].trim();
const __adminToken = __jwt.sign(
  { id: "admin-test", email: "admin@test.dev", role: "admin" },
  __secret,
  { expiresIn: "1d" },
);
const __res = await fetch(`${__url}api/admin/users`, {
  headers: { Authorization: `Bearer ${__adminToken}` },
});
assert.equal(
  __res.status,
  200,
  "An admin token should access /api/admin/users with status 200.",
);
const __json = await __res.json();
assert.isArray(
  __json.users,
  "The admin response should contain a users array.",
);
__json.users.forEach((u) =>
  assert.notProperty(
    u,
    "passwordHash",
    "The admin response must not expose passwordHash.",
  ),
);
```

`POST /api/auth/logout` should invalidate the token so reusing it responds with `401`.

```js
const __email = `out_${Date.now()}_${Math.random().toString(36).slice(2)}@test.dev`;
const __reg = await fetch(`${__url}api/auth/register`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ email: __email, password: "Password123!" }),
});
const { token: __token } = await __reg.json();
const __logout = await fetch(`${__url}api/auth/logout`, {
  method: "POST",
  headers: { Authorization: `Bearer ${__token}` },
});
assert.equal(__logout.status, 200, "Logout should respond with status 200.");
const __after = await fetch(`${__url}api/auth/profile`, {
  headers: { Authorization: `Bearer ${__token}` },
});
assert.equal(
  __after.status,
  401,
  "Reusing a logged-out token should respond with status 401.",
);
```

### --before-each--

```js
const __url = "http://localhost:8080/";
```

### --hints--

#### 1

The `start` script already runs `node --env-file .env index.js`, which loads both `PORT` and `JWT_SECRET`. If the server crashes on boot, check that `.env` has a `JWT_SECRET` and that every file you created exports what `index.js` and the routes import.

#### 2

If a request hangs or returns `500`, read the server logs in the terminal. A common cause is `data/users.json` not containing a valid JSON array.

## --fcc-end--
