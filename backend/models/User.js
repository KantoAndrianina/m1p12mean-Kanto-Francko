const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  mot_de_passe: { type: String, required: true },
  role: { type: String, enum: ['client', 'mecanicien', 'manager'], default: 'client', required: true },
  date_creation: { type: Date, default: Date.now }
});


// Hachage du mot de passe
userSchema.pre('save', async function (next) {
  if (!this.isModified('mot_de_passe')) return next();
  const salt = await bcrypt.genSalt(10);
  this.mot_de_passe = await bcrypt.hash(this.mot_de_passe, salt);
  next();
});

module.exports = mongoose.model('User', userSchema);
