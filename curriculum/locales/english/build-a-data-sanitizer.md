# Build a Data Sanitizer

Practice creating custom Express middleware by building a data sanitizer and validator.

## 0

### --description--

Install your project dependencies by entering `npm i` from the `build-a-data-sanitizer/` folder in the terminal.

Work within the `server.js` and `middleware.js` files.

After that, start your server by running `node server.js`. Do not forget to restart your server for your code changes to take effect.

**Objective:** Fulfill the user stories below and get all the tests to pass to complete the lab.

**User Stories:**

1. You should create a `middleware.js` file that exports an `inputCleaner` function and an `inputValidator` function using `module.exports`.

2. `inputCleaner` should convert `req.body.username` to lowercase if it exists, strip HTML tags from `req.body.comment` if it exists, then call `next()`.

3. `inputValidator` should call `next()` if `req.body.username` is at least 3 characters long. Otherwise, it should redirect to `/form?error=Username must be at least 3 characters.` without calling `next()`.

4. In `server.js`, you should import `inputCleaner` and `inputValidator` from `./middleware`.

5. Your server should listen on port `3000`.

6. A `GET` request to `/` should redirect to `/form`.

7. A `GET` request to `/form` should serve the static HTML form from the `public` directory.

8. A `POST` request to `/submit` should apply `inputCleaner` then `inputValidator` as route-level middleware, before a final handler that responds with the sanitised `username` and `comment`.

### --tests--

Running `node build-a-data-sanitizer/server.js` should start a server listening on port `3000`.

```js
const { stdout } = await __helpers.awaitExecution(
  ["node", "build-a-data-sanitizer/server.js"],
  "http://localhost:3000",
  {},
);
const __listening = await __helpers.isServerListening(3000);
assert.isTrue(__listening, "Your server should be listening on port 3000");
```

A `GET` request to `/` should redirect to `/form`.

```js
const __res = await fetch(`${__url}/`);
assert.include(__res.url, "/form", "Expected GET / to redirect to /form");
```

A `GET` request to `/form` should return a `200` response.

```js
const __res = await fetch(`${__url}/form`);
assert.equal(__res.status, 200, "Expected GET /form to return 200");
```

`inputCleaner` should convert `req.body.username` to lowercase, strip HTML tags from `req.body.comment`, and call `next()`.

```js
const { inputCleaner } = await __helpers.importSansCache(`${project.dashedName}/middleware.js`);
const __req = { body: { username: "ADMIN", comment: "<b>Bold</b>" } };
let __nextCalled = false;
inputCleaner(__req, {}, () => { __nextCalled = true; });
assert.equal(__req.body.username, "admin", "inputCleaner should convert username to lowercase");
assert.equal(__req.body.comment, "Bold", "inputCleaner should strip HTML tags from comment");
assert.isTrue(__nextCalled, "inputCleaner should call next()");
```

`inputValidator` should call `next()` when `username` is at least 3 characters.

```js
const { inputValidator } = await __helpers.importSansCache(`${project.dashedName}/middleware.js`);
let __nextCalled = false;
inputValidator({ body: { username: "abc" } }, {}, () => { __nextCalled = true; });
assert.isTrue(__nextCalled, "inputValidator should call next() when username is at least 3 characters");
```

`inputValidator` should redirect to `/form` with an error message and not call `next()` when `username` is fewer than 3 characters.

```js
const { inputValidator } = await __helpers.importSansCache(`${project.dashedName}/middleware.js`);
let __nextCalled = false;
let __redirectTarget = null;
const __mockRes = { redirect: (url) => { __redirectTarget = url; } };
inputValidator({ body: { username: "AB" } }, __mockRes, () => { __nextCalled = true; });
assert.isFalse(__nextCalled, "inputValidator should not call next() when username is too short");
assert.isNotNull(__redirectTarget, "inputValidator should call res.redirect()");
assert.include(__redirectTarget, "/form", "Expected redirect to /form");
assert.include(
  decodeURIComponent(__redirectTarget),
  "Username must be at least 3 characters",
  "Expected the error message in the redirect URL"
);
```

A `POST` to `/submit` should convert the username to lowercase and include it in the response.

```js
const __res = await fetch(`${__url}/submit`, {
  method: "POST",
  headers: { "Content-Type": "application/x-www-form-urlencoded" },
  body: "username=ADMIN&comment=hello",
});
assert.equal(__res.status, 200, "Expected 200 for a valid submission");
const __body = await __res.text();
assert.include(__body, "admin", "Expected the lowercased username in the response");
```

A `POST` to `/submit` should strip HTML tags from the comment and include it in the response.

```js
const __res = await fetch(`${__url}/submit`, {
  method: "POST",
  headers: { "Content-Type": "application/x-www-form-urlencoded" },
  body: "username=test&comment=<b>Bold</b>",
});
const __body = await __res.text();
assert.include(__body, "Bold", "Expected the comment text in the response");
assert.notInclude(__body, "<b>", "Expected HTML tags to be stripped from the comment");
```

A `POST` to `/submit` with a username fewer than 3 characters should redirect to `/form` with an error message.

```js
const __res = await fetch(`${__url}/submit`, {
  method: "POST",
  headers: { "Content-Type": "application/x-www-form-urlencoded" },
  body: "username=AB&comment=hello",
});
assert.include(__res.url, "/form", "Expected a redirect to /form");
assert.include(
  decodeURIComponent(__res.url),
  "Username must be at least 3 characters",
  "Expected the error message in the redirect URL"
);
```

### --before-each--

```js
const __url = "http://localhost:3000";
```

## --fcc-end--
