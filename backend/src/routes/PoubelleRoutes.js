const express = require('express');
const PoubelleController = require('../controllers/PoubelleController');
const router = express.Router();

router.get('/', PoubelleController.getAllPoubelles);
router.post('/', PoubelleController.createPoubelle);
router.get('/:id', PoubelleController.getPoubelle);
router.put('/:id', PoubelleController.updatePoubelle);
router.delete('/:id', PoubelleController.deletePoubelle);

module.exports = router;
