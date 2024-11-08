// models/complaint.models.js
import mongoose from 'mongoose';

const complaintSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    category: {
        type: String,
        enum: ['Electrical Issues', 'Mess Issues', 'Furniture Issues', 'Washroom Maintenance', 'Harassment', 'Other'],
        required: true
    },
    description: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'in progress', 'resolved'],
        default: 'pending'
    },
    resolvedAt: {
        type: Date  // Adding this to track when the complaint was resolved
    }
}, { timestamps: true });

export const Complaint = mongoose.model('Complaint', complaintSchema);
