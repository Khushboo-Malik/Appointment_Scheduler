require("dotenv").config();

const mongoose=require("mongoose");
const express = require("express");
const { connectMongoDb } = require("./connection");
const {handleUserSignup,handleUserLogin,ReturnDoctors,CreateAppointment,DeleteDoctor,AppointmentCompleted,scheduledAppointments,passwordReset,passwordReset_token}=require("./controllers/user");
const {checkJWTTokenP,checkJWTTokenD,checkJWTTokenA}=require("./middleware/middlewares");

//const imgSchema = require('./models/teamModel.js');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
//const axios=require("axios");

const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
const cookieParser = require('cookie-parser');
app.use(cookieParser());

//const path = require("path");
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

/*const storage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, 'uploads')
  },
  filename: (req, file, cb) => {
      cb(null, file.fieldname + '-' + Date.now())
  }
});

const upload = multer({ storage: storage });*/

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
      const uploadDir = path.join(__dirname, 'uploads');
      fs.mkdirSync(uploadDir, { recursive: true });
      cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
      cb(null, file.fieldname + '-' + Date.now())
  }
});

const upload = multer({ storage: storage });

const imgSchema = new mongoose.Schema({
  name: String,
  desc: String,
  img: {
      data: {
          type: Buffer,
          required: true,
      },
      contentType: String,
  },
});

const Image = mongoose.model('Image', imgSchema);
app.post('/image/uploadImg', upload.single('img'), (req, res, next) => {
  const { name, desc } = req.body;

  if (!name || !desc || !req.file) {
      return res.status(400).json({ error: 'Name, description, and image are required.' });
  }

  const obj = {
      name,
      desc,
      img: {
          data: fs.readFileSync(req.file.path),
          contentType: req.file.mimetype,
      },
  };
  console.log("req.body", req.body)
  console.log("req.file", obj.img.data) 

  Image.create(obj)
      .then((item) => {
          res.status(201).json({
              success: true,
              message: 'File successfully uploaded.',
          });
      })
      .catch((err) => {
          console.log(err);
          res.status(500).json({ error: 'Internal Server Error' });
      });
});

app.get('/image/showImg', (req, res) => {
  Image.find({})
      .then((data) => {
          // Map the data to include the data field in the response
          const items = data.map(item => ({
              name: item.name,
              desc: item.desc,
              img: {
                  data:item.img.data.toString('base64'), // Convert Buffer to base64
                  contentType: item.img.contentType,
              },
          }));

          res.json({ items });
      })
      .catch((err) => {
          console.log(err);
          res.status(500).json({ error: 'Internal Server Error' });
      });
});

connectMongoDb(process.env.MONGO_URL)
  .then(() => console.log("MongoDB Connected!"));

app.listen(PORT, () => console.log(`Server Started at PORT ${PORT}!`));






