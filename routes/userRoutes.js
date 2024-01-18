const express = require("express");
const router = express.Router();

const handleUserSignup = require("../controllers/userController.js").handleUserSignup;
const verifyMail = require("../controllers/userController.js").verifyMail;
const handleUserLogin = require("../controllers/userController.js").handleUserLogin;
const resetPassword = require("../controllers/userController.js").resetPassword;
const verifyOTP = require("../controllers/userController.js").verifyOTP;
const newPassword = require("../controllers/userController.js").newPassword;
const enterField = require("../controllers/userController.js").enterField;




router.post("/signup",handleUserSignup);
router.get("/verifyEmail/:Email",verifyMail);
router.post("/login",handleUserLogin);
router.post("/resetPassword",resetPassword);
router.post("/verifyOTP/:email",verifyOTP);
router.post("/newPassword/:email",newPassword);
router.post("/enterField/:email",enterField);



module.exports=router;