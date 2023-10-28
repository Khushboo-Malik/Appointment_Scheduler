const mongoose=require("mongoose");


//Schema for appointments


const AppointmentSchema=new mongoose.Schema({

    /*_id:{
        type:String,
        required:true,
        unique:true,
    },*/
    PatientID: {
        type:String,
        required:true,
        unique:false,

    },
    DoctorID: {
        type:String,
        required:true,
        unique:false,

    },
    AppointmentDate: {
        type:String,
        required:true,
        unique:false,

    },
    Status: {
        type:String,
        enum:['Scheduled','Completed'],
        default:'Scheduled',

        
        

    },
});

const appointment=mongoose.model('Appointments',AppointmentSchema);
module.exports=appointment;


