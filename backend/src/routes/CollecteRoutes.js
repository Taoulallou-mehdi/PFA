const express = require('express');
const CollecteController = require('../controllers/CollecteController');
const router = express.Router();

router.get('/', CollecteController.getAllCollectes);
router.post('/', CollecteController.createCollecte);
router.get('/:id', CollecteController.getCollecte);
router.put('/:id', CollecteController.updateCollecte);
router.delete('/:id', CollecteController.deleteCollecte);

module.exports = router;