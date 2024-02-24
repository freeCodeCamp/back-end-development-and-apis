# Learn NPM by Building an NPM Module

In this project, you will learn how to create an NPM module. You will create a simple module that can be used to convert strings to lowercase or uppercase. You will also learn how to publish your module to the NPM registry so that others can use it.

## 0

### --description--

In this project, you will be creating an npm module that can be used to convert strings to a specific case. For the duration of this project, you will be working in the `learn-npm-by-building-an-npm-module/` directory.

Open a new terminal, and run `cd learn-npm-by-building-an-npm-module` to change to the project directory.

### --tests--

You should be in the `learn-npm-by-building-an-npm-module/` directory.

```js
const cwd = await __helpers.getLastCWD();
assert.include(cwd, "learn-npm-by-building-an-npm-module");
```

## 1

### --description--

In order to build an npm module, you have to create an empty directory first.

Within the `learn-npm-by-building-an-npm-module/` directory, run `mkdir case_converter` in the terminal.

### --tests--

You should have a directory named `case_converter` in the `learn-npm-by-building-an-npm-module/` directory.

```js
const dir = await __helpers.getDir("learn-npm-by-building-an-npm-module");
assert.include(dir, "case_converter");
```

### --seed--

#### --cmd--

```bash
cd learn-npm-by-building-an-npm-module && rm -r .
```

## 2

### --description--

Run `cd case_converter` to change to the directory you just created.

### --tests--

You should be in the `case_converter/` directory.

```js
const cwd = await __helpers.getLastCWD();
assert.include(cwd, "case_converter");
```

### --seed--

#### --cmd--

```bash
mkdir learn-npm-by-building-an-npm-module/case_converter
```

## 3

### --description--

In order to build an npm module, you should create and configure a `package.json` file.

Run the `npm init` command to create and initialize a `package.json` file.

**NOTE:** `npm init` enters an interactive session that asks you a series of questions about your package. Once you have followed the instructions, you need to manually click the `Run Tests` button.

### --tests--

You should run `npm init` in the terminal.

```js
const temp = await __helpers.getTemp();
assert.include(temp, "npm init");
```

## 4

### --description--

This utility walks you through creating a `package.json` file. It only covers the most common items, and tries to guess sensible defaults.

You are being prompted for the package name. By default, `npm init` uses the directory name as the package name. Press `Enter` to accept the default.

### --hints--

#### 0

Run `npm help json` for definitive documentation on the available fields and what they do.

### --tests--

You should press `Enter` to accept the default package name.

```js
const temp = await __helpers.getTemp();
assert.include(temp, "1.0.0");
```

### --seed--

#### --cmd--

```bash
npm init -y
```

## 5

### --description--

You are being prompted for the package version. Versions are usually in the format `X.Y.Z`.

- `X`: Major revision number for when significant changes are made that may break backwards compatibility
- `Y`: Minor revision number for when new features are added in a backwards-compatible manner
- `Z`: Patch revision number for when backwards-compatible bug fixes are made

Press `Enter` to accept the default version, `1.0.0`.

### --tests--

You should press `Enter` to accept the default version.

```js
const temp = await __helpers.getTemp();
assert.include(temp, "description:");
```

## 6

### --description--

You are being prompted for the package description. This is a brief description of your what your package is/does.

Write `This package is used to convert strings to a specific case.`, then press `Enter`.

### --tests--

You should write `This package is used to convert strings to a specific case.` and press `Enter`.

```js
const temp = await __helpers.getTemp();
const description = temp.match(/description: (.*)/)[1];
// Oddly, the typed values are not visible in the temp output
assert.include(description, "entry point:");
```

## 7

### --description--

You are being prompted for your package entry point. This is the main module that will be loaded when your package is required/imported.

Press `Enter` to accept the default entry point, `index.js`.

### --tests--

You should press `Enter` to accept the default entry point.

```js
const temp = await __helpers.getTemp();
assert.include(temp, "test command:");
```

## 8

### --description--

You are being prompted for the test command. This is the command that is run with the `npm test` command.

Write `node index.test.js`, then press `Enter`.

### --tests--

You should write `node index.test.js` and press `Enter`.

```js
const temp = await __helpers.getTemp();
assert.include(temp, "git repository:");
```

## 9

### --description--

You are being prompted for the Git repository. This is the URL of the repository where the source code for your package lives.

Press `Enter` to accept the default Git repository.

### --tests--

You should press `Enter` to accept the default Git repository.

```js
const temp = await __helpers.getTemp();
assert.include(temp, "keywords:");
```

## 10

### --description--

You are being prompted for the keywords. These are keywords that help people find your package when searching for it on the npm registry.

Write `case,converter,uppercase,lowercase`, then press `Enter`.

### --tests--

You should write `case,converter,uppercase,lowercase` and press `Enter`.

```js
const temp = await __helpers.getTemp();
assert.include(temp, "author:");
```

## 11

### --description--

You are being prompted for the author. This is the name of the package author.

Write your name, then press `Enter`.

### --tests--

You should write your name and press `Enter`.

```js
const temp = await __helpers.getTemp();
assert.include(temp, "license:");
```

## 12

### --description--

You are being prompted for the license. This is the license that your package is released under.

Write `MIT`, then press `Enter`.

### --hints--

#### 0

There are many different licenses that you can choose from. The MIT license is a popular choice for open-source projects.

### --tests--

You should write `MIT` and press `Enter`.

```js
const temp = await __helpers.getTemp();
assert.include(temp, "About to write to");
```

## 13

### --description--

You are being prompted to confirm that the information you entered is correct.

Press `Enter` to confirm.

### --tests--

You should press `Enter` to confirm.

```js
const packageJsonExists = await __helpers.fileExists(
  "learn-npm-by-building-an-npm-module/case_converter/package.json"
);
assert.isTrue(packageJsonExists, "The package.json file does not exist");
```

## 14

### --description--

Within the `case_converter/` directory, create the entry point file `index.js`.

### --tests--

You should have a file named `index.js` in the `case_converter/` directory.

```js
const fileExists = await __helpers.fileExists(
  "learn-npm-by-building-an-npm-module/case_converter/index.js"
);
assert.isTrue(fileExists, "The index.js file does not exist");
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

## 15

### --description--

Within the `index.js` file, create a function, `getUpperCase`, which takes a string as an argument, and returns an uppercase version of the string.

### --tests--

The `index.js` file should contain a function named `getUpperCase`.

```js
const file = await __helpers.getFile(
  project.dashedName,
  "case_converter/index.js"
);
assert.match(file, /function getUpperCase\(|getUpperCase\s*=\s*\(/);
```

The `getUpperCase` function should return an uppercase version of the string argument.

```js
const file = await __helpers.getFile(
  project.dashedName,
  "case_converter/index.js"
);
const evalCode = `${file}
assert.strictEqual(getUpperCase("hello"), "HELLO");
`;
const _ = eval(evalCode);
```

### --seed--

#### --cmd--

```bash
touch learn-npm-by-building-an-npm-module/case_converter/index.js
```

## 16

### --description--

Within the `index.js` file, create a function, `getLowerCase`, which takes a string as an argument, and returns a lowercase version of the string.

### --tests--

The `index.js` file should contain a function named `getLowerCase`.

```js
const file = await __helpers.getFile(
  project.dashedName,
  "case_converter/index.js"
);
assert.match(file, /function getLowerCase\(|getLowerCase\s*=\s*\(/);
```

The `getLowerCase` function should return a lowercase version of the string.

```js
const file = await __helpers.getFile(
  project.dashedName,
  "case_converter/index.js"
);
const evalCode = `${file}
assert.strictEqual(getLowerCase("HELLO"), "hello");
`;
const _ = eval(evalCode);
```

### --seed--

#### --"learn-npm-by-building-an-npm-module/case_converter/index.js"--

```js
function getUpperCase(str) {
  return str.toUpperCase();
}
```

## 17

### --description--

Within `index.js`, create a function, `getSentenceCase`, which takes a string as an argument.

### --tests--

The `index.js` file should contain a function named `getSentenceCase`.

```js
const file = await __helpers.getFile(
  project.dashedName,
  "case_converter/index.js"
);
assert.match(file, /function getSentenceCase\(|getSentenceCase\s*=\s*\(/);
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

## 18

### --description--

Within `getSentenceCase`, return a string of the argument with the first character of the first word capitalized and the rest lowercase.

### --tests--

`getSentenceCase("hello world")` should return `"Hello world"`.

```js
const file = await __helpers.getFile(
  project.dashedName,
  "case_converter/index.js"
);
const evalCode = `${file}
assert.strictEqual(getSentenceCase("hello world"), "Hello world");
`;
const _ = eval(evalCode);
```

`getSentenceCase("HELLO WORLD")` should return `"Hello world"`.

```js
const file = await __helpers.getFile(
  project.dashedName,
  "case_converter/index.js"
);
const evalCode = `${file}
assert.strictEqual(getSentenceCase("HELLO WORLD"), "Hello world");
`;
const _ = eval(evalCode);
```

`getSentenceCase("hELLO wORLD")` should return `"Hello world"`.

```js
const file = await __helpers.getFile(
  project.dashedName,
  "case_converter/index.js"
);
const evalCode = `${file}
assert.strictEqual(getSentenceCase("hELLO wORLD"), "Hello world");
`;
const _ = eval(evalCode);
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

## 19

### --description--

Within `index.js`, create a function, `getProperCase`, which takes a string as an argument.

### --tests--

The `index.js` file should contain a function named `getProperCase`.

```js
const file = await __helpers.getFile(
  project.dashedName,
  "case_converter/index.js"
);
assert.match(file, /function getProperCase\(|getProperCase\s*=\s*\(/);
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

## 20

### --description--

Within `getProperCase`, return a string of the argument with the first character of each word capitalized and the rest lowercase.

### --tests--

`getProperCase("hello world")` should return `"Hello World"`.

```js
const file = await __helpers.getFile(
  project.dashedName,
  "case_converter/index.js"
);
const evalCode = `${file}
assert.strictEqual(getProperCase("hello world"), "Hello World");
`;
const _ = eval(evalCode);
```

`getProperCase("HELLO WORLD")` should return `"Hello World"`.

```js
const file = await __helpers.getFile(
  project.dashedName,
  "case_converter/index.js"
);
const evalCode = `${file}
assert.strictEqual(getProperCase("HELLO WORLD"), "Hello World");
`;
const _ = eval(evalCode);
```

`getProperCase("hELLO wORLD")` should return `"Hello World"`.

```js
const file = await __helpers.getFile(
  project.dashedName,
  "case_converter/index.js"
);
const evalCode = `${file}
assert.strictEqual(getProperCase("hELLO wORLD"), "Hello World");
`;
const _ = eval(evalCode);
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

## 21

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
const file = await __helpers.getFile(
  project.dashedName,
  "case_converter/index.js"
);
const babelisedCode = new __helpers.Babeliser(file);
const expressionStatement = babelisedCode
  .getExpressionStatements()
  .find((e) => {
    return (
      e.expression?.left?.object?.name === "module" &&
      e.expression?.left?.property?.name === "exports"
    );
  });
assert.exists(expressionStatement);
const properties = expressionStatement.expression.right.properties;
assert.include(
  properties.map((p) => p.key.name),
  "getUpperCase"
);
assert.include(
  properties.map((p) => p.key.name),
  "getLowerCase"
);
assert.include(
  properties.map((p) => p.key.name),
  "getSentenceCase"
);
assert.include(
  properties.map((p) => p.key.name),
  "getProperCase"
);
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

## 22

### --description--

It is good practice to document your package so that others know how to use it. Do this by adding a `README.md` file to your package.

### --tests--

You should have a file named `README.md` in the `case_converter/` directory.

```js
const fileExists = await __helpers.fileExists(
  "learn-npm-by-building-an-npm-module/case_converter/README.md"
);
assert.isTrue(fileExists, "The README.md file does not exist");
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

## 23

### --description--

In Markdown, the `#` symbol is used to create a level-1 heading:

```markdown
# My H1 Heading
```

Give your `README.md` file a title. This should be the name of your package.

### --tests--

The `README.md` file should contain `# Case Converter`.

```js
const file = await __helpers.getFile(
  project.dashedName,
  "case_converter/README.md"
);
assert.match(file, /# Case Converter/);
```

### --seed--

#### --cmd--

```bash
touch learn-npm-by-building-an-npm-module/case_converter/README.md
```

## 24

### --description--

Add your package description to the `README.md` file as plain text.

### --tests--

The `README.md` file should contain `This package is used to convert strings to a specific case.`.

```js
const file = await __helpers.getFile(
  project.dashedName,
  "case_converter/README.md"
);
assert.include(
  file,
  "This package is used to convert strings to a specific case."
);
```

### --seed--

#### --"learn-npm-by-building-an-npm-module/case_converter/README.md"--

```markdown
# Case Converter
```

## 25

### --description--

In Markdown, the `##` symbol is used to create a level-2 heading:

```markdown
## My H2 Heading
```

Create a level-2 heading, `Installation`, in the `README.md` file for the installation instructions.

### --tests--

The `README.md` file should contain `## Installation`.

```js
const file = await __helpers.getFile(
  project.dashedName,
  "case_converter/README.md"
);
assert.include(file, "## Installation");
```

### --seed--

#### --"learn-npm-by-building-an-npm-module/case_converter/README.md"--

```markdown
# Case Converter

This package is used to convert strings to a specific case.
```

## 26

### --description--

Add the installation instructions to the `README.md` file. This should be a code block that shows how to install your package using npm:

````markdown
```bash
npm install case_converter
```
````

### --tests--

The `README.md` file should contain the installation instructions.

````js
const file = await __helpers.getFile(
  project.dashedName,
  "case_converter/README.md"
);
assert.include(file, "```bash\nnpm install case_converter\n```");
````

### --seed--

#### --"learn-npm-by-building-an-npm-module/case_converter/README.md"--

```markdown
# Case Converter

This package is used to convert strings to a specific case.

## Installation
```

## 27

### --description--

Add a second level-2 heading, `Usage`, to the `README.md` file for the usage instructions.

### --tests--

The `README.md` file should contain `## Usage`.

```js
const file = await __helpers.getFile(
  project.dashedName,
  "case_converter/README.md"
);
assert.include(file, "## Usage");
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

## 28

### --description--

Within the `Usage` section, add the example code showing how your API works:

````markdown
```js
const caseConverter = require("./index");
const str = "hello free Code Camp!";
console.log(caseConverter.getUpperCase(str)); // HELLO FREE CODE CAMP!
console.log(caseConverter.getLowerCase(str)); // hello free code camp!
console.log(caseConverter.getProperCase(str)); // Hello Free Code Camp!
console.log(caseConverter.getSentenceCase(str)); //
```
````

Also, finish the comment for the `getSentenceCase` function showing the output.

### --tests--

The `README.md` file should contain the given code under the `Usage` section.

````js
const file = await __helpers.getFile(
  project.dashedName,
  "case_converter/README.md"
);
assert.include(file, '```js\nconst caseConverter = require("./index");');
assert.include(file, 'const str = "hello free Code Camp!";');
assert.include(
  file,
  "console.log(caseConverter.getUpperCase(str)); // HELLO FREE CODE CAMP!"
);
assert.include(
  file,
  "console.log(caseConverter.getLowerCase(str)); // hello free code camp!"
);
assert.include(
  file,
  "console.log(caseConverter.getProperCase(str)); // Hello Free Code Camp!"
);
assert.include(file, "console.log(caseConverter.getSentenceCase(str));");
````

The example code should have 4 comments. The last being `// Hello free code camp!`.

```js
const file = await __helpers.getFile(
  project.dashedName,
  "case_converter/README.md"
);
assert.include(
  file,
  "console.log(caseConverter.getSentenceCase(str)); // Hello free code camp!"
);
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

## Usage
````

## 29

### --description--

The final section of your `README.md` file can be a section mentioning the license under which your package is released.

Add a level-2 heading, `License`, to the `README.md` file.

### --tests--

The `README.md` file should contain `## License`.

```js
const file = await __helpers.getFile(
  project.dashedName,
  "case_converter/README.md"
);
assert.include(file, "## License");
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

## Usage

```js
const caseConverter = require("./index");
const str = "hello free Code Camp!";
console.log(caseConverter.getUpperCase(str)); // HELLO FREE CODE CAMP!
console.log(caseConverter.getLowerCase(str)); // hello free code camp!
console.log(caseConverter.getProperCase(str)); // Hello Free Code Camp!
console.log(caseConverter.getSentenceCase(str)); // Hello free code camp!
```
````

## 30

### --description--

Add some text mentioning the license used in your `package.json` file.

### --tests--

The `README.md` file should contain the word `MIT` under the `License` section.

```js
const file = await __helpers.getFile(
  project.dashedName,
  "case_converter/README.md"
);
assert.include(file, "MIT");
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

## Usage

```js
const caseConverter = require("./index");
const str = "hello free Code Camp!";
console.log(caseConverter.getUpperCase(str)); // HELLO FREE CODE CAMP!
console.log(caseConverter.getLowerCase(str)); // hello free code camp!
console.log(caseConverter.getProperCase(str)); // Hello Free Code Camp!
console.log(caseConverter.getSentenceCase(str)); // Hello free code camp!
```

## License
````

## 31

### --description--

Create the `index.test.js` file to test your package.

### --tests--

You should have a file named `index.test.js` in the `case_converter/` directory.

```js
const fileExists = await __helpers.fileExists(
  "learn-npm-by-building-an-npm-module/case_converter/index.test.js"
);
assert.isTrue(fileExists, "The index.test.js file does not exist");
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

## Usage

```js
const caseConverter = require("./index");
const str = "hello free Code Camp!";
console.log(caseConverter.getUpperCase(str)); // HELLO FREE CODE CAMP!
console.log(caseConverter.getLowerCase(str)); // hello free code camp!
console.log(caseConverter.getProperCase(str)); // Hello Free Code Camp!
console.log(caseConverter.getSentenceCase(str)); // Hello free code camp!
```

## License

The MIT License
````

## 32

### --description--

Nodejs comes with a built-in assertion testing module. You can use it to test your package.

Within `index.test.js`, import `assert` from `node:assert/strict`:

```js
const assert = require("node:assert/strict");
```

### --tests--

The `index.test.js` file should have `const assert = require("node:assert/strict");`.

```js
const file = await __helpers.getFile(
  project.dashedName,
  "case_converter/index.test.js"
);
assert.match(
  file,
  /const\s+assert\s*=\s*require\(\s*('|")node:assert\/strict\1\s*\)/
);
```

### --seed--

#### --cmd--

```bash
touch learn-npm-by-building-an-npm-module/case_converter/index.test.js
```

## 33

### --description--

Create a test for the `getUpperCase` function:

```js
assert.strictEqual(
  caseConverter.getUpperCase("hello free Code Camp!"),
  "HELLO FREE CODE CAMP!"
);
```

### --tests--

The `index.test.js` file should contain `assert.strictEqual(caseConverter.getUpperCase("hello free Code Camp!"), "HELLO FREE CODE CAMP!");`.

```js
const file = await __helpers.getFile(
  project.dashedName,
  "case_converter/index.test.js"
);
const t = new __helpers.Tower(file);
const expressionStatement = t.getCallExpression("assert.strictEqual");
assert.exists(expressionStatement);
const [callExpression, stringLiteral] =
  expressionStatement.ast.expression.arguments;
assert.equal(callExpression.callee.object.name, "caseConverter");
assert.equal(callExpression.callee.property.name, "getUpperCase");
assert.equal(stringLiteral.value, "HELLO FREE CODE CAMP!");
```

### --seed--

#### --"learn-npm-by-building-an-npm-module/case_converter/index.test.js"--

```js
const assert = require("node:assert/strict");
```

## 34

### --description--

In order to use the `caseConverter` module in the `index.test.js` file, you need to import it:

```js
const caseConverter = require("./index");
```

### --tests--

The `index.test.js` file should contain `const caseConverter = require("./index");`.

```js
const file = await __helpers.getFile(
  project.dashedName,
  "case_converter/index.test.js"
);
const t = new __helpers.Tower(file);
const variableDeclaration = t.getVariable("caseConverter").compact;
assert.equal(variableDeclaration, 'const caseConverter=require("./index");');
```

The import of `caseConverter` should be above the test.

```js
const file = await __helpers.getFile(
  project.dashedName,
  "case_converter/index.test.js"
);
const t = new __helpers.Tower(file);
const variableDeclaration = t.getVariable("caseConverter");
const expressionStatement = t.getCallExpression("assert.strictEqual");
assert.isBelow(
  variableDeclaration.ast.start,
  expressionStatement.ast.start,
  "The import of caseConverter should be above the test"
);
```

### --seed--

#### --"learn-npm-by-building-an-npm-module/case_converter/index.test.js"--

```js
const assert = require("node:assert/strict");

assert.strictEqual(
  caseConverter.getUpperCase("hello free Code Camp!"),
  "HELLO FREE CODE CAMP!"
);
```

## 35

### --description--

Create one test for each of the other functions exported from `caseConverter` function, all using the string `"hello free Code Camp!"`.

### --tests--

The `index.test.js` file should contain `assert.strictEqual(caseConverter.getLowerCase("hello free Code Camp!"), "hello free code camp!");`.

```js
const file = await __helpers.getFile(
  project.dashedName,
  "case_converter/index.test.js"
);
const t = new __helpers.Tower(file);
const expressionStatement = t.getCalls("assert.strictEqual").at(1);
assert.exists(expressionStatement);
const [callExpression, stringLiteral] =
  expressionStatement.ast.expression.arguments;
assert.equal(callExpression.callee.object.name, "caseConverter");
assert.equal(callExpression.callee.property.name, "getLowerCase");
assert.equal(stringLiteral.value, "hello free code camp!");
```

The `index.test.js` file should contain `assert.strictEqual(caseConverter.getProperCase("hello free Code Camp!"), "Hello Free Code Camp!");`.

```js
const file = await __helpers.getFile(
  project.dashedName,
  "case_converter/index.test.js"
);
const t = new __helpers.Tower(file);
const expressionStatement = t.getCalls("assert.strictEqual").find((t) => {
  return (
    t.ast.expression?.arguments?.[0]?.callee?.property?.name === "getProperCase"
  );
});
assert.exists(expressionStatement);
const [callExpression, stringLiteral] =
  expressionStatement.ast.expression.arguments;
assert.equal(
  __helpers.generate(callExpression, { compact: true }).code,
  'caseConverter.getProperCase("hello free Code Camp!")'
);
assert.equal(stringLiteral.value, "Hello Free Code Camp!");
```

The `index.test.js` file should contain `assert.strictEqual(caseConverter.getSentenceCase("hello free Code Camp!"), "Hello free code camp!");`.

```js
const file = await __helpers.getFile(
  project.dashedName,
  "case_converter/index.test.js"
);
const t = new __helpers.Tower(file);
const expressionStatement = t
  .getCalls("assert.strictEqual")
  .find(
    (t) =>
      t.ast.expression?.arguments?.[0]?.callee?.property?.name ===
      "getSentenceCase"
  );
assert.exists(expressionStatement);
const [callExpression, stringLiteral] =
  expressionStatement.ast.expression.arguments;
assert.equal(
  __helpers.generate(callExpression, { compact: true }).code,
  'caseConverter.getSentenceCase("hello free Code Camp!")'
);
assert.equal(stringLiteral.value, "Hello free code camp!");
```

### --seed--

#### --"learn-npm-by-building-an-npm-module/case_converter/index.test.js"--

```js
const assert = require("node:assert/strict");
const caseConverter = require("./index");

assert.strictEqual(
  caseConverter.getUpperCase("hello free Code Camp!"),
  "HELLO FREE CODE CAMP!"
);
```

## 36

### --description--

Run `npm test` to test your package.

### --tests--

You should run `npm test` in the terminal.

```js
const lastCommand = await __helpers.getLastCommand();
assert.equal(lastCommand.trim(), "npm test");
```

### --seed--

#### --"learn-npm-by-building-an-npm-module/case_converter/index.test.js"--

```js
const assert = require("node:assert/strict");
const caseConverter = require("./index");

assert.strictEqual(
  caseConverter.getUpperCase("hello free Code Camp!"),
  "HELLO FREE CODE CAMP!"
);
assert.strictEqual(
  caseConverter.getLowerCase("hello free Code Camp!"),
  "hello free code camp!"
);
assert.strictEqual(
  caseConverter.getProperCase("hello free Code Camp!"),
  "Hello Free Code Camp!"
);
assert.strictEqual(
  caseConverter.getSentenceCase("hello free Code Camp!"),
  "Hello free code camp!"
);
```

## 37

### --description--

Change one of the function assertions such that it fails the tests.

### --tests--

The `index.test.js` file should contain an assertion that fails.

```js
const { stdout } = await __helpers.getCommandOutput(
  "npm test",
  join(project.dashedName, "case_converter")
);
assert.include(stdout, "AssertionError");
```

## 38

### --description--

Run `npm test` to test your package.

### --tests--

You should run `npm test` in the terminal.

```js
const lastCommand = await __helpers.getLastCommand();
assert.equal(lastCommand.trim(), "npm test");
```

### --seed--

#### --"learn-npm-by-building-an-npm-module/case_converter/index.test.js"--

```js
const assert = require("node:assert/strict");
const caseConverter = require("./index");

assert.strictEqual(
  caseConverter.getUpperCase("hello free Code Camp!"),
  "HELLO FREE CODE CAMp!"
);
assert.strictEqual(
  caseConverter.getLowerCase("hello free Code Camp!"),
  "hello free code camp!"
);
assert.strictEqual(
  caseConverter.getProperCase("hello free Code Camp!"),
  "Hello Free Code Camp!"
);
assert.strictEqual(
  caseConverter.getSentenceCase("hello free Code Camp!"),
  "Hello free code camp!"
);
```

## 39

### --description--

Fix the failing test in the `index.test.js` file.

### --tests--

The `index.test.js` file should contain assertions that all pass.

```js
const { stdout } = await __helpers.getCommandOutput(
  "npm test",
  join(project.dashedName, "case_converter")
);
assert.notInclude(stdout, "AssertionError");
```

## 40

### --description--

At this point, your package should be ready to publish to the npm registry.

Just to make sure, publish your package with a _dry run_:

```bash
npm publish --dry-run
```

### --tests--

You should run `npm publish --dry-run` in the terminal.

```js
const lastCommand = await __helpers.getLastCommand();
assert.equal(lastCommand.trim(), "npm publish --dry-run");
```

### --seed--

#### --"learn-npm-by-building-an-npm-module/case_converter/index.test.js"--

```js
const assert = require("node:assert/strict");
const caseConverter = require("./index");

assert.strictEqual(
  caseConverter.getUpperCase("hello free Code Camp!"),
  "HELLO FREE CODE CAMP!"
);
assert.strictEqual(
  caseConverter.getLowerCase("hello free Code Camp!"),
  "hello free code camp!"
);
assert.strictEqual(
  caseConverter.getProperCase("hello free Code Camp!"),
  "Hello Free Code Camp!"
);
assert.strictEqual(
  caseConverter.getSentenceCase("hello free Code Camp!"),
  "Hello free code camp!"
);
```

## 41

### --description--

The dry run succeeded, and shows you what will be included in the package when you publish it.

Hang on! There is no need to include the `index.test.js` file in the package. You can exclude it by creating an `.npmignore` file, and adding any file or directory you want to exclude from the package:

```markdown
index.test.js
```

### --tests--

You should have a file named `.npmignore` in the `case_converter/` directory.

```js
const { access, constants } = await import("fs/promises");
await access(
  join(ROOT, project.dashedName, "case_converter", ".npmignore"),
  constants.F_OK
);
```

You should have `index.test.js` in the `.npmignore` file.

```js
const file = await __helpers.getFile(
  project.dashedName,
  "case_converter/.npmignore"
);
assert.include(file, "index.test.js");
```

## 42

### --description--

Do another dry run to make sure the `index.test.js` file is excluded from the package.

### --tests--

You should run `npm publish --dry-run` in the terminal.

```js
const lastCommand = await __helpers.getLastCommand();
assert.equal(lastCommand.trim(), "npm publish --dry-run");
```

### --seed--

#### --"learn-npm-by-building-an-npm-module/case_converter/.npmignore"--

```markdown
index.test.js
```

## 43

### --description--

Ordinarily, this would be the point you would publish your package to the npm registry. However, doing so would require you to create an account on the npm website, and you do not need to do that at this time.

Well done! You have created an NPM module, learned how to test it, and do a dry run publish for the NPM registry.

Type `done` in the terminal, when you are done.

### --tests--

You should type `done` in the terminal.

```js
const lastCommand = await __helpers.getLastCommand();
assert.include(lastCommand, "done");
```

## --fcc-end--
