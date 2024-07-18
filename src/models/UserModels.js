import mongoose from 'mongoose' ;

const userSchema = new mongoose.Schema({

    username : {
        type : String,
        required : [ true , "please provide your username"],
        unique : true
    },
    email : {
        type : String,
        required : [ true , "please provide your mailID"],
        unique : true
        
    },
    password : {
        type : String,
        required : [ true , "please provide your password"],
        
    },
    isVerified : {
        type : Boolean,
        default : false
    },
    isAdmin : {
        type : Boolean,
        default : false
    },
    forgotPasswordToken : String,
    forgotPasswordTokenExpiry : Date,
    verifyToken : String,
    verifyTokenExpiry : Date,


// why space?   -> bcoz for add more schema if want

})
//          if already created         otherwise
const User = mongoose.models.users || mongoose.model( 'users' , userSchema)

export default User;