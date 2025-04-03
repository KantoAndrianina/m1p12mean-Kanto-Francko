const RendezVous = require("../models/RendezVous");
const Service = require("../models/Service");
const User = require("../models/User");
const moment = require('moment-timezone');


async function creerRendezVous(req, res) {
  try {
    const { clientId, vehiculeId, serviceId, date, heure } = req.body;

    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ message: "Service introuvable" });
    }

    const dureeEstimee = service.dureeEstimee; 
    const heureDebut = new Date(`${date}T${heure}Z`); 
    const heureFin = new Date(heureDebut.getTime() + dureeEstimee * 60000); 

    console.log("Heure début : ", heureDebut);
    console.log("Heure fin : ", heureFin);

    const mecaniciensDisponibles = await User.find({ role: "mecanicien" });

    for (let mecanicien of mecaniciensDisponibles) {
      const rdvExistant = await RendezVous.findOne({
        mecanicienId: mecanicien._id,
        $or: [
          { "heureDebut": { $lt: heureFin }, "heureFin": { $gt: heureDebut } }
        ]
      });

      if (!rdvExistant) {
        const nouveauRdv = new RendezVous({
          clientId,
          vehiculeId,
          serviceId,
          mecanicienId: mecanicien._id,
          heureDebut,
          heureFin,
          statut: "en attente" 
        });

        await nouveauRdv.save();

        return res.status(201).json({ message: "Rendez-vous créé avec succès", rendezVous: nouveauRdv });
      }
    }

    return res.status(400).json({ message: "Aucun mécanicien disponible pour ce créneau." });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur", error: err });
  }
}


module.exports = { creerRendezVous };