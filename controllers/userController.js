require("dotenv").config()
const User = require('../models/userModel.js');

const{setUser,getUser}=require("../middlewares/auth");
const{send_mail_registration,send_mail_verification,send_mail_OTP}=require("./mailController");
const jwt=require("jsonwebtoken");

const bcrypt = require("bcrypt");
const saltRounds = 10;

const axios = require("axios");

async function handleUserSignup(req, res) {

    const body = req.body;
    /*const Response = req.body["g-recaptcha-response"];
    const secretkey = process.env.SECRET_KEY;
    const verify = `https://www.google.com/recaptcha/api/siteverify?secret=${secretkey}&response=${Response}`;
    try {
        const response = await axios.post(verify);
        console.log("success:", response.data);
        if (!response.data.success) {
            res.json("Couldn't verify reCAPTCHA");
            return;
        }
    }
    catch (error) {
        console.log("error in captcha:", error);
        res.json("Error verifying reCAPTCHA");
        return;
    }*/
    const user = {
        name: body.name,
        email: body.email,
        password: body.password,
        mobile_number:body.mobile_number,
        Educational_Qualification:body.Educational_Qualification,
        role:body.role,
        gender:body.gender,
        emailVerified:"No",
    }
    
    const result=await User.findOne({"email":user.email});
    if(result){
        return res.json("Email already exists");
    };

    if(!user.password){
        return res.status(400).json("Please enter password");
    }
    if(!user.email){
        return res.status(400).json("Please enter email");
    }
    if(!user.name){
        return res.status(400).json("Please enter name");
    }     
    if(!user.mobile_number){
        return res.status(400).json("Please enter mobile number");
    }
    if(!user.Educational_Qualification){
        return res.status(400).json("Please mention valid Educational Qualification");
    } 
    if(!user.role){
        return res.status(400).json("Please enter your role");
    } 
    if(!user.gender){
        return res.status(400).json("Please enter gender");
    }  
    bcrypt.genSalt(saltRounds, (saltErr, salt) => {
        if (saltErr) {
            res.status(500).json("Internal server error");
        } else {

            bcrypt.hash(user.password, salt, async (hashErr, hash) => {
                if (hashErr) {
                    res.status(500).json("Internal server error");
                } else {

                    user.password = hash;

                    try {
                        //console.log("URL:",process.env.URL);
                        //console.log("email:",user.email);
                        const result = await User.create(user);
                        send_mail_verification(user.email,process.env.URL);

                        const obj={name: body.name,
                            email: body.email,
                            mobile_number:body.mobile_number,
                            Educational_Qualification:body.Educational_Qualification,
                            role:body.role,
                            emailVerified:"No",
                        }

                        return res.json({message:"Details entered successfully",result:obj});

                    } catch (dbError) {
                        res.status(500).json("Internal server error");
                        console.log(dbError);
                    }
                }
            });
        }
    });
};

async function enterField(req,res){
    try{

        const email=req.params.email;
        if(!email){
            return res.status(500).json("Internal server error");
        }
        
        const user=await User.findOne({"email":email});
        if(!user){
            return res.status(400).json("Kindly enter previous details first");
        }
        if(user.emailVerified!=='Yes'){
            return res.status(400).json("Please verify your email first");
        }
        const body=req.body;
        const field=body.field;
        if(!field){
            return res.status(400).json("Please select the desired field");
        }
        user.field=field;
        await user.save();
        send_mail_registration(user.email,user.name);

        return res.status(200).json({message:"Signup completed successfully",field:field});
    }catch(error){
        console.error(error);
        res.status(500).json("Internal server error");
    }
}


async function verifyMail(req,res){
    try{
        const{Email}=req.params;
        const userVerify=await User.findOne({"email":Email});
        userVerify.emailVerified="Yes";
        await userVerify.save();
        return res.json("Email verified successfully");

    }catch(error){
        console.log(error);
        return res.status(500).json({msg:"Internal server error"});
    }
  }

  async function handleUserLogin(req,res){
    try{
    const body=req.body;
    const email=body.email;
    const password=body.password;

    if(!password){
        return res.status(400).json("Please enter password");
    }

    if(!email){
        return res.status(400).json("Please enter email");
    }

    
        const user = await User.findOne({ "email":email });
        const is_mail_verified=user.emailVerified;
        if(is_mail_verified==="No"){
            return res.status(400).json("Email not verified");
        }

        console.log("user:",user);
        if (!user){
            
        return res.status(400).json("No such user found")}//or redirect to signup

        const Password=user.password;

        const isPasswordValid = await bcrypt.compare(password, Password);
        if (isPasswordValid) {
            user.isLoggedIn="Yes";
            user.save();
            const token = setUser(user);
            
            return res.json({msg:"Login successfull",token:token}); 
            
        } else {
            res.status(401).json("Incorrect Password");
        }
    }catch (error) {
        console.error(error);
        res.status(500).json("Internal server error");
    }
}

async function resetPassword(req,res){
    try{
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ error: 'Email is required' });
    }

    function generateOTP() {
        return Math.floor(1000 + Math.random() * 9000);
    }

    const user = await User.findOne({ email });

    if (!user) {
        return res.status(404).json({ error: 'No such user found' });
    }
    const otp = generateOTP();

    await User.findOneAndUpdate({ email }, { otp } /*{ new: true }*/);

    send_mail_OTP(email,otp);
    return res.status(200).json("Mail sent successfully!");
    
}catch(error){
    console.error(error);
    res.status(500).json("Internal server error");

}
};

async function verifyOTP(req,res){
    try{
    const {email} = req.params;
    console.log("email:",email);
    const{OTP}=req.body;
    console.log("OTP:",OTP);
    if(!OTP){
        return res.status(400).json("Please enter OTP");
    }
    
    const user = await User.findOne({ "email":email });
    console.log("user:",user);
    if(!user){
        return res.status(400).json("No such user found");
    }
    const true_otp=user.otp;
    console.log("true_otp:",true_otp);
    if(!true_otp){
        return res.status(400).json("Please enter your mail to recieve OTP");
    }
    if(OTP===true_otp){
        
        return res.status(200).send("OTP verified!"); 
    }
    else{
        return res.status(400).json("Invalid OTP");
    }
    }catch(error){
        console.error(error);
    res.status(500).json("Internal server error");

    }
}

async function newPassword(req,res){
    try{
        const {email} = req.params;
        const{newPassword,confirmPassword}=req.body;

        if (!newPassword) {
            return res.status(400).json({ error: "Please enter new password" });
        }
        if (!confirmPassword) {
            return res.status(400).json({ error: 'Please confirm your password' });
        }

        if(newPassword!==confirmPassword){
            return res.status(400).json({error:"New Password and Confirm Password should match"});
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        user.password = hashedPassword;
        await user.save();
        return res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}



module.exports={handleUserSignup,verifyMail,handleUserLogin,resetPassword,verifyOTP,newPassword,enterField};