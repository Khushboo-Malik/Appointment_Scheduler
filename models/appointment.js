const mongoose=require("mongoose");


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

const appointment=mongoose.model('Appointments',AppointmentSchema);
module.exports=appointment;


