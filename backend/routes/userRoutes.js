const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');


// USER
// Routes publiques
router.post('/register', userController.register);
router.post('/login', userController.login);

// Routes protégées
router.get('/profil', authMiddleware, userController.getProfile);
router.get('/mecanicien', authMiddleware, roleMiddleware(['mecanicien', 'manager']), userController.mecanicienAccess);
router.get('/manager', authMiddleware, roleMiddleware(['manager']), userController.managerAccess);
router.get('/all', authMiddleware, roleMiddleware(['manager']), userController.getAllUsers);


module.exports = router;
