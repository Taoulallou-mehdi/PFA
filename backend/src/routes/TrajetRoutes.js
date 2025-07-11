const express = require('express');
const TrajetController = require('../controllers/TrajetController');
const router = express.Router();

router.post('/', TrajetController.createTrajet);
router.get('/', TrajetController.getAllTrajets);
router.get('/:id', TrajetController.getTrajet);
router.put('/:id', TrajetController.updateTrajet);

module.exports = router;
