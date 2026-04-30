import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT ?? 4000;

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

const server = http.createServer((req, res) => {
  if (req.method === "OPTIONS") {
    res.writeHead(204, CORS);
    res.end();
    return;
  }

  const url = new URL(req.url, `http://localhost:${PORT}`);
  const pathname = url.pathname;

  // GET /catalog.json
  if (pathname === "/catalog.json") {
    const data = fs.readFileSync(path.join(__dirname, "catalog.json"), "utf8");
    res.writeHead(200, { ...CORS, "Content-Type": "application/json" });
    res.end(data);
    return;
  }

  // GET /components/:name.js
  const match = pathname.match(/^\/components\/([\w-]+\.js)$/);
  if (match) {
    const filePath = path.join(__dirname, "components", match[1]);
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, "utf8");
      res.writeHead(200, { ...CORS, "Content-Type": "application/javascript" });
      res.end(data);
      return;
    }
  }

  res.writeHead(404, CORS);
  res.end("Not found");
});

server.listen(PORT, () => {
  console.log(`mock-cdn listening on http://localhost:${PORT}`);
});
