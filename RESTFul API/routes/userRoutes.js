const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');
const multer = require('multer');
const upload = multer({dest: '../uploads/'});
router.get('/', UserController.getAllUsers);

router.post('/addUser', UserController.addUser);

router.post('/getInfoUser', UserController.getInfoUser);

router.post('/editUser', UserController.editUser);

router.post('/deleteUser', UserController.deleteUser);

router.post('/uploadFile', upload.single('file'), UserController.uploadFile);

router.get('/dowloadFile', UserController.dowloadFile);

module.exports = router;
