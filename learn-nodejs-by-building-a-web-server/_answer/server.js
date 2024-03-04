import http from "http";
import fs from "fs";
import path, { join } from "path";

const server = http.createServer((request, response) => {
  console.log("request ", request.headers);
  console.log();

  const url = new URL(request.url, `http://${request.headers.host}`);

  let filePath = join("public", url.pathname);

  if (filePath === "public/") {
    filePath = "public/index.html";
  }

  console.log(filePath);

  const extname = String(path.extname(filePath)).toLowerCase();
  const mimeTypes = {
    ".html": "text/html",
    ".js": "text/javascript",
    ".css": "text/css",
    ".png": "image/png",
  };

  const contentType = mimeTypes[extname] || "application/octet-stream";

  fs.readFile(filePath, (error, content) => {
    if (error) {
      fs.readFile("./public/404.html", (_error, content) => {
        response.writeHead(404, { "Content-Type": contentType });
        response.end(content, "utf-8");
      });
    } else {
      response.writeHead(200, { "Content-Type": contentType });
      response.end(content, "utf-8");
    }
  });
});

server.listen(3001, () => {
  console.log("Server running at http://localhost:3001");
});
