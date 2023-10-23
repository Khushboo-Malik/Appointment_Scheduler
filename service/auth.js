const jwt=require("jsonwebtoken");
const secret="KhushbooM1234";
function setUser(user){
     
    return jwt.sign({
        Email:user.Email,
    },secret); 
};

function getUser(token){
    if(!token) {
        return null;
    }
    return jwt.verify(token,secret);
}

module.exports={
    setUser,
    getUser,
};