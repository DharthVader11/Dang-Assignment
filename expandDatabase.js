// expandDatabase.js - Script to Expand Symptoms, Remedies, and Diagnoses

const mongoose = require('mongoose');
const db = mongoose.connection;

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

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/symptomsDB', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to the database'))
  .catch(err => console.log(err));

// Function to insert new symptom data into the database
async function insertNewSymptomData() {
  // Insert new diseases
  const newDisease1 = await Disease.create({
    name: 'Migraine',
    description: 'A neurological condition causing severe headaches, often accompanied by nausea and light sensitivity.'
  });

  const newDisease2 = await Disease.create({
    name: 'Common Cold',
    description: 'A viral infection of the upper respiratory tract characterized by a runny nose, cough, and sore throat.'
  });

  // Insert new remedies
  const newRemedy1 = await Remedy.create({
    name: 'Bed Rest',
    description: 'Taking a break from physical activity to allow the body to heal.',
    instructions: 'Lie down and rest for a few hours. Avoid any strenuous activities.'
  });

  const newRemedy2 = await Remedy.create({
    name: 'Hydration',
    description: 'Drinking fluids to maintain the body’s fluid balance.',
    instructions: 'Drink at least 8 glasses of water throughout the day. Avoid caffeine and alcohol.'
  });

  // Insert new symptoms
  const newSymptom1 = await Symptom.create({
    name: 'Headache',
    description: 'Pain in the head often caused by stress, dehydration, or tension.',
    relatedDiseases: [newDisease1._id, newDisease2._id],
    remedies: [newRemedy1._id, newRemedy2._id]
  });

  const newSymptom2 = await Symptom.create({
    name: 'Cough',
    description: 'A reflex action to clear the airways of mucus or irritants.',
    relatedDiseases: [newDisease2._id],  // Only related to common cold in this case
    remedies: [newRemedy2._id]
  });

  console.log('
