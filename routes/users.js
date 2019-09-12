const express = require('express');
const auth = require('../middleware/auth');
const usersCtrl = require('../controllers/usersCtrl');
const router = express.Router();

router.get('/', usersCtrl.index);

router.use(auth.authenticate);
router.get('/:id', auth.checkAuth, usersCtrl.show);
router.put('/:id', auth.checkAuth, usersCtrl.update);

module.exports = router;
