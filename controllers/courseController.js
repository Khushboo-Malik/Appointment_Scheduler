const mongoose=require("mongoose");

const { Subtopic, Topic, Stage, Field } = require('../models/courseModel.js');
const { texttospeech } = require("googleapis/build/src/apis/texttospeech/index.js");

async function addStages(req,res){
    try{

        const fieldName = req.params.field;
        const { stages } = req.body;
    
        
        if (!fieldName || !stages || !Array.isArray(stages)) {
          return res.status(400).json({ error: 'Invalid request data' });
        }
    
        let field = await Field.findOne({ name: fieldName });
        if (!field) {
          field = new Field({ name: fieldName, stages: [] });
        }
    
        field.stages.push(...stages);
    
        await field.save();
    
        res.status(201).json({ message: 'Courses added successfully', data: field });
    }catch(error){
        res.status(500).json("Internal server error");
        console.log(error);
    }
};

async function addContent(req,res){
    try{
        const body=req.body;

        const text=body.text;
        if(!text){
            return res.status(400).json("Content not provided");
        };
        const obj={
            text:text,
        }
        const add_text=Subtopic.create(obj);
        return res.status(200).json({msg:"Text added successfully",text:obj.text});        
    }catch(error){
        res.status(500).json("Internal server error");
        console.log(error);
    }
}

async function getStages(req, res) {
    try {
      const fieldName = req.params.field;
  
      if (!fieldName) {
        return res.status(400).json({ error: 'Invalid request data' });
      }
  
      let field = await Field.findOne({ name: fieldName });
  
      if (!field) {
        return res.status(404).json({ error: 'Field not found' });
      }
  
      res.status(200).json({ data: field.stages });
    } catch (error) {
      res.status(500).json("Internal server error");
      console.error(error);
    }
  }

module.exports={addStages,addContent,getStages};