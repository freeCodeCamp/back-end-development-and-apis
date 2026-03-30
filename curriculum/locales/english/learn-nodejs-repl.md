# Learn Node.js REPL

In this project, you will explore the Node.js runtime from the command line - installing it, using its flags, and interacting with the interactive REPL (Read-Eval-Print Loop).

## 0

### --description--

In this project, you will explore the <dfn title="Read-Eval-Print Loop">REPL</dfn> and command-line interface of Node.js — installing the runtime, running code with flags, and working interactively in the Node.js shell.

Open a new terminal and run `cd learn-nodejs-repl` to change into the project directory.

### --tests--

You should be in the `learn-nodejs-repl/` directory.

```js
const __cwd = await __helpers.getLastCWD();
assert.include(
  __cwd,
  project.dashedName,
  "Run `cd learn-nodejs-repl` to enter the project directory.",
);
```

## 1

### --description--

Before using Node.js, you need to make sure it is installed. On Ubuntu-based systems, you can install packages using <dfn title="Advanced Package Tool">APT</dfn>, the command-line package manager.

Run the following command to install Node.js:

```bash
sudo apt install -y nodejs
```

Node.js is already present in this environment, so the command will confirm it is up to date.

### --tests--

You should run `sudo apt install -y nodejs` to install Node.js.

```js
const __history = await __helpers.getBashHistory();
assert.match(
  __history,
  /sudo\s+apt\s+install\b.*\bnodejs\b/,
  "Run `sudo apt install -y nodejs` to install Node.js.",
);
```

## 2

### --description--

Now that Node.js is installed, confirm the version that is available on your system.

Run `node -v` in the terminal. The `-v` flag is shorthand for `--version` and prints the installed Node.js version number.

### --tests--

You should run `node -v` or `node --version` to check the Node.js version.

```js
const __history = await __helpers.getBashHistory();
assert.match(
  __history,
  /node\s+(--version|-v)\b/,
  "Run `node -v` to check the installed Node.js version.",
);
```

The output should show a version number starting with `v`.

```js
const __out = await __helpers.getTerminalOutput();
assert.match(
  __out,
  /v\d+\.\d+\.\d+/,
  "The output should display a version string like v20.0.0.",
);
```

## 3

### --description--

Node.js comes bundled with <dfn title="Node Package Manager">npm</dfn>, the package manager used to install and manage JavaScript dependencies.

Run `npm -v` to print the installed npm version.

### --tests--

You should run `npm -v` or `npm --version` to check the npm version.

```js
const __history = await __helpers.getBashHistory();
assert.match(
  __history,
  /npm\s+(--version|-v)\b/,
  "Run `npm -v` to check the installed npm version.",
);
```

The output should show a version number.

```js
const __out = await __helpers.getTerminalOutput();
assert.match(
  __out,
  /\d+\.\d+\.\d+/,
  "The output should display a version string like 10.2.0.",
);
```

## 4

### --description--

You can run JavaScript directly from the terminal without creating a file by using the `-e` (or `--eval`) flag. Whatever string you pass is evaluated as JavaScript code.

```bash
node -e "console.log('Hello, Node!')"
```

Use `node -e` to run any JavaScript expression that prints something to the terminal.

### --tests--

You should run `node` with the `-e` or `--eval` flag.

```js
const __history = await __helpers.getBashHistory();
assert.match(
  __history,
  /node\s+(--eval|-e)\b/,
  'Run `node -e "<code>"` to evaluate a JavaScript expression from the terminal.',
);
```

Running your command should produce output in the terminal.

```js
const __out = await __helpers.getTerminalOutput();
assert.isNotEmpty(
  __out.trim(),
  "Your `node -e` command should print something to the terminal.",
);
```

## 5

### --description--

Previously, you used `node -e` to print a string. The `-e` flag can evaluate any JavaScript expression — including arithmetic.

For example:

```bash
node -e "console.log(2 + 2)"
```

Use `node -e` to evaluate an arithmetic expression of your choice and print the numeric result.

### --tests--

You should use `node -e` to evaluate an arithmetic expression.

```js
const __history = await __helpers.getBashHistory();
assert.match(
  __history,
  /node\s+(--eval|-e)\b/,
  'Use `node -e "<expression>"` to evaluate arithmetic.',
);
```

The output should be a number.

```js
const __out = await __helpers.getTerminalOutput();
assert.match(
  __out.trim(),
  /^-?\d+(\.\d+)?$/,
  "Your expression should print a numeric result.",
);
```

## 6

### --description--

<dfn title="Template literals">Template literals</dfn> use backticks (`` ` ``) instead of quotes and allow you to embed expressions directly in a string using `${}` syntax.

```bash
node -e "const name = 'Node'; console.log(\`Hello, \${name}!\`)"
```

Use `node -e` with a template literal to interpolate a variable or expression into a string and print the result.

### --tests--

You should use `node -e` with a template literal.

```js
const __history = await __helpers.getBashHistory();
assert.match(
  __history,
  /node\s+(--eval|-e)\b[^`]*`/,
  "Use `node -e` with a template literal (backtick string) to interpolate a value.",
);
```

Your command should print output to the terminal.

```js
const __out = await __helpers.getTerminalOutput();
assert.isNotEmpty(
  __out.trim(),
  "Your template literal expression should print something to the terminal.",
);
```

## 7

### --description--

The `-p` (or `--print`) flag works like `-e` but automatically prints the result of the expression — no `console.log` needed.

```bash
node -p "typeof process"
```

Use `node -p` to evaluate any expression of your choice and print the result.

### --tests--

You should run `node` with the `-p` or `--print` flag.

```js
const __history = await __helpers.getBashHistory();
assert.match(
  __history,
  /node\s+(--print|-p)\b/,
  'Run `node -p "<expression>"` to evaluate and print an expression.',
);
```

Your command should produce output in the terminal.

```js
const __out = await __helpers.getTerminalOutput();
assert.isNotEmpty(
  __out.trim(),
  "Your `node -p` expression should print a result.",
);
```

## 8

### --description--

JavaScript's built-in `Math` object provides mathematical constants and functions. You can access them directly in any expression.

```bash
node -p "Math.PI.toFixed(4)"
```

Use `node -p` with any property or method from the `Math` object to print a numeric result.

### --tests--

You should use `node -p` with the `Math` object.

```js
const __history = await __helpers.getBashHistory();
assert.match(
  __history,
  /node\s+(--print|-p)\b.*Math\./,
  'Use `node -p "Math.<something>"` to print a value from the Math object.',
);
```

The output should be a number.

```js
const __out = await __helpers.getTerminalOutput();
assert.match(
  __out.trim(),
  /^-?\d+(\.\d+)?$/,
  "Your expression should print a numeric result.",
);
```

## 9

### --description--

So far you have run JavaScript inline with flags. Now you will create a JavaScript file that Node.js can run directly.

Use `echo` to create a `hello.js` file in the `learn-nodejs-repl/` directory containing a `console.log` call:

```bash
echo "console.log('Hello from a file!')" > hello.js
```

You can write any message you like inside `console.log`.

### --tests--

You should have a `hello.js` file in the project directory.

```js
const __exists = await __helpers.fileExists(`${project.dashedName}/hello.js`);
assert.isTrue(
  __exists,
  "Create a `hello.js` file in the `learn-nodejs-repl/` directory.",
);
```

`hello.js` should contain a `console.log` call.

```js
const __file = await __helpers.getFile(project.dashedName, "hello.js");
assert.match(
  __file,
  /console\.log\(/,
  "`hello.js` should contain a `console.log(...)` call.",
);
```

## 10

### --description--

Node.js can check a file for syntax errors without actually running it using the `--check` (or `-c`) flag. This is useful for catching mistakes before execution.

```bash
node --check hello.js
```

Run `node --check hello.js` to validate its syntax. If the file is valid, the command exits silently with no output.

### --tests--

You should run `node --check` (or `node -c`) on `hello.js`.

```js
const __history = await __helpers.getBashHistory();
assert.match(
  __history,
  /node\s+(--check|-c)\s+hello\.js/,
  "Run `node --check hello.js` to syntax-check the file without executing it.",
);
```

### --seed--

#### --cmd--

```bash
echo "console.log('Hello from a file!')" > learn-nodejs-repl/hello.js
```

## 11

### --description--

Previously, you checked `hello.js` for syntax errors. Now run the file to execute it.

```bash
node hello.js
```

Run `node hello.js` and confirm the output appears in the terminal.

### --tests--

You should run `node hello.js` to execute the file.

```js
const __history = await __helpers.getBashHistory();
assert.match(
  __history,
  /node\s+hello\.js\b/,
  "Run `node hello.js` to execute the file.",
);
```

The file should produce output in the terminal.

```js
const __out = await __helpers.getTerminalOutput();
assert.isNotEmpty(
  __out.trim(),
  "`hello.js` should print something when run with `node hello.js`.",
);
```

### --seed--

#### --cmd--

```bash
echo "console.log('Hello from a file!')" > learn-nodejs-repl/hello.js
```

## 12

### --description--

So far you have run JavaScript non-interactively using flags and files. Node.js also includes an interactive shell called the <dfn title="Read-Eval-Print Loop">REPL</dfn> — it reads an expression you type, evaluates it, prints the result, and loops back for the next input.

Run `node` with no arguments to enter the REPL. You will see a `>` prompt indicating it is ready for input.

**NOTE:** Once you have opened the REPL, click _Run Tests_ to continue.

### --tests--

You should run `node` with no arguments to enter the REPL.

```js
const __history = await __helpers.getBashHistory();
assert.match(
  __history,
  /^node\s*$/m,
  "Run `node` with no arguments to open the interactive REPL.",
);
```

## 13

### --description--

You are now in the REPL. Type any arithmetic expression and press `Enter` — the REPL will evaluate it and print the result immediately, without needing `console.log`.

```
> 2 ** 8
256
```

Type an arithmetic expression of your choice and press `Enter`.

**NOTE:** Keep the REPL open and click _Run Tests_ when done.

### --tests--

You should type an arithmetic expression in the REPL and receive a numeric result.

```js
const __out = await __helpers.getTerminalOutput();
assert.match(
  __out,
  /\d+/,
  "Type an arithmetic expression in the REPL — it should print a number.",
);
```

## 14

### --description--

Variables declared in the REPL persist for the rest of your session — you can reference them in later expressions.

Declare a variable using `let` or `const` and assign it any value you like:

```
> let city = "Paris"
undefined
```

Notice the REPL prints `undefined` — that is the return value of a variable declaration.

**NOTE:** Keep the REPL open and click _Run Tests_ when done.

### --tests--

You should declare a variable in the REPL using `let` or `const`.

```js
const __temp = await __helpers.getTemp();
assert.match(
  __temp,
  /\b(let|const)\s+\w+/,
  "Declare a variable in the REPL using `let` or `const`.",
);
```

The REPL should print `undefined` after a variable declaration.

```js
const __out = await __helpers.getTerminalOutput();
assert.include(
  __out,
  "undefined",
  "Variable declarations return `undefined` in the REPL.",
);
```

## 15

### --description--

Previously, you declared a variable in the REPL. Because it is still in scope, you can read it back simply by typing its name and pressing `Enter`.

```
> city
'Paris'
```

Type your variable name in the REPL to print its value.

**NOTE:** Keep the REPL open and click _Run Tests_ when done.

### --tests--

You should type your variable name in the REPL to read its value.

```js
const __temp = await __helpers.getTemp();
assert.match(
  __temp,
  /^\w+\s*$/m,
  "Type the variable name in the REPL and press Enter to read its value.",
);
```

The REPL should print the value you assigned (not `undefined`).

```js
const __out = await __helpers.getTerminalOutput();
const __lines = __out
  .split("\n")
  .map((l) => l.trim())
  .filter(Boolean);
const __hasValue = __lines.some((l) => l !== "undefined" && !/^>/.test(l));
assert.isTrue(
  __hasValue,
  "The REPL should print the value stored in your variable.",
);
```

## 16

### --description--

The REPL provides a special variable `_` that always holds the result of the last evaluated expression. You can use it in any subsequent expression without re-typing the value.

```
> 10 * 10
100
> _ + 5
105
```

Use `_` in an expression of your choice in the REPL.

**NOTE:** Keep the REPL open and click _Run Tests_ when done.

### --tests--

You should use the `_` variable in the REPL.

```js
const __temp = await __helpers.getTemp();
assert.match(
  __temp,
  /\b_\b/,
  "Type `_` in the REPL to access the last evaluated result.",
);
```

The REPL should print a result when you use `_`.

```js
const __out = await __helpers.getTerminalOutput();
assert.isNotEmpty(__out.trim(), "Using `_` should produce output in the REPL.");
```

## 17

### --description--

You can define functions in the REPL just as you would in a script — they stay available for the rest of the session.

```
> function double(n) { return n * 2; }
undefined
```

Define a function of your choice in the REPL. Like variable declarations, function definitions return `undefined`.

**NOTE:** Keep the REPL open and click _Run Tests_ when done.

### --tests--

You should define a function in the REPL.

```js
const __temp = await __helpers.getTemp();
assert.match(
  __temp,
  /function\s+\w+|const\s+\w+\s*=\s*(function|\()/,
  "Define a function in the REPL using a function declaration or expression.",
);
```

The REPL should print `undefined` after a function definition.

```js
const __out = await __helpers.getTerminalOutput();
assert.include(
  __out,
  "undefined",
  "Function definitions return `undefined` in the REPL.",
);
```

## 18

### --description--

Now call the function you defined in the previous lesson by typing its name followed by parentheses and an argument.

```
> double(21)
42
```

Call your function with an argument of your choice — the REPL will print the return value directly.

**NOTE:** Keep the REPL open and click _Run Tests_ when done.

### --tests--

You should call your function in the REPL.

```js
const __temp = await __helpers.getTemp();
assert.match(
  __temp,
  /\w+\(.*\)/,
  "Call your function in the REPL with an argument.",
);
```

The function should return a value (not `undefined`).

```js
const __out = await __helpers.getTerminalOutput();
const __lines = __out
  .split("\n")
  .map((l) => l.trim())
  .filter(Boolean);
const __hasReturnValue = __lines.some(
  (l) => l !== "undefined" && !/^>/.test(l),
);
assert.isTrue(
  __hasReturnValue,
  "Your function call should return and print a value.",
);
```

## 19

### --description--

Node.js includes a set of built-in modules you can load at any time using `require()`. You do not need to install them — they ship with Node.js itself.

```
> const os = require('os')
undefined
```

Use `require()` in the REPL to load any built-in Node.js module and assign it to a variable.

**NOTE:** Keep the REPL open and click _Run Tests_ when done.

### --tests--

You should use `require()` in the REPL to load a built-in Node.js module.

```js
const __temp = await __helpers.getTemp();
assert.match(
  __temp,
  /require\(\s*['"][a-z]+['"]\s*\)/,
  'Use `require("module-name")` in the REPL to load a built-in module.',
);
```

The REPL should print `undefined` after assigning the result of `require()` to a variable.

```js
const __out = await __helpers.getTerminalOutput();
assert.include(
  __out,
  "undefined",
  "Assigning `require(...)` to a variable returns `undefined` in the REPL.",
);
```

## 20

### --description--

Now that you have loaded a module, call one of its methods to get information back.

```
> os.platform()
'linux'
```

Call any method on the module you loaded and observe the return value printed by the REPL.

**NOTE:** Keep the REPL open and click _Run Tests_ when done.

### --tests--

You should call a method on your loaded module in the REPL.

```js
const __temp = await __helpers.getTemp();
assert.match(
  __temp,
  /\w+\.\w+\(/,
  "Call a method on your loaded module, e.g. `os.platform()`.",
);
```

The method should return and print a value.

```js
const __out = await __helpers.getTerminalOutput();
const __lines = __out
  .split("\n")
  .map((l) => l.trim())
  .filter(Boolean);
const __hasValue = __lines.some((l) => l !== "undefined" && !/^>/.test(l));
assert.isTrue(
  __hasValue,
  "The method call should return and print a result in the REPL.",
);
```

## 21

### --description--

The REPL has a set of special commands that start with a dot (`.`). Type `.help` to print a list of all available dot-commands and what they do.

**NOTE:** Keep the REPL open and click _Run Tests_ when done.

### --tests--

You should type `.help` in the REPL.

```js
const __temp = await __helpers.getTemp();
assert.include(
  __temp,
  ".help",
  "Type `.help` in the REPL to see the list of available dot-commands.",
);
```

The output should list available REPL commands.

```js
const __out = await __helpers.getTerminalOutput();
assert.include(
  __out,
  ".exit",
  "The `.help` output should list available REPL commands including `.exit`.",
);
```

## 22

### --description--

To leave the REPL and return to the regular terminal, type `.exit` and press `Enter`. You can also press `Ctrl+D` to achieve the same result.

Type `.exit` to close the REPL session.

### --tests--

You should type `.exit` to leave the REPL.

```js
const __temp = await __helpers.getTemp();
assert.include(
  __temp,
  ".exit",
  "Type `.exit` in the REPL to exit back to the regular terminal.",
);
```

## 23

### --description--

Earlier you used `require()` to load modules — that is the CommonJS style. Node.js also supports <dfn title="ECMAScript Modules">ESM</dfn>, the modern `import`/`export` syntax. You can run ESM code inline by piping it to `node` with the `--input-type=module` flag.

```bash
echo "import { createRequire } from 'module'; console.log(typeof createRequire);" | node --input-type=module
```

Pipe some ESM code of your choice to `node --input-type=module` and confirm it produces output.

### --tests--

You should run `node` with the `--input-type=module` flag.

```js
const __history = await __helpers.getBashHistory();
assert.match(
  __history,
  /node\s+--input-type=module/,
  "Pipe ESM code to `node --input-type=module` to run it as an ES module.",
);
```

The output should confirm the ESM code executed successfully.

```js
const __out = await __helpers.getTerminalOutput();
assert.isNotEmpty(
  __out.trim(),
  "Your piped ESM code should produce output in the terminal.",
);
```

## --fcc-end--
