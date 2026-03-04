# Build CamperBot's Personal Profile App

You will build a personal profile for CamperBot using Express.

## 0

### --description--

Build an API that satisfies the below user stories:

Install your project dependencies by entering `npm i` from the `lab-personal-profile-app/` folder in the terminal.

Work within the `server.js` file.

After that, start your server by running `npm start`. Do not forget to restart your server in order for your code changes to take place.

**Objective:** Fulfill the user stories below and get all the tests to pass to complete the lab.

**User Stories:**

1. You should import the `express` module.

2. You should create an Express application instance and assign it to a variable named `app`.

3. You should define a `port` variable and assign it the value `3000`.

4. You should have a GET route for the root path `/` that sends the response `Welcome to Camper Bot's homepage!`.

5. You should have a GET route for the `/hobbies` path that sends the response `I love cycling, boating, and playing guitar.`.

6. You should have a GET route for the `/skills` path that sends the response `JavaScript, Node.js, and Express.js!`.

7. You should have a GET route for the `/api/profile` path that sends a JSON response.

8. The `/api/profile` route should return a JSON object with a `name` property set to `Camper Bot`.

9. The `/api/profile` route should return a JSON object with a `hobbies` property containing an array of strings for the hobbies `['cycling', 'boating', 'guitar']`.

10. The `/api/profile` route should return a JSON object with a `skills` property containing an array of strings for the skills `['JavaScript', 'Node.js', 'Express.js']`.

11. Your application should listen on the port specified in the `port` variable.

12. When the server starts listening, you should log the message `Personal Profile App running at http://localhost:3000` to the console.

### --tests--

You should have a GET route for the root path `/` that sends the response `Welcome to Camper Bot's homepage!`.

```js
try {
  const response = await fetch(`${__url}`);
  const data = await response.json();
  assert.strictEqual(data, "Welcome to Camper Bot's homepage!");
} catch (e) {
  assert.fail();
}
```

You should have a GET route for the `/hobbies` path that sends the response `I love cycling, boating, and playing guitar.`.

```js
try {
  const response = await fetch(`${__url}hobbies`);
  const data = await response.json();
  assert.strictEqual(data, "I love cycling, boating, and playing guitar.");
} catch (e) {
  assert.fail();
}
```

You should have a GET route for the `/skills` path that sends the response `JavaScript, Node.js, and Express.js!`.

```js
try {
  const response = await fetch(`${__url}skills`);
  const data = await response.json();
  assert.strictEqual(data, "JavaScript, Node.js, and Express.js!");
} catch (e) {
  assert.fail();
}
```

You should have a GET route for the `/api/profile` path that sends a JSON response.

```js
try {
  const response = await fetch(`${__url}api/profile`);
  const data = await response.json();
  assert.isOk(data);
} catch (e) {
  assert.fail();
}
```

The `/api/profile` route should return a JSON object with a `name` property set to `Camper Bot`.

```js
try {
  const response = await fetch(`${__url}api/profile`);
  const data = await response.json();
  assert.strictEqual(data.name, "Camper Bot");
} catch (e) {
  assert.fail();
}
```

The `/api/profile` route should return a JSON object with a `hobbies` property containing an array of strings for the hobbies `['cycling', 'boating', 'guitar']`.

```js
try {
  const response = await fetch(`${__url}api/profile`);
  const data = await response.json();
  assert.deepEqual(data.hobbies, ['cycling', 'boating', 'guitar']);
} catch (e) {
  assert.fail();
}
```

The `/api/profile` route should return a JSON object with a `skills` property containing an array of strings for the skills `['JavaScript', 'Node.js', 'Express.js']`.

```js
try {
  const response = await fetch(`${__url}api/profile`);
  const data = await response.json();
  assert.deepEqual(data.skills, ['JavaScript', 'Node.js', 'Express.js']");
} catch (e) {
  assert.fail();
}
```

When the server starts listening, you should log the message `Personal Profile App running at http://localhost:3000` to the console.

```js
const expectedData = "Personal Profile App running at http://localhost:3000";
const { stdout } = await __helpers.awaitExecution(
  ["node", "lab-personal-profile-app/server.js"],
  "http://localhost:3000",
  { expectedData }
);
assert.include(stdout, expectedData);
```

### --before-each--

```js
const __url = "http://localhost:3000/";
```

## --fcc-end--
