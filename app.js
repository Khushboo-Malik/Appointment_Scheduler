require("dotenv").config();

const express = require("express");
const { connectMongoDb } = require("./connection");
const {handleUserSignup,handleUserLogin,ReturnDoctors,CreateAppointment,DeleteDoctor,AppointmentCompleted,scheduledAppointments,passwordReset,passwordReset_token}=require("./controllers/user");
const {checkJWTTokenP,checkJWTTokenD,checkJWTTokenA}=require("./middleware/middlewares");

const axios=require("axios");

const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
const cookieParser = require('cookie-parser');
app.use(cookieParser());

const path = require("path");
const ejs = require("ejs");

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.get("/signup", async (req, res) => {
    
  const variables=
  {"sitekey":process.env.SITE_KEY,}
   
  return res.render("signup",variables);
});
app.post("/signup",handleUserSignup);

app.get("/login",async(req,res)=>{
  return res.render("login");
});
app.post("/login",handleUserLogin);

app.get("/home",async(req,res)=>{
  return res.render("home");
});

app.get("/getDoctor",checkJWTTokenP,ReturnDoctors);

app.get("/showAppointments/",scheduledAppointments);

app.post("/createAppointment",checkJWTTokenP,CreateAppointment);

app.delete("/admin/delete",checkJWTTokenA,DeleteDoctor);

app.patch("/doctor/completed",checkJWTTokenD,AppointmentCompleted);

app.get("/password/reset",async(req,res)=>{
  return res.render("password");
});
app.post("/password/reset",passwordReset);

app.post("/password/reset/:token",passwordReset_token);

connectMongoDb(process.env.MONGO_URL)
  .then(() => console.log("MongoDB Connected!"));

app.listen(PORT, () => console.log("Server Started!"));






