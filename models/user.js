const mongoose=require("mongoose");


//Schema for users
const UserSchema=new mongoose.Schema({
    /*_id:{
        type:String,
        required:true,
        unique:true,
    },*/
    FirstName: {
        type:String,
        required:true,
        unique:false,
    },
    LastName: {
        type:String,
        required:true,
        unique:false,
    },
    
    Email: {
        type:String,
        required:true,
        unique:true,
    },
    Password: {
        type:String,
        required:true,
        unique:false,
    },
    Salt: {
        type:String,
        required:true,
        unique:true,
    },

    AccountType: {
        type:String,
        required:false,
        enum : ['Patient','Doctor','Admin'], 
        default: 'Patient',
        


    },
    Specialization: {
        type:String,
        required:false,
        unique:false,
    },
    
    });

    
      





    const user=mongoose.model('Users',UserSchema);

    module.exports=user;



    
