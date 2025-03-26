const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  mot_de_passe: { type: String, required: true },
  role: { type: String, enum: ['client', 'mecanicien', 'manager'], required: true },
  date_creation: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
