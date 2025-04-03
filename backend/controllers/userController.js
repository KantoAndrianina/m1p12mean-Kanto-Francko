const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET est manquant dans le fichier .env');
}
const SECRET_KEY = process.env.JWT_SECRET;

// Inscription
exports.register = async (req, res) => {
    try {
        const { nom, email, mot_de_passe, role } = req.body;

        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: 'Email déjà utilisé' });

        user = new User({ nom, email, mot_de_passe, role });
        // console.log("Utilisateur AVANT save:", JSON.stringify(user, null, 2));

        await user.save();

        res.status(201).json({ message: 'Utilisateur enregistré avec succès !' });
    } catch (error) {
        console.error("Erreur register:", error);
        res.status(500).json({ message: 'Erreur lors de l’inscription', error });
    }
};


// Connexion
exports.login = async (req, res) => {
    try {
        const { email, mot_de_passe } = req.body;
        console.log("Email envoyé:", email);
        // console.log("Mot de passe envoyé:", mot_de_passe); 

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'Utilisateur non trouvé' });

        // console.log("Mot de passe en base:", user.mot_de_passe);

        const isMatch = await bcrypt.compare(mot_de_passe, user.mot_de_passe);
        // console.log("Résultat bcrypt.compare:", isMatch); 

        if (!isMatch) return res.status(400).json({ message: 'Mot de passe incorrect' });

        const token = jwt.sign({ id: user._id, role: user.role }, SECRET_KEY, { expiresIn: '2h' });

        res.status(200).json({ message: 'Connexion réussie', token });
    } catch (error) {
        console.error("Erreur login:", error);
        res.status(500).json({ message: 'Erreur lors de la connexion', error });
    }
};


// Profil utilisateur connecté
exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-mot_de_passe'); // Ne pas envoyer le mdp
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération du profil', error });
    }
};

// Mecanicien et manager
exports.mecanicienAccess = (req, res) => {
    res.json({ message: "Tongasoa Meca" });
};

// Manager
exports.managerAccess = (req, res) => {
    res.json({ message: "Tongasoa Boss" });
};

// All utilisateurs (Manager only)
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération', error });
    }
};
