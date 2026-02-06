# Learn Express Middleware by Building a Data Sanitizer

You will be building a data sanitizer middleware for an Express application.

## 0

### --description--

You will be building a data sanitizer middleware for an Express application.

**User Stories:**

1. You should import the `express` module.

1. You should create an Express application instance and assign it to a variable `app`.

1. You should define a constant `PORT` and assign it the value `3000`.

1. You should use the built-in `express.urlencoded()` middleware with `{ extended: true }` to parse form data.

1. You should create a custom middleware function called `inputCleaner` that takes three parameters `req`, `res` and `next` for request, response, and next middleware function respectively.

1. The `inputCleaner` middleware should:

- Logs the message `[Middleware 1] Cleaning/Modifying data...` to the console.

- Converts `req.body.username` to lowercase if it exists.

- Removes HTML tags from `req.body.comment` if it exists using the regex pattern `/<[^>]*>/g`.

- Calls `next()` to continue to the next middleware.

1. You should create a custom middleware function called `inputValidator` that takes three parameters `req`, `res` and `next`.

1. The `inputValidator` should:

- Logs the message `[Middleware 2] Validating data...` to the console.

- Checks if `username` exists and has a length of at least 3 characters.

- If validation fails, logs `[Middleware 2] Validation FAILED: Username too short.` and redirects to `/form?error=Username must be at least 3 characters.` without calling `next()`.

- If validation passes, logs `[Middleware 2] Validation PASSED.` and calls `next()`.

1. You should use `express.static()` middleware to serve static files from the `public` directory at the `/form` route.

1. You should have a GET route for the root path `/` that redirects to `/form`.

1. You should have a POST route for the `/submit` path that:

- Uses `inputCleaner` as the first route-specific middleware.

- Uses `inputValidator` as the second route-specific middleware.

- Has a final handler that sends an HTML response with the cleaned and validated `username` and `comment`.

- The HTML response should include a success heading, display the submitted data, and provide a link back to `/form`.

1. Your application should listen on port `3000`.

1. When the server starts listening, you should log two messages to the console:
- `Server running on http://localhost:3000`
- `Open in browser: http://localhost:3000/form`

1. When a user submits a form to `/submit`, the data should pass through `inputCleaner` first, then `inputValidator`, and finally reach the route handler if validation passes.

1. The middleware chain should demonstrate the request-response cycle: if validation fails, the response is sent immediately without reaching the final handler.

<!-- test examples -->

| Input Value | Expected req.body.username in Final Handler | Action Taken by Middleware |
|-------------|---------------------------------------------|----------------------------|
| `"  Admin "` | `"admin"` | Cleaned and Validated. |
| `"AB"` | N/A (cycle halted) | Fails Validation, Redirected. |
| `"Test"`, Comment: `"<b>Bold</b>"` | `"test"`, Comment: `"Bold"` | Cleaned (lowercase and tag stripping). |

### --tests--

You should import the `express` module.

```js


```

You should have an `app` variable that holds the Express application instance.

```js


```

You should have a `PORT` variable that holds the port number `3000`.

```js


```

You should use `app.use(express.urlencoded({ extended: true }));` to parse form data.

```js


```

You should have a function called `inputCleaner`.

```js


```

The `inputCleaner` should take three parameters: `req`, `res`, and `next`.

```js


```

The `inputCleaner` middleware should convert `req.body.username` to lowercase.

```js


```

The `inputCleaner` middleware should remove HTML tags from `req.body.comment`.

```js


```

The `inputCleaner` middleware should call `next()` at the end of its logic.

```js


```

You should have a function called `inputValidator`.

```js


```

The `inputValidator` should take three parameters `req`, `res` and `next`.

```js

```

The `inputValidator` should log an error message to the console `Middleware 2] Validation FAILED: Username too short.` if username is less than 3 characters long.

```js

```

The `inputValidator` should redirect to `/form` with an error message `Username must be at least 3 characters.` if the username is less than 3 characters long.

```js


```

The `inputValidator` should call `next()` only if the validation criteria are met.

```js


```

You should use `express.static()` to serve the `public` directory at the `/form` route.

```js


```

Your GET route for `/` should redirect to `/form`.

```js


```

Your POST route for `/submit` should use `inputCleaner` as its first middleware.

```js


```

Your POST route for `/submit` should use `inputValidator` as its second middleware.

```js


```

The final handler for the `/submit` route should return a success message and display the `username` and `comment`.

```js


```

Your application should call `app.listen` using the `PORT` variable.

```js


```


### --before-all--

### --after-all--

## --fcc-end--