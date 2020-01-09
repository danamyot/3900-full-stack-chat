let express = require("express");
let app = express();
let multer = require("multer");
let upload = multer();
let cookieParser = require("cookie-parser");
let reloadMagic = require("./reload-magic.js");

app.use(cookieParser());
reloadMagic(app);

let passwords = {};
let sessions = {};
let messages = [];

let generateId = () => {
  return "" + Math.floor(Math.random() * 100000000);
};

app.use("/", express.static("build"));

app.get("/messages", function(req, res) {
  let sessionID = req.cookies.sid;
  if (!sessions[sessionID]) {
    return;
  }
  res.send(JSON.stringify(messages));
});

app.post("/newmessage", upload.none(), (req, res) => {
  let sessionId = req.cookies.sid;
  let username = sessions[sessionId];
  let msg = req.body.msg;
  let newMsg = { username: username, message: msg };
  messages = messages.concat(newMsg);
  res.send(JSON.stringify({ success: true }));
});

app.post("/login", upload.none(), (req, res) => {
  let username = req.body.username;
  let enteredPassword = req.body.password;
  let expectedPassword = passwords[username];
  if (enteredPassword === expectedPassword) {
    let sessionId = generateId();
    sessions[sessionId] = username;
    res.cookie("sid", sessionId);
    res.send(JSON.stringify({ success: true }));
    return;
  }
  res.send(JSON.stringify({ success: false }));
});

app.post("/signup", upload.none(), (req, res) => {
  let username = req.body.username;
  let enteredPassword = req.body.password;
  if (!passwords[username]) {
    passwords[username] = enteredPassword;
    return res.send(JSON.stringify({ success: true }));
  }
  return res.send(JSON.stringify({ success: false }));
});

app.all("/*", (req, res, next) => {
  res.sendFile(__dirname + "/build/index.html");
});

app.listen(4000);
