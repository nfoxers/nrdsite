const express = require("express");
const cookieparser = require("cookie-parser");
const fs = require("fs");
const https = require("https");
const http = require("http");
const path = require("path")
const app = express();

/* configurations & boilerplate variables */

let http_port = 80;
let https_port = 443;
let https_enable = true;

let system = {
  uptime: 0,
  tvisits: 0,
  uvisits: 0,
  node: false
}

let visits = {
  users: {
    "127.0.0.1": {
      first_visited: "...",
      last_visited: "...",
      visits: 0,
    },
  },
}

let messages = {
  name: {
    msg: "...",
    time: "...",
    ip: "..."
  }
}

/* initialization */

app.use(express.json());
app.use(cookieparser());

function readjson(pth) {
  p = path.join(__dirname, pth);
  if(!fs.existsSync(p)) return {};
  try {
    const data = fs.readFileSync(p, 'utf8');
    return JSON.parse(data || "{}");    
  } catch(e) {
    console.error(`error reading json file ${pth}: ${e}`);
  }
}

function writejson(pth, data) {
  p = path.join(__dirname, pth);
  fs.writeFileSync(p, JSON.stringify(data, null, 2), 'utf8');
}

system = readjson("data/system.json");
visits = readjson("data/visits.json");
messages = readjson("data/messages.json");

if(system.node == false) {
  system.node = true;
  writejson("data/system.json", system);
}

/* route handlers */

app.get("/{*splat.html}", (req, res, next) => {
  const cookie = req.cookies;
  let cip = "127.0.0.1";

  if(cookie.ip) cip = cookie.ip;

  console.log(`${req.ip} (${cip}) opened ${req.path}`);
  next();
});

app.post("/api/usr_visit", (req, res) => {
  const obj = req.body;

  system = readjson("data/system.json");
  system.uvisits++;
  system.tvisits++;
  system.uptime = (process.uptime()/60).toFixed(2) ;
  writejson("data/system.json", system);
  console.log(system);

  visits = readjson("data/visits.json");

  let found = 0;
  for(let key in visits.users) {
    if(key == obj.ip) {
      found = 1;
      visits.users[key].last_visited = obj.time;
      visits.users[key].visits++;
    }
  }
  if(!found) {
    visits.users[obj.ip] = {
      first_visited: obj.time,
      last_visited: obj.time,
      visits: 1
    }
    console.log(`${obj.ip} is a new user`);
  }
  writejson("data/visits.json", visits);
  
  res.status(200).json({ success: true });
})

app.post("/api/usr_msg", (req, res) => {
  const obj = req.body;

  messages = readjson("data/messages.json");
  
  messages[obj.name] = {};
  messages[obj.name].msg = obj.message;
  messages[obj.name].time = obj.time;
  messages[obj.name].ip = obj.ip;
  
  writejson("data/messages.json", messages);

  console.log(messages);
  res.status(200).json({ success: true });
})

app.use(express.static("."));

app.get("/*splat", (req, res) => {
  console.log(`${req.ip} opened a page that does not exist (${req.url})`);
  res.status(404).sendFile(path.join(__dirname, "pages/notfound.html"));
});

/* server */

if(process.getuid && process.getuid() != 0) {
  console.log("not ran by root, ports will be modified");
  http_port += 8000;
  https_port += 8000;
}

http.createServer(app).listen(http_port, () => {
  console.log(`server is running on port ${http_port} HTTP`);
}).on("error", (err) => {
  console.error(err);
});

if(https_enable) {
  if(!fs.existsSync("env/server.key") || !fs.existsSync("env/server.cert")) {
    console.error("SLS credentials not found, please provide your own and store it at env/server.key and env/server.cert");
  } else {
      const sslopt = {
      key: fs.readFileSync(path.join(__dirname, "env/server.key")),
      cert: fs.readFileSync(path.join(__dirname, "env/server.cert"))
    };

    https.createServer(sslopt, app).listen(https_port, () => {
      console.log(`server is running on port ${https_port} HTTPS`);
    }).on("error", (err) => {
      console.error(err);
    });
  }
}

/* cleanup */

process.on("SIGINT", () => {
  console.log("\nexiting...");

  system.uptime = 0;
  system.uvisits = 0;
  system.node = false;
  writejson("data/system.json", system);

  process.exit();
})