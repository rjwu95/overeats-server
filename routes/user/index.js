const router = require('express').Router();
const controller = require('./controller');
const authMiddleware = require('../../middleware/auth');

router.post('/signup', controller.signup);
router.post('/signin', controller.signin);

router.get('/info', authMiddleware.checkExpiredToken, controller.info);
router.get('/signout', authMiddleware.checkExpiredToken, controller.signout);

module.exports = router;
