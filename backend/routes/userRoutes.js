const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');
require('dotenv').config();

// Clé secrète JWT
if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET est manquant dans le fichier .env');
  }
  const SECRET_KEY = process.env.JWT_SECRET;
  
// Inscription
router.post('/register', async (req, res) => {
  try {
    const { nom, email, mot_de_passe, role } = req.body;

    // Verif si l'utilisateur existe déjà
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'Email déjà utilisé' });

    // Créer nouvel utilisateur
    user = new User({ nom, email, mot_de_passe, role });
    await user.save();

    res.status(201).json({ message: 'Utilisateur enregistré avec succès !' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de l’inscription', error });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, mot_de_passe } = req.body;

    // Verif si l'utilisateur existe
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Utilisateur non trouvé' });

    // Verif du mot de passe
    const isMatch = await bcrypt.compare(mot_de_passe, user.mot_de_passe);
    if (!isMatch) return res.status(400).json({ message: 'Mot de passe incorrect' });

    // Générer token JWT
    const token = jwt.sign({ id: user._id, role: user.role }, SECRET_KEY, { expiresIn: '2h' });

    res.status(200).json({ message: 'Connexion réussie', token });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la connexion', error });
  }
});

// Route utilisateurs connectes
router.get('/profil', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-mot_de_passe'); // Ne pas envoyer le mdp
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération du profil', error });
  }
});

// Route mecanicien et manager
router.get('/mecanicien', authMiddleware, roleMiddleware(['mecanicien', 'manager']), (req, res) => {
    res.json({ message: "Tongasoa Meca" });
  });
  
// Route manager
router.get('/manager', authMiddleware, roleMiddleware(['manager']), (req, res) => {
res.json({ message: "Tongasoa Boss" });
});

// FindAll
router.get('/all', authMiddleware, roleMiddleware(['manager']), async (req, res) => {
    try {
      const users = await User.find();
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ message: 'Erreur lors de la récupération', error });
    }
  });

module.exports = router;
