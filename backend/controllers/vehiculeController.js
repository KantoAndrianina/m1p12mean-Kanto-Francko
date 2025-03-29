const Vehicule = require('../models/Vehicule');

// Ajouter vehicules
exports.addVehicule = async (req, res) => {
  try {
    const { marque, modele, annee, immatriculation } = req.body;
    const nouveauVehicule = new Vehicule({
      proprietaire: req.user.id,
      marque,
      modele,
      annee,
      immatriculation
    });

    await nouveauVehicule.save();
    res.status(201).json({ message: 'Véhicule ajouté avec succès', vehicule: nouveauVehicule });
  } catch (error) {
    res.status(500).json({ erreur: 'Erreur serveur' });
  }
};

// Voir vehicules
exports.getVehicules = async (req, res) => {
  try {
    const vehicules = await Vehicule.find({ proprietaire: req.user.id });
    res.status(200).json(vehicules);
  } catch (error) {
    res.status(500).json({ erreur: 'Erreur serveur' });
  }
};

// Modifier vehicule
exports.updateVehicule = async (req, res) => {
  try {
    const vehicule = await Vehicule.findOne({ _id: req.params.id, proprietaire: req.user.id });
    if (!vehicule) return res.status(404).json({ erreur: 'Véhicule non trouvé' });

    await Vehicule.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json({ message: 'Véhicule mis à jour' });
  } catch (error) {
    res.status(500).json({ erreur: 'Erreur serveur' });
  }
};

// Supprimer vehicule
exports.deleteVehicule = async (req, res) => {
  try {
    const vehicule = await Vehicule.findOne({ _id: req.params.id, proprietaire: req.user.id });
    if (!vehicule) return res.status(404).json({ erreur: 'Véhicule non trouvé' });

    await Vehicule.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Véhicule supprimé' });
  } catch (error) {
    res.status(500).json({ erreur: 'Erreur serveur' });
  }
};
