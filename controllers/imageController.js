require("dotenv").config()
const User = require('../models/userModel.js');
const jwt=require("jsonwebtoken");
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadDir = path.join(__dirname, 'uploads');
      fs.mkdirSync(uploadDir, { recursive: true });
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      cb(null, file.fieldname + '-' + Date.now());
    }
  });
  
  const upload = multer({ storage: storage });
  const uploadMiddleware = upload.single('photo');

  async function upload_img(req,res){
    try {
      const email = req.params.email;
  
      if (!email) {
        return res.status(400).json({ error: 'Internal server error'});
      }
  
      uploadMiddleware(req, res, async (err) => {
        if (err instanceof multer.MulterError) {
        
        return res.status(400).json({ error: 'Error uploading the file.' });
        } else if (err) {
          
          return res.status(500).json({ error: 'Internal Server Error' });
        }
        //console.log("req.file:",req.file);
        //console.log("req.file.path:",req.file.path);
        if(!req.file){
          return res.status(400).json("Image not uploaded");
        }
        const obj = {
          photo: fs.readFileSync(req.file.path),
        };
        
        let image_upload = await User.findOne({ email });
  
        if (!image_upload) {
          return res.status(404).json({ error: 'Visitor not found.' });
        }
        
        image_upload.photo = obj.photo;
        
        await image_upload.save();
  
        return res.status(200).json({ success: "image uploaded successfully"});
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: 'Internal Server Error',
      });
    }
  };

  async function show_img(req,res) {
    try {
        const email = req.params.email;
        if (!email) {
            return res.status(400).json("Internal server error");
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ error: 'Visitor not found.' });
        }
        const photo=user.photo;
        if(!photo){
          return res.status(400).json("Photo has not been uploaded");
        }
        const photo_base64 = Buffer.from(user.photo, 'binary').toString('base64');

        return res.status(200).json({ success: true, photo: photo_base64 });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error',
        });
    }
};

module.exports={upload_img,show_img}
