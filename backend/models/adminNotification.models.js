import mongoose from "mongoose";

const adminNotificationSchema = new mongoose.Schema({
    admin : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Admin',
        required : true
    },
    message : {
        type : String,
        required : true
    },
    type : {
        type : String,
        enum : ['new_issue', 'issue_assigned', 'issue_resolved', 'other'], // Add 'issue_resolved' here
        required : true
    },
    isRead : {
        type : Boolean,
        default : false
    },
    createdAt :{
        type : Date,
        default : Date.now
    }
});

export const AdminNotification = mongoose.model('AdminNotification', adminNotificationSchema);
