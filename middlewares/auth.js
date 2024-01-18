const jwt=require("jsonwebtoken");
const jwtSecret=process.env.SECRET_KEY_JWT;

function setUser(user){
     
    return jwt.sign({
        name:user.name,
        email:user.email,
        Educational_Qualification:user.Educational_Qualification, 
        role:user.role,
        gender:user.gender,
        field:user.field,  
    },jwtSecret); 
};

function getUser(token){
    if(!token) {
        return null;
    }
    else{
      return jwt.verify(token,jwtSecret);
    }
}

module.exports={setUser,getUser};