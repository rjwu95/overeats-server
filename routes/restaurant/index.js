const router = require('express').Router();
const controller = require('./controller');
const { checkExpiredToken, checkTypeToken } = require('../../middleware/auth');

router.get('/delivery/:restaurantKey/:order_id', controller.delivery);
router.get('/:category/:address', controller.category);

router.post('/payment', checkExpiredToken, checkTypeToken, controller.payment);
router.post('/review', controller.review);

module.exports = router;
