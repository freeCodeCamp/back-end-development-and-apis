# Build a Timestamp Microservice

In this certification project, you will build an Express-based API for parsing and formatting dates.

## 0

### --description--

Build a full stack JavaScript app that is functionally similar to this: https://timestamp-microservice.freecodecamp.rocks/

Install your project dependencies by entering `npm i` from the `build-a-timestamp-microservice/` folder in the terminal.

Work within the `server.js` file.

After that, start your server by running `npm start`. Do not forget to restart your server in order for your code changes to take place.

Pass all the user stories below to complete the project.

### --tests--

A request to `/api/:date?` with a valid date should return a JSON object with a `unix` key that is a Unix timestamp of the input date in milliseconds.

```js
// 1
try {
  const response = await fetch(`${__url}api/2016-12-25`);
  const data = await response.json();
  assert.strictEqual(data.unix, 1482624000000);
} catch (e) {
  assert.fail();
}
```

A request to `/api/:date?` with a valid date should return a JSON object with a `utc` key that is a string of the input date in the format: `Thu, 01 Jan 1970 00:00:00 GMT`.

```js
// 2
const response = await fetch(`${__url}api/2016-12-25`);
const data = await response.json();
assert.strictEqual(data.utc, "Sun, 25 Dec 2016 00:00:00 GMT");
```

A request to `/api/1451001600000` should return `{ unix: 1451001600000, utc: "Fri, 25 Dec 2015 00:00:00 GMT" }`.

```js
// 3
const response = await fetch(`${__url}api/1451001600000`);
const data = await response.json();
assert.equal(data.unix, 1451001600000);
assert.equal(data.utc, "Fri, 25 Dec 2015 00:00:00 GMT");
```

Your project can handle dates that can be successfully parsed by `new Date(date_string)`.

```js
// 4
const response = await fetch(`${__url}api/05 October 2011`);
const data = await response.json();
console.log(data);
assert.equal(data.unix, 1317772800000);
assert.equal(data.utc, "Wed, 05 Oct 2011 00:00:00 GMT");
```

If the input date string is invalid, the api returns an object having the structure `{ error : "Invalid Date" }`.

```js
// 5
const response = await fetch(`${__url}api/this-is-not-a-date`);
const data = await response.json();
assert.strictEqual(data.error.toLowerCase(), "invalid date");
```

An empty date parameter should return the current time in a JSON object with a `unix` key.

```js
// 6
const response = await fetch(`${__url}api`);
const data = await response.json();
const now = Date.now();
assert.isBelow((data.unix - now).toString().length, 6);
```

An empty date parameter should return the current time in a JSON object with a `utc` key.

```js
// 7
const response = await fetch(`${__url}api`);
const data = await response.json();
const now = Date.now();
const serverTime = new Date(data.utc).getTime();
assert.isBelow((serverTime - now).toString.length, 6);
```

### --before-each--

```js
const __url = "http://localhost:8000/";
```

## --fcc-end--
