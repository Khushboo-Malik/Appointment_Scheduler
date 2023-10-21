const express=require("express");
const userRouter=require("./routes/user");
//const bcrypt = require("bcrypt");//For hashing passwords 

const PORT=8000;
const app=express();
const {connectMongoDb}=require("./connection");
connectMongoDb("mongodb://127.0.0.1:27017/appointments");

app.use("/",userRouter);
app.listen(PORT,()=>console.log("Server Started!"));
