const express = require("express");
const router = express.Router();

const upload_img = require("../controllers/imageController.js").upload_img;
const show_img=require("../controllers/imageController.js").show_img;

router.post("/upload_img/:email",upload_img);
router.get("/show_img/:email",show_img);

module.exports=router;
