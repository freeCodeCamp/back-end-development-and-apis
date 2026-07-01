# Build a Family Movie Watchlist API

```json
{ "tags": ["Certification Project"] }
```

Practice authentication and authorization by building a family movie watchlist HTTP API.

## 0

### --description--

Install your project dependencies by entering `npm i` from the `build-a-family-movie-watchlist-api/` folder in the terminal.

Seeded data in `./data/` has been provided, and does not need to be manually edited.

Functions in `./utils/db.js` have been provided for working with the watchlist. No more need to be created.

**Objective:** Fulfill the user stories below and get all the tests to pass to complete the lab.

**User Stories**

- `./middleware/authenticate.js` should export a named function `authenticate`.

- `authenticate` should respond `401 { "error": "No token provided." }` if there is no authorization bearer token in the headers.

- `authenticate` should respond `401 { "error": "Invalid or expired token." }` if the token is not successfully verified.

- `authenticate` should attach the decoded token to `req.user`.

- `./middleware/authorize.js` should export a named function `authorizeModification`.

- `authorizeModification` should respond `403 { "error": "Access denied" }` if `req.user.role` is not `"parent"`, or if `req.user.role` is not `"child"` **and** `req.params.userId` is not the same as `req.user.id`.

- When a `POST` request is made to `/api/auth/login` without a `username` or `password` field in the request body, the server should return a `400` status.

- When a `POST` request is made to `/api/auth/login` with a `username` that does not exist, the server should return a `401` status.

- When a `POST` request is made to `/api/auth/login` with a correct `username` but wrong `password`, the server should return a `401` status.

- When a `POST` request is made to `/api/auth/login` with valid credentials, the server should return a `200` status with a JSON body containing a `token` field.

- When a request is made to any watchlist route without an `Authorization` header, the server should return a `401` status.

- When a request is made to any watchlist route with a malformed or expired token, the server should return a `401` status.

- When an authenticated user makes a `GET` request to `/api/watchlist/:userId`, the server should return a `200` status with the watchlist for that user regardless of the requester's role.

- When an authenticated user with the `parent` role makes a `POST` request to `/api/watchlist/:userId/movies`, the server should return a `201` status and add the movie to that user's watchlist.

- When an authenticated user with the `child` role makes a `POST` request to `/api/watchlist/:userId/movies` where `:userId` belongs to another user, the server should return a `403` status.

- When an authenticated user with the `child` role makes a `POST` request to `/api/watchlist/:userId/movies` where `:userId` is their own, the server should return a `201` status and add the movie to their watchlist.

- When an authenticated user with the `parent` role makes a `PUT` request to `/api/watchlist/:userId/movies/:movieId`, the server should return a `200` status and update the movie on that user's watchlist.

- When an authenticated user with the `child` role makes a `PUT` request to `/api/watchlist/:userId/movies/:movieId` where `:userId` belongs to another user, the server should return a `403` status.

- When an authenticated user with the `child` role makes a `PUT` request to `/api/watchlist/:userId/movies/:movieId` where `:userId` is their own, the server should return a `200` status and update the movie.

- When an authenticated user with the `parent` role makes a `DELETE` request to `/api/watchlist/:userId/movies/:movieId`, the server should return a `200` status and remove the movie from that user's watchlist.

- When an authenticated user with the `child` role makes a `DELETE` request to `/api/watchlist/:userId/movies/:movieId` where `:userId` belongs to another user, the server should return a `403` status.

- When an authenticated user with the `child` role makes a `DELETE` request to `/api/watchlist/:userId/movies/:movieId` where `:userId` is their own, the server should return a `200` status and remove the movie.

### --tests--

An HTTP server should be listening on port `3000`.

```js
const __listening = await __helpers.isServerListening(3000);
assert.isTrue(__listening, "Your server should be listening on port 3000");
```

`middleware/authenticate.js` should export a named `authenticate` function.

```js
const { authenticate } = await __helpers.importSansCache(
  `${project.dashedName}/middleware/authenticate.js`,
);
assert.isFunction(
  authenticate,
  "middleware/authenticate.js should export a named function `authenticate`.",
);
```

`authenticate` should respond `401 { "error": "No token provided." }` when there is no authorization bearer token.

```js
const { authenticate } = await __helpers.importSansCache(
  `${project.dashedName}/middleware/authenticate.js`,
);
const __res = __mockRes();
let __next = false;
await authenticate({ headers: {} }, __res, () => (__next = true));
assert.equal(
  __res.statusCode,
  401,
  "A request with no Authorization header should respond with 401.",
);
assert.deepEqual(
  __res.body,
  { error: "No token provided." },
  'The response body should be { "error": "No token provided." }.',
);
assert.isFalse(__next, "next() should not be called when there is no token.");
```

`authenticate` should respond `401 { "error": "Invalid or expired token." }` when the token cannot be verified.

```js
process.env.JWT_SECRET = process.env.JWT_SECRET || "grading-secret-value";
const { authenticate } = await __helpers.importSansCache(
  `${project.dashedName}/middleware/authenticate.js`,
);
const __res = __mockRes();
let __next = false;
await authenticate(
  { headers: { authorization: "Bearer not.a.valid.token" } },
  __res,
  () => (__next = true),
);
assert.equal(
  __res.statusCode,
  401,
  "A request with an invalid token should respond with 401.",
);
assert.deepEqual(
  __res.body,
  { error: "Invalid or expired token." },
  'The response body should be { "error": "Invalid or expired token." }.',
);
assert.isFalse(
  __next,
  "next() should not be called for an invalid token.",
);
```

`authenticate` should attach the decoded token to `req.user` and call `next()` for a valid token.

```js
process.env.JWT_SECRET = "grading-secret-value";
const { createRequire } = await import("module");
const { join } = await import("path");
const __jwt = createRequire(join(ROOT, project.dashedName, "package.json"))(
  "jsonwebtoken",
);
const __token = __jwt.sign(
  { id: 3, username: "jake_miller", role: "child" },
  process.env.JWT_SECRET,
  { expiresIn: "1h" },
);
const { authenticate } = await __helpers.importSansCache(
  `${project.dashedName}/middleware/authenticate.js`,
);
const __req = { headers: { authorization: `Bearer ${__token}` } };
const __res = __mockRes();
let __next = false;
await authenticate(__req, __res, () => (__next = true));
assert.isTrue(__next, "A valid token should call next().");
assert.exists(
  __req.user,
  "authenticate should attach the decoded token to req.user.",
);
assert.equal(
  __req.user.id,
  3,
  "req.user should hold the decoded token payload.",
);
assert.equal(
  __req.user.role,
  "child",
  "req.user should hold the decoded token payload.",
);
```

`middleware/authorize.js` should export a named `authorizeModification` function.

```js
const { authorizeModification } = await __helpers.importSansCache(
  `${project.dashedName}/middleware/authorize.js`,
);
assert.isFunction(
  authorizeModification,
  "middleware/authorize.js should export a named function `authorizeModification`.",
);
```

`authorizeModification` should respond `403 { "error": "Access denied" }` when a `child` targets another user, and call `next()` for a `parent` or a `child` targeting themselves.

```js
const { authorizeModification } = await __helpers.importSansCache(
  `${project.dashedName}/middleware/authorize.js`,
);

const __denied = __mockRes();
let __next1 = false;
await authorizeModification(
  { user: { id: "3", role: "child" }, params: { userId: "4" } },
  __denied,
  () => (__next1 = true),
);
assert.equal(
  __denied.statusCode,
  403,
  "A child modifying another user should respond with 403.",
);
assert.deepEqual(
  __denied.body,
  { error: "Access denied" },
  'The response body should be { "error": "Access denied" }.',
);
assert.isFalse(__next1, "next() should not be called on a denied request.");

const __parent = __mockRes();
let __next2 = false;
await authorizeModification(
  { user: { id: "1", role: "parent" }, params: { userId: "3" } },
  __parent,
  () => (__next2 = true),
);
assert.isTrue(
  __next2,
  "A parent should be allowed to modify any user's watchlist.",
);

const __childOwn = __mockRes();
let __next3 = false;
await authorizeModification(
  { user: { id: "3", role: "child" }, params: { userId: "3" } },
  __childOwn,
  () => (__next3 = true),
);
assert.isTrue(
  __next3,
  "A child should be allowed to modify their own watchlist.",
);
```

A `POST` to `/api/auth/login` without a `username` or `password` should respond with `400`.

```js
const __res1 = await fetch(`${__url}/api/auth/login`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({}),
});
assert.equal(
  __res1.status,
  400,
  "A login with no username or password should respond with 400.",
);
const __res2 = await fetch(`${__url}/api/auth/login`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ username: "dad_miller" }),
});
assert.equal(
  __res2.status,
  400,
  "A login with a missing password should respond with 400.",
);
```

A `POST` to `/api/auth/login` with a `username` that does not exist should respond with `401`.

```js
const { status } = await __login("ghost_user", "whatever123");
assert.equal(status, 401, "An unknown username should respond with 401.");
```

A `POST` to `/api/auth/login` with a correct `username` but wrong `password` should respond with `401`.

```js
const { status } = await __login("dad_miller", "wrong-password");
assert.equal(status, 401, "A wrong password should respond with 401.");
```

A `POST` to `/api/auth/login` with valid credentials should respond with `200` and a JSON body containing a `token`.

```js
const { status, token } = await __login("dad_miller", "parent456");
assert.equal(status, 200, "Valid credentials should respond with 200.");
assert.isString(token, "The response body should contain a token string.");
```

A request to a watchlist route without an `Authorization` header should respond with `401`.

```js
const __res = await fetch(`${__url}/api/watchlist/1`);
assert.equal(
  __res.status,
  401,
  "A watchlist request with no Authorization header should respond with 401.",
);
```

A request to a watchlist route with a malformed or expired token should respond with `401`.

```js
const __res = await fetch(`${__url}/api/watchlist/1`, {
  headers: { Authorization: "Bearer malformed.token.value" },
});
assert.equal(
  __res.status,
  401,
  "A watchlist request with a bad token should respond with 401.",
);
```

An authenticated `GET` to `/api/watchlist/:userId` should respond with `200` and that user's watchlist, regardless of the requester's role.

```js
const { token } = await __login("jake_miller", "child123");
const __res = await fetch(`${__url}/api/watchlist/1`, {
  headers: __auth(token),
});
assert.equal(
  __res.status,
  200,
  "A child should be able to read another user's watchlist.",
);
const __text = await __res.text();
assert.include(
  __text,
  "The Dark Knight",
  "The response should contain that user's watchlist.",
);
```

An authenticated `parent` making a `POST` to `/api/watchlist/:userId/movies` should respond with `201` and add the movie.

```js
const { token } = await __login("dad_miller", "parent456");
const __title = `Parent Movie ${Date.now()}`;
const __res = await fetch(`${__url}/api/watchlist/3/movies`, {
  method: "POST",
  headers: __auth(token),
  body: JSON.stringify({ title: __title, genre: "Drama" }),
});
assert.equal(
  __res.status,
  201,
  "A parent should be able to add a movie to any watchlist.",
);
const __check = await fetch(`${__url}/api/watchlist/3`, {
  headers: __auth(token),
});
assert.include(
  await __check.text(),
  __title,
  "The movie should be added to the watchlist.",
);
```

An authenticated `child` making a `POST` to `/api/watchlist/:userId/movies` for another user should respond with `403`.

```js
const { token } = await __login("jake_miller", "child123");
const __res = await fetch(`${__url}/api/watchlist/1/movies`, {
  method: "POST",
  headers: __auth(token),
  body: JSON.stringify({ title: "Blocked Movie", genre: "Action" }),
});
assert.equal(
  __res.status,
  403,
  "A child adding to another user's watchlist should respond with 403.",
);
```

An authenticated `child` making a `POST` to `/api/watchlist/:userId/movies` for themselves should respond with `201` and add the movie.

```js
const { token } = await __login("jake_miller", "child123");
const __title = `Child Movie ${Date.now()}`;
const __res = await fetch(`${__url}/api/watchlist/3/movies`, {
  method: "POST",
  headers: __auth(token),
  body: JSON.stringify({ title: __title, genre: "Action" }),
});
assert.equal(
  __res.status,
  201,
  "A child should be able to add a movie to their own watchlist.",
);
const __check = await fetch(`${__url}/api/watchlist/3`, {
  headers: __auth(token),
});
assert.include(
  await __check.text(),
  __title,
  "The movie should be added to the child's watchlist.",
);
```

An authenticated `parent` making a `PUT` to `/api/watchlist/:userId/movies/:movieId` should respond with `200` and update the movie.

```js
const { token } = await __login("dad_miller", "parent456");
const __title = `Parent Update ${Date.now()}`;
await fetch(`${__url}/api/watchlist/1/movies`, {
  method: "POST",
  headers: __auth(token),
  body: JSON.stringify({ title: __title, genre: "Drama" }),
});
const __id = await __movieId(token, 1, __title);
assert.exists(__id, "The movie to update should exist.");
const __res = await fetch(`${__url}/api/watchlist/1/movies/${__id}`, {
  method: "PUT",
  headers: __auth(token),
  body: JSON.stringify({ watched: true }),
});
assert.equal(
  __res.status,
  200,
  "A parent should be able to update a movie on any watchlist.",
);
```

An authenticated `child` making a `PUT` to `/api/watchlist/:userId/movies/:movieId` for another user should respond with `403`.

```js
const { token } = await __login("jake_miller", "child123");
const __res = await fetch(`${__url}/api/watchlist/1/movies/1`, {
  method: "PUT",
  headers: __auth(token),
  body: JSON.stringify({ watched: true }),
});
assert.equal(
  __res.status,
  403,
  "A child updating another user's movie should respond with 403.",
);
```

An authenticated `child` making a `PUT` to `/api/watchlist/:userId/movies/:movieId` for themselves should respond with `200` and update the movie.

```js
const { token } = await __login("jake_miller", "child123");
const __title = `Child Update ${Date.now()}`;
await fetch(`${__url}/api/watchlist/3/movies`, {
  method: "POST",
  headers: __auth(token),
  body: JSON.stringify({ title: __title, genre: "Action" }),
});
const __id = await __movieId(token, 3, __title);
assert.exists(__id, "The movie to update should exist.");
const __res = await fetch(`${__url}/api/watchlist/3/movies/${__id}`, {
  method: "PUT",
  headers: __auth(token),
  body: JSON.stringify({ watched: true }),
});
assert.equal(
  __res.status,
  200,
  "A child should be able to update a movie on their own watchlist.",
);
```

An authenticated `parent` making a `DELETE` to `/api/watchlist/:userId/movies/:movieId` should respond with `200` and remove the movie.

```js
const { token } = await __login("dad_miller", "parent456");
const __title = `Parent Delete ${Date.now()}`;
await fetch(`${__url}/api/watchlist/1/movies`, {
  method: "POST",
  headers: __auth(token),
  body: JSON.stringify({ title: __title, genre: "Drama" }),
});
const __id = await __movieId(token, 1, __title);
assert.exists(__id, "The movie to delete should exist.");
const __res = await fetch(`${__url}/api/watchlist/1/movies/${__id}`, {
  method: "DELETE",
  headers: __auth(token),
});
assert.equal(
  __res.status,
  200,
  "A parent should be able to delete a movie from any watchlist.",
);
assert.notInclude(
  await (await fetch(`${__url}/api/watchlist/1`, { headers: __auth(token) })).text(),
  __title,
  "The movie should be removed from the watchlist.",
);
```

An authenticated `child` making a `DELETE` to `/api/watchlist/:userId/movies/:movieId` for another user should respond with `403`.

```js
const { token } = await __login("jake_miller", "child123");
const __res = await fetch(`${__url}/api/watchlist/1/movies/1`, {
  method: "DELETE",
  headers: __auth(token),
});
assert.equal(
  __res.status,
  403,
  "A child deleting another user's movie should respond with 403.",
);
```

An authenticated `child` making a `DELETE` to `/api/watchlist/:userId/movies/:movieId` for themselves should respond with `200` and remove the movie.

```js
const { token } = await __login("jake_miller", "child123");
const __title = `Child Delete ${Date.now()}`;
await fetch(`${__url}/api/watchlist/3/movies`, {
  method: "POST",
  headers: __auth(token),
  body: JSON.stringify({ title: __title, genre: "Action" }),
});
const __id = await __movieId(token, 3, __title);
assert.exists(__id, "The movie to delete should exist.");
const __res = await fetch(`${__url}/api/watchlist/3/movies/${__id}`, {
  method: "DELETE",
  headers: __auth(token),
});
assert.equal(
  __res.status,
  200,
  "A child should be able to delete a movie from their own watchlist.",
);
```

### --before-each--

```js
const __url = "http://localhost:3000";

const __login = async (username, password) => {
  const res = await fetch(`${__url}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  const body = await res.json().catch(() => ({}));
  return { status: res.status, token: body.token };
};

const __auth = (token) => ({
  Authorization: `Bearer ${token}`,
  "Content-Type": "application/json",
});

const __mockRes = () => ({
  statusCode: 200,
  status(code) {
    this.statusCode = code;
    return this;
  },
  json(body) {
    this.body = body;
    return this;
  },
  send(body) {
    this.body = body;
    return this;
  },
});

const __extractList = (data) => {
  if (Array.isArray(data)) return data;
  if (data && typeof data === "object") {
    for (const key of ["watchlist", "movies", "list", "data"]) {
      if (Array.isArray(data[key])) return data[key];
    }
    const arr = Object.values(data).find((v) => Array.isArray(v));
    if (arr) return arr;
  }
  return [];
};

const __movieId = async (token, userId, title) => {
  const res = await fetch(`${__url}/api/watchlist/${userId}`, {
    headers: __auth(token),
  });
  const list = __extractList(await res.json().catch(() => []));
  return list.find((m) => m && m.title === title)?.id;
};
```

## --fcc-end--
