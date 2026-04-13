# Build a Personal Profile App

```json
{ "tags": ["Certification Project"] }
```

Practice building an Express server and JSON API by creating a personal profile application.

## 0

### --description--

Install your project dependencies by entering `npm i` from the `build-a-personal-profile-app/` folder in the terminal.

Do not forget to restart your server for your code changes to take effect.

**Objective:** Fulfill the user stories below and get all the tests to pass.

**User Stories:**

2. You should use Express to create an HTTP server that listens on port `3000`.

3. You should have a GET route for the root path `/` that sends the response `Welcome to Camper Bot's homepage!`.

4. You should have a GET route for the `/hobbies` path that sends the response `I cycle, go boating, and play guitar.`.

5. You should have a GET route for the `/skills` path that sends the response `JavaScript, Node.js, and Express.js!`.

6. You should have a GET route for the `/api/profile` path that sends a JSON response with a `name` property set to `Camper Bot`, a `hobbies` property containing an array of strings `['cycling', 'boating', 'guitar']`, and a `skills` property containing an array of strings `['JavaScript', 'Node.js', 'Express.js']`.

7. When the server starts listening, you should log the message `Personal Profile App running at http://localhost:3000` to the console.

### --tests--

You should install `express` in `build-a-personal-profile-app/`.

```js
const packageJson = JSON.parse(
  await __helpers.getFile(project.dashedName, "package.json"),
);
const version = packageJson.dependencies?.["express"];
assert.exists(version, "You should have express in your dependencies");
```

You should have an HTTP server listening on port `3000`.

```js
const isListening = await __helpers.isServerListening(3000);
assert.isTrue(isListening, "Your server should be listening on port 3000");
```

You should have a GET route for the root path `/` that sends the response `Welcome to Camper Bot's homepage!`.

```js
const response = await fetch(`${__url}`);
const data = await response.text();
assert.strictEqual(data, "Welcome to Camper Bot's homepage!");
```

You should have a GET route for the `/hobbies` path that sends the response `I cycle, go boating, and play guitar.`.

```js
const response = await fetch(`${__url}hobbies`);
const data = await response.text();
assert.strictEqual(data, "I cycle, go boating, and play guitar.");
```

You should have a GET route for the `/skills` path that sends the response `JavaScript, Node.js, and Express.js!`.

```js
const response = await fetch(`${__url}skills`);
const data = await response.text();
assert.strictEqual(data, "JavaScript, Node.js, and Express.js!");
```

The `/api/profile` route should return a JSON response with the correct content type.

```js
const response = await fetch(`${__url}api/profile`);
const headers = response.headers;
assert.include(headers["content-type"], "application/json");
```

The `/api/profile` route should return a JSON object with a `name` property set to `Camper Bot`.

```js
const response = await fetch(`${__url}api/profile`);
const data = await response.json();
assert.strictEqual(data.name, "Camper Bot");
```

The `/api/profile` route should return a JSON object with a `hobbies` property containing an array of strings for the hobbies `['cycling', 'boating', 'guitar']`.

```js
const response = await fetch(`${__url}api/profile`);
const data = await response.json();
assert.deepEqual(data.hobbies, ["cycling", "boating", "guitar"]);
```

The `/api/profile` route should return a JSON object with a `skills` property containing an array of strings for the skills `['JavaScript', 'Node.js', 'Express.js']`.

```js
const response = await fetch(`${__url}api/profile`);
const data = await response.json();
assert.deepEqual(data.skills, ["JavaScript", "Node.js", "Express.js"]);
```

### --before-each--

```js
const __url = "http://localhost:3000/";
```

## --fcc-end--
