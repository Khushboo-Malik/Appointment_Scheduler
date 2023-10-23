const express = require("express");
const { connectMongoDb } = require("./connection");
const {handleUserSignup,handleUserLogin}=require("./controllers/user");

const axios=require("axios");

const app = express();
const PORT = 8000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));


const path = require("path");
const ejs = require("ejs");


app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));


app.get("/signup", async (req, res) => {
  return res.render("signup");
});
app.get("/login",async(req,res)=>{
  return res.render("login");
});
app.get("/home",async(req,res)=>{
  return res.render("home");
});

app.post("/signup",handleUserSignup);
app.post("/login",handleUserLogin);

connectMongoDb("mongodb://127.0.0.1:27017/appointments")
  .then(() => console.log("MongoDB Connected!"));


app.listen(PORT, () => console.log("Server Started!"));






