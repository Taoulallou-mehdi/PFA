const express = require('express');
const PoubelleController = require('../controllers/PoubelleController');
const router = express.Router();

router.post('/', PoubelleController.createPoubelle);
router.get('/:id', PoubelleController.getPoubelle);

module.exports = router;
