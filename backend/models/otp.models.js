import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref :'User',
    },
    admin:{
        type:mongoose.Schema.Types.ObjectId,
        ref : 'Admin'
    },
    otp:{
        type:String,
        required : true
    },
    expiresAt:{
        type:Date,
        required : true
    },
    createdAt :{
        type: Date,
        required : true,
        default:Date.now
    }
})

export const OTP = mongoose.model('OTP',otpSchema);