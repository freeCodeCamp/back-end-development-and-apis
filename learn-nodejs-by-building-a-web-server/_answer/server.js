import http from "http";
import fs from "fs";
import { join, extname } from "path";

const server = http.createServer((request, response) => {
  console.log(request.headers);
  console.log();

  const url = request.url === "/" ? "/index.html" : request.url;

  const filePath = join("public", url);

  console.log(filePath);

  const ext = String(extname(filePath)).toLowerCase();
  const mimeTypes = {
    ".html": "text/html",
    ".js": "text/javascript",
    ".css": "text/css",
    ".png": "image/png",
  };

  const contentType = mimeTypes[ext] || "application/octet-stream";

  fs.readFile(filePath, (error, content) => {
    if (error) {
      fs.readFile("./public/404.html", (_error, content) => {
        response.writeHead(404, {
          "Content-Type": { "Content-Type": "text/html" },
        });
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
