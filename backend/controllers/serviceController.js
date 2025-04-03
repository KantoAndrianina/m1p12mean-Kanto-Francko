const Service = require('../models/Service');

exports.addService = async (req, res) => {
  try {
    const { nom, description, prix, dureeEstimee, categorie } = req.body;
    const nouveauService = new Service({ nom, description, prix, dureeEstimee, categorie });
    await nouveauService.save();
    res.status(201).json(nouveauService);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

exports.getServices = async (req, res) => {
  try {
    const services = await Service.find();
    res.status(200).json(services);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

exports.updateService = async (req, res) => {
  try {
    const { id } = req.params;
    const service = await Service.findByIdAndUpdate(id, req.body, { new: true });
    res.status(200).json(service);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

exports.deleteService = async (req, res) => {
  try {
    const { id } = req.params;
    await Service.findByIdAndDelete(id);
    res.status(200).json({ message: "Service supprimé" });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};
