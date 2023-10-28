const uuid = require("uuid");
const User = require("../models/user");
const Appointment=require("../models/appointment");

const bcrypt=require("bcrypt");
const saltRounds = 10; 

const { setUser,getUser} = require("../middleware/auth");
const axios = require("axios");
const nodemailer=require("nodemailer");
const {google}=require("googleapis");
const config=require("../config.js");
const OAuth2=google.auth.OAuth2;





const OAuth2_client=new OAuth2(config.clientId,config.clientSecret);
OAuth2_client.setCredentials({refresh_token:config.refreshToken});


//SignUp Function

async function handleUserSignup(req, res) {

    
    const body= req.body;
    const Response = req.body["g-recaptcha-response"];
    const secretkey = "6LfO5b4oAAAAAJXays5dIzUzIEvzrsX2qO4pY1Vy";
    const verify = `https://www.google.com/recaptcha/api/siteverify?secret=${secretkey}&response=${Response}`;
    try {
        const response = await axios.post(verify);
        if (!response.data.success) {
            res.send("Couldn't verify reCAPTCHA");
            return;
        }
    }
    catch (error) {
        console.log("error in captcha:", error);
        res.send("Error verifying reCAPTCHA");
        return;
    }
    
    const user={
                
                FirstName:body.FirstName,
                LastName:body.LastName,
                Email:body.Email,
                Password:body.Password,
                AccountType:body.AccountType,
                Specialization:body.Specialization,

    }
    console.log("user:",user);
    
    bcrypt.genSalt(saltRounds, (saltErr, salt) => {
        if (saltErr) {
          res.status(500).send("Couldn't generate salt");
        } else {
          
          bcrypt.hash(user.Password, salt, async (hashErr, hash) => {
            if (hashErr) {
              res.status(500).send("Couldn't hash password");
            } else {
            
              user.Password = hash; 
              user.Salt = salt; 
      
              try {
                const result = await User.create(user);
                console.log("finaluser:",result);
                return res.send("Signup Successfull!");


                

              } catch (dbError) {
                res.status(500).send("Database error");
              }
            }
          });
        }
      })};
        
        
//Login Function

async function handleUserLogin(req, res) {
    const {Email,Password} = req.body;

    try{
    const user = await User.findOne({ Email});
    
    if (!user)
        return res.render("login", {
            error: "Invalid Email or Password"
        });
    const isPasswordValid = await bcrypt.compare(Password, user.Password);
        if (isPasswordValid) {
            
            const token = setUser(user);
            res.cookie("token",token);

        
            return res.send("Login Successfull");
        }else{
            res.status(401).send("Authentication Failed")
        } 
    }catch(error){
        res.status(500).send("Internal server error");
    }
};


//Returning Doctors

async function ReturnDoctors(req, res) {

    const Specialization = req.query.Specialization;
    try {

        const doctors = await User.find({ Specialization });
        const variables = {
            "Specialization": Specialization,
            "doctors": doctors
        }
        res.render('doctors', variables);
    }

    catch (error) {
        console.error("Error:", error);
        res.status(500).send("Server Error");
    }

};

//Mailing Function for create appointments
function send_mail(Docname,DOCID,date,Email){
    const accessToken=OAuth2_client.getAccessToken();
    const transport=nodemailer.createTransport({
        service:"gmail",
        auth:{
            type:"OAuth2",
            user:config.user,
            clientId:config.clientId,
            clientSecret:config.clientSecret,
            refreshToken:config.refreshToken,
            accessToken:accessToken,
        }
    });
    const mail_options={
        from:`Khushboo Malik <${config.user}`,
        to:Email,
        subject:"Nodemailer",
        html:get_html_message(Docname,DOCID,date),
    }
    transport.sendMail(mail_options,function(error,result){
        if(error){
            console.log("error:",error);
        }else{
            console.log("Success:",result);
        }
       

 transport.close();
});}

function get_html_message(Docname,DOCID,date){
    return`
    <h3>Your appointment has been scheduled!<h3>
    <h5>Doctor Name:${Docname}</h5><br>
    <h5>Doctor ID:${DOCID}</h5><br>
    <h5>Appointment Date:${date}</h5>`}

//Creating Appointment

async function CreateAppointment(req,res){
    const docid=req.query._id;
    console.log("docid:",docid);
    const body=req.body;
    const date=body.AppointmentDate;
    const id=req.user._id;
    const Email=req.user.Email;
    console.log("date:",date);
    try{
    
        const dr=await User.findOne({"_id":docid});
        const docname=dr.FirstName;
        console.log("docname:",docname);
        const result=await Appointment.create({
        PatientID:id,
        DoctorID:docid,
        AppointmentDate:date,
        Status:"Scheduled",
        
    
        });
        
        
        
        send_mail(docname,docid,date,Email);
        res.send("Appointment Created!");
        return;

    }catch(error){
        console.error("Error:", error);
        res.status(500).send("Server Error");
 }
}

//Deleting doctors by admin

async function DeleteDoctor(req,res){

    const Email=req.query.Email;
    console.log("Email:",Email);
    const dr=await User.findOne({"Email":Email});
    if(!dr){
        res.send("User does NOT exist");
        return;
    }
    console.log("dr:",dr);
    const AccountType=dr.AccountType;
    console.log("account type:",AccountType);
    
    if(AccountType==="Patient" || AccountType==="Admin"){
        res.send("Cannot delete other than doctor");
        
        return;
        
    }
    else{
        const deletedoc = await User.findOneAndDelete({ Email:Email });
        console.log("deletedoc");
        console.log("Doctor successfully deleted");
        res.send("Doctor deleted successfully");
        return;

    
};}

//Marking appointment as completed

async function AppointmentCompleted(req,res){
    try{
    const Body=req.body;
    console.log("body:",Body);
    const _id=req.query._id;
    console.log("_id:",_id);
    const complete_app=await Appointment.findOneAndUpdate({ _id:_id}, Body, { new: true });
    if (!complete_app) {
        throw new Error("Product not found!");
      } 
      else{
      res.json(complete_app);}
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  };

  //Returning list of scheduled appointments

async function scheduledAppointments(req,res){
    
    
    try {
        const Email=req.query.Email;
        const user=await User.findOne({Email:Email});
        const id=user._id;
        const appointments=await Appointment.find({PatientID:id, Status:"Scheduled"});
        console.log("appointments:",appointments);

        const variables = {
            
            "appointments": appointments
        }
        res.render("appointments", variables);
    }

    catch (error) {
        console.error("Error:", error);
        res.status(500).send("Server Error");
    }}; 
 
//Mailing Function for password reset
function send_mail_password(Email,token){
    const accessToken=OAuth2_client.getAccessToken();
    const transport=nodemailer.createTransport({
        service:"gmail",
        auth:{
            type:"OAuth2",
            user:config.user,
            clientId:config.clientId,
            clientSecret:config.clientSecret,
            refreshToken:config.refreshToken,
            accessToken:accessToken,
        }
    });

    const message=get_html_message_password(token);
    console.log("message is:",message);
    const mail_options={
        from:`Khushboo Malik <${config.user}`,
        to:Email,
        subject:"Password Reset Link",
        html:message,
    }
    transport.sendMail(mail_options,function(error,result){
        if(error){
            console.log("error:",error);
        }else{
            console.log("Success:",result);
        }
       

 transport.close();
});}  

function get_html_message_password(token){
    const resetLink = `http://localhost:8000/password/reset/${token}`;
    return`
    <h3>Click on this link to verify your password: <h3><br>
    <h5><a href="${resetLink}">${resetLink}</a></h5>`}

//Password Reset Link

async function passwordReset(req,res){

    const Body=req.body;
    const Email=Body.Email;
    if(!Email){
        res.error(400).send("Email not provided");
        return;
    }
    const user = await User.findOne({ Email});
    console.log("user:",user);
    if (!user)
        return res.render("login", {
            error: "Invalid Email or Password"
        });
    const token = setUser(user);
    console.log("token:",token);
    send_mail_password(Email,token);
    res.send("Email sent!");
    return;
}

//Password reset token

async function passwordReset_token(req,res){
    const token=req.params.token;
    const decoded_token=getUser(token);
    
    const Email=decoded_token.Email;
    
    const user=await User.findOne({"Email":Email});
    if(!user){
        res.status(400).send("User not found");
    }
    const body=req.body;
    const Password=body.Password;
    
    bcrypt.genSalt(saltRounds, (saltErr, salt) => {
        if (saltErr) {
          res.status(500).send("Couldn't generate salt");
        } else {
          
          bcrypt.hash(Password, salt, async (hashErr, hash) => {
            if (hashErr) {
              res.status(500).send("Couldn't hash password");
            } else {
            
              user.Password = hash; 
              user.Salt = salt;

              
              const updatedUser=await User.findOneAndUpdate({ Password:hash,Salt:salt}, user)
              res.send("Password reset!");
              return; }
    
            
    
            


            })}}
)}








module.exports = {
    handleUserSignup, handleUserLogin, ReturnDoctors,CreateAppointment,DeleteDoctor,AppointmentCompleted,scheduledAppointments,passwordReset,passwordReset_token};

