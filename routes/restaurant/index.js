const router = require('express').Router();
const controller = require('./controller');

router.get('/:category/:address', controller.category);
router.get('/delivery/:order_id', controller.delivery);
router.post('/payment', controller.payment);
module.exports = router;
