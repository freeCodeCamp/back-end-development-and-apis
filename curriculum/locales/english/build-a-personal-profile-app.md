# Build a Personal Profile App

You will build a personal profile for CamperBot using Express.

## 0

### --description--

Install your project dependencies by entering `npm i` from the `lab-personal-profile-app/` folder in the terminal.

Work within the `server.js` file.

After that, start your server by running `npm start`. Do not forget to restart your server for your code changes to take effect.

**Objective:** Fulfill the user stories below and get all the tests to pass to complete the lab.

**User Stories:**

1. You should use Express to create an HTTP server that listens on port `3000`.

2. You should have a GET route for the root path `/` that sends the response `Welcome to Camper Bot's homepage!`.

3. You should have a GET route for the `/hobbies` path that sends the response `I love cycling, boating, and playing guitar.`.

4. You should have a GET route for the `/skills` path that sends the response `JavaScript, Node.js, and Express.js!`.

5. You should have a GET route for the `/api/profile` path that sends a JSON response with a `name` property set to `Camper Bot`, a `hobbies` property containing an array of strings `['cycling', 'boating', 'guitar']`, and a `skills` property containing an array of strings `['JavaScript', 'Node.js', 'Express.js']`.

6. When the server starts listening, you should log the message `Personal Profile App running at http://localhost:3000` to the console.

### --tests--

Your server should use Express.

```js
const file = await __helpers.getFile("lab-personal-profile-app", "server.js");
assert.match(
  file,
  /require\s*\(\s*['"]express['"]\s*\)|import\s+\w+.*from\s+['"]express['"]/,
);
```

Running `node lab-personal-profile-app/server.js` should start an HTTP server listening on port `3000`.

```js
const { stdout } = await __helpers.awaitExecution(
  ["node", "lab-personal-profile-app/server.js"],
  "http://localhost:3000",
  {},
);
const isListening = await __helpers.isServerListening(3000);
assert.isTrue(isListening, "Your server should be listening on port 3000");
```

You should have a GET route for the root path `/` that sends the response `Welcome to Camper Bot's homepage!`.

```js
try {
  const response = await fetch(`${__url}`);
  const data = await response.json();
  assert.strictEqual(data, "Welcome to Camper Bot's homepage!");
} catch (e) {
  assert.fail(e);
}
```

You should have a GET route for the `/hobbies` path that sends the response `I love cycling, boating, and playing guitar.`.

```js
try {
  const response = await fetch(`${__url}hobbies`);
  const data = await response.json();
  assert.strictEqual(data, "I love cycling, boating, and playing guitar.");
} catch (e) {
  assert.fail(e);
}
```

You should have a GET route for the `/skills` path that sends the response `JavaScript, Node.js, and Express.js!`.

```js
try {
  const response = await fetch(`${__url}skills`);
  const data = await response.json();
  assert.strictEqual(data, "JavaScript, Node.js, and Express.js!");
} catch (e) {
  assert.fail(e);
}
```

The `/api/profile` route should return a JSON object with a `name` property set to `Camper Bot`.

```js
try {
  const response = await fetch(`${__url}api/profile`);
  const data = await response.json();
  assert.strictEqual(data.name, "Camper Bot");
} catch (e) {
  assert.fail(e);
}
```

The `/api/profile` route should return a JSON object with a `hobbies` property containing an array of strings for the hobbies `['cycling', 'boating', 'guitar']`.

```js
try {
  const response = await fetch(`${__url}api/profile`);
  const data = await response.json();
  assert.deepEqual(data.hobbies, ["cycling", "boating", "guitar"]);
} catch (e) {
  assert.fail(e);
}
```

The `/api/profile` route should return a JSON object with a `skills` property containing an array of strings for the skills `['JavaScript', 'Node.js', 'Express.js']`.

```js
try {
  const response = await fetch(`${__url}api/profile`);
  const data = await response.json();
  assert.deepEqual(data.skills, ["JavaScript", "Node.js", "Express.js"]);
} catch (e) {
  assert.fail(e);
}
```

When the server starts listening, you should log the message `Personal Profile App running at http://localhost:3000` to the console.

```js
const expectedData = "Personal Profile App running at http://localhost:3000";
const { stdout } = await __helpers.awaitExecution(
  ["node", "lab-personal-profile-app/server.js"],
  "http://localhost:3000",
  { expectedData },
);
assert.include(stdout, expectedData);
```

### --before-each--

```js
const __url = "http://localhost:3000/";
```

## --fcc-end--
