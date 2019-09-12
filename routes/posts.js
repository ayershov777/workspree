const express = require('express');
const auth = require('../middleware/auth');
const postsCtrl = require('../controllers/postsCtrl');
const router = express.Router();

router.get('/', postsCtrl.index);

router.use(auth.authenticate);
router.get('/:id', postsCtrl.show);
router.post('/', auth.checkAuth, postsCtrl.create);
router.put('/:id', auth.checkAuth, postsCtrl.update);
router.delete('/:id', auth.checkAuth, postsCtrl.remove);

module.exports = router;
