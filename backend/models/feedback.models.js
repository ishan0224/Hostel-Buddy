import mongoose from 'mongoose';

const feedbackSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    complaint: { type: mongoose.Schema.Types.ObjectId, ref: 'Complaint', required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comments: { type: String },
    createdAt: { type: Date, default: Date.now },
});

export const Feedback = mongoose.model('Feedback', feedbackSchema);


