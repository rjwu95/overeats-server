const router = require('express').Router();
const controller = require('./controller');

router.get('/:category/:address', controller.category);

module.exports = router;
