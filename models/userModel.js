const mongoose=require("mongoose");

const userSchema=new mongoose.Schema({
    name:{
        type: String,
        required:true,
        unique:false,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
        unique:false,
    },
    gender:{
        type:String,
        required:true,
        enum:["male","female"],
    },
    mobile_number:{
        type:String,
        required:true,
        unique:true,
    },                                   
    Educational_Qualification:{
        type:String,
        required:true,
        enum:['8th Standard','10th Standard','12th Standard','Undergraduate','Postgraduate','PhD'],
        default:'8th Standard',
    },
    photo:{
        type:Buffer,
    },
    role:{
        type:String,
        required:true,
        enum:["Teacher","Learner"],
        default:"Learner",
    },
    otp:{
        type: String,
        required: false,
        default: 0,
      },
    field:{
        type:String,
        required:false,
        enum:["Cooking and Baking","Battery charging, maintenance and testing","Bike and Car Mechanic","Sewing,Stitching and Tailoring","Horticulture and Cut Flower Techniques","Basic Computer Fundamentals","Fruit and Vegetable Preservation"],
        default:"Basic Computer Fundamentals",
        unique:false,
    },
    emailVerified:{
        type:String,
        required:false,
        enum:["Yes","No"],
        default:"No",
      }
    });

    const User = mongoose.model('User', userSchema);

    module.exports = User;
    
