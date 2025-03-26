const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.post('/', async (req, res) => {
  try {
    const { nom, email, mot_de_passe, role } = req.body;
    const newUser = new User({ nom, email, mot_de_passe, role });
    await newUser.save();
    res.status(201).json({ message: 'Utilisateur ajouté avec succès !', user: newUser });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de l’ajout', error });
  }
});

router.get('/', async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération', error });
  }
});

module.exports = router;
