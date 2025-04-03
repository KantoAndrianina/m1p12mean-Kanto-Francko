const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/serviceController');
const authMiddleware = require('../middlewares/authMiddleware'); 
const roleMiddleware = require('../middlewares/roleMiddleware');

router.post('/add', authMiddleware, roleMiddleware(['manager']), serviceController.addService);
router.get('/all', serviceController.getServices);
router.put('/:id', authMiddleware, roleMiddleware(['manager']), serviceController.updateService);
router.delete('/:id', authMiddleware, roleMiddleware(['manager']), serviceController.deleteService);

module.exports = router;
