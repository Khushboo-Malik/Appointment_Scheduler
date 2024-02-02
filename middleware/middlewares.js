const jwt = require("jsonwebtoken");
const secretKey = "KhushbooM1234"; 
const {getUser}=require("./auth");

//For create appointment and for check doctor api
function checkJWTTokenP(req, res, next) {
  
  const token = req.cookies.token; 
    
  const user = getUser(token);
  req.user=user;

  console.log(user);
  if (user && user.AccountType === "Patient") {

    next(); 
  }else{
        
  res.redirect("/login");     
  }
};

//For getdoctor api
function checkJWTTokenD(req, res, next) {
  const token = req.cookies.token; 
    
    const user = getUser(token);
    
    if (user && user.AccountType === "Doctor") {
      console.log("account type:",user.AccountType);   

        next(); 
    } else {
        
        res.status(403).send("Access denied"); 
    }
};

  //For deleting admin

  function checkJWTTokenA(req, res, next) {
    const token = req.cookies.token; 
      
      const user = getUser(token);
      if (user && user.AccountType === "Admin") {
          next(); 

      } else {
          
          res.status(403).send("Access denied"); 
      }
  };

module.exports = {checkJWTTokenP,checkJWTTokenD,checkJWTTokenA};
