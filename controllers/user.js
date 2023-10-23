const uuid=require("uuid");
const User = require("../models/user");
const{setUser}=require("../service/auth");
const axios=require("axios");
//const Salt="gghfgdt";



//SignUp Function
async function handleUserSignup(req, res) {
    const { FirstName, LastName, Email, Password, AccountType, Specialization } = req.body;
    //For finding error
    console.log("firstname", FirstName);
    console.log("lastname:", LastName);


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
        console.log("error in captcha:",error);
        res.send("Error verifying reCAPTCHA");
        return;
    }
    await User.create({
        FirstName,

        LastName,
        Email,
        Password,
        AccountType,
        Specialization,
    });

return res.render("/home");
};


//Login Function
async function handleUserLogin(req, res) {
    const { Email, Password } = req.body;

    const user = await User.findOne({ Email, Password });
    if (!user) 
        return res.render("login", {
            error: "Invalid Email or Password"
        });     
    
    const token=setUser(user);
    res.cookie("uid",token);
    return res.redirect("/home");
};





module.exports = {
    handleUserSignup,handleUserLogin
};