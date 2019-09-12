const express = require('express');
const auth = require('../middleware/auth');
const repliesCtrl = require('../controllers/repliesCtrl');
const router = express.Router();

router.get('/', repliesCtrl.index);
router.get('/:id', repliesCtrl.show);

router.use(auth.authenticate);
router.post('/', auth.checkAuth, repliesCtrl.create);
router.delete('/:id', auth.checkAuth, repliesCtrl.removeMessage);

module.exports = router;
