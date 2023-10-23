const mongoose=require("mongoose");

//Schema for users
const UserSchema=new mongoose.Schema({
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
        type:Number,
        required:true,
        unique:false,
    },
    Salt: {
        type:String,
        required:false,
        unique:false,
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
    Appointments: {
        type:[String],
        required:true,
        unique:false,
    }});







    const user=mongoose.model('Users',UserSchema);

    module.exports=user;
    
