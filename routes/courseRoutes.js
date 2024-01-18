const express = require("express");
const router = express.Router();

const addStages= require("../controllers/courseController.js").addStages;
const addContent=require("../controllers/courseController.js").addContent;
const getStages=require("../controllers/courseController.js").getStages;




router.post("/addStages/:field",addStages);
router.post("/addContent",addContent);
router.get("/showStages/:field",getStages);


module.exports=router;