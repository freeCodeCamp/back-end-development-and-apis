import { ROOT } from "@freecodecamp/freecodecamp-os/.freeCodeCamp/tooling/env.js";
import { join } from "path";
import { readFile, readdir } from "fs/promises";
import { constants, access } from "fs/promises";
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
