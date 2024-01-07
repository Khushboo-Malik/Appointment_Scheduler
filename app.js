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
      data: Buffer,
      contentType: String,
  },
});

const Image = mongoose.model('Image', imgSchema);

//const fs = require('fs');

/*app.post('/image/uploadImg', upload.single('img'), (req, res, next) => {
    const { name, desc } = req.body;

    if (!name || !desc || !req.file) {
        return res.status(400).json({ error: 'Name, description, and image are required.' });
    }

    const imgData = fs.readFileSync(path.join(__dirname, 'uploads', req.file.filename));

    const obj = {
        name,
        desc,
        img: {
            data: imgData,
            contentType: req.file.mimetype,
        },
    };

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
});*/

app.get('/image/showImg', (req, res) => {
    Image.find({})
        .then((data) => {
            res.json({ items: data });
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});

app.post('/image/uploadImg', upload.single('img'), (req, res, next) => {
  const { name, desc } = req.body;

  if (!name || !desc || !req.file) {
      return res.status(400).json({ error: 'Name, description, and image are required.' });
  }

  const obj = {
      name,
      desc,
      img: {
          data: req.file.buffer, // Use req.file.buffer directly
          contentType: req.file.mimetype,
      },
  };

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

/* GET route for fetching all images
app.get('/image/showImg', (req, res) => {
  Image.find({})
      .then((data) => {
          res.json({ items: data });
      })
      .catch((err) => {
          console.error(err);
          res.status(500).json({ error: 'Internal Server Error' });
      });
});*/


connectMongoDb(process.env.MONGO_URL)
  .then(() => console.log("MongoDB Connected!"));

app.listen(PORT, () => console.log("Server Started!"));






