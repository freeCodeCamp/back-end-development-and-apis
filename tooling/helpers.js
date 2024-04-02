import { ROOT } from "@freecodecamp/freecodecamp-os/.freeCodeCamp/tooling/env.js";
import { join } from "path";
import { readFile, readdir, constants, access } from "fs/promises";
import { createConnection } from "net";
import { logover } from "@freecodecamp/freecodecamp-os/.freeCodeCamp/tooling/logger.js";

export { Babeliser } from "babeliser";

export async function getDir(path) {
  const rootPath = join(ROOT, path);
  const dir = await readdir(rootPath);
  return dir;
}

export async function fileExists(path) {
  try {
    await access(path, constants.F_OK);
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
  } = {}
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
            .map((flag) => `-${flag}`)
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

import { parse } from "@babel/parser";
import gen_default from "@babel/generator";
import { is } from "@babel/types";

const generate = gen_default.default;

export { generate };

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
          if (!is("Identifier", identifier)) {
            return false;
          }

          return identifier.name === name;
        }
      }

      return false;
    });
    if (!ast) {
      throw new Error(`No AST found with name ${name}`);
    }

    return new Tower(ast);
  }

  getFunction(name) {
    return this.getType("FunctionDeclaration", name);
  }

  getVariable(name) {
    return this.getType("VariableDeclaration", name);
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
