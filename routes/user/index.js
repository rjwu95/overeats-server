const router = require('express').Router();
const controller = require('./controller');

router.post('/signin', controller.signin);
router.post('/signup', controller.signup);
router.get('/info', controller.info);
router.get('/signout', controller.signout);

module.exports = router;
