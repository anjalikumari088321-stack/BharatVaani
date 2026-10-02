require("dotenv").config();

const { SarvamAIClient } = require("sarvamai");
const express = require('express');
const cors = require('cors');

const app = express();
const sarvam = new SarvamAIClient({
  apiSubscriptionKey: process.env.SARVAM_API_KEY
});
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const knowledge = {
  kisan: {
    hindi: "PM Kisan Yojana ke tahat eligible kisano ko har saal ₹6000 ki financial help milti hai.",
    english: "Under PM Kisan Yojana, eligible farmers receive financial assistance of ₹6000 per year."
  },

  yojana: {
    hindi: "UP ki Kanya Sumangala Yojana betiyon ke liye financial assistance provide karti hai.",
    english: "UP's Kanya Sumangala Yojana provides financial assistance for eligible girl children."
  },

  dbms: {
    hindi: "DBMS mein weak entity woh entity hoti hai jo kisi strong entity par depend karti hai.",
    english: "In DBMS, a weak entity is an entity that depends on a strong entity for its identification."
  },

  default: {
    hindi: "Ram Ram! Main BharatVaani hoon. Aap Hindi ya English mein pooch sakte hain.",
    english: "Hello! I am BharatVaani. You can ask me questions in Hindi or English."
  }
};
app.post('/ask', async (req, res) => {
  try {
    const userText = req.body.text;

    const response = await sarvam.chat.completions({
      model: "sarvam-105b",
      messages: [
        {
          role: "system",
          content:
            "You are BharatVaani, a friendly AI assistant for people in India. Answer in simple Hindi or Hinglish. If the user asks in English, answer in simple English. Keep answers short and useful."
        },
        {
          role: "user",
          content: userText
        }
      ],
      temperature: 0.3,
      max_tokens: 300
    });

    const reply = response.choices[0].message.content;

    res.json({ reply });

  } catch (error) {
    console.error("Sarvam Error:", error);
    res.status(500).json({
      reply: "Sorry, BharatVaani abhi response nahi de pa rahi hai."
    });
  }
});

app.listen(3000, () => console.log("Server chal raha hai http://localhost:3000"));