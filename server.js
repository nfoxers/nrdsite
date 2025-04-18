const express = require("express");
const fs = require("fs");
const https = require("https");
const http = require("http");
const path = require("path")
const app = express();
const port = 8080;

app.use(express.json());

function readjson(pth) {
  p = path.join(__dirname, pth);
  if(!fs.existsSync(p)) return {};
  const data = fs.readFileSync(p, 'utf8');
  return JSON.parse(data || "{}");
}

function writejson(pth, data) {
  p = path.join(__dirname, pth);
  fs.writeFileSync(p, JSON.stringify(data, null, 2), 'utf8');
}

let system = {
  uptime: 0,
  tvisits: 0,
  uvisits: 0,
  node: false
}

system = readjson("data/system.json");
if(system.node == false) {
  system.node = true;
  writejson("data/system.json", system);
}

app.get("/{*splat.html}", (req, res, next) => {
  console.log(`${req.ip} opened ${req.path}`);
  
  next();
});

app.get("/", (req, res, next) => {
  system = readjson("data/system.json");
  system.uvisits++;
  system.tvisits++;
  system.uptime = (process.uptime()/60).toFixed(2) ;
  writejson("data/system.json", system);
  console.log(system);
  next();
})

app.use(express.static("."));

app.get("/*splat", (req, res, next) => {
  console.log(`${req.ip} opened a page that does not exist`);
  res.status(404).sendFile(path.join(__dirname, "pages/notfound.html"));
});

http.createServer(app).listen(80, () => {
  console.log("server is running on port 80 HTTP");
}).on("error", (err) => {
  console.error(err);
});

const sslopt = {
  key: fs.readFileSync(path.join(__dirname, "env/server.key")),
  cert: fs.readFileSync(path.join(__dirname, "env/server.cert"))
};

https.createServer(sslopt, app).listen(443, () => {
  console.log("server is running on port 443 HTTPS");
}).on("error", (err) => {
  console.error(err);
});


process.on("SIGINT", () => {
  console.log("exiting...");

  system.uptime = 0;
  system.uvisits = 0;
  system.node = false;
  writejson("data/system.json", system);

  process.exit();
})