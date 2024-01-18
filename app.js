require("dotenv").config();

const mongoose=require("mongoose");
const express = require("express");
const { connectMongoDb } = require("./connection");
const bodyParser = require("body-parser");
const jwt=require("jsonwebtoken");

const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
const cookieParser = require('cookie-parser');
app.use(cookieParser());


//Requiring routes from router
const userRoutes=require("./routes/userRoutes.js");
const courseRoutes=require("./routes/courseRoutes.js");
const imageRoutes=require("./routes/imageRoutes.js");



//Specifying routes' name
app.use("/user",userRoutes);
app.use("/course",courseRoutes);
app.use("/image",imageRoutes);


connectMongoDb(process.env.MONGO_URL)
  .then(() => console.log("MongoDB Connected!"));

app.listen(PORT, () => console.log("Server Started!"));