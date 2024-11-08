import express from 'express';
import axios from 'axios';
import cors from 'cors';
import dotenv from 'dotenv';
import { formatGeminiResponse } from '../utility/textFormatter.js';

dotenv.config();

const router = express.Router();

router.use(cors());
router.use(express.json());

// Chat API Route
router.post('/chat', async (req, res) => {
    const userMessage = req.body.message;

    if (!userMessage) {
        return res.status(400).json({ error: 'Message is required' });
    }

    try {
        const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${process.env.GEMINI_API_KEY}`,
            {
                contents: [{ parts: [{ text: userMessage }] }]
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );

        const content = response.data.candidates?.[0]?.content?.parts?.[0]?.text;
        const formattedContent = formatGeminiResponse(content);  // Apply formatting
        res.json({ reply: formattedContent });
    } catch (error) {
        console.error('Error with Gemini request:', error);
        res.status(500).json({ error: 'Error communicating with Gemini API' });
    }
});

export default router;
