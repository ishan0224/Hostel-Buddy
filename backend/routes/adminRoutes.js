// adminRoutes.js
import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { Admin } from '../models/admin.models.js';
import authMiddleware from '../middleware/authMiddleware.js';
import dotenv from 'dotenv';
import { AdminNotification } from '../models/adminNotification.models.js';

dotenv.config();

const router = express.Router();

// Create a new admin
router.post('/register', async (req, res) => {
    const { username, email, password, role } = req.body;

    try {
        // Check if admin already exists
        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) {
            return res.status(400).json({ message: 'Admin with this email already exists' });
        }

        // Create new admin (password will be hashed in pre-save middleware)
        const newAdmin = new Admin({ username, email, password, role });
        await newAdmin.save(); // Pre-save middleware handles password hashing

        // Generate JWT token
        const token = jwt.sign({ id: newAdmin._id, role: newAdmin.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(201).json({ message: 'Admin created successfully', admin: newAdmin, token });
    } catch (error) {
        res.status(500).json({ message: 'Error creating admin', error: error.message });
    }
});

// Admin login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if admin exists
        const admin = await Admin.findOne({ email });
        if (!admin) {
            console.log("Admin not found with email:", email);
            return res.status(404).json({ message: 'Invalid credentials' });
        }
        console.log("Admin found:", admin);

        // Check password
        console.log("Entered password:", password);
        console.log("Password from DB:", admin.password);
        const isMatch = await admin.matchPassword(password);
        console.log(`Password match: ${isMatch}`);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = jwt.sign({ id: admin._id, role: admin.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error: error.message });
    }
});

// Get admin by ID (Authenticated Route)
router.get('/:id', authMiddleware, async (req, res) => {
    try {
        const admin = await Admin.findById(req.params.id);
        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }
        res.status(200).json(admin);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching admin', error: error.message });
    }
});

// Update admin (Authenticated Route)
router.put('/:id', authMiddleware, async (req, res) => {
    const { username, email, role } = req.body;

    try {
        const updatedAdmin = await Admin.findByIdAndUpdate(
            req.params.id,
            { username, email, role },
            { new: true, runValidators: true }
        );

        if (!updatedAdmin) {
            return res.status(404).json({ message: 'Admin not found' });
        }

        res.status(200).json({ message: 'Admin updated successfully', admin: updatedAdmin });
    } catch (error) {
        res.status(500).json({ message: 'Error updating admin', error: error.message });
    }
});

// Delete admin (Authenticated Route)
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const deletedAdmin = await Admin.findByIdAndDelete(req.params.id);
        if (!deletedAdmin) {
            return res.status(404).json({ message: 'Admin not found' });
        }

        res.status(200).json({ message: 'Admin deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting admin', error: error.message });
    }
});

// Get notifications for an admin
router.get('/:adminId/notifications', async (req, res) => {
    try {
        const { adminId } = req.params;
        const notifications = await AdminNotification.find({ admin: adminId }).sort({ createdAt: -1 });
        res.status(200).json(notifications);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching notifications', error: error.message });
    }
});

router.put('/notifications/:notificationId/read', async (req, res) => {
    try {
        const { notificationId } = req.params;

        const updatedNotification = await AdminNotification.findByIdAndUpdate(
            notificationId,
            { isRead: true },
            { new: true }
        );

        if (!updatedNotification) {
            return res.status(404).json({ message: 'Notification not found' });
        }

        res.status(200).json({ message: 'Notification marked as read', notification: updatedNotification });
    } catch (error) {
        res.status(500).json({ message: 'Error marking notification as read', error: error.message });
    }
});



export default router;
