const express = require("express");
const app = express();
const multer = require("multer");
const upload = multer();
const cookieParser = require("cookie-parser");
const reloadMagic = require("./reload-magic.js");

app.use(cookieParser());
reloadMagic(app);

const passwords = {};
const sessions = {};
let messages = [];

const generateId = () => {
  return "" + Math.floor(Math.random() * 100000000);
};

app.use("/", express.static("build"));

app.get("/messages", function(req, res) {
  const sessionID = req.cookies.sid;
  if (!sessions[sessionID]) {
    return;
  }
  return res.send(JSON.stringify(messages));
});

app.post("/newmessage", upload.none(), (req, res) => {
  const sessionId = req.cookies.sid;
  const username = sessions[sessionId];
  const msg = req.body.msg;
  const newMsg = { username: username, message: msg };
  messages = messages.concat(newMsg);
  res.send(JSON.stringify({ success: true }));
});

app.post("/login", upload.none(), (req, res) => {
  const username = req.body.username;
  const enteredPassword = req.body.password;
  const expectedPassword = passwords[username];
  if (enteredPassword === expectedPassword) {
    const sessionId = generateId();
    sessions[sessionId] = username;
    res.cookie("sid", sessionId);
    return res.send(JSON.stringify({ success: true }));
  }
  res.send(JSON.stringify({ success: false }));
});

app.post("/signup", upload.none(), (req, res) => {
  const username = req.body.username;
  const enteredPassword = req.body.password;
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
