const express = require('express');
const CollecteController = require('../controllers/CollecteController');
const router = express.Router();

router.post('/', CollecteController.createCollecte);
router.get('/:id', CollecteController.getCollecte);

module.exports = router;
