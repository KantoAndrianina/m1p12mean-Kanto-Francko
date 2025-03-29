const mongoose = require('mongoose');

const vehiculeSchema = new mongoose.Schema({
  proprietaire: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  marque: { type: String, required: true },
  modele: { type: String, required: true },
  annee: { type: Number, required: true }, 
  immatriculation: { type: String, required: true, unique: true }, 
  dateAjout: { type: Date, default: Date.now } 
});

module.exports = mongoose.model('Vehicule', vehiculeSchema);
