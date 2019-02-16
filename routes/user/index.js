const router = require('express').Router();
const controller = require('./controller');
const authMiddleware = require('../../middleware/auth');

router.post('/signup', controller.signup);
router.post('/signin', controller.signin);

router.get('/info', authMiddleware.checkToken, controller.info);
router.get('/signout', authMiddleware.checkToken, controller.signout);

module.exports = router;
