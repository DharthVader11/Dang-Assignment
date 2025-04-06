// server.js - Backend Server (Express)

const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = process.env.PORT || 3000;

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/symptomsDB', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to the database'))
  .catch(err => console.log(err));

// Define the schemas for Symptoms, Diseases, and Remedies
const symptomSchema = new mongoose.Schema({
  name: String,
  description: String,
  relatedDiseases: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Disease' }],
  remedies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Remedy' }]
});

const diseaseSchema = new mongoose.Schema({
  name: String,
  description: String,
});

const remedySchema = new mongoose.Schema({
  name: String,
  description: String,
  instructions: String
});

// Create Models for Symptoms, Diseases, and Remedies
const Symptom = mongoose.model('Symptom', symptomSchema);
const Disease = mongoose.model('Disease', diseaseSchema);
const Remedy = mongoose.model('Remedy', remedySchema);

// API Route to get all symptoms
app.get('/api/symptoms', async (req, res) => {
  try {
    const symptoms = await Symptom.find().populate('relatedDiseases remedies');
    res.json(symptoms);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching symptoms' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
