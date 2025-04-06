// server.js

const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 3000;

// Body parser middleware to handle form data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// OpenAI API Key (you need to get this from OpenAI)
const OPENAI_API_KEY = 'your-openai-api-key'; // Replace this with your OpenAI API key

// API Route to handle symptom queries
app.post('/ask', async (req, res) => {
  const { symptomDescription } = req.body;

  if (!symptomDescription) {
    return res.status(400).json({ message: 'Symptom description is required.' });
  }

  // Construct a prompt for ChatGPT to provide diagnosis and remedies
  const prompt = `The user is describing a symptom: "${symptomDescription}". Based on this symptom, provide a diagnosis and suggest remedies.`;

  try {
    // Make a request to the OpenAI API to get the response from ChatGPT
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo', // You can use 'gpt-4' if you have access
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 200,
        temperature: 0.7,
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const answer = response.data.choices[0].message.content;

    // Send the answer back to the frontend
    res.json({ answer });
  } catch (error) {
    console.error('Error with OpenAI API:', error);
    res.status(500).json({ message: 'Something went wrong with the request.' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
