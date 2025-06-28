import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import axios from 'axios';
import multer from 'multer';
import fs from 'fs';
import path from 'path';


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = 'gemini-2.0-flash';
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;
const upload = multer({ dest: 'uploads/' });
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

app.post('/api/ask', async (req, res) => {
  const { question } = req.body;

  if (!question) {
    return res.status(400).json({ error: 'Question is required' });
  }

  const prompt = `Explain the following question in a simple, child-friendly way in the same language as the question. Include analogies if possible:\n\n"${question}"`;

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

    const answer = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!answer) {
      throw new Error('No answer returned from Gemini');
    }

    res.json({ answer });
  } catch (error) {
    console.error('Gemini Ask Error:', error?.response?.data || error.message);
    res.status(500).json({ error: 'Failed to get answer' });
  }
});



app.post('/api/generate-worksheet', upload.single('image'), async (req, res) => {
  const { prompt } = req.body;
  const imagePath = req.file?.path;

  if (!imagePath) {
    return res.status(400).json({ error: 'Image is required' });
  }

  try {
    const imageBytes = fs.readFileSync(imagePath).toString('base64');

    const fullPrompt = `
You are an AI teaching assistant. A teacher has uploaded a textbook page.
Generate three differentiated worksheet versions:
1. For Grade 3: simple language and visuals
2. For Grade 5: moderate complexity with examples
3. For Grade 8: advanced, with higher-order thinking questions

${prompt ? `The topic to focus on is: ${prompt}` : ''}
Respond ONLY in this JSON format:
{
  "3": "...",
  "5": "...",
  "8": "..."
}
`;

    const payload = {
      contents: [
        {
          parts: [
            { text: fullPrompt },
            {
              inlineData: {
                mimeType: 'image/jpeg',
                data: imageBytes,
              },
            },
          ],
        },
      ],
    };

    const response = await axios.post(
      GEMINI_API_URL,
      payload,
      { headers: { 'Content-Type': 'application/json' } }
    );

    const text = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
    const cleanedText = text
      .replace(/```json\s*([\s\S]*?)\s*```/, '$1') // Removes ```json ... ```
      .replace(/```([\s\S]*?)```/, '$1')           // Handles fallback plain ``` ... ```
      .trim();

    const parsed = JSON.parse(cleanedText);

    res.json(parsed);
  } catch (err) {
    console.error('❌ Gemini Worksheet Error:', err?.response?.data || err.message);
    res.status(500).json({
      error: 'Failed to generate worksheet',
      details: err?.response?.data || err.message,
    });
  } finally {
    if (imagePath) fs.unlinkSync(imagePath);
  }
});


app.post('/api/lesson-plan', async (req, res) => {
  const { grade, subject, theme } = req.body;

  if (!grade || !subject) {
    return res.status(400).json({ error: 'Grade and Subject are required' });
  }

  const prompt = `
You're an expert school planner. Create a weekly lesson plan (Monday to Saturday) for Grade ${grade} on the subject "${subject}".
${theme ? `Focus on the theme: "${theme}".` : ''}
Return:
1. A JSON object.
2. A Markdown table with Day, Topic, Activity, Assessment.
Start the Markdown table after this line: ---TABLE---
`;

  try {
  const response = await axios.post(GEMINI_API_URL, {
    contents: [{ parts: [{ text: prompt }] }],
  });

  const text = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!text) throw new Error('No content from Gemini');

  

  let cleanedJson = '';
  try {
    const jsonMatch = text.match(/```json\s*([\s\S]*?)```/i) || text.match(/```([\s\S]*?)```/i);
    if (jsonMatch) {
      cleanedJson = jsonMatch[1].trim();
    } else {
      cleanedJson = text.split('---TABLE---')[0].trim();
    }

    const parsed = JSON.parse(cleanedJson);
    const markdownTable = text.split('---TABLE---')[1]?.trim() || '';

    res.json({ plan: parsed, markdown: markdownTable });
  } catch (err) {
    console.error('❌ Lesson Plan JSON Parsing Error:', err.message);
    res.status(500).json({ error: 'Invalid format returned by Gemini' });
  }
} catch (error) {
  console.error('Lesson Plan API Error:', error.message || error);
  res.status(500).json({ error: 'Failed to generate lesson plan' });
}

});



app.get('/', (req, res) => {
  res.send('✅ Sahayak API is running');
});

app.listen(PORT, () => {
  console.log(`🚀 Server listening at http://localhost:${PORT}`);
});
