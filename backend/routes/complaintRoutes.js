import express from 'express';
import { Complaint } from '../models/complaint.models.js';  
import { User } from '../models/user.models.js';  
import { AdminNotification } from '../models/adminNotification.models.js';
import { Admin } from '../models/admin.models.js'; // Import Admin model
import dotenv from 'dotenv'; 
import { getAnalyticsFromGemini } from '../utility/geminiService.js';

dotenv.config();

const router = express.Router();

// Create a new complaint (User files a complaint)
router.post('/create', async (req, res) => {
    const { user, category, description } = req.body;

    try {
        // Check if the user exists
        const existingUser = await User.findById(user);
        if (!existingUser) {
            return res.status(400).json({ message: 'User does not exist' });
        }

        // Create a new complaint with user's room number and hostel block
        const newComplaint = new Complaint({ 
            user, 
            category, 
            description,
            roomNumber: existingUser.roomNumber,
            hostelBlock: existingUser.hostelBlock
        });
        await newComplaint.save();

        // Generate admin notification for the new complaint
        // Assuming there's at least one admin who needs to be notified
        const admin = await Admin.findOne({ role: 'admin' }); // Get the admin to be notified
        if (admin) {
            const newAdminNotification = new AdminNotification({
                admin: admin._id,
                message: `A new complaint has been reported by User ID ${user} in the ${category} category.`,
                type: 'new_issue',
            });

            await newAdminNotification.save();
        } else {
            console.error('Admin not found for notification');
        }

        res.status(201).json({ message: 'Complaint filed successfully, and admin notified', complaint: newComplaint });
    } catch (error) {
        console.error("Error in creating complaint or notifying admin:", error); // Log the error
        res.status(500).json({ message: 'Error filing complaint', error: error.message });
    }
});

// Get all complaints (Admin access)
router.get('/', async (req, res) => {
    try {
        const complaints = await Complaint.find().populate('user', 'username email');
        res.status(200).json(complaints);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching complaints', error: error.message });
    }
});


// complaintRoutes.js (Analytics Route)
router.get('/gemini-analytics', async (req, res) => {
    try {
        // Fetch all complaints and populate user data
        const complaints = await Complaint.find().populate('user', 'username roomNumber hostelBlock');
        
        if (complaints.length === 0) {
            return res.status(404).json({ message: 'No complaints found for analysis' });
        }

        // Generate analytics from Gemini
        const analytics = await getAnalyticsFromGemini(complaints);
        res.status(200).json({ message: 'Analytics generated successfully', analytics });
    } catch (error) {
        console.error("Error generating analytics:", error);
        res.status(500).json({ message: 'Error generating analytics', error: error.message });
    }
});


// Get complaint by ID (User/Admin access)
router.get('/:id', async (req, res) => {
    try {
        const complaint = await Complaint.findById(req.params.id).populate('user', 'username email');
        if (!complaint) {
            return res.status(404).json({ message: 'Complaint not found' });
        }
        res.status(200).json(complaint);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching complaint', error: error.message });
    }
});


// Update complaint status (Admin action)
router.put('/:id', async (req, res) => {
    const { status } = req.body;

    try {
        const updatedComplaint = await Complaint.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true, runValidators: true }
        );

        if (!updatedComplaint) {
            return res.status(404).json({ message: 'Complaint not found' });
        }

        res.status(200).json({ message: 'Complaint status updated', complaint: updatedComplaint });
    } catch (error) {
        res.status(500).json({ message: 'Error updating complaint status', error: error.message });
    }
});

// Delete a complaint (Admin action)
router.delete('/:id', async (req, res) => {
    try {
        const deletedComplaint = await Complaint.findByIdAndDelete(req.params.id);
        if (!deletedComplaint) {
            return res.status(404).json({ message: 'Complaint not found' });
        }

        res.status(200).json({ message: 'Complaint deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting complaint', error: error.message });
    }
});

// Get complaint history for a specific user
router.get('/user/:userId/history', async (req, res) => {
    const { userId } = req.params;

    try {
        // Find complaints associated with the given user ID, with sorting by created date
        const complaints = await Complaint.find({ user: userId })
            .populate('user', 'username email')
            .sort({ createdAt: -1 });

        if (complaints.length === 0) {
            return res.status(404).json({ message: 'No complaint history found for this user' });
        }

        res.status(200).json(complaints);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching complaint history', error: error.message });
    }
});

export default router;
