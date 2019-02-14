const router = require('express').Router();
const controller = require('./controller');

router.get('/:category/:address', controller.category);
router.post('/payment', controller.payment);
router.get('/delivery', controller.delivery);
module.exports = router;
