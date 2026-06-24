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

- `bcryptjs` - to hash and compare passwords.
- `jsonwebtoken` - to issue and validate tokens.

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
const __b = new __helpers.Babeliser(__file);
const __sources = __b.getImportDeclarations().map((i) => i.source.value);
assert.include(__sources, "fs", 'Import the "fs" module.');
assert.include(__sources, "path", 'Import the "path" module.');
```

`utils/db.js` should build a path to `../data/users.json` using `path.join` and `import.meta.dirname`.

```js
const __file = await __helpers.getFile(project.dashedName, "utils/db.js");
const __b = new __helpers.Babeliser(__file);
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
const __fn = __b
  .getFunctionDeclarations()
  .find((f) => f.id?.name === "readUsers");
assert.exists(__fn, "Export a function named readUsers.");
assert.lengthOf(__fn.params, 0, "readUsers should take no parameters.");
assert.isTrue(
  __b
    .getType("ExportNamedDeclaration")
    .some((e) => e.declaration?.id?.name === "readUsers"),
  "readUsers should be exported.",
);
```

`readUsers` should read the file synchronously with `fs.readFileSync`.

```js
const __fs = __b
  .getImportDeclarations()
  .find((i) => i.source.value === "fs")
  ?.specifiers.find((s) => s.type === "ImportDefaultSpecifier")?.local.name;
assert.isTrue(
  __b
    .getType("CallExpression")
    .some((c) => __b.generateCode(c.callee).includes(`${__fs}.readFileSync`)),
  "readUsers should call fs.readFileSync(...).",
);
```

`readUsers` should parse the JSON, returning an empty array when the file is empty.

```js
assert.isTrue(
  __b
    .getType("CallExpression")
    .some((c) => __b.generateCode(c.callee) === "JSON.parse"),
  "Parse the file contents with JSON.parse.",
);
assert.isTrue(
  __b.getType("ArrayExpression").some((a) => a.elements.length === 0),
  "Return an empty array when the file has no data.",
);
```

### --before-each--

```js
const __file = await __helpers.getFile(project.dashedName, "utils/db.js");
const __b = new __helpers.Babeliser(__file);
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

`utils/db.js` should export a `writeUsers` function that accepts one argument.

```js
const __fn = __b
  .getFunctionDeclarations()
  .find((f) => f.id?.name === "writeUsers");
assert.exists(__fn, "Export a function named writeUsers.");
assert.lengthOf(__fn.params, 1, "writeUsers should accept the users array.");
assert.isTrue(
  __b
    .getType("ExportNamedDeclaration")
    .some((e) => e.declaration?.id?.name === "writeUsers"),
  "writeUsers should be exported.",
);
```

`writeUsers` should serialise the users with `JSON.stringify` and write them with `fs.writeFileSync`.

```js
const __fs = __b
  .getImportDeclarations()
  .find((i) => i.source.value === "fs")
  ?.specifiers.find((s) => s.type === "ImportDefaultSpecifier")?.local.name;
assert.isTrue(
  __b
    .getType("CallExpression")
    .some((c) => __b.generateCode(c.callee) === `${__fs}.writeFileSync`),
  "writeUsers should call fs.writeFileSync(...).",
);
assert.isTrue(
  __b
    .getType("CallExpression")
    .some((c) => __b.generateCode(c.callee) === "JSON.stringify"),
  "Serialise the users with JSON.stringify before writing.",
);
```

### --before-each--

```js
const __file = await __helpers.getFile(project.dashedName, "utils/db.js");
const __b = new __helpers.Babeliser(__file);
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

`utils/db.js` should export a `findByEmail` function that accepts one argument.

```js
const __fn = __b
  .getFunctionDeclarations()
  .find((f) => f.id?.name === "findByEmail");
assert.exists(__fn, "Export a function named findByEmail.");
assert.lengthOf(__fn.params, 1, "findByEmail should accept an email argument.");
assert.isTrue(
  __b
    .getType("ExportNamedDeclaration")
    .some((e) => e.declaration?.id?.name === "findByEmail"),
  "findByEmail should be exported.",
);
```

`utils/db.js` should export a `findById` function that accepts one argument.

```js
const __fn = __b
  .getFunctionDeclarations()
  .find((f) => f.id?.name === "findById");
assert.exists(__fn, "Export a function named findById.");
assert.lengthOf(__fn.params, 1, "findById should accept an id argument.");
assert.isTrue(
  __b
    .getType("ExportNamedDeclaration")
    .some((e) => e.declaration?.id?.name === "findById"),
  "findById should be exported.",
);
```

Both lookups should use `.find` and fall back to `null` when no user matches.

```js
assert.isTrue(
  __b
    .getType("CallExpression")
    .some((c) => c.callee?.property?.name === "find"),
  "Use Array.prototype.find to locate the user.",
);
const __nullFallbacks = __b
  .getType("LogicalExpression")
  .filter((e) => e.operator === "||" && e.right?.type === "NullLiteral");
assert.isAtLeast(
  __nullFallbacks.length,
  2,
  "Both lookups should fall back to null when no user matches.",
);
```

### --before-each--

```js
const __file = await __helpers.getFile(project.dashedName, "utils/db.js");
const __b = new __helpers.Babeliser(__file);
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

`utils/jwt.js` should import `jsonwebtoken` and export a `signToken` function.

```js
const __file = await __helpers.getFile(project.dashedName, "utils/jwt.js");
const __b = new __helpers.Babeliser(__file);
const __jwt = __b
  .getImportDeclarations()
  .find((i) => i.source.value === "jsonwebtoken")
  ?.specifiers.find((s) => s.type === "ImportDefaultSpecifier")?.local.name;
assert.exists(__jwt, 'Import the default export of "jsonwebtoken".');
assert.exists(
  __b.getFunctionDeclarations().find((f) => f.id?.name === "signToken"),
  "Export a signToken(payload) function.",
);
assert.isTrue(
  __b
    .getType("ExportNamedDeclaration")
    .some((e) => e.declaration?.id?.name === "signToken"),
  "signToken should be exported.",
);
```

`signToken` should call `jwt.sign` with the secret and an `expiresIn` option.

```js
const __file = await __helpers.getFile(project.dashedName, "utils/jwt.js");
const __b = new __helpers.Babeliser(__file);
const __jwt = __b
  .getImportDeclarations()
  .find((i) => i.source.value === "jsonwebtoken")
  ?.specifiers.find((s) => s.type === "ImportDefaultSpecifier")?.local.name;
const __sign = __b
  .getType("CallExpression")
  .find((c) => __b.generateCode(c.callee) === `${__jwt}.sign`);
assert.exists(__sign, "signToken should call jwt.sign(...).");
assert.include(
  __b.generateCode(__sign.arguments?.[1] ?? {}),
  "process.env",
  "Sign the token with your secret from process.env.",
);
const __opts = __sign.arguments?.[2];
assert.isTrue(
  __opts?.type === "ObjectExpression" &&
    __opts.properties.some((p) => p.key?.name === "expiresIn"),
  "Pass an { expiresIn } option to jwt.sign so the token expires.",
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

`utils/jwt.js` should export a `verifyToken(token)` function that calls `jwt.verify`.

```js
const __jwt = __b
  .getImportDeclarations()
  .find((i) => i.source.value === "jsonwebtoken")
  ?.specifiers.find((s) => s.type === "ImportDefaultSpecifier")?.local.name;
const __fn = __b
  .getFunctionDeclarations()
  .find((f) => f.id?.name === "verifyToken");
assert.exists(__fn, "Export a verifyToken(token) function.");
assert.lengthOf(__fn.params, 1, "verifyToken should accept a token argument.");
assert.isTrue(
  __b
    .getType("ExportNamedDeclaration")
    .some((e) => e.declaration?.id?.name === "verifyToken"),
  "verifyToken should be exported.",
);
assert.isTrue(
  __b
    .getType("CallExpression")
    .some((c) => __b.generateCode(c.callee) === `${__jwt}.verify`),
  "verifyToken should call jwt.verify(...).",
);
```

`verifyToken` should return `null` from a `catch` block when verification throws.

```js
const __try = __b.getType("TryStatement")[0];
assert.exists(__try, "Wrap jwt.verify in a try/catch.");
const __returnsNull = (node) => {
  let __found = false;
  const __walk = (n) => {
    if (!n || typeof n !== "object") return;
    if (Array.isArray(n)) return n.forEach(__walk);
    if (n.type === "ReturnStatement" && n.argument?.type === "NullLiteral")
      __found = true;
    for (const k in n) {
      if (["scope", "loc", "start", "end"].includes(k)) continue;
      __walk(n[k]);
    }
  };
  __walk(node);
  return __found;
};
assert.isTrue(
  __try.handler != null && __returnsNull(__try.handler),
  "Return null inside the catch block.",
);
```

### --before-each--

```js
const __file = await __helpers.getFile(project.dashedName, "utils/jwt.js");
const __b = new __helpers.Babeliser(__file);
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

`routes/auth.js` should import `express` and create a router with `express.Router()`.

```js
const __file = await __helpers.getFile(project.dashedName, "routes/auth.js");
const __b = new __helpers.Babeliser(__file);
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
const __file = await __helpers.getFile(project.dashedName, "routes/auth.js");
const __b = new __helpers.Babeliser(__file);
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

## 11

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

`routes/auth.js` should define an `async` `POST /register` route that reads `email` and `password` from `req.body`.

```js
const __route = __b
  .getType("CallExpression")
  .find(
    (c) =>
      c.callee?.property?.name === "post" &&
      c.arguments?.[0]?.value === "/register",
  );
assert.exists(__route, 'Define a router.post("/register", ...) route.');
const __handler = __route.arguments.find(
  (a) =>
    a.type === "ArrowFunctionExpression" || a.type === "FunctionExpression",
);
assert.isTrue(__handler?.async === true, "Make the /register handler async.");
const __destructures = __b.getVariableDeclarations().some((v) => {
  const __d = v.declarations[0];
  return (
    __d?.id?.type === "ObjectPattern" &&
    __d.id.properties.some((p) => p.key?.name === "email") &&
    __d.id.properties.some((p) => p.key?.name === "password") &&
    __b.generateCode(__d.init) === "req.body"
  );
});
assert.isTrue(__destructures, "Read email and password from req.body.");
```

A missing field should respond with `400`, and a duplicate email should respond with `409`.

```js
const __statuses = __b
  .getType("CallExpression")
  .filter((c) => c.callee?.property?.name === "status")
  .map((c) => c.arguments?.[0]?.value);
assert.include(
  __statuses,
  400,
  "Respond with status 400 when email or password is missing.",
);
assert.isTrue(
  __b
    .getType("CallExpression")
    .some((c) => __b.generateCode(c.callee) === "findByEmail"),
  "Call findByEmail to check for an existing user.",
);
assert.include(
  __statuses,
  409,
  "Respond with status 409 when the email is already in use.",
);
```

### --before-each--

```js
const __file = await __helpers.getFile(project.dashedName, "routes/auth.js");
const __b = new __helpers.Babeliser(__file);
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
assert.isTrue(
  __b.getImportDeclarations().some((i) => i.source.value === "bcryptjs"),
  'Import bcrypt from "bcryptjs".',
);
assert.isTrue(
  __b
    .getImportDeclarations()
    .some(
      (i) =>
        i.source.value === "crypto" &&
        i.specifiers.some(
          (s) => (s.imported?.name ?? s.local.name) === "randomUUID",
        ),
    ),
  'Import randomUUID from "crypto".',
);
```

`routes/auth.js` should import `readUsers` and `writeUsers` from `../utils/db.js`.

```js
const __db = __b
  .getImportDeclarations()
  .find((i) => i.source.value === "../utils/db.js");
const __names = __db
  ? __db.specifiers.map((s) => s.imported?.name ?? s.local.name)
  : [];
assert.include(__names, "readUsers", "Import readUsers from ../utils/db.js.");
assert.include(__names, "writeUsers", "Import writeUsers from ../utils/db.js.");
```

The handler should hash the password with `bcrypt.hash` and persist the user with `writeUsers`.

```js
const __bcrypt = __b
  .getImportDeclarations()
  .find((i) => i.source.value === "bcryptjs")
  ?.specifiers.find((s) => s.type === "ImportDefaultSpecifier")?.local.name;
assert.isTrue(
  __b
    .getType("CallExpression")
    .some((c) => __b.generateCode(c.callee) === `${__bcrypt}.hash`),
  "Hash the password with bcrypt.hash(...).",
);
assert.isTrue(
  __b
    .getType("CallExpression")
    .some((c) => __b.generateCode(c.callee) === "writeUsers"),
  "Persist the new user with writeUsers(...).",
);
```

The new user object should set `id` to `randomUUID()`, `role` to `"user"`, and include a `provider`.

```js
const __user = __b
  .getType("ObjectExpression")
  .find(
    (o) =>
      o.properties.some((p) => p.key?.name === "role") &&
      o.properties.some((p) => p.key?.name === "provider"),
  );
assert.exists(__user, "Build a user object with role and provider properties.");
const __id = __user.properties.find((p) => p.key?.name === "id");
assert.equal(
  __b.generateCode(__id?.value ?? {}),
  "randomUUID()",
  "Generate the id with randomUUID().",
);
const __role = __user.properties.find((p) => p.key?.name === "role");
assert.equal(
  __role?.value?.value,
  "user",
  'New users should have role "user".',
);
```

### --before-each--

```js
const __file = await __helpers.getFile(project.dashedName, "routes/auth.js");
const __b = new __helpers.Babeliser(__file);
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

Finally, wrap the whole handler body in a `try`/`catch`. In the `catch`, respond with status `500` and the error message.

### --tests--

`routes/auth.js` should import `signToken` from `../utils/jwt.js`.

```js
assert.isTrue(
  __b
    .getImportDeclarations()
    .some(
      (i) =>
        i.source.value === "../utils/jwt.js" &&
        i.specifiers.some(
          (s) => (s.imported?.name ?? s.local.name) === "signToken",
        ),
    ),
  "Import signToken from ../utils/jwt.js.",
);
```

The handler should call `signToken`, respond with status `201`, and include the `token` in the response.

```js
assert.isTrue(
  __b
    .getType("CallExpression")
    .some((c) => __b.generateCode(c.callee) === "signToken"),
  "Call signToken to issue a token.",
);
const __statuses = __b
  .getType("CallExpression")
  .filter((c) => c.callee?.property?.name === "status")
  .map((c) => c.arguments?.[0]?.value);
assert.include(__statuses, 201, "Respond with status 201 after registering.");
const __jsonWithToken = __b
  .getType("CallExpression")
  .some(
    (c) =>
      c.callee?.property?.name === "json" &&
      c.arguments?.[0]?.type === "ObjectExpression" &&
      c.arguments[0].properties.some((p) => p.key?.name === "token"),
  );
assert.isTrue(__jsonWithToken, "Include the token in the JSON response.");
```

The handler body should be wrapped in a `try`/`catch` that responds with status `500`.

```js
assert.isAtLeast(
  __b.getType("TryStatement").length,
  1,
  "Wrap the handler body in a try/catch.",
);
const __statuses = __b
  .getType("CallExpression")
  .filter((c) => c.callee?.property?.name === "status")
  .map((c) => c.arguments?.[0]?.value);
assert.include(
  __statuses,
  500,
  "Respond with status 500 from the catch block.",
);
```

### --before-each--

```js
const __file = await __helpers.getFile(project.dashedName, "routes/auth.js");
const __b = new __helpers.Babeliser(__file);
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

Add a `POST /login` route. Like `/register`, make the handler `async` and wrap its body in `try`/`catch` (respond with `500` on error).

Read `email` and `password` from `req.body`, and respond with status `400` if either is missing.

Then look up the user with `findByEmail(email)`. If no user is found, respond with status `401` and a JSON message such as `"Invalid credentials"`.

> **NOTE:** Use the same generic `"Invalid credentials"` message whether the email or the password is wrong, so an attacker cannot tell which emails are registered.

### --tests--

`routes/auth.js` should define an `async` `POST /login` route.

```js
const __route = __b
  .getType("CallExpression")
  .find(
    (c) =>
      c.callee?.property?.name === "post" &&
      c.arguments?.[0]?.value === "/login",
  );
assert.exists(__route, 'Define a router.post("/login", ...) route.');
const __handler = __route.arguments.find(
  (a) =>
    a.type === "ArrowFunctionExpression" || a.type === "FunctionExpression",
);
assert.isTrue(__handler?.async === true, "Make the /login handler async.");
```

The login handler should look up the user with `findByEmail` and respond with status `401` when none is found.

```js
assert.isTrue(
  __b
    .getType("CallExpression")
    .some((c) => __b.generateCode(c.callee) === "findByEmail"),
  "Look up the user with findByEmail.",
);
const __statuses = __b
  .getType("CallExpression")
  .filter((c) => c.callee?.property?.name === "status")
  .map((c) => c.arguments?.[0]?.value);
assert.include(
  __statuses,
  401,
  "Respond with status 401 for invalid credentials.",
);
```

### --before-each--

```js
const __file = await __helpers.getFile(project.dashedName, "routes/auth.js");
const __b = new __helpers.Babeliser(__file);
```

## 15

### --description--

Now verify the password. `bcrypt.compare(plainText, hash)` returns a promise that resolves to `true` when they match:

```js
const match = await bcrypt.compare(password, user.passwordHash);
```

In the `/login` handler, compare the submitted `password` with the stored `user.passwordHash`. If they do not match, respond with status `401`.

When they match, sign a token containing the user's `id`, `email`, and `role`, then respond with a JSON body containing a `message` and the `token`.

### --tests--

The login handler should compare the password with `bcrypt.compare`.

```js
const __bcrypt = __b
  .getImportDeclarations()
  .find((i) => i.source.value === "bcryptjs")
  ?.specifiers.find((s) => s.type === "ImportDefaultSpecifier")?.local.name;
assert.isTrue(
  __b
    .getType("CallExpression")
    .some((c) => __b.generateCode(c.callee) === `${__bcrypt}.compare`),
  "Compare the password with bcrypt.compare(...).",
);
```

On success, the handler should sign a token and respond with a JSON body containing the `token`.

```js
assert.isTrue(
  __b
    .getType("CallExpression")
    .some((c) => __b.generateCode(c.callee) === "signToken"),
  "Issue a token with signToken on success.",
);
const __jsonWithToken = __b
  .getType("CallExpression")
  .some(
    (c) =>
      c.callee?.property?.name === "json" &&
      c.arguments?.[0]?.type === "ObjectExpression" &&
      c.arguments[0].properties.some((p) => p.key?.name === "token"),
  );
assert.isTrue(
  __jsonWithToken,
  "Respond with a JSON body containing the token.",
);
```

### --before-each--

```js
const __file = await __helpers.getFile(project.dashedName, "routes/auth.js");
const __b = new __helpers.Babeliser(__file);
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

## 17

### --description--

Protected routes need a way to identify the caller. Create a `middleware/authenticate.js` file with a default-exported middleware function `authenticate(req, res, next)`.

Clients send their token in the `Authorization` header using the `Bearer` scheme:

```
Authorization: Bearer <token>
```

In the middleware, read `req.headers.authorization`. If it is missing or does not start with `"Bearer "`, respond with status `401` and a JSON message such as `"No token provided"`. Otherwise, extract the token by splitting the header on the space and taking the second part.

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
const __b = new __helpers.Babeliser(__file);
const __fn = __b
  .getFunctionDeclarations()
  .find((f) => f.id?.name === "authenticate");
assert.exists(__fn, "Define a function named authenticate.");
assert.lengthOf(
  __fn.params,
  3,
  "authenticate should take three parameters: (req, res, next).",
);
const __def = __b.getType("ExportDefaultDeclaration")[0];
assert.isTrue(
  __def != null &&
    (__def.declaration?.id?.name === "authenticate" ||
      __b.generateCode(__def.declaration) === "authenticate"),
  "Export authenticate as the default export.",
);
```

`authenticate` should read the `Authorization` header, check the `Bearer` scheme, and respond with `401` when no token is present.

```js
const __file = await __helpers.getFile(
  project.dashedName,
  "middleware/authenticate.js",
);
const __b = new __helpers.Babeliser(__file);
assert.isTrue(
  __b
    .getType("MemberExpression")
    .some((m) => __b.generateCode(m) === "req.headers.authorization"),
  "Read the token from req.headers.authorization.",
);
const __startsWith = __b
  .getType("CallExpression")
  .find((c) => c.callee?.property?.name === "startsWith");
assert.exists(
  __startsWith,
  'Check the header begins with the "Bearer " scheme using startsWith.',
);
assert.isTrue(
  (__startsWith.arguments?.[0]?.value ?? "").includes("Bearer"),
  'Pass the "Bearer " scheme to startsWith.',
);
const __statuses = __b
  .getType("CallExpression")
  .filter((c) => c.callee?.property?.name === "status")
  .map((c) => c.arguments?.[0]?.value);
assert.include(
  __statuses,
  401,
  "Respond with status 401 when no token is provided.",
);
```

`authenticate` should extract the token by splitting the header.

```js
const __file = await __helpers.getFile(
  project.dashedName,
  "middleware/authenticate.js",
);
const __b = new __helpers.Babeliser(__file);
assert.isTrue(
  __b
    .getType("CallExpression")
    .some((c) => c.callee?.property?.name === "split"),
  "Extract the token by splitting the header on the space.",
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

In `authenticate`, pass the token to `verifyToken`. If it returns a falsy value, the token is invalid or expired - respond with status `401` and a JSON message such as `"Invalid or expired token"`. Otherwise, attach the decoded payload to `req.user` and call `next()` to continue to the route handler.

### --tests--

`middleware/authenticate.js` should import `verifyToken` from `../utils/jwt.js`.

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

`authenticate` should call `verifyToken` and respond with `401` when the token is invalid.

```js
assert.isTrue(
  __b
    .getType("CallExpression")
    .some((c) => __b.generateCode(c.callee) === "verifyToken"),
  "Verify the token with verifyToken(token).",
);
const __statuses = __b
  .getType("CallExpression")
  .filter((c) => c.callee?.property?.name === "status")
  .map((c) => c.arguments?.[0]?.value);
assert.include(
  __statuses,
  401,
  "Respond with status 401 when the token is invalid.",
);
```

`authenticate` should attach the decoded payload to `req.user` and call `next()`.

```js
assert.isTrue(
  __b
    .getType("AssignmentExpression")
    .some((a) => __b.generateCode(a.left) === "req.user"),
  "Attach the decoded payload to req.user.",
);
assert.isTrue(
  __b
    .getType("CallExpression")
    .some((c) => c.callee?.type === "Identifier" && c.callee.name === "next"),
  "Call next() when the token is valid.",
);
```

### --before-each--

```js
const __file = await __helpers.getFile(
  project.dashedName,
  "middleware/authenticate.js",
);
const __b = new __helpers.Babeliser(__file);
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
const __authLocal = __b
  .getImportDeclarations()
  .find((i) => i.source.value === "../middleware/authenticate.js")
  ?.specifiers.find((s) => s.type === "ImportDefaultSpecifier")?.local.name;
assert.exists(
  __authLocal,
  "Import authenticate from ../middleware/authenticate.js.",
);
```

`routes/auth.js` should define a `GET /profile` route protected by `authenticate`.

```js
const __authLocal = __b
  .getImportDeclarations()
  .find((i) => i.source.value === "../middleware/authenticate.js")
  ?.specifiers.find((s) => s.type === "ImportDefaultSpecifier")?.local.name;
const __route = __b
  .getType("CallExpression")
  .find(
    (c) =>
      c.callee?.property?.name === "get" &&
      c.arguments?.[0]?.value === "/profile",
  );
assert.exists(__route, 'Define a router.get("/profile", ...) route.');
assert.isTrue(
  __route.arguments.some(
    (a) => a.type === "Identifier" && a.name === __authLocal,
  ),
  "Protect /profile with the authenticate middleware.",
);
```

The `/profile` handler should respond with `{ user: req.user }`.

```js
const __userResp = __b
  .getType("CallExpression")
  .some(
    (c) =>
      c.callee?.property?.name === "json" &&
      c.arguments?.[0]?.type === "ObjectExpression" &&
      c.arguments[0].properties.some(
        (p) =>
          p.key?.name === "user" && __b.generateCode(p.value) === "req.user",
      ),
  );
assert.isTrue(__userResp, "Respond with res.json({ user: req.user }).");
```

### --before-each--

```js
const __file = await __helpers.getFile(project.dashedName, "routes/auth.js");
const __b = new __helpers.Babeliser(__file);
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

`utils/token-blacklist.js` should declare a `Set` and export a `blacklistToken` function that adds to it.

```js
const __file = await __helpers.getFile(
  project.dashedName,
  "utils/token-blacklist.js",
);
const __b = new __helpers.Babeliser(__file);
const __set = __b.getVariableDeclarations().find((v) => {
  const __init = v.declarations[0]?.init;
  return __init?.type === "NewExpression" && __init.callee?.name === "Set";
});
assert.exists(__set, "Create a Set to hold blacklisted tokens.");
assert.exists(
  __b.getFunctionDeclarations().find((f) => f.id?.name === "blacklistToken"),
  "Export a blacklistToken(token) function.",
);
assert.isTrue(
  __b
    .getType("ExportNamedDeclaration")
    .some((e) => e.declaration?.id?.name === "blacklistToken"),
  "blacklistToken should be exported.",
);
assert.isTrue(
  __b.getType("CallExpression").some((c) => c.callee?.property?.name === "add"),
  "blacklistToken should add the token to the set.",
);
```

`utils/token-blacklist.js` should export an `isBlacklisted` function that checks the set.

```js
const __file = await __helpers.getFile(
  project.dashedName,
  "utils/token-blacklist.js",
);
const __b = new __helpers.Babeliser(__file);
assert.exists(
  __b.getFunctionDeclarations().find((f) => f.id?.name === "isBlacklisted"),
  "Export an isBlacklisted(token) function.",
);
assert.isTrue(
  __b
    .getType("ExportNamedDeclaration")
    .some((e) => e.declaration?.id?.name === "isBlacklisted"),
  "isBlacklisted should be exported.",
);
assert.isTrue(
  __b.getType("CallExpression").some((c) => c.callee?.property?.name === "has"),
  "isBlacklisted should check the set with .has(token).",
);
```

## 21

### --description--

Wire the blacklist into your authentication check. In `middleware/authenticate.js`, import `isBlacklisted` from `../utils/token-blacklist.js`.

After extracting the token but before verifying it, check `isBlacklisted(token)`. If the token has been blacklisted, respond with status `401` and a JSON message such as `"Token has been invalidated. Log in again."`.

### --tests--

`middleware/authenticate.js` should import `isBlacklisted` from `../utils/token-blacklist.js`.

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

`authenticate` should call `isBlacklisted` and reject a blacklisted token with status `401`.

```js
assert.isTrue(
  __b
    .getType("CallExpression")
    .some((c) => __b.generateCode(c.callee) === "isBlacklisted"),
  "Check the token with isBlacklisted(token).",
);
const __statuses = __b
  .getType("CallExpression")
  .filter((c) => c.callee?.property?.name === "status")
  .map((c) => c.arguments?.[0]?.value);
assert.include(__statuses, 401, "Reject a blacklisted token with status 401.");
```

### --before-each--

```js
const __file = await __helpers.getFile(
  project.dashedName,
  "middleware/authenticate.js",
);
const __b = new __helpers.Babeliser(__file);
```

## 22

### --description--

Add a protected `POST /logout` route to `routes/auth.js`. Import `blacklistToken` from `../utils/token-blacklist.js`.

Protect the route with `authenticate`. In the handler, read the token from the `Authorization` header (split on the space and take the second part), pass it to `blacklistToken`, and respond with a JSON message (for example `"Logged out successfully"`).

### --tests--

`routes/auth.js` should import `blacklistToken` from `../utils/token-blacklist.js`.

```js
assert.isTrue(
  __b
    .getImportDeclarations()
    .some(
      (i) =>
        i.source.value === "../utils/token-blacklist.js" &&
        i.specifiers.some(
          (s) => (s.imported?.name ?? s.local.name) === "blacklistToken",
        ),
    ),
  "Import blacklistToken from ../utils/token-blacklist.js.",
);
```

`routes/auth.js` should define a `POST /logout` route protected by `authenticate`.

```js
const __authLocal = __b
  .getImportDeclarations()
  .find((i) => i.source.value === "../middleware/authenticate.js")
  ?.specifiers.find((s) => s.type === "ImportDefaultSpecifier")?.local.name;
const __route = __b
  .getType("CallExpression")
  .find(
    (c) =>
      c.callee?.property?.name === "post" &&
      c.arguments?.[0]?.value === "/logout",
  );
assert.exists(__route, 'Define a router.post("/logout", ...) route.');
assert.isTrue(
  __route.arguments.some(
    (a) => a.type === "Identifier" && a.name === __authLocal,
  ),
  "Protect /logout with the authenticate middleware.",
);
```

The `/logout` handler should blacklist the request's token.

```js
assert.isTrue(
  __b
    .getType("CallExpression")
    .some((c) => __b.generateCode(c.callee) === "blacklistToken"),
  "Blacklist the token with blacklistToken(token).",
);
```

### --before-each--

```js
const __file = await __helpers.getFile(project.dashedName, "routes/auth.js");
const __b = new __helpers.Babeliser(__file);
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

The returned middleware should respond with status `403` and a JSON message such as `"Access denied"` when there is no `req.user` or the user's `role` does not match `role`. Otherwise it should call `next()`.

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
const __b = new __helpers.Babeliser(__file);
const __fn = __b
  .getFunctionDeclarations()
  .find((f) => f.id?.name === "authorizeRole");
assert.exists(__fn, "Define a function named authorizeRole.");
assert.lengthOf(__fn.params, 1, "authorizeRole should accept a role argument.");
const __def = __b.getType("ExportDefaultDeclaration")[0];
assert.isTrue(
  __def != null &&
    (__def.declaration?.id?.name === "authorizeRole" ||
      __b.generateCode(__def.declaration) === "authorizeRole"),
  "Export authorizeRole as the default export.",
);
```

`authorizeRole` should return a middleware function with three parameters.

```js
const __file = await __helpers.getFile(
  project.dashedName,
  "middleware/authorize.js",
);
const __b = new __helpers.Babeliser(__file);
const __mw = [
  ...__b.getArrowFunctionExpressions(),
  ...__b.getType("FunctionExpression"),
].find((f) => f.params?.length === 3);
assert.exists(
  __mw,
  "authorizeRole should return a (req, res, next) => {} middleware function.",
);
```

The returned middleware should compare `req.user.role` with `role` and respond with `403` on a mismatch, otherwise call `next()`.

```js
const __file = await __helpers.getFile(
  project.dashedName,
  "middleware/authorize.js",
);
const __b = new __helpers.Babeliser(__file);
const __statuses = __b
  .getType("CallExpression")
  .filter((c) => c.callee?.property?.name === "status")
  .map((c) => c.arguments?.[0]?.value);
assert.include(__statuses, 403, "Respond with status 403 on a role mismatch.");
assert.isTrue(
  __b
    .getType("BinaryExpression")
    .some(
      (e) =>
        (e.operator === "!==" || e.operator === "===") &&
        (__b.generateCode(e.left) === "req.user.role" ||
          __b.generateCode(e.right) === "req.user.role"),
    ),
  "Compare req.user.role with the required role.",
);
assert.isTrue(
  __b
    .getType("CallExpression")
    .some((c) => c.callee?.type === "Identifier" && c.callee.name === "next"),
  "Call next() when the role matches.",
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
const __b = new __helpers.Babeliser(__file);
const __imports = __b.getImportDeclarations();
assert.isTrue(
  __imports.some((i) => i.source.value === "../middleware/authenticate.js"),
  "Import authenticate from ../middleware/authenticate.js.",
);
assert.isTrue(
  __imports.some((i) => i.source.value === "../middleware/authorize.js"),
  "Import authorizeRole from ../middleware/authorize.js.",
);
assert.isTrue(
  __imports.some(
    (i) =>
      i.source.value === "../utils/db.js" &&
      i.specifiers.some(
        (s) => (s.imported?.name ?? s.local.name) === "readUsers",
      ),
  ),
  "Import readUsers from ../utils/db.js.",
);
```

`routes/admin.js` should define `GET /users` guarded by `authenticate` and `authorizeRole("admin")`.

```js
const __file = await __helpers.getFile(project.dashedName, "routes/admin.js");
const __b = new __helpers.Babeliser(__file);
const __authLocal = __b
  .getImportDeclarations()
  .find((i) => i.source.value === "../middleware/authenticate.js")
  ?.specifiers.find((s) => s.type === "ImportDefaultSpecifier")?.local.name;
const __roleLocal = __b
  .getImportDeclarations()
  .find((i) => i.source.value === "../middleware/authorize.js")
  ?.specifiers.find((s) => s.type === "ImportDefaultSpecifier")?.local.name;
const __route = __b
  .getType("CallExpression")
  .find(
    (c) =>
      c.callee?.property?.name === "get" &&
      c.arguments?.[0]?.value === "/users",
  );
assert.exists(__route, 'Define a router.get("/users", ...) route.');
assert.isTrue(
  __route.arguments.some(
    (a) => a.type === "Identifier" && a.name === __authLocal,
  ),
  "Guard /users with the authenticate middleware.",
);
assert.isTrue(
  __route.arguments.some(
    (a) =>
      a.type === "CallExpression" &&
      __b.generateCode(a.callee) === __roleLocal &&
      a.arguments?.[0]?.value === "admin",
  ),
  'Guard /users with authorizeRole("admin").',
);
```

The handler should strip `passwordHash` from each user and respond with `{ users }`.

```js
const __file = await __helpers.getFile(project.dashedName, "routes/admin.js");
const __b = new __helpers.Babeliser(__file);
const __strips = __b.getArrowFunctionExpressions().some((a) => {
  const __p = a.params?.[0];
  return (
    __p?.type === "ObjectPattern" &&
    __p.properties.some((pr) => pr.key?.name === "passwordHash")
  );
});
assert.isTrue(
  __strips,
  "Strip passwordHash from each user by destructuring it out.",
);
const __usersResp = __b
  .getType("CallExpression")
  .some(
    (c) =>
      c.callee?.property?.name === "json" &&
      c.arguments?.[0]?.type === "ObjectExpression" &&
      c.arguments[0].properties.some((p) => p.key?.name === "users"),
  );
assert.isTrue(__usersResp, "Respond with res.json({ users }).");
```

`routes/admin.js` should export the router as the default export.

```js
const __file = await __helpers.getFile(project.dashedName, "routes/admin.js");
const __b = new __helpers.Babeliser(__file);
const __routerDecl = __b.getVariableDeclarations().find((v) => {
  const __init = v.declarations[0]?.init;
  return (
    __init?.type === "CallExpression" &&
    __b.generateCode(__init.callee).endsWith("Router")
  );
});
const __routerName = __routerDecl?.declarations[0]?.id?.name;
const __def = __b.getType("ExportDefaultDeclaration")[0];
assert.isTrue(
  __def != null && __b.generateCode(__def.declaration) === __routerName,
  "Export the router as the default export.",
);
```

## 25

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
const __url = "http://localhost:8080/";
```

### --hints--

#### 1

The `start` script already runs `node --env-file .env index.js`, which loads both `PORT` and `JWT_SECRET`. If the server crashes on boot, check that `.env` has a `JWT_SECRET` and that every file you created exports what `index.js` and the routes import.

#### 2

If a request hangs or returns `500`, read the server logs in the terminal. A common cause is `data/users.json` not containing a valid JSON array.

## --fcc-end--
