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
    Appointments: {
        type:[String],
        required:true,
        unique:false,
    }});


//Schema for appointments
const AppointmentSchema=new mongoose.Schema({
    PatientID: {
        type:Number,
        required:true,
        unique:true,

    },
    DoctorID: {
        type:Number,
        required:true,
        unique:true,

    },
    AppointmentDate: {
        type:Date,
        required:true,
        unique:false,

    },
    Status: {
        type:String,
        enum:['Scheduled','Completed'],
        default:'Scheduled',
        

    },
});




    const user=mongoose.model('Users',UserSchema);
    const appointment=mongoose.model('Appointments',AppointmentSchema);

    module.exports={user,appointment};
    
