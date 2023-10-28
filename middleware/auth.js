const jwt=require("jsonwebtoken");
const secret="KhushbooM1234";

function setUser(user){
     
    return jwt.sign({
        _id:user._id,
        FirstName:user.FirstName,
        LastName:user.LastName,
        Email:user.Email,
        AccountType:user.AccountType,
        Specialization:user.Specialization,


    },secret); 
};

function getUser(token){
    if(!token) {
        return null;
    }
    else{
    
      return jwt.verify(token,secret);
    
    
    }
}

module.exports={
    setUser,
    getUser,
    
    
};

