//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const md5 = require('md5');

const app = express();

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect("mongodb://localhost:27017/userDB", { useNewUrlParser: true, useUnifiedTopology: true });


const userSchema = new mongoose.Schema({
    email: String,
    password: String
})


const User = new mongoose.model("User", userSchema);

app.get("/", function (req, res) {
    res.render("home");
}
);

app.get("/login", function (req, res) {
    res.render("login");
}
);

app.get("/register", async function (req, res) {
    res.render("register");
}
);

app.post("/register", async function (req, res) {

    var user = await User.findOne({ email: req.body.username });
    console.log(user);

    if (user) {
        res.render("register");
        return;
    }
    const newUser = new User({
        email: req.body.username,
        password:md5(req.body.password)
    })
    console.log("User registered");
    var status = await newUser.save();
    res.render("secrets");
}
);


app.post("/login", async function (req, res) {
    const username = req.body.username;
    const password = md5(req.body.password);

    var user = await User.findOne({ email: username })

    if (user.password === password) {
        res.render("secrets");
    }
    else {
        res.render("login");
    }
}
);


app.listen(3000, function () {
    console.log("Server started on port 3000");
});