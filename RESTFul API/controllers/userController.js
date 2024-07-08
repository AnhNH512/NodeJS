const User = require("../models/userModel");

class UserController {
  static getAllUsers(req, res) {
    const users = User.findAll();
    console.log("users>>>>", users);
    res.json(users);
  }
}

module.exports = UserController;
