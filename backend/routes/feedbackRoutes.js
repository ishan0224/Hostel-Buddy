import express from 'express';
import { Feedback } from '../models/feedback.models.js';
import { Complaint } from '../models/complaint.models.js';
import { User } from '../models/user.models.js';

const router = express.Router();


// Post feedback for a resolved complaint
router.post('/', async (req, res) => {
    const { user, complaint, rating, comments } = req.body;

    try {
        // Check if user exists
        const existingUser = await User.findById(user);
        if (!existingUser) {
            return res.status(400).json({ message: 'User not found' });
        }

        // Check if complaint exists and is resolved
        const existingComplaint = await Complaint.findById(complaint);
        if (!existingComplaint || existingComplaint.status.toLowerCase() !== 'resolved') {
            return res.status(400).json({ message: 'Complaint not found or not resolved' });
        }

        // Create feedback
        const newFeedback = new Feedback({ user, complaint, rating, comments });
        await newFeedback.save();

        res.status(201).json({ message: 'Feedback submitted successfully', feedback: newFeedback });
    } catch (error) {
        res.status(500).json({ message: 'Error submitting feedback', error: error.message });
    }
});


// Get all feedback for a particular complaint
router.get('/complaint/:complaintId', async (req, res) => {
    try {
        const feedbacks = await Feedback.find({ complaint: req.params.complaintId }).populate('user', 'username');
        if (!feedbacks.length) {
            return res.status(404).json({ message: 'No feedback found for this complaint' });
        }
        res.status(200).json(feedbacks);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching feedback', error: error.message });
    }
});

// Get all feedback by a particular user
router.get('/user/:userId', async (req, res) => {
    try {
        const feedbacks = await Feedback.find({ user: req.params.userId }).populate('complaint', 'category');
        if (!feedbacks.length) {
            return res.status(404).json({ message: 'No feedback found for this user' });
        }
        res.status(200).json(feedbacks);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching feedback', error: error.message });
    }
});

export default router;
