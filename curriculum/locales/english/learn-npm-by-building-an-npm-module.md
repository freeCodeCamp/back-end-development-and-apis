# Learn NPM by Building an NPM Module

In this project, you will learn how to create an NPM module. You will create a simple module that can be used to convert strings to lowercase or uppercase. You will also learn how to publish your module to the NPM registry so that others can use it.

## 0

### --description--

In order to build an npm module, you have to create an empty directory first.

Within the `learn-npm-by-building-an-npm-module/` directory, run `mkdir case_converter` in the terminal.

### --tests--

Example test.

```js
assert.fail();
```

## 1

### --description--

Run `cd case_converter` to change to the directory you just created.

### --tests--

You should be in the `case_converter/` directory.

```js
assert.fail();
```

### --seed--

#### --cmd--

```bash
mkdir learn-npm-by-building-an-npm-module/case_converter
```

## 2

### --description--

In order to build an npm module, you should create and configure a `package.json` file.

Run the `npm init` command to create and initialize a `package.json` file.

### --tests--

You should run `npm init` in the terminal.

```js
assert.fail();
```

## 3

### --description--

This utility walks you through creating a `package.json` file. It only covers the most common items, and tries to guess sensible defaults.

You are being prompted for the package name. By default, `npm init` uses the directory name as the package name. Press `Enter` to accept the default.

### --hints--

#### 0

Run `npm help json` for definitive documentation on the available fields and what they do.

### --tests--

You should press `Enter` to accept the default package name.

```js
assert.fail();
```

## 4

### --description--

You are being prompted for the package version. Versions are usually in the format `X.Y.Z`.

- `X`: Major revision number for when significant changes are made that may break backwards compatibility
- `Y`: Minor revision number for when new features are added in a backwards-compatible manner
- `Z`: Patch revision number for when backwards-compatible bug fixes are made

Press `Enter` to accept the default version, `1.0.0`.

### --tests--

You should press `Enter` to accept the default version.

```js
assert.fail();
```

## 5

### --description--

You are being prompted for the package description. This is a brief description of your what your package is/does.

Write `This package is used to convert strings to a specific case.`, then press `Enter`.

### --tests--

You should write `This package is used to convert strings to a specific case.` and press `Enter`.

```js
assert.fail();
```

## 6

### --description--

You are being prompted for your package entry point. This is the main module that will be loaded when your package is required/imported.

Press `Enter` to accept the default entry point, `index.js`.

### --tests--

You should press `Enter` to accept the default entry point.

```js
assert.fail();
```

## 7

### --description--

You are being prompted for the test command. This is the command that is run with the `npm test` command.

Write `node index.test.js`, then press `Enter`.

### --tests--

You should write `node index.test.js` and press `Enter`.

```js
assert.fail();
```

## 8

### --description--

You are being prompted for the Git repository. This is the URL of the repository where the source code for your package lives.

Press `Enter` to accept the default Git repository.

### --tests--

You should press `Enter` to accept the default Git repository.

```js
assert.fail();
```

## 9

### --description--

You are being prompted for the keywords. These are keywords that help people find your package when searching for it on the npm registry.

Write `case,converter,uppercase,lowercase`, then press `Enter`.

### --tests--

You should write `case,converter,uppercase,lowercase` and press `Enter`.

```js
assert.fail();
```

## 10

### --description--

You are being prompted for the author. This is the name of the package author.

Write your name, then press `Enter`.

### --tests--

You should write your name and press `Enter`.

```js
assert.fail();
```

## 11

### --description--

You are being prompted for the license. This is the license that your package is released under.

Write `MIT`, then press `Enter`.

### --hints--

#### 0

There are many different licenses that you can choose from. The MIT license is a popular choice for open-source projects.

### --tests--

You should write `MIT` and press `Enter`.

```js
assert.fail();
```

## 12

### --description--

You are being prompted to confirm that the information you entered is correct.

Press `Enter` to confirm.

### --tests--

You should press `Enter` to confirm.

```js
assert.fail();
```

## 13

### --description--

Within the `case_converter/` directory, create the entry point file `index.js`.

### --tests--

You should have a file named `index.js` in the `case_converter/` directory.

```js
assert.fail();
```

### --seed--

#### --cmd--

```bash
touch learn-npm-by-building-an-npm-module/case_converter/package.json
```

#### --"learn-npm-by-building-an-npm-module/case_converter/package.json"--

```json
{
  "name": "case_converter",
  "version": "1.0.0",
  "description": "This package is used to convert strings to a specific case.",
  "main": "index.js",
  "scripts": {
    "test": "node index.test.js"
  },
  "repository": "",
  "keywords": ["case", "converter", "uppercase", "lowercase"],
  "author": "Camper",
  "license": "MIT"
}
```

## 14

### --description--

Within the `index.js` file, create a function, `getUpperCase`, which takes a string as an argument, and returns an uppercase version of the string.

### --tests--

The `index.js` file should contain a function named `getUpperCase`.

```js
assert.fail();
```

The `getUpperCase` function should take one argument.

```js
assert.fail();
```

The `getUpperCase` function should return an uppercase version of the string.

```js
assert.fail();
```

### --seed--

#### --cmd--

```bash
touch learn-npm-by-building-an-npm-module/case_converter/index.js
```

## 15

### --description--

Within the `index.js` file, create a function, `getLowerCase`, which takes a string as an argument, and returns a lowercase version of the string.

### --tests--

The `index.js` file should contain a function named `getLowerCase`.

```js
assert.fail();
```

The `getLowerCase` function should take one argument.

```js
assert.fail();
```

The `getLowerCase` function should return a lowercase version of the string.

```js
assert.fail();
```

### --seed--

#### --"learn-npm-by-building-an-npm-module/case_converter/index.js"--

```js
function getUpperCase(str) {
  return str.toUpperCase();
}
```

## 16

### --description--

Within `index.js`, create a function, `getSentenceCase`, which takes a string as an argument.

### --tests--

The `index.js` file should contain a function named `getSentenceCase`.

```js
assert.fail();
```

The `getSentenceCase` function should take one argument.

```js
assert.fail();
```

### --seed--

#### --"learn-npm-by-building-an-npm-module/case_converter/index.js"--

```js
function getUpperCase(str) {
  return str.toUpperCase();
}

function getLowerCase(str) {
  return str.toLowerCase();
}
```

## 17

### --description--

Within `getSentenceCase`, return a string of the argument with the first character of the first word capitalized and the rest lowercase.

### --tests--

`getSentenceCase("hello world")` should return `"Hello world"`.

```js
assert.strictEqual(getSentenceCase("hello world"), "Hello world");
```

`getSentenceCase("HELLO WORLD")` should return `"Hello world"`.

```js
assert.strictEqual(getSentenceCase("HELLO WORLD"), "Hello world");
```

`getSentenceCase("hELLO wORLD")` should return `"Hello world"`.

```js
assert.strictEqual(getSentenceCase("hELLO wORLD"), "Hello world");
```

### --seed--

#### --"learn-npm-by-building-an-npm-module/case_converter/index.js"--

```js
function getUpperCase(str) {
  return str.toUpperCase();
}

function getLowerCase(str) {
  return str.toLowerCase();
}

function getSentenceCase(str) {}
```

## 18

### --description--

Within `index.js`, create a function, `getProperCase`, which takes a string as an argument.

### --tests--

The `index.js` file should contain a function named `getProperCase`.

```js
assert.fail();
```

The `getProperCase` function should take one argument.

```js
assert.fail();
```

### --seed--

#### --"learn-npm-by-building-an-npm-module/case_converter/index.js"--

```js
function getUpperCase(str) {
  return str.toUpperCase();
}

function getLowerCase(str) {
  return str.toLowerCase();
}

function getSentenceCase(str) {
  const lowerStr = getLowerCase(str);
  return lowerStr.charAt(0).toUpperCase() + lowerStr.slice(1);
}
```

## 19

### --description--

Within `getProperCase`, return a string of the argument with the first character of each word capitalized and the rest lowercase.

### --tests--

`getProperCase("hello world")` should return `"Hello World"`.

```js
assert.strictEqual(getProperCase("hello world"), "Hello World");
```

`getProperCase("HELLO WORLD")` should return `"Hello World"`.

```js
assert.strictEqual(getProperCase("HELLO WORLD"), "Hello World");
```

`getProperCase("hELLO wORLD")` should return `"Hello World"`.

```js
assert.strictEqual(getProperCase("hELLO wORLD"), "Hello World");
```

### --seed--

#### --"learn-npm-by-building-an-npm-module/case_converter/index.js"--

```js
function getUpperCase(str) {
  return str.toUpperCase();
}

function getLowerCase(str) {
  return str.toLowerCase();
}

function getSentenceCase(str) {
  const lowerStr = getLowerCase(str);
  return lowerStr.charAt(0).toUpperCase() + lowerStr.slice(1);
}

function getProperCase(str) {}
```

## 20

### --description--

In order for your functions to be imported by other modules, you need to export them:

```js
module.exports = {
  myFunction,
  myOtherFunction,
};
```

Use `module.exports` to export the `getUpperCase`, `getLowerCase`, `getSentenceCase`, and `getProperCase` functions.

### --tests--

The `index.js` file should export the `getUpperCase`, `getLowerCase`, `getSentenceCase`, and `getProperCase` functions.

```js
assert.fail();
```

### --seed--

#### --"learn-npm-by-building-an-npm-module/case_converter/index.js"--

```js
function getUpperCase(str) {
  return str.toUpperCase();
}

function getLowerCase(str) {
  return str.toLowerCase();
}

function getSentenceCase(str) {
  const lowerStr = getLowerCase(str);
  return lowerStr.charAt(0).toUpperCase() + lowerStr.slice(1);
}

function getProperCase(str) {
  const properCaseArr = str.split(" ").map((word) => getSentenceCase(word));
  return properCaseArr.join(" ");
}
```

## 21

### --description--

It is good practice to document your package so that others know how to use it. Do this by adding a `README.md` file to your package.

### --tests--

You should have a file named `README.md` in the `case_converter/` directory.

```js
assert.fail();
```

### --seed--

#### --"learn-npm-by-building-an-npm-module/case_converter/index.js"--

```js
function getUpperCase(str) {
  return str.toUpperCase();
}

function getLowerCase(str) {
  return str.toLowerCase();
}

function getSentenceCase(str) {
  const lowerStr = getLowerCase(str);
  return lowerStr.charAt(0).toUpperCase() + lowerStr.slice(1);
}

function getProperCase(str) {
  const properCaseArr = str.split(" ").map((word) => getSentenceCase(word));
  return properCaseArr.join(" ");
}

module.exports = {
  getProperCase,
  getLowerCase,
  getUpperCase,
  getSentenceCase,
};
```

## 22

### --description--

In Markdown, the `#` symbol is used to create a level-1 heading:

```markdown
# My H1 Heading
```

Give your `README.md` file a title. This should be the name of your package.

### --tests--

The `README.md` file should contain `# Case Converter`.

```js
assert.fail();
```

### --seed--

#### --cmd--

```bash
touch learn-npm-by-building-an-npm-module/case_converter/README.md
```

## 23

### --description--

Add your package description to the `README.md` file as plain text.

### --tests--

The `README.md` file should contain `This package is used to convert strings to a specific case.`.

```js
assert.fail();
```

### --seed--

#### --"learn-npm-by-building-an-npm-module/case_converter/README.md"--

```markdown
# Case Converter
```

## 24

### --description--

In Markdown, the `##` symbol is used to create a level-2 heading:

```markdown
## My H2 Heading
```

Create a level-2 heading, `Installation`, in the `README.md` file for the installation instructions.

### --tests--

The `README.md` file should contain `## Installation`.

```js
assert.fail();
```

### --seed--

#### --"learn-npm-by-building-an-npm-module/case_converter/README.md"--

```markdown
# Case Converter

This package is used to convert strings to a specific case.
```

## 25

### --description--

Add the installation instructions to the `README.md` file. This should be a code block that shows how to install your package using npm:

````markdown
```bash
npm install case_converter
```
````

### --tests--

The `README.md` file should contain the installation instructions.

```js
assert.fail();
```

### --seed--

#### --"learn-npm-by-building-an-npm-module/case_converter/README.md"--

```markdown
# Case Converter

This package is used to convert strings to a specific case.

## Installation
```

## 26

### --description--

Add a second level-2 heading, `Usage`, to the `README.md` file for the usage instructions.

### --tests--

The `README.md` file should contain `## Usage`.

```js
assert.fail();
```

### --seed--

#### --"learn-npm-by-building-an-npm-module/case_converter/README.md"--

````markdown
# Case Converter

This package is used to convert strings to a specific case.

## Installation

```bash
npm install case_converter
```
````

## --fcc-end--
