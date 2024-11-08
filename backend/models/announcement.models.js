import mongoose from 'mongoose';

const announcementSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    content: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date
    }
});

// Pre-save middleware to automatically set the updatedAt field
announcementSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

export const Announcement = mongoose.model('Announcement', announcementSchema);

