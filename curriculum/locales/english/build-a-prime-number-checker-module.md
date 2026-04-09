# Build a Prime Number Checker Module

```json
{ "tags": ["Certification Project"] }
```

Practice building and exporting an NPM module by creating a prime number checker.

## 0

### --description--

In this project, you will apply what you learned about building npm modules to create a `prime-checker` module from scratch. Work within the `build-a-prime-number-checker-module/` directory.

A <dfn title="prime number">prime number</dfn> is a whole number greater than 1 that has no divisors other than 1 and itself (e.g. 2, 3, 5, 7, 11).

In `index.js`, write a function named `isPrime` that takes a number as an argument and returns `true` if it is prime, or `false` otherwise. Then export `isPrime` using `module.exports`.

Pass all the user stories below to complete the project.

### --tests--

You should have an `index.js` file.

```js

```

The project directory should be an npm package.

```js

```

Your `index.js` file should define a function named `isPrime`.

```js
const __file = await __helpers.getFile(project.dashedName, "index.js");
assert.match(
  __file,
  /function isPrime\s*\(|isPrime\s*=\s*(\(|function)/,
  "index.js should define an isPrime function",
);
```

Your `isPrime` function should be exported using `module.exports`.

```js
const __file = await __helpers.getFile(project.dashedName, "index.js");
assert.match(
  __file,
  /module\.exports/,
  "index.js should use module.exports to export",
);
const __mod = await __helpers.importSansCache(`${project.dashedName}/index.js`);
assert.isFunction(
  __mod.isPrime ?? __mod.default?.isPrime ?? __mod,
  "isPrime should be exported",
);
```

Calling `isPrime` with a prime number should return `true`.

```js
const __mod = await __helpers.importSansCache(`${project.dashedName}/index.js`);
const isPrime = __mod.isPrime ?? __mod.default?.isPrime ?? __mod;
assert.strictEqual(isPrime(2), true, "isPrime(2) should return true");
```

Calling `isPrime` with a non-prime number should return `false`.

```js
const __mod = await __helpers.importSansCache(`${project.dashedName}/index.js`);
const isPrime = __mod.isPrime ?? __mod.default?.isPrime ?? __mod;
assert.strictEqual(isPrime(2), true, "isPrime(2) should return false");
```

### --seed--

#### --"build-a-prime-number-checker-module/package.json"--

```json
{
  "name": "prime-checker",
  "version": "1.0.0",
  "description": "A module that exports a function to check if a number is prime.",
  "main": "index.js",
  "scripts": {
    "start": "node index.js"
  },
  "keywords": ["prime", "checker", "math"],
  "author": "",
  "license": "MIT"
}
```

#### --"build-a-prime-number-checker-module/index.js"--

```js
// Write your isPrime function here and export it
```

## --fcc-end--
