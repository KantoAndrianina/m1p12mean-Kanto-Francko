const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const vehiculeController = require('../controllers/vehiculeController');

router.post('/add', authMiddleware, vehiculeController.addVehicule);
router.get('/all', authMiddleware, vehiculeController.getVehicules);
router.put('/:id', authMiddleware, vehiculeController.updateVehicule);
router.delete('/:id', authMiddleware, vehiculeController.deleteVehicule);

module.exports = router;
