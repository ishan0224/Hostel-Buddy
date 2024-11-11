import express from 'express';
import { Announcement } from '../models/announcement.models.js';
import { User } from '../models/user.models.js';
import { UserNotification } from '../models/userNotification.models.js';

const router = express.Router();

router.post('/create', async (req, res) => {
    const { title, content } = req.body;

    try {
        // Create a new announcement
        const newAnnouncement = new Announcement({ title, content });
        await newAnnouncement.save();

        // Fetch all users to send a notification
        const users = await User.find();

        if (users.length > 0) {
            const notifications = users.map(user => ({
                user: user._id,
                message: `New announcement: ${title}`,
                type: 'other',
            }));

            // Insert multiple notifications at once
            await UserNotification.insertMany(notifications);
        }

        res.status(201).json({ message: 'Announcement created successfully, notifications sent to users', announcement: newAnnouncement });
    } catch (error) {
        res.status(500).json({ message: 'Error creating announcement', error: error.message });
    }
});

// Get all announcements
router.get('/', async (req, res) => {
    try {
        const announcements = await Announcement.find();
        res.status(200).json(announcements);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching announcements', error: error.message });
    }
});

// Update an announcement (Admin only)
router.put('/:id', async (req, res) => {
    const { title, content } = req.body;

    try {
        const updatedAnnouncement = await Announcement.findByIdAndUpdate(
            req.params.id,
            { title, content },
            { new: true, runValidators: true }
        );

        if (!updatedAnnouncement) {
            return res.status(404).json({ message: 'Announcement not found' });
        }

        res.status(200).json({ message: 'Announcement updated successfully', announcement: updatedAnnouncement });
    } catch (error) {
        res.status(500).json({ message: 'Error updating announcement', error: error.message });
    }
});

// Delete an announcement (Admin only)
router.delete('/:id', async (req, res) => {
    try {
        const deletedAnnouncement = await Announcement.findByIdAndDelete(req.params.id);
        if (!deletedAnnouncement) {
            return res.status(404).json({ message: 'Announcement not found' });
        }

        res.status(200).json({ message: 'Announcement deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting announcement', error: error.message });
    }
});

export default router;
