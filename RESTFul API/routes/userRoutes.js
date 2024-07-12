const express = require("express");
const router = express.Router();
const UserController = require("../controllers/userController");

router.get("/", UserController.getAllUsers);

router.post("/addUser", UserController.addUser);

router.post("/getInfoUser", UserController.getInfoUser);

router.post("/editUser", UserController.editUser);

router.post("/deleteUser", UserController.deleteUser);

module.exports = router;
