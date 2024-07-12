const User = require("../models/userModel");
const { successResponse, errorResponse } = require("../helpful/response");
class UserController {
  static getAllUsers(req, res) {
    try {
      const users = User.findAll();
      console.log("users>>>>", users); // Kiểm tra dữ liệu trước khi trả về
      res.json(successResponse(users));
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ error: "Failed to fetch users" });
    }
  }

  static addUser(req, res) {
    try {
      User.addUser(req.body);
      res.json(successResponse(null, "Thêm người dùng thành công"));
    } catch {
      res.json(errorResponse("Thêm người dùng thất bại"));
    }
  }

  static deleteUser(req, res) {
    const users = User.findAll();
    console.log(req, "req");
    res.json(users);
  }

  static editUser(req, res) {
    console.log(req, "req");
    const users = User.findAll();
    res.json(users);
  }

  static getInfoUser(req, res) {
    const users = User.getInfoUser(req.body);
    console.log(users, "users");
    res.json(successResponse(users));
  }
}

module.exports = UserController;
