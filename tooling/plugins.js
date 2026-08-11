import { pluginEvents } from "@freecodecamp/freecodecamp-os/.freeCodeCamp/plugin/index.js";
import { readdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

pluginEvents.onTestsStart = async (project, testsState) => {};

pluginEvents.onTestsEnd = async (project, testsState) => {};

pluginEvents.onProjectStart = async (project) => {};

pluginEvents.onProjectFinished = async (project) => {
  try {
    const token = await readFile("config/token.txt", "utf-8");

    const tutorialId = "freeCodeCamp/" + project.dashedName;
    console.log("Submitting:", tutorialId);
    // Send request to POST /coderoad-challenge-completed
    // header: coderoad-user-token
    // body: tutorialId: freeCodeCamp/{project_dashed_name}
    const res = await fetch(
      "https://api.freecodecamp.org/coderoad-challenge-completed",
      {
        method: "POST",
        headers: {
          "coderoad-user-token": token.trim(),
          "content-type": "application/json",
        },
        body: JSON.stringify({
          tutorialId,
        }),
      },
    );

    const r = await res.json();
    if (r.type === "error") {
      console.log({ tutorialId });
      console.error(r);
    }
  } catch (e) {
    console.error(e);
    console.error(
      "An error occurred saving progress when completing this project",
    );
  }
};

pluginEvents.onLessonFailed = async (project) => {};

pluginEvents.onLessonPassed = async (project) => {
  if (project.id === 1) return;
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
