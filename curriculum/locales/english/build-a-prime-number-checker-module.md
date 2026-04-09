# Build a Prime Number Checker Module

```json
{ "tags": ["Certification Project"] }
```

Practice building and exporting an NPM module by creating a prime number checker.

## 0

### --description--

In this project, you will apply what you learned about building npm modules to create a `prime-checker` module from scratch. Work within the `build-a-prime-number-checker-module/` directory.

A <dfn title="prime number">prime number</dfn> is a whole number greater than 1 that has no divisors other than 1 and itself (e.g. 2, 3, 5, 7, 11).

Within an `index.js`, write a function named `isPrime` that takes a number as an argument and returns `true` if it is prime, or `false` otherwise. Then export `isPrime` using `module.exports`.

Pass all the user stories below to complete the project.

### --tests--

You should have an `index.js` file.

```js
const __exists = await __helpers.fileExists(project.dashedName, "index.js");
assert.isTrue(__exists, "index.js should exist");
```

The project directory should be an npm package.

```js
const f = await __helpers.getFile(project.dashedName, "package.json");
assert.isString(f, "package.json should exist");
const p = JSON.parse(f);
assert.property(p, "name");
assert.property(p, "version");
assert.property(p, "description");
assert.property(p, "keywords");
assert.property(p, "license");
assert.property(p, "author");
assert.property(p, "type");

assert.isString(p.name, "the package name should be a string");
assert.isString(p.version, "the package version should be a string");
assert.isString(p.description, "the package description should be a string");
assert.isArray(p.keywords, "the package keywords should be an array");
assert.isString(p.license, "the package license should be a string");
assert.isString(p.author, "the package author should be a string");
assert.equal(p.type, "commonjs", "the package type should be commonjs");
```

Your `index.js` file should define a function named `isPrime`.

```js
const __file = await __helpers.getFile(project.dashedName, "index.js");
const __t = new __helpers.Tower(__file);
const __fn = __t.getFunction("isPrime");
assert.isDefined(__fn, "index.js should define a function named isPrime");
```

Your `isPrime` function should be exported using `module.exports`.

```js
const __file = await __helpers.getFile(project.dashedName, "index.js");
const __babelised = new __helpers.Babeliser(__file);
const __exportStatement = __babelised.getExpressionStatements().find((e) => {
  return (
    e.expression?.left?.object?.name === "module" &&
    e.expression?.left?.property?.name === "exports"
  );
});
assert.exists(
  __exportStatement,
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
for (const n of [2, 3, 5, 11, 97]) {
  assert.strictEqual(isPrime(n), true, `isPrime(${n}) should return true`);
}
```

Calling `isPrime` with a non-prime number should return `false`.

```js
const __mod = await __helpers.importSansCache(`${project.dashedName}/index.js`);
const isPrime = __mod.isPrime ?? __mod.default?.isPrime ?? __mod;
for (const n of [1, 4, 9, 15, 100]) {
  assert.strictEqual(isPrime(n), false, `isPrime(${n}) should return false`);
}
```

## --fcc-end--
