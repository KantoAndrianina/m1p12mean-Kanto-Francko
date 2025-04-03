const mongoose = require('mongoose');

const rendezVousSchema = new mongoose.Schema({
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: "Utilisateur", required: true },
  vehiculeId: { type: mongoose.Schema.Types.ObjectId, ref: "Vehicule", required: true },
  serviceId: { type: mongoose.Schema.Types.ObjectId, ref: "Service", required: true },
  mecanicienId: { type: mongoose.Schema.Types.ObjectId, ref: "Utilisateur", required: true },
  heureDebut: { type: Date, required: true },
  heureFin: { type: Date, required: true },
  statut: { type: String, enum: ["en attente", "confirmé", "terminé", "annulé"], default: "en attente" },
});

module.exports = mongoose.model("RendezVous", rendezVousSchema);
