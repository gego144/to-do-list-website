const express = require("express");
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");

const app = express();
const jsonParser = express.json();

const urlencodedParser = bodyParser.urlencoded({ extended: false });

// CHANGE THIS TO DATABASE LATER OF USERS
const users = [];

//listen for requests

app.listen(3000);

app.use(express.static(__dirname + "/public"));

app.get("/index.html", (req, res) => {
  res.sendFile("./index.html", { root: __dirname });
});

app.get("/login.html", (req, res) => {
  res.sendFile("./login.html", { root: __dirname });
});

app.post("/login", jsonParser, (req, res) => {
  console.log("Hello");
  console.log(req.body.password);
  res.json(req.body.password);
});

app.get("/signup.html", (req, res) => {
  res.sendFile("./signup.html", { root: __dirname });
});

app.post("/signup", urlencodedParser, (req, res) => {});

app.use((req, res) => {
  res.sendFile("./404.html", { root: __dirname });
});
