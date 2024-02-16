import { ROOT } from "@freecodecamp/freecodecamp-os/.freeCodeCamp/tooling/env.js";
import { join } from "path";
import { readdir } from "fs/promises";
import { constants, access } from "fs/promises";

export async function getDir(path) {
  const rootPath = join(ROOT, path);
  const dir = await readdir(rootPath);
  return dir;
}
