const express = require('express');
const TrajetController = require('../controllers/TrajetController');
const router = express.Router();

router.post('/', TrajetController.createTrajet);
router.get('/:id', TrajetController.getTrajet);

module.exports = router;
