const { Router } = require('express');
const verifyJWT = require('../middlewares/verifyJWT');
const userController = require('../controllers/user.controller');
const router = Router();

router.get('/me/posts', verifyJWT, userController.getAuthUserPosts);
router.get('/:username/posts', userController.getAllPostsByUsername);

module.exports = router;
