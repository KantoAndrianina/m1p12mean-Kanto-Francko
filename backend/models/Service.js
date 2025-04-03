const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  description: { type: String, required: true },
  prix: { type: Number, required: true },
  dureeEstimee: { type: Number, required: true }, // En minutes
  categorie: { type: String, required: true }
});

module.exports = mongoose.model('Service', serviceSchema);
