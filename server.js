let express = require("express");
let multer = require("multer");
let upload = multer();
let app = express();
let cookieParser = require("cookie-parser");
app.use(cookieParser());
let reloadMagic = require("./reload-magic.js");
let passwords = {};
let sessions = {};
let messages = [];
reloadMagic(app);
app.use("/", express.static("build"));
app.get("/messages", function(req, res) {
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
let generateId = () => {
  return "" + Math.floor(Math.random() * 100000000);
};
app.post("/signup", upload.none(), (req, res) => {
  let username = req.body.username;
  let enteredPassword = req.body.password;
  passwords[username] = enteredPassword;
  res.send(JSON.stringify({ success: true }));
});
app.all("/*", (req, res, next) => {
  res.sendFile(__dirname + "/build/index.html");
});
app.listen(4000);
