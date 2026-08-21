function checkForToken() {
  const serverTokenCode = `
    try {
      const {readFile} = await import('fs/promises');
      const tokenFile = await readFile(join(ROOT, 'config/token.txt'));
      const token = tokenFile.toString();
      console.log(token);
      __result = token;
    } catch (e) {
      __result = null;
    }`;
  socket.send(
    JSON.stringify({
      event: "__run-client-code",
      data: serverTokenCode,
    }),
  );
}

function checkForUpdate() {
  const serverVersionCode = `
    try {
      const { readFile } = await import('fs/promises');
      const pkgFile = await readFile(join(ROOT, 'package.json'));
      const local = JSON.parse(pkgFile.toString()).version;
      const res = await fetch('https://raw.githubusercontent.com/freeCodeCamp/back-end-development-and-apis/main/package.json');
      const remotePkg = await res.json();
      const remote = remotePkg.version;
      __result = { kind: 'version-check', local, remote };
    } catch (e) {
      console.error(e);
      __result = { kind: 'version-check', local: null, remote: null, error: true };
    }`;
  socket.send(
    JSON.stringify({
      event: "__run-client-code",
      data: serverVersionCode,
    }),
  );
}

function isOlderVersion(local, remote) {
  if (!local || !remote) return false;
  const a = local.split(".").map(Number);
  const b = remote.split(".").map(Number);
  for (let i = 0; i < Math.max(a.length, b.length); i++) {
    const x = a[i] || 0;
    const y = b[i] || 0;
    if (x < y) return true;
    if (x > y) return false;
  }
  return false;
}

function showUpdateBanner(remoteVersion) {
  if (document.getElementById("fcc-update-banner")) return;
  const banner = document.createElement("div");
  banner.id = "fcc-update-banner";
  banner.style.cssText =
    "position:fixed;top:0;left:0;right:0;z-index:9999;" +
    "background:#0a0a23;color:#fff;padding:10px 16px;" +
    "font-family:sans-serif;font-size:14px;" +
    "display:flex;align-items:center;justify-content:center;gap:12px;" +
    "box-shadow:0 2px 6px rgba(0,0,0,0.3);";

  const text = document.createElement("span");
  text.innerHTML = `A newer version (${remoteVersion}) of this course is available. Consider updating with <code>git pull -r --autostash</code>.`;

  const dismiss = document.createElement("button");
  dismiss.innerText = "Dismiss";
  dismiss.style.cssText =
    "background:transparent;color:#fff;border:1px solid #fff;" +
    "border-radius:4px;padding:2px 10px;cursor:pointer;";
  dismiss.onclick = () => {
    localStorage.setItem("fcc-dismissed-update-version", remoteVersion);
    banner.remove();
  };

  banner.appendChild(text);
  banner.appendChild(dismiss);
  document.body.appendChild(banner);
}

async function askForToken() {
  const modal = document.createElement("dialog");
  const p = document.createElement("p");
  p.innerText = "Enter your token";
  p.style.color = "black";
  const input = document.createElement("input");
  input.type = "text";
  input.id = "token-input";
  input.style.color = "black";
  const button = document.createElement("button");
  button.innerText = "Submit";
  button.style.color = "black";
  button.onclick = async () => {
    const token = input.value;
    const serverTokenCode = `
      try {
        const {writeFile} = await import('fs/promises');
        await writeFile(join(ROOT, 'config/token.txt'), '${token}');
        __result = true;
      } catch (e) {
        console.error(e);
        __result = false;
      }`;
    socket.send(
      JSON.stringify({
        event: "__run-client-code",
        data: serverTokenCode,
      }),
    );
    modal.close();
  };

  modal.appendChild(p);
  modal.appendChild(input);
  modal.appendChild(button);
  document.body.appendChild(modal);
  modal.showModal();
}

const socket = new WebSocket(
  `${window.location.protocol === "https:" ? "wss:" : "ws:"}//${
    window.location.host
  }`,
);

window.onload = function () {
  socket.onmessage = function (event) {
    const parsedData = JSON.parse(event.data);
    if (
      parsedData.event === "RESPONSE" &&
      parsedData.data.event === "__run-client-code"
    ) {
      if (parsedData.data.error) {
        console.log(parsedData.data.error);
        return;
      }
      const { __result } = parsedData.data;
      if (
        __result &&
        typeof __result === "object" &&
        __result.kind === "version-check"
      ) {
        if (
          !__result.error &&
          isOlderVersion(__result.local, __result.remote)
        ) {
          if (
            localStorage.getItem("fcc-dismissed-update-version") !==
            __result.remote
          ) {
            showUpdateBanner(__result.remote);
          }
        }
        return;
      }
      if (!__result) {
        askForToken();
        return;
      }
      window.__token = __result;
    }
  };
  let interval;
  interval = setInterval(() => {
    if (socket.readyState === 1) {
      clearInterval(interval);
      checkForToken();
      checkForUpdate();
    }
  }, 1000);
};
