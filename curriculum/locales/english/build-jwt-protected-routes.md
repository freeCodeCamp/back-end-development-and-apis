# Build JWT Protected Routes

You will learn JSON Web Token authentication and role-based authorization by building a secure Express API with register, login, logout, and protected routes.

## 0

### --description--

In this project, you will build an Express API that authenticates users with <dfn title="JSON Web Token - a signed, self-contained token used to prove a user's identity between requests">JWT</dfn>s and protects routes based on a user's role.

The project directory already contains a minimal server in `index.js` that mounts `helmet` and `express.json()`, plus a `package.json` and a `.env` file. You will build the data layer, token helpers, routes, and middleware around it.

Open a new terminal and navigate into the `build-jwt-protected-routes` directory.

### --tests--

The terminal working directory should include `build-jwt-protected-routes`.

```js
const __cwd = await __helpers.getLastCWD();
assert.include(
  __cwd,
  project.dashedName,
  "Run `cd build-jwt-protected-routes`.",
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

Instead of a database, this project stores users in a JSON file. Create an empty `data/users.json` file in the project directory. You will give it its starting contents in the next lesson.

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

## 3

### --description--

Set the contents of `data/users.json` to an empty array, so there are no users to begin with:

```json
[]
```

### --tests--

`data/users.json` should contain an empty array.

```js
const __raw = await __helpers.getFile(project.dashedName, "data/users.json");
const __data = JSON.parse(__raw);
assert.isArray(__data, "data/users.json should contain a JSON array.");
assert.lengthOf(__data, 0, "The array in data/users.json should be empty.");
```

## 4

### --description--

Create a `utils/db.js` file in the project directory. This module will read and write the users file.

### --tests--

A `utils/db.js` file should exist in the project directory.

```js
const __exists = await __helpers.fileExists(
  `${project.dashedName}/utils/db.js`,
);
assert.isTrue(__exists, "utils/db.js does not exist - create the file first.");
```

## 5

### --description--

In Node.js, `import.meta.dirname` holds the absolute path of the current module's directory, which you can join with a relative path:

```js
import path from "path";
const FILE = path.join(import.meta.dirname, "../data/example.json");
```

In `utils/db.js`, import the `path` module, then declare a `const DB_PATH` that points to `../data/users.json` relative to the module directory.

### --tests--

`utils/db.js` should import the `path` module.

```js
const __sources = __b.getImportDeclarations().map((i) => i.source.value);
assert.include(__sources, "path", 'Import the "path" module.');
```

`utils/db.js` should build a path to `../data/users.json` using `path.join` and `import.meta.dirname`.

```js
const __join = __b.getType("CallExpression").find((c) => {
  const __code = __b.generateCode(c.callee);
  return __code.endsWith(".join") || __code === "join";
});
assert.exists(__join, "Build the path with path.join(...).");
assert.isTrue(
  __join.arguments.some((a) =>
    __b.generateCode(a).includes("import.meta.dirname"),
  ),
  "Use import.meta.dirname to resolve the path.",
);
assert.isTrue(
  __join.arguments.some((a) => a.value && a.value.includes("data/users.json")),
  "Point the path at ../data/users.json.",
);
```

### --before-each--

```js
const __file = await __helpers.getFile(project.dashedName, "utils/db.js");
const __b = new __helpers.Babeliser(__file);
```

## 6

### --description--

Now read the file. In `utils/db.js`, import the `fs` module, then export a function named `readUsers` that returns the array of stored users.

It should read `DB_PATH` synchronously as a UTF-8 string and `.trim()` it. If the result is empty, return an empty array; otherwise return the parsed JSON.

### --tests--

`readUsers()` should return the parsed array of users from the file.

```js
const { readFile, writeFile } = await import("fs/promises");
const { join } = await import("path");
const __dataPath = join(ROOT, project.dashedName, "data/users.json");
const __backup = await __helpers.getFile(
  project.dashedName,
  "data/users.json",
);
try {
  await writeFile(
    __dataPath,
    JSON.stringify([{ id: "1", email: "a@b.com", role: "user" }]),
  );
  const { readUsers } = await __helpers.importSansCache(
    join(project.dashedName, "utils/db.js"),
  );
  assert.isFunction(readUsers, "Export a readUsers function.");
  assert.deepEqual(
    readUsers(),
    [{ id: "1", email: "a@b.com", role: "user" }],
    "readUsers() should return the parsed contents of the users file.",
  );
  await writeFile(__dataPath, "   ");
  assert.deepEqual(
    readUsers(),
    [],
    "readUsers() should return an empty array when the file is empty.",
  );
} finally {
  await writeFile(__dataPath, __backup);
}
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

## 7

### --description--

In `utils/db.js`, export a function named `writeUsers` that accepts a `users` array and writes it back to `DB_PATH`.

Use `fs.writeFileSync` with `JSON.stringify(users, null, 2)` so the file stays human-readable.

### --tests--

`writeUsers(users)` should persist the array to the users file.

```js
const { readFile, writeFile } = await import("fs/promises");
const { join } = await import("path");
const __dataPath = join(ROOT, project.dashedName, "data/users.json");
const __backup = await readFile(__dataPath, "utf-8");
try {
  const { writeUsers } = await __helpers.importSansCache(
    join(project.dashedName, "utils/db.js"),
  );
  assert.isFunction(writeUsers, "Export a writeUsers function.");
  writeUsers([{ id: "7", email: "w@x.com" }]);
  const __onDisk = JSON.parse(await readFile(__dataPath, "utf-8"));
  assert.deepEqual(
    __onDisk,
    [{ id: "7", email: "w@x.com" }],
    "writeUsers(users) should write the array to data/users.json.",
  );
} finally {
  await writeFile(__dataPath, __backup);
}
```

### --before-each--

```js
const __file = await __helpers.getFile(project.dashedName, "utils/db.js");
const __b = new __helpers.Babeliser(__file);
```

## 8

### --description--

In `utils/db.js`, export two lookup helpers:

- `findByEmail(email)` - returns the first user whose `email` matches, or `null`.
- `findById(id)` - returns the first user whose `id` matches, or `null`.

Each should call `readUsers()` and use `Array.prototype.find`:

```js
return readUsers().find((u) => u.email === email) || null;
```

### --tests--

`findByEmail` and `findById` should return the matching user, or `null` when none matches.

```js
const { readFile, writeFile } = await import("fs/promises");
const { join } = await import("path");
const __dataPath = join(ROOT, project.dashedName, "data/users.json");
const __backup = await __helpers.getFile(
  project.dashedName,
  "data/users.json",
);
try {
  await writeFile(
    __dataPath,
    JSON.stringify([
      { id: "1", email: "a@b.com" },
      { id: "2", email: "c@d.com" },
    ]),
  );
  const { findByEmail, findById } = await __helpers.importSansCache(
    join(project.dashedName, "utils/db.js"),
  );
  assert.isFunction(findByEmail, "Export a findByEmail function.");
  assert.isFunction(findById, "Export a findById function.");
  assert.equal(
    findByEmail("c@d.com")?.id,
    "2",
    "findByEmail should return the user with the matching email.",
  );
  assert.isNull(
    findByEmail("missing@nope.com"),
    "findByEmail should return null when no user matches.",
  );
  assert.equal(
    findById("1")?.email,
    "a@b.com",
    "findById should return the user with the matching id.",
  );
  assert.isNull(
    findById("999"),
    "findById should return null when no user matches.",
  );
} finally {
  await writeFile(__dataPath, __backup);
}
```

## 9

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
const __vars = Object.fromEntries(
  __env
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith("#"))
    .map((l) => {
      const __i = l.indexOf("=");
      return [l.slice(0, __i).trim(), l.slice(__i + 1).trim()];
    }),
);
assert.property(__vars, "JWT_SECRET", "Add a JWT_SECRET variable to .env.");
assert.isNotEmpty(
  __vars.JWT_SECRET,
  "JWT_SECRET should have a non-empty value.",
);
```

## 10

### --description--

Create a `utils/jwt.js` file in the project directory. This module will wrap the `jsonwebtoken` library.

### --tests--

A `utils/jwt.js` file should exist in the project directory.

```js
const __exists = await __helpers.fileExists(
  `${project.dashedName}/utils/jwt.js`,
);
assert.isTrue(__exists, "utils/jwt.js does not exist - create the file first.");
```

## 11

### --description--

`jwt.sign(payload, secret, options)` returns a signed token. The `expiresIn` option sets how long the token stays valid:

```js
jwt.sign({ id: 1 }, "secret", { expiresIn: "1h" });
```

In `utils/jwt.js`, import the default export of `jsonwebtoken` as `jwt`, then export a function `signToken(payload)` that signs the `payload` with `process.env.JWT_SECRET` and an `expiresIn` of `"1d"`.

### --tests--

`signToken(payload)` should return a token that encodes the payload and has an expiry.

```js
process.env.JWT_SECRET = "grading-secret-value";
const { join } = await import("path");
const { signToken } = await __helpers.importSansCache(
  join(project.dashedName, "utils/jwt.js"),
);
assert.isFunction(signToken, "Export a signToken function.");
const __token = signToken({ id: "1", email: "a@b.com", role: "user" });
assert.isString(__token, "signToken should return a token string.");
const { createRequire } = await import("module");
const __jwt = createRequire(join(ROOT, project.dashedName, "package.json"))(
  "jsonwebtoken",
);
const __decoded = __jwt.verify(__token, process.env.JWT_SECRET);
assert.equal(
  __decoded.id,
  "1",
  "The token should encode the payload you signed.",
);
assert.exists(
  __decoded.exp,
  "The token should have an expiry - pass an expiresIn option.",
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

## 12

### --description--

`jwt.verify(token, secret)` returns the decoded payload if the token is valid, but **throws** if the token is invalid or expired.

In `utils/jwt.js`, export a function `verifyToken(token)` that returns the decoded payload when the token is valid, and returns `null` when verification throws. Wrap the call to `jwt.verify` in a `try`/`catch` so the thrown error becomes a `null` return.

### --tests--

`verifyToken` should return the payload for a valid token and `null` for an invalid one.

```js
process.env.JWT_SECRET = "grading-secret-value";
const { join } = await import("path");
const { signToken, verifyToken } = await __helpers.importSansCache(
  join(project.dashedName, "utils/jwt.js"),
);
assert.isFunction(verifyToken, "Export a verifyToken function.");
const __valid = signToken({ id: "42", role: "user" });
assert.equal(
  verifyToken(__valid)?.id,
  "42",
  "verifyToken should return the decoded payload for a valid token.",
);
assert.isNull(
  verifyToken("clearly.not.a.valid.token"),
  "verifyToken should return null for an invalid token.",
);
```

## 13

### --description--

Create a `routes/auth.js` file in the project directory. This will hold the authentication routes.

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

## 14

### --description--

An Express <dfn title="an isolated mini-application that handles its own routes and middleware, then is mounted onto the main app">Router</dfn> lets you group related routes in their own file. Import `express`, create a router instance, and export it as the default export:

```js
import express from "express";
const router = express.Router();
export default router;
```

Set this up in `routes/auth.js`.

### --tests--

`routes/auth.js` should import `express` and create a router with `express.Router()`.

```js
assert.isTrue(
  __b.getImportDeclarations().some((i) => i.source.value === "express"),
  "Import express.",
);
const __routerDecl = __b.getVariableDeclarations().find((v) => {
  const __init = v.declarations[0]?.init;
  return (
    __init?.type === "CallExpression" &&
    __b.generateCode(__init.callee).endsWith("Router")
  );
});
assert.exists(__routerDecl, "Create a router with express.Router().");
```

`routes/auth.js` should export the router as the default export.

```js
const __routerDecl = __b.getVariableDeclarations().find((v) => {
  const __init = v.declarations[0]?.init;
  return (
    __init?.type === "CallExpression" &&
    __b.generateCode(__init.callee).endsWith("Router")
  );
});
const __routerName = __routerDecl?.declarations[0]?.id?.name;
const __def = __b.getType("ExportDefaultDeclaration")[0];
assert.exists(__def, "Add a default export.");
assert.equal(
  __b.generateCode(__def.declaration),
  __routerName,
  "Export the router as the default export.",
);
```

### --before-each--

```js
const __file = await __helpers.getFile(project.dashedName, "routes/auth.js");
const __b = new __helpers.Babeliser(__file);
```

## 15

### --description--

Add a `POST /register` route to the router. Make the handler `async`, since hashing the password later will be asynchronous.

The handler should read `email` and `password` from `req.body`. If either is missing, respond with status `400` and a JSON message such as `"Email and password are required"`. If a user with that email already exists, respond with status `409` and a message such as `"Email already in use"`.

Import `findByEmail` from `../utils/db.js` to perform the lookup.

### --tests--

`routes/auth.js` should import `findByEmail` from `../utils/db.js`.

```js
assert.isTrue(
  __b
    .getImportDeclarations()
    .some(
      (i) =>
        i.source.value === "../utils/db.js" &&
        i.specifiers.some(
          (s) => (s.imported?.name ?? s.local.name) === "findByEmail",
        ),
    ),
  "Import findByEmail from ../utils/db.js.",
);
```

`POST /register` should be an `async` route handler.

```js
const __r = __route("post", "/register");
assert.exists(__r, 'Define a router.post("/register", ...) route.');
const __fns = __r.arguments.filter(
  (a) =>
    a.type === "ArrowFunctionExpression" || a.type === "FunctionExpression",
);
assert.isTrue(
  __fns.at(-1)?.async === true,
  "Make the /register handler async.",
);
```

The `/register` handler should respond with `400` when a field is missing and `409` when the email already exists.

```js
const __src = __handlerSrc("post", "/register");
assert.exists(__src, 'Define the POST "/register" handler.');

// Mock the dependencies the handler imports, then build it from its source.
let __existing = null;
const findByEmail = () => __existing;
const readUsers = () => [];
const writeUsers = () => {};
const signToken = () => "signed.jwt.token";
const bcrypt = { hash: async () => "HASHED_PW", compare: async () => true };
const randomUUID = () => "uuid-1";
const register = eval(`(${__src})`);

const __missing = __mockRes();
await register({ body: {} }, __missing);
assert.equal(
  __missing.statusCode,
  400,
  "A missing email or password should respond with status 400.",
);

__existing = { id: "1", email: "a@b.com" };
const __dup = __mockRes();
await register({ body: { email: "a@b.com", password: "secret123" } }, __dup);
assert.equal(
  __dup.statusCode,
  409,
  "An email that already exists should respond with status 409.",
);
```

### --before-each--

```js
const __file = await __helpers.getFile(project.dashedName, "routes/auth.js");
const __b = new __helpers.Babeliser(__file);
const __route = (method, path) =>
  __b
    .getType("CallExpression")
    .find(
      (c) =>
        c.callee?.property?.name === method && c.arguments?.[0]?.value === path,
    );
const __handlerSrc = (method, path) => {
  const __fn = __route(method, path)
    ?.arguments?.filter(
      (a) =>
        a.type === "ArrowFunctionExpression" || a.type === "FunctionExpression",
    )
    .at(-1);
  return __fn ? __b.generateCode(__fn) : null;
};
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

## 16

### --description--

Now create the user. **Never store a plain-text password** - hash it first. `bcrypt.hash(password, saltRounds)` returns a promise of the hash:

```js
const passwordHash = await bcrypt.hash(password, 10);
```

In the `/register` handler, hash the password, then build a new user object with:

- `id` - a unique id from `randomUUID()`
- `email`
- `passwordHash`
- `role` - `"user"`

Push the new user onto the array from `readUsers()` and persist it with `writeUsers()`.

Import `bcrypt` from `bcryptjs`, `randomUUID` from `crypto`, and `readUsers` and `writeUsers` from `../utils/db.js`.

### --tests--

The `/register` handler should hash the password and persist a new user with `role` `"user"` and no plain-text password.

```js
const __src = __handlerSrc("post", "/register");
assert.exists(__src, 'Define the POST "/register" handler.');

let __saved = null;
const findByEmail = () => null;
const readUsers = () => [];
const writeUsers = (users) => {
  __saved = users;
};
const signToken = () => "signed.jwt.token";
const bcrypt = { hash: async () => "HASHED_PW", compare: async () => true };
const randomUUID = () => "uuid-1";
const register = eval(`(${__src})`);

await register(
  { body: { email: "new@user.com", password: "secret123" } },
  __mockRes(),
);
assert.isArray(
  __saved,
  "The handler should call writeUsers with the users array.",
);
const __user = __saved.at(-1);
assert.exists(__user, "A new user should be added to the array.");
assert.equal(__user.email, "new@user.com", "Store the submitted email.");
assert.equal(
  __user.passwordHash,
  "HASHED_PW",
  "Store the bcrypt hash, not the plain password.",
);
assert.notProperty(__user, "password", "Do not store the plain-text password.");
assert.equal(__user.role, "user", 'New users should have the role "user".');
```

### --before-each--

```js
const __file = await __helpers.getFile(project.dashedName, "routes/auth.js");
const __b = new __helpers.Babeliser(__file);
const __route = (method, path) =>
  __b
    .getType("CallExpression")
    .find(
      (c) =>
        c.callee?.property?.name === method && c.arguments?.[0]?.value === path,
    );
const __handlerSrc = (method, path) => {
  const __fn = __route(method, path)
    ?.arguments?.filter(
      (a) =>
        a.type === "ArrowFunctionExpression" || a.type === "FunctionExpression",
    )
    .at(-1);
  return __fn ? __b.generateCode(__fn) : null;
};
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
  role: "user",
};
users.push(newUser);
writeUsers(users);
```

## 17

### --description--

Once the user is saved, issue a token so they are logged in immediately after registering.

Import `signToken` from `../utils/jwt.js`. Sign a token whose payload contains the new user's `id`, `email`, and `role`, then respond with status `201` and a JSON body containing a `message` and the `token`.

### --tests--

A successful registration should respond with status `201` and the signed token.

```js
const __src = __handlerSrc("post", "/register");
assert.exists(__src, 'Define the POST "/register" handler.');

const findByEmail = () => null;
const readUsers = () => [];
const writeUsers = () => {};
const signToken = () => "signed.jwt.token";
const bcrypt = { hash: async () => "HASHED_PW", compare: async () => true };
const randomUUID = () => "uuid-1";
const register = eval(`(${__src})`);

const __res = __mockRes();
await register(
  { body: { email: "new@user.com", password: "secret123" } },
  __res,
);
assert.equal(
  __res.statusCode,
  201,
  "A successful registration should respond with 201.",
);
assert.equal(
  __res.body?.token,
  "signed.jwt.token",
  "The response should include the signed token.",
);
```

### --before-each--

```js
const __file = await __helpers.getFile(project.dashedName, "routes/auth.js");
const __b = new __helpers.Babeliser(__file);
const __route = (method, path) =>
  __b
    .getType("CallExpression")
    .find(
      (c) =>
        c.callee?.property?.name === method && c.arguments?.[0]?.value === path,
    );
const __handlerSrc = (method, path) => {
  const __fn = __route(method, path)
    ?.arguments?.filter(
      (a) =>
        a.type === "ArrowFunctionExpression" || a.type === "FunctionExpression",
    )
    .at(-1);
  return __fn ? __b.generateCode(__fn) : null;
};
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

## 18

### --description--

Add a `POST /login` route. Like `/register`, make the handler `async`.

Read `email` and `password` from `req.body`, and respond with status `400` if either is missing.

Then look up the user with `findByEmail(email)`. If no user is found, respond with status `401` and a JSON message such as `"Invalid credentials"`.

> **NOTE:** Use the same generic `"Invalid credentials"` message whether the email or the password is wrong, so an attacker cannot tell which emails are registered.

### --tests--

`POST /login` should be an `async` route handler.

```js
const __r = __route("post", "/login");
assert.exists(__r, 'Define a router.post("/login", ...) route.');
const __fns = __r.arguments.filter(
  (a) =>
    a.type === "ArrowFunctionExpression" || a.type === "FunctionExpression",
);
assert.isTrue(__fns.at(-1)?.async === true, "Make the /login handler async.");
```

The `/login` handler should respond with `400` for a missing field and `401` for an unknown user.

```js
const __src = __handlerSrc("post", "/login");
assert.exists(__src, 'Define the POST "/login" handler.');

let __account = null;
const findByEmail = () => __account;
const signToken = () => "login.token";
const bcrypt = { hash: async () => "H", compare: async () => true };
const login = eval(`(${__src})`);

const __missing = __mockRes();
await login({ body: {} }, __missing);
assert.equal(
  __missing.statusCode,
  400,
  "A missing email or password should respond with status 400.",
);

const __unknown = __mockRes();
await login(
  { body: { email: "ghost@nope.com", password: "secret123" } },
  __unknown,
);
assert.equal(
  __unknown.statusCode,
  401,
  "An unknown user should respond with status 401.",
);
```

### --before-each--

```js
const __file = await __helpers.getFile(project.dashedName, "routes/auth.js");
const __b = new __helpers.Babeliser(__file);
const __route = (method, path) =>
  __b
    .getType("CallExpression")
    .find(
      (c) =>
        c.callee?.property?.name === method && c.arguments?.[0]?.value === path,
    );
const __handlerSrc = (method, path) => {
  const __fn = __route(method, path)
    ?.arguments?.filter(
      (a) =>
        a.type === "ArrowFunctionExpression" || a.type === "FunctionExpression",
    )
    .at(-1);
  return __fn ? __b.generateCode(__fn) : null;
};
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
```

## 19

### --description--

Now verify the password. `bcrypt.compare(plainText, hash)` returns a promise that resolves to `true` when they match:

```js
const match = await bcrypt.compare(password, user.passwordHash);
```

In the `/login` handler, compare the submitted `password` with the stored `user.passwordHash`. If they do not match, respond with status `401`.

When they match, sign a token containing the user's `id`, `email`, and `role`, then respond with a JSON body containing a `message` and the `token`.

### --tests--

A wrong password should respond with `401`, and a correct password should respond with the signed token and `200`.

```js
const __src = __handlerSrc("post", "/login");
assert.exists(__src, 'Define the POST "/login" handler.');

const __account = {
  id: "1",
  email: "a@b.com",
  role: "user",
  passwordHash: "stored-hash",
};
let __passwordMatches = true;
const findByEmail = () => __account;
const signToken = () => "login.token";
const bcrypt = {
  hash: async () => "H",
  compare: async () => __passwordMatches,
};
const login = eval(`(${__src})`);

__passwordMatches = false;
const __wrong = __mockRes();
await login({ body: { email: "a@b.com", password: "wrong" } }, __wrong);
assert.equal(
  __wrong.statusCode,
  401,
  "A password that does not match should respond with status 401.",
);

__passwordMatches = true;
const __ok = __mockRes();
await login({ body: { email: "a@b.com", password: "right" } }, __ok);
assert.equal(
  __ok.body?.token,
  "login.token",
  "A successful login should respond with the signed token.",
);
assert.equal(
  __ok.statusCode,
  200,
  "A successful login should respond with status 200.",
);
```

### --before-each--

```js
const __file = await __helpers.getFile(project.dashedName, "routes/auth.js");
const __b = new __helpers.Babeliser(__file);
const __route = (method, path) =>
  __b
    .getType("CallExpression")
    .find(
      (c) =>
        c.callee?.property?.name === method && c.arguments?.[0]?.value === path,
    );
const __handlerSrc = (method, path) => {
  const __fn = __route(method, path)
    ?.arguments?.filter(
      (a) =>
        a.type === "ArrowFunctionExpression" || a.type === "FunctionExpression",
    )
    .at(-1);
  return __fn ? __b.generateCode(__fn) : null;
};
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

## 20

### --description--

The auth router is ready to mount. A router is mounted on the app just like middleware, with an optional base path:

```js
app.use("/base/path", router);
```

In `index.js`, import the default export of `./routes/auth.js` as `authRoutes`, then mount it at the `/api/auth` path so the routes become `POST /api/auth/register` and `POST /api/auth/login`.

### --tests--

`index.js` should import the default export of `./routes/auth.js`.

```js
const __local = __b
  .getImportDeclarations()
  .find((i) => i.source.value === "./routes/auth.js")
  ?.specifiers.find((s) => s.type === "ImportDefaultSpecifier")?.local.name;
assert.exists(__local, 'Import the default export of "./routes/auth.js".');
```

`index.js` should mount the auth router at the `/api/auth` path with `app.use`.

```js
const __local = __b
  .getImportDeclarations()
  .find((i) => i.source.value === "./routes/auth.js")
  ?.specifiers.find((s) => s.type === "ImportDefaultSpecifier")?.local.name;
const __mount = __b
  .getType("CallExpression")
  .find(
    (c) =>
      c.callee?.property?.name === "use" &&
      c.callee?.object?.name === "app" &&
      c.arguments?.[0]?.value === "/api/auth",
  );
assert.exists(__mount, 'Mount the router at "/api/auth" with app.use.');
assert.equal(
  __mount.arguments?.[1]?.name,
  __local,
  "Pass the imported auth router to app.use.",
);
```

### --before-each--

```js
const __file = await __helpers.getFile(project.dashedName, "index.js");
const __b = new __helpers.Babeliser(__file);
```

## 21

### --description--

Protected routes need a way to identify the caller. Create a `middleware/authenticate.js` file in the project directory.

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

## 22

### --description--

Clients send their token in the `Authorization` header using the `Bearer` scheme:

```
Authorization: Bearer <token>
```

In `middleware/authenticate.js`, default-export a middleware function `authenticate(req, res, next)`. Read `req.headers.authorization`. If it is missing or does not start with `"Bearer "`, respond with status `401` and a JSON message such as `"No token provided"`. Otherwise, extract the token by splitting the header on the space and taking the second part.

### --tests--

`authenticate` should be the default export and respond with `401` when there is no valid `Bearer` token.

```js
const __src = __authenticateSrc();
assert.isString(
  __src,
  "middleware/authenticate.js should define an authenticate function.",
);
const __def = __b.getType("ExportDefaultDeclaration")[0];
assert.isTrue(
  __def != null &&
    (__def.declaration?.id?.name === "authenticate" ||
      __b.generateCode(__def.declaration) === "authenticate"),
  "Export authenticate as the default export.",
);

const verifyToken = () => ({ id: "u1", role: "user" });
const isBlacklisted = () => false;
const authenticate = eval(`(${__src})`);

const __noHeader = __mockRes();
let __next1 = false;
authenticate({ headers: {} }, __noHeader, () => (__next1 = true));
assert.equal(
  __noHeader.statusCode,
  401,
  "A request with no Authorization header should respond with 401.",
);
assert.isFalse(__next1, "next() should not be called when there is no token.");

const __badScheme = __mockRes();
let __next2 = false;
authenticate(
  { headers: { authorization: "Basic abc" } },
  __badScheme,
  () => (__next2 = true),
);
assert.equal(
  __badScheme.statusCode,
  401,
  'A header that is not "Bearer ..." should respond with 401.',
);
```

### --before-each--

```js
const __file = await __helpers.getFile(
  project.dashedName,
  "middleware/authenticate.js",
);
const __b = new __helpers.Babeliser(__file);
const __authenticateSrc = () => {
  const __fn = __b
    .getFunctionDeclarations()
    .find((f) => f.id?.name === "authenticate");
  return __fn ? __b.generateCode(__fn) : null;
};
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

## 23

### --description--

Now verify the extracted token. Import `verifyToken` from `../utils/jwt.js`.

In `authenticate`, pass the token to `verifyToken`. If it returns a falsy value, the token is invalid or expired - respond with status `401` and a JSON message such as `"Invalid or expired token"`. Otherwise, attach the decoded payload to `req.user` and call `next()` to continue to the route handler.

### --tests--

`authenticate` should import `verifyToken` from `../utils/jwt.js`.

```js
assert.isTrue(
  __b
    .getImportDeclarations()
    .some(
      (i) =>
        i.source.value === "../utils/jwt.js" &&
        i.specifiers.some(
          (s) => (s.imported?.name ?? s.local.name) === "verifyToken",
        ),
    ),
  "Import verifyToken from ../utils/jwt.js.",
);
```

A valid token should set `req.user` and call `next()`; an invalid token should respond with `401`.

```js
const __src = __authenticateSrc();
assert.isString(__src, "Define the authenticate function.");

const verifyToken = (t) =>
  t === "good-token" ? { id: "u1", role: "user" } : null;
const isBlacklisted = () => false;
const authenticate = eval(`(${__src})`);

const __req = { headers: { authorization: "Bearer good-token" } };
const __res = __mockRes();
let __nextCalled = false;
authenticate(__req, __res, () => (__nextCalled = true));
assert.isTrue(__nextCalled, "A valid token should call next().");
assert.equal(
  __req.user?.id,
  "u1",
  "authenticate should set req.user to the decoded payload.",
);

const __res2 = __mockRes();
let __nextCalled2 = false;
authenticate(
  { headers: { authorization: "Bearer bad-token" } },
  __res2,
  () => (__nextCalled2 = true),
);
assert.equal(
  __res2.statusCode,
  401,
  "An invalid token should respond with 401.",
);
assert.isFalse(
  __nextCalled2,
  "next() should not be called for an invalid token.",
);
```

### --before-each--

```js
const __file = await __helpers.getFile(
  project.dashedName,
  "middleware/authenticate.js",
);
const __b = new __helpers.Babeliser(__file);
const __authenticateSrc = () => {
  const __fn = __b
    .getFunctionDeclarations()
    .find((f) => f.id?.name === "authenticate");
  return __fn ? __b.generateCode(__fn) : null;
};
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

## 24

### --description--

You can protect a route by passing middleware as an argument before the handler. Express runs them in order, so `authenticate` runs first and only calls the handler if the token is valid:

```js
router.get("/path", authenticate, (req, res) => {});
```

In `routes/auth.js`, import the default export of `../middleware/authenticate.js` as `authenticate`. Add a protected `GET /profile` route that responds with a JSON body of `{ user: req.user }`.

### --tests--

`routes/auth.js` should define a `GET /profile` route protected by the `authenticate` middleware.

```js
const __authLocal = __b
  .getImportDeclarations()
  .find((i) => i.source.value === "../middleware/authenticate.js")
  ?.specifiers.find((s) => s.type === "ImportDefaultSpecifier")?.local.name;
assert.exists(
  __authLocal,
  "Import authenticate from ../middleware/authenticate.js.",
);
const __r = __route("get", "/profile");
assert.exists(__r, 'Define a router.get("/profile", ...) route.');
assert.isTrue(
  __r.arguments.some((a) => a.type === "Identifier" && a.name === __authLocal),
  "Protect /profile with the authenticate middleware.",
);
```

The `/profile` handler should respond with `{ user: req.user }`.

```js
const __src = __handlerSrc("get", "/profile");
assert.exists(__src, 'Define the GET "/profile" handler.');
const profile = eval(`(${__src})`);
const __req = { user: { id: "u1", email: "a@b.com", role: "user" } };
const __res = __mockRes();
await profile(__req, __res);
assert.deepEqual(
  __res.body?.user,
  __req.user,
  "The /profile handler should respond with { user: req.user }.",
);
```

### --before-each--

```js
const __file = await __helpers.getFile(project.dashedName, "routes/auth.js");
const __b = new __helpers.Babeliser(__file);
const __route = (method, path) =>
  __b
    .getType("CallExpression")
    .find(
      (c) =>
        c.callee?.property?.name === method && c.arguments?.[0]?.value === path,
    );
const __handlerSrc = (method, path) => {
  const __fn = __route(method, path)
    ?.arguments?.filter(
      (a) =>
        a.type === "ArrowFunctionExpression" || a.type === "FunctionExpression",
    )
    .at(-1);
  return __fn ? __b.generateCode(__fn) : null;
};
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
```

## 25

### --description--

JWTs are stateless, so the server cannot "delete" a token to log a user out. Instead, you keep a list of invalidated tokens and reject any token on that list.

Create a `utils/token-blacklist.js` file in the project directory.

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

## 26

### --description--

In `utils/token-blacklist.js`, declare a module-level `const blacklist = new Set()`, then export two functions:

- `blacklistToken(token)` - adds the token to the set.
- `isBlacklisted(token)` - returns whether the token is in the set.

### --tests--

`blacklistToken` and `isBlacklisted` should track invalidated tokens.

```js
const { join } = await import("path");
const { blacklistToken, isBlacklisted } = await __helpers.importSansCache(
  join(project.dashedName, "utils/token-blacklist.js"),
);
assert.isFunction(blacklistToken, "Export a blacklistToken function.");
assert.isFunction(isBlacklisted, "Export an isBlacklisted function.");
assert.isFalse(
  isBlacklisted("token-a"),
  "A token that was never blacklisted should not be blacklisted.",
);
blacklistToken("token-a");
assert.isTrue(
  isBlacklisted("token-a"),
  "After blacklisting, isBlacklisted should return true for that token.",
);
assert.isFalse(
  isBlacklisted("token-b"),
  "Unrelated tokens should remain valid.",
);
```

## 27

### --description--

Wire the blacklist into your authentication check. In `middleware/authenticate.js`, import `isBlacklisted` from `../utils/token-blacklist.js`.

After extracting the token but before verifying it, check `isBlacklisted(token)`. If the token has been blacklisted, respond with status `401` and a JSON message such as `"Token has been invalidated. Log in again."`.

### --tests--

`authenticate` should import `isBlacklisted` from `../utils/token-blacklist.js`.

```js
assert.isTrue(
  __b
    .getImportDeclarations()
    .some(
      (i) =>
        i.source.value === "../utils/token-blacklist.js" &&
        i.specifiers.some(
          (s) => (s.imported?.name ?? s.local.name) === "isBlacklisted",
        ),
    ),
  "Import isBlacklisted from ../utils/token-blacklist.js.",
);
```

A blacklisted token should be rejected with status `401`, even though it is otherwise valid.

```js
const __src = __authenticateSrc();
assert.isString(__src, "Define the authenticate function.");

const verifyToken = () => ({ id: "u1", role: "user" });
const isBlacklisted = (t) => t === "revoked-token";
const authenticate = eval(`(${__src})`);

const __res = __mockRes();
let __nextCalled = false;
authenticate(
  { headers: { authorization: "Bearer revoked-token" } },
  __res,
  () => (__nextCalled = true),
);
assert.equal(
  __res.statusCode,
  401,
  "A blacklisted token should respond with 401.",
);
assert.isFalse(
  __nextCalled,
  "next() should not be called for a blacklisted token.",
);
```

### --before-each--

```js
const __file = await __helpers.getFile(
  project.dashedName,
  "middleware/authenticate.js",
);
const __b = new __helpers.Babeliser(__file);
const __authenticateSrc = () => {
  const __fn = __b
    .getFunctionDeclarations()
    .find((f) => f.id?.name === "authenticate");
  return __fn ? __b.generateCode(__fn) : null;
};
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
```

## 28

### --description--

Add a protected `POST /logout` route to `routes/auth.js`. Import `blacklistToken` from `../utils/token-blacklist.js`.

Protect the route with `authenticate`. In the handler, read the token from the `Authorization` header (split on the space and take the second part), pass it to `blacklistToken`, and respond with a JSON message (for example `"Logged out successfully"`).

### --tests--

`routes/auth.js` should define a `POST /logout` route protected by the `authenticate` middleware.

```js
const __authLocal = __b
  .getImportDeclarations()
  .find((i) => i.source.value === "../middleware/authenticate.js")
  ?.specifiers.find((s) => s.type === "ImportDefaultSpecifier")?.local.name;
const __r = __route("post", "/logout");
assert.exists(__r, 'Define a router.post("/logout", ...) route.');
assert.isTrue(
  __r.arguments.some((a) => a.type === "Identifier" && a.name === __authLocal),
  "Protect /logout with the authenticate middleware.",
);
```

The `/logout` handler should blacklist the token from the request's `Authorization` header.

```js
const __src = __handlerSrc("post", "/logout");
assert.exists(__src, 'Define the POST "/logout" handler.');

let __blacklisted = null;
const blacklistToken = (t) => {
  __blacklisted = t;
};
const logout = eval(`(${__src})`);

const __res = __mockRes();
await logout(
  { headers: { authorization: "Bearer the-token" }, user: { id: "u1" } },
  __res,
);
assert.equal(
  __blacklisted,
  "the-token",
  "Logout should pass the request's token to blacklistToken.",
);
```

### --before-each--

```js
const __file = await __helpers.getFile(project.dashedName, "routes/auth.js");
const __b = new __helpers.Babeliser(__file);
const __route = (method, path) =>
  __b
    .getType("CallExpression")
    .find(
      (c) =>
        c.callee?.property?.name === method && c.arguments?.[0]?.value === path,
    );
const __handlerSrc = (method, path) => {
  const __fn = __route(method, path)
    ?.arguments?.filter(
      (a) =>
        a.type === "ArrowFunctionExpression" || a.type === "FunctionExpression",
    )
    .at(-1);
  return __fn ? __b.generateCode(__fn) : null;
};
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

## 29

### --description--

Authentication proves _who_ a user is; <dfn title="deciding whether an authenticated user is allowed to perform an action, often based on their role">authorization</dfn> decides _what_ they are allowed to do.

Create a `middleware/authorize.js` file in the project directory.

### --tests--

A `middleware/authorize.js` file should exist in the project directory.

```js
const __exists = await __helpers.fileExists(
  `${project.dashedName}/middleware/authorize.js`,
);
assert.isTrue(
  __exists,
  "middleware/authorize.js does not exist - create the file first.",
);
```

## 30

### --description--

In `middleware/authorize.js`, default-export a function `authorizeRole(role)` that **returns** a middleware function. This pattern - a function that returns middleware - lets you configure the middleware per route, e.g. `authorizeRole("admin")`.

```js
export default function requireSomething(value) {
  return (req, res, next) => {};
}
```

The returned middleware should respond with status `403` and a JSON message such as `"Access denied"` when there is no `req.user` or the user's `role` does not match `role`. Otherwise it should call `next()`.

### --tests--

`authorizeRole(role)` should return a middleware function.

```js
const { join } = await import("path");
const { default: authorizeRole } = await __helpers.importSansCache(
  join(project.dashedName, "middleware/authorize.js"),
);
assert.isFunction(
  authorizeRole,
  "authorize.js should default-export the authorizeRole function.",
);
assert.isFunction(
  authorizeRole("admin"),
  "authorizeRole(role) should return a middleware function.",
);
```

The returned middleware should reject a mismatched role with `403` and call `next()` when the role matches.

```js
const { join } = await import("path");
const __mockRes = () => {
  const r = { statusCode: 200, send: () => {} };
  r.status = (c) => ((r.statusCode = c), r);
  r.json = (b) => ((r.body = b), r);
  return r;
};
const { default: authorizeRole } = await __helpers.importSansCache(
  join(project.dashedName, "middleware/authorize.js"),
);
const __mw = authorizeRole("admin");

const __denied = __mockRes();
let __next1 = false;
__mw({ user: { role: "user" } }, __denied, () => (__next1 = true));
assert.equal(
  __denied.statusCode,
  403,
  "A user whose role does not match should get 403.",
);
assert.isFalse(__next1, "next() should not be called on a role mismatch.");

const __allowed = __mockRes();
let __next2 = false;
__mw({ user: { role: "admin" } }, __allowed, () => (__next2 = true));
assert.isTrue(__next2, "next() should be called when the role matches.");

const __noUser = __mockRes();
let __next3 = false;
__mw({}, __noUser, () => (__next3 = true));
assert.equal(
  __noUser.statusCode,
  403,
  "A request with no req.user should get 403.",
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

## 31

### --description--

Create a `routes/admin.js` file in the project directory for admin-only routes.

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

## 32

### --description--

You can stack middleware on a single route - Express runs them left to right:

```js
router.get("/path", first, second, handler);
```

In `routes/admin.js`:

- Import `express`, `authenticate` from `../middleware/authenticate.js`, `authorizeRole` from `../middleware/authorize.js`, and `readUsers` from `../utils/db.js`.
- Create a `router` with `express.Router()` and export it as the default export.
- Add a `GET /users` route guarded by both `authenticate` and `authorizeRole("admin")`. The handler should map over `readUsers()` to **strip the `passwordHash`** from every user, then respond with `{ users }`.

### --hints--

#### 0

To remove a property while keeping the rest, destructure it out:

```js
readUsers().map(({ passwordHash, ...user }) => user);
```

### --tests--

`routes/admin.js` should define `GET /users` guarded by `authenticate` and `authorizeRole("admin")`, and export the router.

```js
const __authLocal = __b
  .getImportDeclarations()
  .find((i) => i.source.value === "../middleware/authenticate.js")
  ?.specifiers.find((s) => s.type === "ImportDefaultSpecifier")?.local.name;
const __roleLocal = __b
  .getImportDeclarations()
  .find((i) => i.source.value === "../middleware/authorize.js")
  ?.specifiers.find((s) => s.type === "ImportDefaultSpecifier")?.local.name;
assert.exists(
  __authLocal,
  "Import authenticate from ../middleware/authenticate.js.",
);
assert.exists(
  __roleLocal,
  "Import authorizeRole from ../middleware/authorize.js.",
);
const __r = __route("get", "/users");
assert.exists(__r, 'Define a router.get("/users", ...) route.');
assert.isTrue(
  __r.arguments.some((a) => a.type === "Identifier" && a.name === __authLocal),
  "Guard /users with the authenticate middleware.",
);
assert.isTrue(
  __r.arguments.some(
    (a) =>
      a.type === "CallExpression" &&
      __b.generateCode(a.callee) === __roleLocal &&
      a.arguments?.[0]?.value === "admin",
  ),
  'Guard /users with authorizeRole("admin").',
);
const __def = __b.getType("ExportDefaultDeclaration")[0];
assert.exists(__def, "Export the router as the default export.");
```

The `/users` handler should respond with `{ users }`, stripping `passwordHash` from every user.

```js
const __src = __handlerSrc("get", "/users");
assert.exists(__src, 'Define the GET "/users" handler.');

const readUsers = () => [
  { id: "1", email: "a@b.com", role: "user", passwordHash: "SECRET_HASH" },
];
const listUsers = eval(`(${__src})`);

const __res = __mockRes();
await listUsers({ user: { role: "admin" } }, __res);
assert.isArray(__res.body?.users, "Respond with a { users } array.");
assert.equal(
  __res.body.users[0].email,
  "a@b.com",
  "Keep the safe user fields like email.",
);
assert.notProperty(
  __res.body.users[0],
  "passwordHash",
  "Strip passwordHash from every user in the response.",
);
```

### --before-each--

```js
const __file = await __helpers.getFile(project.dashedName, "routes/admin.js");
const __b = new __helpers.Babeliser(__file);
const __route = (method, path) =>
  __b
    .getType("CallExpression")
    .find(
      (c) =>
        c.callee?.property?.name === method && c.arguments?.[0]?.value === path,
    );
const __handlerSrc = (method, path) => {
  const __fn = __route(method, path)
    ?.arguments?.filter(
      (a) =>
        a.type === "ArrowFunctionExpression" || a.type === "FunctionExpression",
    )
    .at(-1);
  return __fn ? __b.generateCode(__fn) : null;
};
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
```

## 33

### --description--

Mount the admin router. In `index.js`, import the default export of `./routes/admin.js` as `adminRoutes` and mount it at the `/api/admin` path, so the route becomes `GET /api/admin/users`.

### --tests--

`index.js` should import the default export of `./routes/admin.js`.

```js
const __local = __b
  .getImportDeclarations()
  .find((i) => i.source.value === "./routes/admin.js")
  ?.specifiers.find((s) => s.type === "ImportDefaultSpecifier")?.local.name;
assert.exists(__local, 'Import the default export of "./routes/admin.js".');
```

`index.js` should mount the admin router at the `/api/admin` path with `app.use`.

```js
const __local = __b
  .getImportDeclarations()
  .find((i) => i.source.value === "./routes/admin.js")
  ?.specifiers.find((s) => s.type === "ImportDefaultSpecifier")?.local.name;
const __mount = __b
  .getType("CallExpression")
  .find(
    (c) =>
      c.callee?.property?.name === "use" &&
      c.callee?.object?.name === "app" &&
      c.arguments?.[0]?.value === "/api/admin",
  );
assert.exists(__mount, 'Mount the router at "/api/admin" with app.use.');
assert.equal(
  __mount.arguments?.[1]?.name,
  __local,
  "Pass the imported admin router to app.use.",
);
```

### --before-each--

```js
const __file = await __helpers.getFile(project.dashedName, "index.js");
const __b = new __helpers.Babeliser(__file);
```

## 34

### --description--

Express v5 automatically forwards errors thrown inside `async` route handlers to the next error-handling middleware - no `try`/`catch` is needed in the route handlers themselves.

Add an Express error handler to `index.js` **after** all route mounts that responds with the error status or `500`, and the error message as `{ "error": err.message }`.

### --tests--

`index.js` should register an error-handling middleware with `app.use`.

```js
const __errHandler = __b
  .getType("CallExpression")
  .filter(
    (c) =>
      c.callee?.property?.name === "use" && c.callee?.object?.name === "app",
  )
  .find((c) => {
    const __fn = c.arguments?.find(
      (a) =>
        a.type === "ArrowFunctionExpression" || a.type === "FunctionExpression",
    );
    return __fn?.params?.length === 4;
  });
assert.exists(
  __errHandler,
  "Add an error-handling middleware to index.js with app.use((err, req, res, next) => {...}).",
);
```

The error middleware should respond with status `500` and a JSON `{ "error": err.message }`.

```js
const __errHandler = __b
  .getType("CallExpression")
  .filter(
    (c) =>
      c.callee?.property?.name === "use" && c.callee?.object?.name === "app",
  )
  .find((c) => {
    const __fn = c.arguments?.find(
      (a) =>
        a.type === "ArrowFunctionExpression" || a.type === "FunctionExpression",
    );
    return __fn?.params?.length === 4;
  });
assert.exists(
  __errHandler,
  "Register an Express error middleware function with four parameters.",
);
const __fn = __errHandler?.arguments?.find(
  (a) =>
    a.type === "ArrowFunctionExpression" || a.type === "FunctionExpression",
);
assert.exists(__fn, "Register an Express error middleware function.");
const __fnSrc = __b.generateCode(__fn);
const __mockRes = () => {
  const r = { statusCode: 200, send: () => {} };
  r.status = (c) => ((r.statusCode = c), r);
  r.json = (b) => ((r.body = b), r);
  return r;
};
const errHandler = eval(`(${__fnSrc})`);
const __res = __mockRes();
errHandler(new Error("test error"), {}, __res, () => {});
assert.equal(
  __res.statusCode,
  500,
  "The error middleware should respond with status 500.",
);
assert.equal(
  __res.body?.error,
  "test error",
  "The error middleware should include the error message in the response.",
);
```

### --before-each--

```js
const __file = await __helpers.getFile(project.dashedName, "index.js");
const __b = new __helpers.Babeliser(__file);
```

### --hints--

#### 1

The four-parameter signature `(err, req, res, next)` is what Express uses to identify error-handling middleware. A regular middleware with three parameters would not receive errors.

#### 2

```js
app.use((err, req, res, next) => {
  res.status(err.status ?? 500).json({ message: err.message });
});
```

## 35

```json
{ "watch": [] }
```

### --description--

Your authentication API is complete. The `"start"` script loads `.env` with `node --env-file .env`, so `PORT` and `JWT_SECRET` are available. Start the server:

```bash
npm start
```

**NOTE:** Keep the server running, then click _Run Tests_. The tests exercise the full flow against `http://localhost:8800`:

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
const __secret = Object.fromEntries(
  __env
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith("#"))
    .map((l) => {
      const __i = l.indexOf("=");
      return [l.slice(0, __i).trim(), l.slice(__i + 1).trim()];
    }),
).JWT_SECRET;
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
const __url = "http://localhost:8800/";
```

### --hints--

#### 1

The `start` script already runs `node --env-file .env index.js`, which loads both `PORT` and `JWT_SECRET`. If the server crashes on boot, check that `.env` has a `JWT_SECRET` and that every file you created exports what `index.js` and the routes import.

#### 2

If a request hangs or returns `500`, read the server logs in the terminal. A common cause is `data/users.json` not containing a valid JSON array.

## --fcc-end--
