import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = 'gemini-2.0-flash';
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

// POST /api/generate-story
app.post('/api/generate-story', async (req, res) => {
  const { topic, grade, language } = req.body;

  if (!topic || !grade || !language) {
    return res.status(400).json({ error: 'Missing topic, grade or language' });
  }

  const prompt = `Create a short story in ${language} for grade ${grade} students about "${topic}" that is simple, fun, and educational.`;

  try {
    const response = await axios.post(GEMINI_API_URL, {
      contents: [
        {
          parts: [
            {
              text: prompt,
            },
          ],
        },
      ],
    });

    const story = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!story) {
      throw new Error('No story returned from Gemini');
    }

    return res.json({ story });
  } catch (error) {
    console.error('Gemini API Error:', error?.response?.data || error.message);
    return res.status(500).json({ error: 'Failed to generate story' });
  }
});

app.get('/', (req, res) => {
  res.send('✅ Sahayak API is running');
});

app.listen(PORT, () => {
  console.log(`🚀 Server listening at http://localhost:${PORT}`);
});
