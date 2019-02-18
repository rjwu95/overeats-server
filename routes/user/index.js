const router = require('express').Router();
const controller = require('./controller');
const { checkExpiredToken, checkTypeToken } = require('../../middleware/auth');

router.post('/signup', controller.signup);
router.post('/signin', controller.signin);

router.get('/info', checkExpiredToken, checkTypeToken, controller.info);
router.get('/signout', checkExpiredToken, checkTypeToken, controller.signout);

module.exports = router;
