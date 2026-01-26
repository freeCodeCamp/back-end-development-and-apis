# Learn Express by Building a Random Joke App

In this course, you will learn basic Express by building a random joke app.

## 0

### --description--

To get started, you need to import Express by using `require()`, then create an Express app by calling the Express function and saving it in an `app` variable. 

### --tests--

You should create a variable named `express`.

```js
const file = await __helpers.getFile("learn-express-by-building-a-random-joke-app", "index.js");
const code = new __helpers.Tower(file);
const expressVar = code.getVariable("express");
assert.exists(expressVar);
```

Your `express` variable should be set to `require('express')`.

```js
const file = await __helpers.getFile("learn-express-by-building-a-random-joke-app", "index.js");
const code = new __helpers.Tower(file);
const expressVar = code.getVariable("express");
assert.match(expressVar.compact, /const\s+express\s*=\s*require\(["']express["']\);?/);
```

You should create an `app` variable and set it to `express()`.

```js
const file = await __helpers.getFile("learn-express-by-building-a-random-joke-app", "index.js");
const code = new __helpers.Tower(file);
const appVar = code.getVariable("app");
assert.match(appVar.compact, /const\s+app\s*=\s*express\(\);?/);
```

### --seed--

#### --"index.js"--

```js

```

## 1

```json
{
  "watch": ["learn-x-by-building-y/test/index.js"]
}
```

### --description--

Step 2 desc

### --tests--

Hint one text

```js
// hint one test
```

### --seed--

#### --"index.js"--

```javascript
const express = require('express');
const app = express();
```

## --fcc-end--
