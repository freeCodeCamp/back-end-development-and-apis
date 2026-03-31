# Learn Node.js Common Modules

Reinforce your knowledge of Node.js built-in modules by using them hands-on: `fs`, `buffer`, `crypto`, `os`, `path`, `process`, and `stream`.

## 0

### --description--

Node.js comes with a set of <dfn title="built-in modules that are part of Node.js itself and do not need to be installed">core modules</dfn> you can use without installing anything. To load one, pass its name to `require`:

```js
const http = require('http');
console.log(http);
```

In `server.js`, use `require` to import the `fs` module and store it in a variable called `fs`. Then log `fs` to the console with `console.log`.

Run the file with `node server.js` in the terminal to see the full API surface of the module.

### --tests--

`server.js` declares a variable called `fs` assigned to `require('fs')`.

```js
const __file = await __helpers.getFile(project.dashedName, 'server.js');
const __t = new __helpers.Tower(__file);
const __fs = __t.getVariable('fs');
assert.isDefined(__fs, 'You should declare a variable called `fs`');
assert.match(__fs.compact, /require\(["']fs["']\)/, 'You should assign `require("fs")` to `fs`');
```

Running `server.js` with Node logs the `fs` module to the console.

```js
const { stdout } = await __helpers.getCommandOutput('node server.js', project.dashedName);
assert.include(stdout, 'readFile', 'Running `node server.js` should log the `fs` module (expected to see `readFile` in the output)');
```

### --seed--

#### --"learn-nodejs-common-modules/server.js"--

```js
// Add your code below this line
```

## 1

### --description--

`fs.readFileSync` reads a file <dfn title="blocking the event loop until the operation completes">synchronously</dfn> and returns its contents as a `Buffer` by default:

```js
const data = fs.readFileSync('path/to/file.txt');
console.log(data); // <Buffer 48 65 6c 6c 6f ...>
```

In `server.js`, call `fs.readFileSync` with the path `'assets/poem.txt'` and log the result to the console.

Run the file with `node server.js` — you should see a raw `Buffer` printed, not a string.

### --tests--

`server.js` calls `fs.readFileSync` with a path pointing to `assets/poem.txt`.

```js
const __file = await __helpers.getFile(project.dashedName, 'server.js');
const __t = new __helpers.Tower(__file);
const __calls = __t.getCalls('fs.readFileSync');
assert.isAbove(__calls.length, 0, 'You should call `fs.readFileSync` in `server.js`');
assert.match(
  __calls.at(0).compact,
  /assets[/\\]?poem\.txt/,
  'The path passed to `fs.readFileSync` should point to `assets/poem.txt`'
);
```

Running `server.js` prints a raw `Buffer` to the console.

```js
const { stdout } = await __helpers.getCommandOutput('node server.js', project.dashedName);
assert.include(stdout, '<Buffer', 'Running `node server.js` should print a Buffer — make sure you are logging the result of `fs.readFileSync` without an encoding option');
```

### --seed--

#### --cmd--

```bash
mkdir -p learn-nodejs-common-modules/assets
```

#### --"learn-nodejs-common-modules/server.js"--

```js
const fs = require('fs');

// Add your code below this line
```

#### --"learn-nodejs-common-modules/assets/poem.txt"--

```
The fog comes
on little cat feet.

It sits looking
over harbor and city
on silent haunches
and then moves on.
```

## 2

### --description--

In the previous lesson, `fs.readFileSync` returned a raw `Buffer` because no encoding was specified. To get a string instead, pass an options object with `encoding: 'utf8'` as the second argument:

```js
const data = fs.readFileSync('path/to/file.txt', { encoding: 'utf8' });
console.log(data); // Hello, World!
```

Update the `fs.readFileSync` call in `server.js` to pass `{ encoding: 'utf8' }` as the second argument.

Run `node server.js` — the poem should now print as readable text instead of a Buffer.

### --tests--

`fs.readFileSync` is called with `{ encoding: 'utf8' }` as the second argument.

```js
const __file = await __helpers.getFile(project.dashedName, 'server.js');
const __t = new __helpers.Tower(__file);
const __calls = __t.getCalls('fs.readFileSync');
assert.isAbove(__calls.length, 0, 'You should call `fs.readFileSync` in `server.js`');
assert.match(
  __calls.at(0).compact,
  /encoding.*utf.?8/,
  'Pass `{ encoding: "utf8" }` as the second argument to `fs.readFileSync`'
);
```

Running `server.js` prints the poem as a plain string, not a Buffer.

```js
const { stdout } = await __helpers.getCommandOutput('node server.js', project.dashedName);
assert.notInclude(stdout, '<Buffer', 'The output should be a string, not a Buffer — make sure you passed the encoding option');
assert.include(stdout, 'fog comes', 'Running `node server.js` should print the contents of `assets/poem.txt` as a string');
```

## 3

### --description--

The second way to use `fs` is `fs.readFile`, which reads a file <dfn title="without blocking the event loop — other code can continue while the file is being read">asynchronously</dfn> using a <dfn title="a function passed as an argument that is called when the operation completes">callback</dfn>. The callback receives an error (or `null`) and the file data:

```js
fs.readFile('path/to/file.txt', { encoding: 'utf8' }, (err, data) => {
  console.log(data);
});
```

In `server.js`, call `fs.readFile` with the path `'assets/poem.txt'` and a callback that logs the file contents to the console.

Run `node server.js` to verify the poem prints.

### --tests--

`server.js` calls `fs.readFile` with a path pointing to `assets/poem.txt`.

```js
const __file = await __helpers.getFile(project.dashedName, 'server.js');
const __t = new __helpers.Tower(__file);
const __calls = __t.getCalls('fs.readFile');
assert.isAbove(__calls.length, 0, 'You should call `fs.readFile` in `server.js`');
assert.match(
  __calls.at(0).compact,
  /assets[/\\]?poem\.txt/,
  'The first argument to `fs.readFile` should be the path `assets/poem.txt`'
);
```

`fs.readFile` is called with a callback function as its last argument.

```js
const __file = await __helpers.getFile(project.dashedName, 'server.js');
assert.match(
  __file,
  /fs\.readFile\s*\([^)]*function\s*\(|fs\.readFile\s*\([^)]*=>/,
  'You should pass a callback function as the last argument to `fs.readFile`'
);
```

Running `server.js` prints the poem contents to the console via the callback.

```js
const { stdout } = await __helpers.getCommandOutput('node server.js', project.dashedName);
assert.include(stdout, 'fog comes', 'Running `node server.js` should print the poem — log the data inside the callback');
```

### --seed--

#### --"learn-nodejs-common-modules/server.js"--

```js
const fs = require('fs');

// Add your code below this line
```

## 4

### --description--

The third way to read a file with `fs` is via its `promises` API, which lets you use `async`/`await` instead of a callback. You can access it as `require('fs').promises` or by importing `fs/promises` directly:

```js
const fsPromises = require('fs').promises;

async function main() {
  const data = await fsPromises.readFile('path/to/file.txt', { encoding: 'utf8' });
  console.log(data);
}

main();
```

In `server.js`, use the `fs` promises API with `async`/`await` to read `'assets/poem.txt'` and log its contents.

Run `node server.js` to confirm the poem prints.

### --tests--

`server.js` accesses the `promises` API from the `fs` module.

```js
const __file = await __helpers.getFile(project.dashedName, 'server.js');
assert.match(
  __file,
  /require\(["']fs[/"'].*promises|fs\.promises|require\(["']fs\/promises["']\)/,
  'You should access `fs.promises` or require `fs/promises`'
);
```

`server.js` uses `await` to call `readFile` on the promises API.

```js
const __file = await __helpers.getFile(project.dashedName, 'server.js');
assert.match(__file, /await/, 'You should use `await` to read the file asynchronously');
assert.match(__file, /\.readFile\s*\(/, 'You should call `.readFile(...)` on the promises API');
```

Running `server.js` prints the poem to the console.

```js
const { stdout } = await __helpers.getCommandOutput('node server.js', project.dashedName);
assert.include(stdout, 'fog comes', 'Running `node server.js` should print the poem using the promises-based API');
```

### --seed--

#### --"learn-nodejs-common-modules/server.js"--

```js
const fs = require('fs');

// Add your code below this line
```

## 5

### --description--

`fs.writeFileSync` creates a file (or overwrites it) <dfn title="blocking the event loop until the write completes">synchronously</dfn>. Pass a path and the content to write:

```js
fs.writeFileSync('assets/output.txt', 'Hello, World!');
```

In `server.js`, use `fs.writeFileSync` to create the file `'assets/output.txt'` and write the string `'Hello, freeCodeCamp!'` to it.

Run `node server.js` — the file should be created in the `assets/` directory.

### --tests--

`server.js` calls `fs.writeFileSync` with the path `'assets/output.txt'`.

```js
const __file = await __helpers.getFile(project.dashedName, 'server.js');
const __t = new __helpers.Tower(__file);
const __calls = __t.getCalls('fs.writeFileSync');
assert.isAbove(__calls.length, 0, 'You should call `fs.writeFileSync` in `server.js`');
assert.match(
  __calls.at(0).compact,
  /assets[/\\]?output\.txt/,
  'The first argument to `fs.writeFileSync` should be `assets/output.txt`'
);
```

Running `server.js` creates `assets/output.txt` on disk.

```js
const { join } = await import('path');
const { existsSync } = await import('fs');
await __helpers.getCommandOutput('node server.js', project.dashedName);
const __exists = existsSync(join(ROOT, project.dashedName, 'assets', 'output.txt'));
assert.isTrue(__exists, '`assets/output.txt` should exist after running `node server.js`');
```

### --seed--

#### --"learn-nodejs-common-modules/server.js"--

```js
const fs = require('fs');

// Add your code below this line
```

## 6

### --description--

`fs.appendFileSync` adds content to an existing file without overwriting it. If the file does not exist, it is created:

```js
fs.appendFileSync('assets/output.txt', '\nSecond line');
```

In `server.js`, add a call to `fs.appendFileSync` below the existing `writeFileSync` call. Append a second line — any string of your choice — to `'assets/output.txt'`.

Run `node server.js` to verify the file now has two lines.

### --tests--

`server.js` calls `fs.appendFileSync` with the path `'assets/output.txt'`.

```js
const __file = await __helpers.getFile(project.dashedName, 'server.js');
const __t = new __helpers.Tower(__file);
const __calls = __t.getCalls('fs.appendFileSync');
assert.isAbove(__calls.length, 0, 'You should call `fs.appendFileSync` in `server.js`');
assert.match(
  __calls.at(0).compact,
  /assets[/\\]?output\.txt/,
  'The first argument to `fs.appendFileSync` should be `assets/output.txt`'
);
```

After running `server.js`, `assets/output.txt` contains more than one line.

```js
const { join } = await import('path');
const { readFileSync } = await import('fs');
await __helpers.getCommandOutput('node server.js', project.dashedName);
const __content = readFileSync(join(ROOT, project.dashedName, 'assets', 'output.txt'), 'utf8');
assert.isAbove(__content.split('\n').filter(Boolean).length, 1, '`assets/output.txt` should contain more than one line after running `node server.js`');
```

### --seed--

#### --"learn-nodejs-common-modules/server.js"--

```js
const fs = require('fs');

fs.writeFileSync('assets/output.txt', 'Hello, freeCodeCamp!');

// Add your code below this line
```

## 7

### --description--

`fs.existsSync` checks whether a file or directory exists and returns a boolean:

```js
const exists = fs.existsSync('assets/output.txt');
console.log(exists); // true or false
```

In `server.js`, call `fs.existsSync` with the path `'assets/output.txt'` and log the result to the console.

Run `node server.js` — you should see `true` printed.

### --tests--

`server.js` calls `fs.existsSync` with the path `'assets/output.txt'`.

```js
const __file = await __helpers.getFile(project.dashedName, 'server.js');
const __t = new __helpers.Tower(__file);
const __calls = __t.getCalls('fs.existsSync');
assert.isAbove(__calls.length, 0, 'You should call `fs.existsSync` in `server.js`');
assert.match(
  __calls.at(0).compact,
  /assets[/\\]?output\.txt/,
  'The argument to `fs.existsSync` should be `assets/output.txt`'
);
```

Running `server.js` prints `true` to the console.

```js
const { stdout } = await __helpers.getCommandOutput('node server.js', project.dashedName);
assert.include(stdout, 'true', 'Running `node server.js` should print `true` — make sure you are logging the result of `fs.existsSync`');
```

### --seed--

#### --"learn-nodejs-common-modules/server.js"--

```js
const fs = require('fs');

fs.writeFileSync('assets/output.txt', 'Hello, freeCodeCamp!');
fs.appendFileSync('assets/output.txt', '\nSecond line');

// Add your code below this line
```

## 8

### --description--

`fs.readdirSync` reads the contents of a directory and returns an array of file and folder names:

```js
const entries = fs.readdirSync('assets');
console.log(entries); // [ 'output.txt', 'poem.txt' ]
```

In `server.js`, call `fs.readdirSync` with the path `'assets'` and log the result.

Run `node server.js` — you should see an array listing the files in the `assets/` directory.

### --tests--

`server.js` calls `fs.readdirSync` with `'assets'`.

```js
const __file = await __helpers.getFile(project.dashedName, 'server.js');
const __t = new __helpers.Tower(__file);
const __calls = __t.getCalls('fs.readdirSync');
assert.isAbove(__calls.length, 0, 'You should call `fs.readdirSync` in `server.js`');
assert.match(__calls.at(0).compact, /['"]assets['"]/, 'The argument to `fs.readdirSync` should be `\'assets\'`');
```

Running `server.js` prints an array that includes `poem.txt`.

```js
const { stdout } = await __helpers.getCommandOutput('node server.js', project.dashedName);
assert.include(stdout, 'poem.txt', 'Running `node server.js` should print the contents of the `assets/` directory, which includes `poem.txt`');
```

### --seed--

#### --"learn-nodejs-common-modules/server.js"--

```js
const fs = require('fs');

// Add your code below this line
```

## 9

### --description--

The `Buffer` module is a global in Node.js — you do not need to `require` it. A `Buffer` represents a fixed-length sequence of raw bytes in memory. Create one from a string using `Buffer.from`:

```js
const buf = Buffer.from('Hello');
console.log(buf); // <Buffer 48 65 6c 6c 6f>
```

In `server.js`, create a `Buffer` from the string `'Hello, Node!'` using `Buffer.from`, store it in a variable called `buf`, and log `buf` to the console.

Run `node server.js` — you should see the raw byte values printed as a `Buffer`.

### --tests--

`server.js` calls `Buffer.from` with the string `'Hello, Node!'`.

```js
const __file = await __helpers.getFile(project.dashedName, 'server.js');
assert.match(__file, /Buffer\.from\s*\(\s*['"]Hello,\s*Node!['"]\s*\)/, 'You should call `Buffer.from("Hello, Node!")` in `server.js`');
```

Running `server.js` prints a `Buffer` to the console.

```js
const { stdout } = await __helpers.getCommandOutput('node server.js', project.dashedName);
assert.include(stdout, '<Buffer', 'Running `node server.js` should print a Buffer');
```

### --seed--

#### --"learn-nodejs-common-modules/server.js"--

```js
// Add your code below this line
```

## 10

### --description--

A `Buffer` can be encoded to a human-readable string using `.toString(encoding)`. The two most common encodings are `'hex'` (hexadecimal digits) and `'base64'`:

```js
const buf = Buffer.from('Hello');
console.log(buf.toString('hex'));    // 48656c6c6f
console.log(buf.toString('base64')); // SGVsbG8=
```

In `server.js`, add two more `console.log` calls below the existing one: one that logs `buf.toString('hex')` and one that logs `buf.toString('base64')`.

Run `node server.js` to see both encoded forms.

### --tests--

`server.js` calls `buf.toString('hex')`.

```js
const __file = await __helpers.getFile(project.dashedName, 'server.js');
assert.match(__file, /\.toString\s*\(\s*['"]hex['"]\s*\)/, 'You should call `.toString("hex")` on the buffer');
```

`server.js` calls `buf.toString('base64')`.

```js
const __file = await __helpers.getFile(project.dashedName, 'server.js');
assert.match(__file, /\.toString\s*\(\s*['"]base64['"]\s*\)/, 'You should call `.toString("base64")` on the buffer');
```

Running `server.js` prints both a hex string and a base64 string.

```js
const { stdout } = await __helpers.getCommandOutput('node server.js', project.dashedName);
assert.match(stdout, /[0-9a-f]{10,}/, 'Running `node server.js` should print a hex-encoded string');
assert.match(stdout, /[A-Za-z0-9+/]+=*/, 'Running `node server.js` should print a base64-encoded string');
```

## 11

### --description--

`Buffer.alloc(size)` creates a zero-filled buffer of the given byte length. You can fill it with a specific value by passing a second argument:

```js
const buf = Buffer.alloc(4, 0xab);
console.log(buf); // <Buffer ab ab ab ab>
```

In `server.js`, add a new `Buffer.alloc` call that allocates `8` bytes and fills them with `0xff`. Store it in a variable called `buf2` and log it.

Run `node server.js` — you should see `<Buffer ff ff ff ff ff ff ff ff>`.

### --tests--

`server.js` calls `Buffer.alloc(8)` with a fill value of `0xff`.

```js
const __file = await __helpers.getFile(project.dashedName, 'server.js');
assert.match(__file, /Buffer\.alloc\s*\(\s*8\s*,\s*0xff\s*\)/, 'You should call `Buffer.alloc(8, 0xff)` in `server.js`');
```

Running `server.js` prints a buffer of 8 `ff` bytes.

```js
const { stdout } = await __helpers.getCommandOutput('node server.js', project.dashedName);
assert.match(stdout, /ff ff ff ff ff ff ff ff/, 'Running `node server.js` should print `<Buffer ff ff ff ff ff ff ff ff>`');
```

## 12

### --description--

You can decode a base64 string back to readable text by creating a `Buffer` from the base64 string and then calling `.toString('utf8')`:

```js
const decoded = Buffer.from('SGVsbG8=', 'base64').toString('utf8');
console.log(decoded); // Hello
```

In `server.js`, decode the following base64 string and log the result:

```
ZnJlZUNvZGVDYW1w
```

Run `node server.js` — you should see the decoded text printed.

### --tests--

`server.js` decodes a base64 string using `Buffer.from`.

```js
const __file = await __helpers.getFile(project.dashedName, 'server.js');
assert.match(
  __file,
  /Buffer\.from\s*\(\s*['"]ZnJlZUNvZGVDYW1w['"]\s*,\s*['"]base64['"]\s*\)/,
  'You should call `Buffer.from("ZnJlZUNvZGVDYW1w", "base64")` in `server.js`'
);
```

Running `server.js` prints the decoded UTF-8 string.

```js
const { stdout } = await __helpers.getCommandOutput('node server.js', project.dashedName);
assert.include(stdout, 'freeCodeCamp', 'Running `node server.js` should print the decoded string `freeCodeCamp`');
```

## 13

### --description--

The `crypto` module provides cryptographic functionality. One common use is hashing — transforming data into a fixed-length string that cannot be reversed. Use `crypto.createHash` to create a hash, `.update` to feed it data, and `.digest` to get the result:

```js
const crypto = require('crypto');
const hash = crypto.createHash('sha256').update('hello').digest('hex');
console.log(hash); // 2cf24dba...
```

In `server.js`, require the `crypto` module and use `crypto.createHash('sha256')` to hash the string `'freeCodeCamp!'`. Log the result as a hex digest.

Run `node server.js` — you should see a 64-character hexadecimal string.

### --tests--

`server.js` requires `crypto` and calls `crypto.createHash('sha256')`.

```js
const __file = await __helpers.getFile(project.dashedName, 'server.js');
const __t = new __helpers.Tower(__file);
const __crypto = __t.getVariable('crypto');
assert.isDefined(__crypto, 'You should declare a variable called `crypto`');
assert.match(__crypto.compact, /require\(["']crypto["']\)/, 'You should assign `require("crypto")` to `crypto`');
assert.match(__file, /createHash\s*\(\s*['"]sha256['"]\s*\)/, 'You should call `crypto.createHash("sha256")`');
```

Running `server.js` prints a 64-character hex digest.

```js
const { stdout } = await __helpers.getCommandOutput('node server.js', project.dashedName);
assert.match(stdout.trim(), /^[0-9a-f]{64}$/, 'Running `node server.js` should print a 64-character SHA-256 hex digest');
```

### --seed--

#### --"learn-nodejs-common-modules/server.js"--

```js
// Add your code below this line
```

## 14

### --description--

`crypto.randomBytes(n)` generates `n` cryptographically strong random bytes and returns them as a `Buffer`. Calling `.toString('hex')` on the result gives a random hex string:

```js
const random = crypto.randomBytes(8).toString('hex');
console.log(random); // e.g. 4f3a9c1b8e2d7a05
```

In `server.js`, add a call to `crypto.randomBytes(16)` and log the result as a hex string.

Run `node server.js` — you should see a 32-character random hex string on a new line.

### --tests--

`server.js` calls `crypto.randomBytes(16)`.

```js
const __file = await __helpers.getFile(project.dashedName, 'server.js');
assert.match(__file, /crypto\.randomBytes\s*\(\s*16\s*\)/, 'You should call `crypto.randomBytes(16)` in `server.js`');
```

Running `server.js` prints a 32-character hex string.

```js
const { stdout } = await __helpers.getCommandOutput('node server.js', project.dashedName);
const __lines = stdout.trim().split('\n');
const __hexLine = __lines.find(l => /^[0-9a-f]{32}$/.test(l.trim()));
assert.isDefined(__hexLine, 'Running `node server.js` should print a 32-character hex string from `crypto.randomBytes(16)`');
```

## 15

### --description--

`crypto.randomUUID()` generates a <dfn title="a 128-bit identifier formatted as 32 hexadecimal digits grouped by hyphens">UUID version 4</dfn> — a universally unique identifier:

```js
const id = crypto.randomUUID();
console.log(id); // e.g. 110e8400-e29b-41d4-a716-446655440000
```

In `server.js`, add a call to `crypto.randomUUID()` and log the result.

Run `node server.js` — you should see a UUID printed on a new line.

### --tests--

`server.js` calls `crypto.randomUUID()`.

```js
const __file = await __helpers.getFile(project.dashedName, 'server.js');
assert.match(__file, /crypto\.randomUUID\s*\(\s*\)/, 'You should call `crypto.randomUUID()` in `server.js`');
```

Running `server.js` prints a valid UUID v4.

```js
const { stdout } = await __helpers.getCommandOutput('node server.js', project.dashedName);
const __uuidPattern = /[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}/i;
assert.match(stdout, __uuidPattern, 'Running `node server.js` should print a valid UUID v4');
```

## 16

### --description--

The `os` module provides information about the operating system. Require it like any other module:

```js
const os = require('os');
```

In `server.js`, require the `os` module and log the following three values, each on its own line:

- `os.platform()` — the operating system platform (e.g. `'linux'`, `'win32'`)
- `os.arch()` — the CPU architecture (e.g. `'x64'`, `'arm'`)
- `os.hostname()` — the hostname of the machine

Run `node server.js` to see the values for your system.

### --tests--

`server.js` requires `os` and calls `os.platform()`, `os.arch()`, and `os.hostname()`.

```js
const __file = await __helpers.getFile(project.dashedName, 'server.js');
const __t = new __helpers.Tower(__file);
const __os = __t.getVariable('os');
assert.isDefined(__os, 'You should declare a variable called `os`');
assert.match(__os.compact, /require\(["']os["']\)/, 'You should assign `require("os")` to `os`');
assert.match(__file, /os\.platform\s*\(\s*\)/, 'You should call `os.platform()`');
assert.match(__file, /os\.arch\s*\(\s*\)/, 'You should call `os.arch()`');
assert.match(__file, /os\.hostname\s*\(\s*\)/, 'You should call `os.hostname()`');
```

Running `server.js` prints non-empty strings for platform, arch, and hostname.

```js
const { stdout } = await __helpers.getCommandOutput('node server.js', project.dashedName);
const __lines = stdout.trim().split('\n').filter(Boolean);
assert.isAtLeast(__lines.length, 3, 'Running `node server.js` should print at least 3 lines (platform, arch, hostname)');
assert.isTrue(__lines.every(l => l.trim().length > 0), 'Each logged value should be a non-empty string');
```

### --seed--

#### --"learn-nodejs-common-modules/server.js"--

```js
// Add your code below this line
```

## 17

### --description--

The `os` module also exposes memory and uptime information:

- `os.totalmem()` — total system memory in bytes
- `os.freemem()` — available memory in bytes
- `os.uptime()` — system uptime in seconds

In `server.js`, add `console.log` calls for each of the three values above.

Run `node server.js` — you should now see six lines of output.

### --tests--

`server.js` calls `os.totalmem()`, `os.freemem()`, and `os.uptime()`.

```js
const __file = await __helpers.getFile(project.dashedName, 'server.js');
assert.match(__file, /os\.totalmem\s*\(\s*\)/, 'You should call `os.totalmem()`');
assert.match(__file, /os\.freemem\s*\(\s*\)/, 'You should call `os.freemem()`');
assert.match(__file, /os\.uptime\s*\(\s*\)/, 'You should call `os.uptime()`');
```

Running `server.js` prints numeric values for total memory, free memory, and uptime.

```js
const { stdout } = await __helpers.getCommandOutput('node server.js', project.dashedName);
const __lines = stdout.trim().split('\n').filter(Boolean);
assert.isAtLeast(__lines.length, 6, 'Running `node server.js` should print at least 6 lines');
const __nums = __lines.filter(l => /^\d+(\.\d+)?$/.test(l.trim()));
assert.isAtLeast(__nums.length, 3, 'At least three of the logged values should be numbers (totalmem, freemem, uptime)');
```

## 18

### --description--

`os.cpus()` returns an array of objects describing each logical CPU core on the machine. The number of cores is simply the length of that array:

```js
console.log(os.cpus().length); // e.g. 8
```

In `server.js`, add a `console.log` that prints the number of CPU cores using `os.cpus().length`.

Run `node server.js` — a positive integer should appear at the end of the output.

### --tests--

`server.js` logs `os.cpus().length`.

```js
const __file = await __helpers.getFile(project.dashedName, 'server.js');
assert.match(__file, /os\.cpus\s*\(\s*\)\.length/, 'You should log `os.cpus().length` in `server.js`');
```

Running `server.js` prints a positive integer for the CPU count.

```js
const { stdout } = await __helpers.getCommandOutput('node server.js', project.dashedName);
const __lines = stdout.trim().split('\n').filter(Boolean);
const __last = __lines.at(-1).trim();
assert.match(__last, /^\d+$/, 'The last line of output should be the CPU count — a positive integer');
assert.isAbove(parseInt(__last, 10), 0, 'The CPU count should be greater than 0');
```

## 19

### --description--

The `path` module provides utilities for working with file and directory paths in a cross-platform way. Use `path.join` to build paths from segments — it inserts the correct separator (`/` on Unix, `\` on Windows) automatically:

```js
const path = require('path');
const fullPath = path.join(__dirname, 'assets', 'poem.txt');
console.log(fullPath);
```

In `server.js`, require the `path` module and use `path.join` to build a path from `__dirname`, `'assets'`, and `'poem.txt'`. Store the result in a variable called `filePath` and log it.

Run `node server.js` — you should see an absolute path to `assets/poem.txt`.

### --tests--

`server.js` requires `path` and calls `path.join` with `__dirname`, `'assets'`, and `'poem.txt'`.

```js
const __file = await __helpers.getFile(project.dashedName, 'server.js');
const __t = new __helpers.Tower(__file);
const __path = __t.getVariable('path');
assert.isDefined(__path, 'You should declare a variable called `path`');
assert.match(__path.compact, /require\(["']path["']\)/, 'You should assign `require("path")` to `path`');
const __calls = __t.getCalls('path.join');
assert.isAbove(__calls.length, 0, 'You should call `path.join` in `server.js`');
assert.match(__calls.at(0).compact, /__dirname/, 'The first argument to `path.join` should be `__dirname`');
assert.match(__calls.at(0).compact, /assets/, 'The path segments should include `assets`');
assert.match(__calls.at(0).compact, /poem\.txt/, 'The path segments should include `poem.txt`');
```

Running `server.js` prints an absolute path ending in `assets/poem.txt`.

```js
const { stdout } = await __helpers.getCommandOutput('node server.js', project.dashedName);
assert.match(stdout.trim(), /assets.poem\.txt/, 'Running `node server.js` should print a path containing `assets/poem.txt`');
```

### --seed--

#### --"learn-nodejs-common-modules/server.js"--

```js
// Add your code below this line
```

## 20

### --description--

The `path` module has three useful methods for inspecting path components:

- `path.basename(p)` — the last portion of a path (the filename)
- `path.dirname(p)` — the directory portion of a path
- `path.extname(p)` — the file extension, including the dot

In `server.js`, add `console.log` calls that pass `filePath` to each of the three methods above.

Run `node server.js` — you should see the filename, directory, and extension printed on separate lines.

### --tests--

`server.js` calls `path.basename`, `path.dirname`, and `path.extname` on `filePath`.

```js
const __file = await __helpers.getFile(project.dashedName, 'server.js');
assert.match(__file, /path\.basename\s*\(/, 'You should call `path.basename(filePath)` in `server.js`');
assert.match(__file, /path\.dirname\s*\(/, 'You should call `path.dirname(filePath)` in `server.js`');
assert.match(__file, /path\.extname\s*\(/, 'You should call `path.extname(filePath)` in `server.js`');
```

Running `server.js` prints `poem.txt`, a directory path, and `.txt` on separate lines.

```js
const { stdout } = await __helpers.getCommandOutput('node server.js', project.dashedName);
assert.include(stdout, 'poem.txt', 'Running `node server.js` should print `poem.txt` (from `path.basename`)');
assert.include(stdout, '.txt', 'Running `node server.js` should print `.txt` (from `path.extname`)');
```

## 21

### --description--

`path.resolve` and `path.join` both build paths, but they behave differently when given `'..'` segments:

- `path.join` simply concatenates the segments with the separator — it does not resolve the result to an absolute path on its own unless you start with an absolute segment like `__dirname`.
- `path.resolve` always returns an absolute path, processing `'..'` segments against the current working directory.

```js
console.log(path.join('assets', '..', 'server.js'));   // assets/../server.js → assets/../server.js (relative)
console.log(path.resolve('assets', '..', 'server.js')); // /absolute/path/to/server.js
```

In `server.js`, add two `console.log` calls: one using `path.join('assets', '..', 'server.js')` and one using `path.resolve('assets', '..', 'server.js')`.

Run `node server.js` to compare the outputs.

### --tests--

`server.js` calls `path.join` with `'assets'`, `'..'`, and `'server.js'`.

```js
const __file = await __helpers.getFile(project.dashedName, 'server.js');
assert.match(__file, /path\.join\s*\(\s*['"]assets['"].*['"]\.\.['"].*['"]server\.js['"]\s*\)/, 'You should call `path.join("assets", "..", "server.js")` in `server.js`');
```

`server.js` calls `path.resolve` with `'assets'`, `'..'`, and `'server.js'`.

```js
const __file = await __helpers.getFile(project.dashedName, 'server.js');
assert.match(__file, /path\.resolve\s*\(\s*['"]assets['"].*['"]\.\.['"].*['"]server\.js['"]\s*\)/, 'You should call `path.resolve("assets", "..", "server.js")` in `server.js`');
```

Running `server.js` prints two paths — one relative, one absolute.

```js
const { stdout } = await __helpers.getCommandOutput('node server.js', project.dashedName);
const __lines = stdout.trim().split('\n').filter(l => l.includes('server.js'));
assert.isAtLeast(__lines.length, 2, 'Running `node server.js` should print two paths containing `server.js`');
const __hasAbsolute = __lines.some(l => l.trim().startsWith('/') || /^[A-Z]:\\/.test(l.trim()));
assert.isTrue(__hasAbsolute, 'One of the paths should be absolute (from `path.resolve`)');
```

## 22

### --description--

`path.parse(p)` breaks a path string into its component parts and returns an object with `root`, `dir`, `base`, `ext`, and `name` properties:

```js
const parts = path.parse('/home/user/assets/poem.txt');
console.log(parts);
// { root: '/', dir: '/home/user/assets', base: 'poem.txt', ext: '.txt', name: 'poem' }
```

In `server.js`, call `path.parse(filePath)` and log the result.

Run `node server.js` — you should see an object with all five properties printed.

### --tests--

`server.js` calls `path.parse` with `filePath`.

```js
const __file = await __helpers.getFile(project.dashedName, 'server.js');
assert.match(__file, /path\.parse\s*\(\s*filePath\s*\)/, 'You should call `path.parse(filePath)` in `server.js`');
```

Running `server.js` prints an object containing `ext` and `name` properties from the parsed path.

```js
const { stdout } = await __helpers.getCommandOutput('node server.js', project.dashedName);
assert.include(stdout, 'ext', 'Running `node server.js` should print an object with an `ext` property');
assert.include(stdout, 'name', 'Running `node server.js` should print an object with a `name` property');
assert.include(stdout, 'poem', 'The parsed path should include `poem` as the file name');
```

## 23

### --description--

`process` is a global object in Node.js — you do not need to `require` it. It provides information about the current Node.js process:

- `process.version` — the Node.js version string (e.g. `'v20.0.0'`)
- `process.platform` — the operating system platform (e.g. `'linux'`)
- `process.env` — an object containing environment variables; `process.env.NODE_ENV` is commonly used to detect the environment

In `server.js`, log `process.version`, `process.platform`, and `process.env.NODE_ENV`, each on its own line.

Run `node server.js` — you should see the version, platform, and `undefined` (or the value of `NODE_ENV` if set) printed.

### --tests--

`server.js` logs `process.version`, `process.platform`, and `process.env.NODE_ENV`.

```js
const __file = await __helpers.getFile(project.dashedName, 'server.js');
assert.match(__file, /process\.version/, 'You should log `process.version` in `server.js`');
assert.match(__file, /process\.platform/, 'You should log `process.platform` in `server.js`');
assert.match(__file, /process\.env\.NODE_ENV/, 'You should log `process.env.NODE_ENV` in `server.js`');
```

Running `server.js` prints the Node.js version string.

```js
const { stdout } = await __helpers.getCommandOutput('node server.js', project.dashedName);
assert.match(stdout, /v\d+\.\d+\.\d+/, 'Running `node server.js` should print the Node.js version (e.g. `v20.0.0`)');
```

### --seed--

#### --"learn-nodejs-common-modules/server.js"--

```js
// Add your code below this line
```

## 24

### --description--

`process.argv` is an array containing the command-line arguments passed to the Node.js process. The first two elements are always the path to `node` and the path to the script file. Any extra arguments you pass start from index `2`:

```js
// run with: node server.js hello world
console.log(process.argv);    // [ '/path/to/node', '/path/to/server.js', 'hello', 'world' ]
console.log(process.argv[2]); // 'hello'
```

In `server.js`, add a `console.log` call that logs `process.argv`.

Run `node server.js` and also try passing an extra argument like `node server.js myArg` to see it appear in the array.

### --tests--

`server.js` logs `process.argv`.

```js
const __file = await __helpers.getFile(project.dashedName, 'server.js');
assert.match(__file, /process\.argv/, 'You should log `process.argv` in `server.js`');
```

Running `server.js` prints an array that includes the path to the script file.

```js
const { stdout } = await __helpers.getCommandOutput('node server.js', project.dashedName);
assert.include(stdout, 'server.js', 'Running `node server.js` should print the argv array, which includes the script path');
```

## 25

### --description--

`process.stdout.write` and `process.stderr.write` let you write directly to the standard output and standard error streams, without the automatic newline that `console.log` adds:

```js
process.stdout.write('Hello ');
process.stdout.write('World\n'); // newline only when you add \n
process.stderr.write('Something went wrong\n');
```

In `server.js`, add a call to `process.stdout.write` that writes `'Hello from stdout\n'` and a call to `process.stderr.write` that writes `'Hello from stderr\n'`.

Run `node server.js` — both messages should appear in the terminal.

### --tests--

`server.js` calls `process.stdout.write`.

```js
const __file = await __helpers.getFile(project.dashedName, 'server.js');
assert.match(__file, /process\.stdout\.write\s*\(/, 'You should call `process.stdout.write(...)` in `server.js`');
```

`server.js` calls `process.stderr.write`.

```js
const __file = await __helpers.getFile(project.dashedName, 'server.js');
assert.match(__file, /process\.stderr\.write\s*\(/, 'You should call `process.stderr.write(...)` in `server.js`');
```

Running `server.js` outputs the stdout message to the terminal.

```js
const { stdout } = await __helpers.getCommandOutput('node server.js', project.dashedName);
assert.include(stdout, 'Hello from stdout', 'Running `node server.js` should write `Hello from stdout` to stdout');
```

## 26

### --description--

A <dfn title="a sequence of data made available over time, processed piece by piece rather than all at once">stream</dfn> lets you handle data incrementally without loading it all into memory. `fs.createReadStream` creates a readable stream that emits chunks of a file:

```js
const fs = require('fs');
const readable = fs.createReadStream('assets/poem.txt', { encoding: 'utf8' });

readable.on('data', (chunk) => {
  console.log(chunk);
});

readable.on('end', () => {
  console.log('Done reading');
});
```

In `server.js`, require `fs` and create a readable stream from `'assets/poem.txt'` with `encoding: 'utf8'`. Listen to the `data` and `end` events and log each chunk and a message when reading is complete.

Run `node server.js` — the poem should print in chunks, followed by your end message.

### --tests--

`server.js` calls `fs.createReadStream` with `'assets/poem.txt'`.

```js
const __file = await __helpers.getFile(project.dashedName, 'server.js');
const __t = new __helpers.Tower(__file);
const __calls = __t.getCalls('fs.createReadStream');
assert.isAbove(__calls.length, 0, 'You should call `fs.createReadStream` in `server.js`');
assert.match(__calls.at(0).compact, /assets[/\\]?poem\.txt/, 'The path passed to `fs.createReadStream` should be `assets/poem.txt`');
```

`server.js` listens to the `data` event and the `end` event on the readable stream.

```js
const __file = await __helpers.getFile(project.dashedName, 'server.js');
assert.match(__file, /\.on\s*\(\s*['"]data['"]/, 'You should listen to the `data` event on the readable stream');
assert.match(__file, /\.on\s*\(\s*['"]end['"]/, 'You should listen to the `end` event on the readable stream');
```

Running `server.js` prints the poem contents to the console.

```js
const { stdout } = await __helpers.getCommandOutput('node server.js', project.dashedName);
assert.include(stdout, 'fog comes', 'Running `node server.js` should print the poem from the readable stream');
```

### --seed--

#### --"learn-nodejs-common-modules/server.js"--

```js
const fs = require('fs');

// Add your code below this line
```

## 27

### --description--

`fs.createWriteStream` creates a writable stream. You can push data into it using `.write(chunk)` and signal that writing is complete with `.end()`:

```js
const writable = fs.createWriteStream('assets/stream-output.txt');
writable.write('First chunk\n');
writable.write('Second chunk\n');
writable.end();
```

In `server.js`, create a writable stream pointing to `'assets/stream-output.txt'` and write at least two chunks of text to it, then call `.end()`.

Run `node server.js` — the file `assets/stream-output.txt` should be created with your written content.

### --tests--

`server.js` calls `fs.createWriteStream` with `'assets/stream-output.txt'`.

```js
const __file = await __helpers.getFile(project.dashedName, 'server.js');
const __t = new __helpers.Tower(__file);
const __calls = __t.getCalls('fs.createWriteStream');
assert.isAbove(__calls.length, 0, 'You should call `fs.createWriteStream` in `server.js`');
assert.match(__calls.at(0).compact, /assets[/\\]?stream-output\.txt/, 'The path passed to `fs.createWriteStream` should be `assets/stream-output.txt`');
```

Running `server.js` creates `assets/stream-output.txt` on disk.

```js
const { join } = await import('path');
const { existsSync } = await import('fs');
await __helpers.getCommandOutput('node server.js', project.dashedName);
const __exists = existsSync(join(ROOT, project.dashedName, 'assets', 'stream-output.txt'));
assert.isTrue(__exists, '`assets/stream-output.txt` should exist after running `node server.js`');
```

## 28

### --description--

`readable.pipe(writable)` connects a readable stream directly to a writable stream — data flows from the source to the destination automatically without you having to handle `data` events manually:

```js
const readable = fs.createReadStream('assets/poem.txt');
const writable = fs.createWriteStream('assets/stream-output.txt');
readable.pipe(writable);
```

In `server.js`, remove the manual `.write` calls. Instead, create a readable stream from `'assets/poem.txt'` and a writable stream to `'assets/stream-output.txt'`, then pipe the readable into the writable.

Run `node server.js` — `assets/stream-output.txt` should be overwritten with the contents of `poem.txt`.

### --tests--

`server.js` calls `.pipe()` to connect the readable to the writable stream.

```js
const __file = await __helpers.getFile(project.dashedName, 'server.js');
assert.match(__file, /\.pipe\s*\(/, 'You should call `.pipe(writable)` on the readable stream');
```

Running `server.js` writes the poem into `assets/stream-output.txt`.

```js
const { join } = await import('path');
const { readFileSync } = await import('fs');
await __helpers.getCommandOutput('node server.js', project.dashedName);
const __content = readFileSync(join(ROOT, project.dashedName, 'assets', 'stream-output.txt'), 'utf8');
assert.include(__content, 'fog comes', '`assets/stream-output.txt` should contain the poem after piping');
```

### --seed--

#### --"learn-nodejs-common-modules/server.js"--

```js
const fs = require('fs');

const readable = fs.createReadStream('assets/poem.txt');
const writable = fs.createWriteStream('assets/stream-output.txt');

// Replace this comment with your pipe call
```

## --fcc-end--
