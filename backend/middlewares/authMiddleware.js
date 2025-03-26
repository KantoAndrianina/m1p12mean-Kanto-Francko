const jwt = require('jsonwebtoken');
require('dotenv').config();

if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET est manquant dans le fichier .env');
  }
  const SECRET_KEY = process.env.JWT_SECRET;
  
module.exports = (req, res, next) => {
  const token = req.header('Authorization');

  if (!token) return res.status(401).json({ message: 'Accès refusé, aucun token fourni' });

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded; // stocker infos de l’utilisateur connecté
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token invalide' });
  }
};
