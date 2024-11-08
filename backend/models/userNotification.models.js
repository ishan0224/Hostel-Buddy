import mongoose from 'mongoose';

const userNotificationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    message: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['issue_resolved', 'issue_updated', 'other'], 
        required: true
    },
    isRead: {   
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export const UserNotification = mongoose.model('UserNotification', userNotificationSchema);
