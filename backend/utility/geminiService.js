import axios from 'axios';
import dotenv from 'dotenv';
import { formatGeminiResponse } from '../utility/textFormatter.js';

dotenv.config();

export const getAnalyticsFromGemini = async (complaintsData) => {
    try {
        // Format the complaints data
        const formattedData = complaintsData.map(complaint => ({
            user: complaint.user.username,
            roomNumber: complaint.user.roomNumber,
            hostelBlock: complaint.user.hostelBlock,
            issueLocation: complaint.issueLocation,
            category: complaint.category,
            createdAt: complaint.createdAt,
            status: complaint.status,
            resolvedAt: complaint.resolvedAt ? complaint.resolvedAt : "not yet resolved"
        }));

        const prompt = `
            Analyze the following complaint history data and provide insights:

            Data: ${JSON.stringify(formattedData)}

            Provide insights on the following:
            1. **Common Issues**: Identify the most frequently reported issues and mention the users, rooms, and hostel blocks involved.
            2. **Recurring Problems**: Specify if any users, rooms, or hostel blocks have recurring complaints.
            3. **Average Resolution Time**: Calculate the average resolution time for resolved complaints.
            4. **Recommendations**: Suggest improvements to reduce recurring problems.
        `;

        const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${process.env.GEMINI_API_KEY}`,
            {
                contents: [{ parts: [{ text: prompt }] }]
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );

        const content = response.data.candidates?.[0]?.content?.parts?.[0]?.text;
        return formatGeminiResponse(content);  // Apply formatting before returning the result
    } catch (error) {
        console.error("Error communicating with Gemini API:", error.response?.data || error.message);
        throw new Error("Failed to generate analytics from Gemini");
    }
};
