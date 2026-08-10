import { ROOT } from "@freecodecamp/freecodecamp-os/.freeCodeCamp/tooling/env.js";
import { join } from "path";
import { readFile, readdir, constants, access } from "fs/promises";
import { createConnection } from "net";
import { logover } from "@freecodecamp/freecodecamp-os/.freeCodeCamp/tooling/logger.js";

import { Babeliser } from "babeliser";

export { Babeliser };

export async function getDir(path) {
  const rootPath = join(ROOT, path);
  const dir = await readdir(rootPath);
  return dir;
}

export async function fileExists(...path) {
  try {
    const withRoot = join(ROOT, ...path);
    await access(withRoot, constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

export async function getFile(projectDashedName, pathRelativeToProject) {
  const rootPath = join(ROOT, projectDashedName, pathRelativeToProject);
  const file = await readFile(rootPath, "utf-8");
  return file;
}

export function isServerListening(port) {
  return new Promise((resolve, _reject) => {
    const client = createConnection({ port });
    client.on("connect", () => {
      client.end();
      resolve(true);
    });
    client.on("error", () => {
      resolve(false);
    });
  });
}

/**
 *
 * @param {[string]} command An array of the form `[binary, ...arguments]`
 * @param {string} url URL to fetch
 * @param {Object?} options
 * @param {string?} options.expectedData Data to expect to be received from stdout
 * @param {string?} options.expectedError Data to expect to be received from stderr
 * @param {number} options.fetchTimeout Timeout in milliseconds for the fetch operation. Defaults to 2000.
 * @param {number} options.pollInterval Interval in milliseconds to check if data is `expectedData`. Defaults to 100.
 * @param {number} options.dataTimeout Timeout in milliseconds for the process to emit to stdout. Defaults to 2000.
 * @returns {Object} Object containing `stdout` and `stderr` strings
 */
export async function awaitExecution(
  command,
  url,
  {
    expectedData,
    expectedError,
    fetchTimeout = 2_000,
    pollInterval = 100,
    dataTimeout = 2_000,
  } = {},
) {
  const { execFile } = await import("node:child_process");

  // `execFile` must be used, because it does not spawn a shell by default.
  // Rather, the specified executable file is spawned directly as a new process
  // making it slightly more efficient than `exec`.
  const [bin, ...args] = command;
  const childProcess = execFile(bin, args, {
    cwd: ROOT,
  });

  let stdoutStr = "";
  let stderrStr = "";
  let receiveDataTimeout;

  childProcess.stdout.on("data", (data) => {
    stdoutStr += data;
    if (expectedData && stdoutStr.includes(expectedData)) {
      clearTimeout(receiveDataTimeout);
    }
  });

  childProcess.stderr.on("data", (data) => {
    stderrStr += data;
    if (expectedError && stderrStr.includes(expectedError)) {
      clearTimeout(receiveDataTimeout);
    }
    logover.debug(`stderr: ${data}`);
  });

  childProcess.on("error", (error) => {
    logover.debug(`exec error: ${error}`);
  });

  const controller = new AbortController();
  const signal = controller.signal;

  // A timeout to abort the fetch if there is no response
  const abortFetchTimeout = setTimeout(() => {
    controller.abort();
  }, fetchTimeout);

  let receiveDataTimeoutPoller;

  const receiveDataPromise = new Promise((resolve) => {
    receiveDataTimeout = setTimeout(() => {
      resolve();
    }, dataTimeout);

    receiveDataTimeoutPoller = setInterval(() => {
      if (receiveDataTimeout._destroyed === true) {
        resolve();
      }
    }, pollInterval);
  });

  try {
    const _response = await fetch(url, { signal });
    clearTimeout(abortFetchTimeout);
  } catch (_e) {}

  await receiveDataPromise;

  clearInterval(receiveDataTimeoutPoller);

  // Ensure to kill the child process to prevent leaving running servers
  childProcess.kill();

  return { stdout: stdoutStr, stderr: stderrStr };
}

/**
 * Parses a CLI string using the most common patterns for CLIs:
 * - `--flag` or `-f` for flags
 * - `-abc` for multiple flags
 * - `--key=value` or `-k=value` for key-value pairs
 * - `"quoted string"` or `'quoted string'` for strings
 * - `"some \"escaped\" string"` for escaped strings
 *
 * **Examples**:
 *
 * ```js
 * parseCli("curl --max-time 2 http://localhost:3000");
 * // => ["curl", "--max-time", "2", "http://localhost:3000"]
 * parseCli("curl -m 2 http://localhost:3000");
 * // => ["curl", "-m", "2", "http://localhost:3000"]
 * parseCli("curl -m=2 http://localhost:3000");
 * // => ["curl", "-m", "2", "http://localhost:3000"]
 * parseCli("git commit -am \"some message=1\"");
 * // => ["git", "commit", "-a", "-m", "some message=1"]
 * ```
 * @param {string} str CLI string including command
 * @returns {string[]} array of arguments where the first element is the command
 */
export function parseCli(str) {
  const args = [];
  const [command, ...rest] = str.split(" ");
  const iter = rest[Symbol.iterator]();
  let current = iter.next();
  while (!current.done) {
    const arg = current.value;
    if (arg.startsWith("--")) {
      const [key, value] = arg.split("=");
      if (value) {
        args.push(key, value);
      } else {
        args.push(key);
      }
    } else if (arg.startsWith("-")) {
      const [key, value] = arg.split("=");
      if (value) {
        args.push(key, value);
      } else {
        args.push(
          ...key
            .slice(1)
            .split("")
            .map((flag) => `-${flag}`),
        );
      }
    } else if (arg.startsWith('"') || arg.startsWith("'")) {
      const quote = arg[0];
      let string = arg.slice(1);
      current = iter.next();
      while (!string.endsWith(quote) && !current.done) {
        string += ` ${current.value}`;
        current = iter.next();
      }
      args.push(string.slice(0, -1));
    } else {
      args.push(arg);
    }
    current = iter.next();
  }
  return [command, ...args];
}

export async function getRepl() {
  const p = join(ROOT, ".logs", ".repl.log");
  return await readFile(p, "utf-8");
}

import { parse } from "@babel/parser";
import gen_default from "@babel/generator";
import { is } from "@babel/types";

const generate = gen_default.default;

export { generate };

/**
 * Static analysis helpers on top of `Babeliser`, for tests that need to accept
 * any syntax a camper might reasonably write.
 *
 * `Babeliser#getType` does not descend into the receiver of a method chain, so
 * `crypto.createHash("sha256").update(str)` only exposes the `.update` call, and
 * `fs.promises.readFile(p)` never exposes `fs.promises`. Every node is therefore
 * expanded through its chain, so nested calls and member expressions are found
 * wherever they appear, in any scope.
 *
 * **Example**:
 *
 * ```js
 * const i = new Inspector(file);
 * const calls = i.getCalls("fs.readFile");
 * assert.isAbove(calls.length, 0);
 * assert.equal(i.argText(calls.at(0).arguments.at(0)), "assets/poem.txt");
 * assert.isTrue(i.hasCallback(calls.at(0)));
 * ```
 */
export class Inspector extends Babeliser {
  constructor(codeString, options = {}) {
    super(codeString, options);

    const chain = (node) => {
      const nodes = [];
      let current = node;
      while (current) {
        nodes.push(current);
        if (is("CallExpression", current)) {
          current = current.callee;
        } else if (is("MemberExpression", current)) {
          current = current.object;
        } else {
          current = null;
        }
      }
      return nodes;
    };

    const chained = this.getType("CallExpression")
      .concat(this.getType("MemberExpression"))
      .flatMap(chain);

    /** Every call expression, including those chained onto another call. */
    this.calls = chained.filter((n) => is("CallExpression", n));
    /** Every member expression, including the receivers of a chain. */
    this.members = chained.filter((n) => is("MemberExpression", n));
    /** Every variable declarator, in any scope. */
    this.declarators = this.getVariableDeclarations().flatMap(
      (v) => v.declarations,
    );
  }

  /**
   * Calls whose callee is written exactly `calleeCode`.
   * @param {string} calleeCode e.g. `"fs.readFile"`
   */
  getCalls(calleeCode) {
    return this.calls.filter((c) => generate(c.callee).code === calleeCode);
  }

  /**
   * Whether `calleeCode` is called at all.
   * @param {string} calleeCode e.g. `"os.platform"`
   */
  hasCall(calleeCode) {
    return this.getCalls(calleeCode).length > 0;
  }

  /**
   * Calls to a method of any receiver, so the receiver may be named anything.
   * @param {string} methodName e.g. `"toString"` for `buf.toString("hex")`
   */
  getMethodCalls(methodName) {
    return this.calls.filter((c) => c.callee?.property?.name === methodName);
  }

  /**
   * Whether the code reads `memberCode`.
   * @param {string} memberCode e.g. `"process.env.NODE_ENV"`
   */
  hasMember(memberCode) {
    return this.members.some((m) => generate(m).code === memberCode);
  }

  /**
   * The value of a string or simple template literal, else its source. Lets a
   * test compare an argument without caring which quotes were used.
   */
  argText(node) {
    if (!node) {
      return "";
    }
    if (is("StringLiteral", node)) {
      return node.value;
    }
    if (is("TemplateLiteral", node) && node.expressions.length === 0) {
      return node.quasis[0].value.cooked;
    }
    return generate(node).code;
  }

  /** The `argText` of each argument of `call`. */
  argTexts(call) {
    return (call?.arguments ?? []).map((a) => this.argText(a));
  }

  /** The declarator for a variable named `name`, in any scope. */
  getDeclarator(name) {
    return this.declarators.find((d) => d.id?.name === name);
  }

  /**
   * The module `name` is assigned from, or `null` when it is not a `require`.
   * The `node:` prefix is preserved, so compare against both spellings.
   */
  getRequiredModule(name) {
    const init = this.getDeclarator(name)?.init;
    if (init?.callee?.name !== "require") {
      return null;
    }
    return this.argText(init.arguments?.at(0)) || null;
  }

  /**
   * Whether a function `name` exists, declared with `function`, or assigned as
   * an arrow function or function expression.
   */
  hasFunction(name) {
    const declared = this.getFunctionDeclarations().some(
      (f) => f.id?.name === name,
    );
    const assigned = this.declarators.some(
      (d) =>
        d.id?.name === name &&
        ["ArrowFunctionExpression", "FunctionExpression"].includes(
          d.init?.type,
        ),
    );
    return declared || assigned;
  }

  /**
   * Whether the last argument of `call` is a callback - inline, or a reference
   * to a function declared elsewhere. Callback-last APIs always take the value
   * being operated on first, so a lone argument is never treated as a callback.
   */
  hasCallback(call) {
    const args = call?.arguments ?? [];
    if (args.length < 2) {
      return false;
    }
    const last = args.at(-1);
    if (["ArrowFunctionExpression", "FunctionExpression"].includes(last.type)) {
      return true;
    }
    return is("Identifier", last) && this.hasFunction(last.name);
  }
}

export class Tower {
  constructor(stringOrAST, options = {}) {
    if (typeof stringOrAST === "string") {
      const parsedThing = parse(stringOrAST, {
        sourceType: "module",
        ...options,
      });
      this.ast = parsedThing.program;
    } else {
      this.ast = stringOrAST;
    }
  }

  // Get all the given types at the current scope
  getType(type, name) {
    const body = this.extractBody(this.ast);
    const ast = body.find((node) => {
      if (node.type === type) {
        if (is("FunctionDeclaration", node)) {
          return node.id?.name === name;
        }

        if (is("VariableDeclaration", node)) {
          const variableDeclarator = node.declarations[0];
          if (!is("VariableDeclarator", variableDeclarator)) {
            return false;
          }

          const identifier = variableDeclarator.id;
          if (is("Identifier", identifier)) {
            return identifier.name === name;
          }

          if (is("ObjectPattern", identifier)) {
            if (generate(identifier, { compact: true }).code === name) {
              return true;
            }

            return identifier.properties.some(
              (p) => is("Identifier", p.key) && p.key.name === name,
            );
          }

          return false;
        }
      }

      if (type === "VariableDeclaration" && is("ImportDeclaration", node)) {
        const matchesSpecifier = node.specifiers.some((s) => {
          if (
            is("ImportDefaultSpecifier", s) ||
            is("ImportNamespaceSpecifier", s) ||
            is("ImportSpecifier", s)
          ) {
            return s.local.name === name;
          }

          return false;
        });
        if (matchesSpecifier) {
          return true;
        }

        if (node.specifiers.every((s) => is("ImportSpecifier", s))) {
          const compact = `{${node.specifiers
            .map((s) => s.local.name)
            .join(",")}}`;
          return compact === name;
        }
      }

      return false;
    });

    return ast ? new Tower(ast) : undefined;
  }

  getFunction(name) {
    return this.getType("FunctionDeclaration", name);
  }

  getVariable(name) {
    return this.getType("VariableDeclaration", name);
  }

  getIfStatements() {
    const body = this.extractBody(this.ast);
    return body.filter((node) => is("IfStatement", node));
  }

  /**
   * The property of an object-literal variable whose key is `key`
   *
   * ```js
   * const mimeTypes = { ".html": "text/html" };
   * getProperty(".html"); // `".html": "text/html"`
   * ```
   */
  getProperty(key) {
    const init =
      this.ast.type === "VariableDeclaration"
        ? this.ast.declarations[0]?.init
        : this.ast;
    if (!is("ObjectExpression", init)) {
      return undefined;
    }

    const property = init.properties.find((p) => {
      if (is("StringLiteral", p.key)) {
        return p.key.value === key;
      }

      if (is("Identifier", p.key)) {
        return p.key.name === key;
      }

      return false;
    });

    return property ? new Tower(property) : undefined;
  }

  getCalls(callSite) {
    const body = this.extractBody(this.ast);
    const calls = body.filter((node) => {
      if (is("ExpressionStatement", node)) {
        const expression = node.expression;
        if (is("CallExpression", expression)) {
          const callee = expression.callee;

          switch (callee.type) {
            case "Identifier":
              return callee.name === callSite;
            case "MemberExpression":
              return generate(callee).code === callSite;
            default:
              return true;
          }
        }
      }

      if (is("VariableDeclarator", node)) {
        const init = node.init;
        if (is("CallExpression", init)) {
          const callee = init.callee;

          switch (callee.type) {
            case "Identifier":
              return callee.name === callSite;
            case "MemberExpression":
              return generate(callee).code === callSite;
            default:
              return true;
          }
        }
      }

      return false;
    });
    return calls.map((call) => new Tower(call));
  }

  extractBody(ast) {
    switch (ast.type) {
      case "Program":
        return ast.body;
      case "FunctionDeclaration":
        return ast.body.body;
      case "VariableDeclaration":
        return ast.declarations;
      case "ArrowFunctionExpression":
        const blockStatement = ast.body;
        if (is("BlockStatement", blockStatement)) {
          return blockStatement.body;
        }

        throw new Error(`Unimplemented for ${ast.type}`);
      case "BlockStatement":
        return ast.body;
      default:
        throw new Error(`Unimplemented for ${ast.type}`);
    }
  }

  get generate() {
    return generate(this.ast).code;
  }

  get compact() {
    return generate(this.ast, { compact: true }).code;
  }
}
