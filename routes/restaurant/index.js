const router = require('express').Router();
const controller = require('./controller');

router.get('/delivery/:restaurantKey/:order_id', controller.delivery);
router.get('/:category/:address', controller.category);
router.post('/payment', controller.payment);
router.post('/review', controller.review);
module.exports = router;
