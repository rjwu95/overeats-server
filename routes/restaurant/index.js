const router = require('express').Router();
const controller = require('./controller');
const authMiddleware = require('../../middleware/auth');

router.get('/delivery/:restaurantKey/:order_id', controller.delivery);
router.get('/:category/:address', controller.category);
router.post('/payment', authMiddleware.checkToken, controller.payment);
module.exports = router;
