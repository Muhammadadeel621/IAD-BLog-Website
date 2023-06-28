const { Router } = require('express');
const PostController = require('../controllers/post.controller');
const verifyJWT = require('../middlewares/verifyJWT');
const fileUploader = require('../middlewares/fileuploader');

const router = Router();

router.get('/', PostController.getAllPosts);
router.get('/static', PostController.getAllPostsStatic);
router.get('/:id', PostController.getPostById);
router.post('/', verifyJWT, fileUploader(['.jpeg', '.jpg', '.png', '.webp'], 'image'), PostController.createPost);
router.patch('/:id', verifyJWT, PostController.updatePost);
router.delete('/:id', verifyJWT, PostController.deletePost);

module.exports = router;
