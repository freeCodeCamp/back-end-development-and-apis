import { pluginEvents } from "@freecodecamp/freecodecamp-os/.freeCodeCamp/plugin/index.js";
import { readdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

pluginEvents.onTestsStart = async (project, testsState) => {};

pluginEvents.onTestsEnd = async (project, testsState) => {};

pluginEvents.onProjectStart = async (project) => {};

pluginEvents.onProjectFinished = async (project) => {};

pluginEvents.onLessonFailed = async (project) => {};

pluginEvents.onLessonPassed = async (project) => {
  // for `learn-nodejs-repl`, reset log files per lesson

  if (project.dashedName !== "learn-nodejs-repl") {
    return;
  }

  await resetLogs();
};

async function resetLogs() {
  const logsDir = ".logs/";
  try {
    const files = await readdir(logsDir, { withFileTypes: true });
    for (const file of files) {
      await writeFile(join(logsDir, file.name), "", "utf-8");
    }
  } catch (e) {
    console.error("unable to reset logs files");
    console.error(e);
  }
}
