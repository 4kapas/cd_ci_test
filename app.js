var express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const fs = require("fs");
const path = require("path");

var app = express();
const port = 37800;

app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname,'/build')));
app.use(express.static(path.join(__dirname,'dist')));

// app.use(express.static(__dirname + "/public"));
// app.use("/scripts", express.static(path.join(__dirname, "node_modules")));

app.set("views", __dirname + ".");

app.set("view engine", "ejs");
app.engine("html", require("ejs").renderFile);
// app.use(express.static('static'));

app.listen(port, function () {
    console.log(`http://localhost:${port} started`);
});

app.get("*", function (req, res) {
  // res.sendFile(__dirname + "/dist/index.html");
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  // res.render('/views/index.html',{title: 'Hey'});
});


