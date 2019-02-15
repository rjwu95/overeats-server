const router = require('express').Router();
const controller = require('./controller');

router.get('/delivery/:restaurantKey/:order_id', controller.delivery);
router.get('/:category/:address', controller.category);
router.post('/payment', controller.payment);
module.exports = router;
