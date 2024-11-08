import express from 'express';
import { OTP } from '../models/otp.models.js';
import { Complaint } from '../models/complaint.models.js';
import { UserNotification } from '../models/userNotification.models.js';
import { AdminNotification } from '../models/adminNotification.models.js';
import { User } from '../models/user.models.js';
import crypto from 'crypto';
import dotenv from 'dotenv';
import { sendOtpEmail } from '../utility/emailService.js';
import { Admin } from '../models/admin.models.js'; 

dotenv.config();
const router = express.Router();

// Generate OTP for a user to mark issue as resolved
router.post('/generate', async (req, res) => {
    const { userId, issueId } = req.body;

    try {
        // Check if the issue exists
        const issue = await Complaint.findById(issueId);
        if (!issue) {
            return res.status(404).json({ message: 'Issue not found' });
        }

        // Find the user by userId
        const user = await User.findById(userId); // Corrected model reference here
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Generate OTP
        const otp = crypto.randomInt(100000, 999999).toString(); // Generates a 6-digit OTP

        // Create OTP entry with expiration (e.g., 10 minutes from now)
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiration

        const newOtp = new OTP({
            user: userId,
            otp,
            expiresAt,
        });

        await newOtp.save();

        // Send OTP via email
        await sendOtpEmail(user.email, otp);

        res.status(201).json({ message: 'OTP generated successfully and sent via email', otpId: newOtp._id });
    } catch (error) {
        res.status(500).json({ message: 'Error generating OTP', error: error.message });
    }
});



// Verify OTP and mark issue as resolved
// Verify OTP and mark issue as resolved
router.post('/verify', async (req, res) => {
    const { otpId, userId, issueId, enteredOtp } = req.body;

    try {
        // Find OTP entry
        const otpRecord = await OTP.findById(otpId);
        if (!otpRecord) {
            return res.status(404).json({ message: 'OTP not found' });
        }

        // Check if OTP matches and is not expired
        if (otpRecord.otp !== enteredOtp) {
            return res.status(400).json({ message: 'Invalid OTP' });
        }

        if (otpRecord.expiresAt < new Date()) {
            return res.status(400).json({ message: 'OTP has expired' });
        }

        // Mark issue as resolved
        const issue = await Complaint.findByIdAndUpdate(issueId, { status: 'resolved', resolvedAt: new Date() }, { new: true });
        if (!issue) {
            return res.status(404).json({ message: 'Issue not found' });
        }

        // Optionally, delete the OTP record after successful verification
        await OTP.findByIdAndDelete(otpId);

        // Generate a user notification for issue resolution
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found for notification' });
        }

        const newUserNotification = new UserNotification({
            user: userId,
            message: `Your issue with ID ${issueId} has been marked as resolved.`,
            type: 'issue_resolved',
        });
        await newUserNotification.save();

        // Fetch admin for notification (assuming at least one admin needs to be notified)
        const admin = await Admin.findOne({ role: 'admin' }); // Adjust this logic if you have multiple admins
        if (!admin) {
            return res.status(404).json({ message: 'Admin not found for notification' });
        }

        // Generate an admin notification for issue resolution
        const newAdminNotification = new AdminNotification({
            admin: admin._id, // Use a valid admin ObjectId
            message: `The complaint with ID ${issueId} has been resolved by User ID ${userId} (Hostel Block: ${user.hostelBlock}, Room Number: ${user.roomNumber}).`,
            type: 'issue_resolved',
        });

        await newAdminNotification.save();

        res.status(200).json({ message: 'OTP verified successfully, issue resolved', issue });
    } catch (error) {
        console.error("Error verifying OTP or notifying admin:", error); // Log the error
        res.status(500).json({ message: 'Error verifying OTP', error: error.message });
    }
});




export default router;
