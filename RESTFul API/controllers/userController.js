const User = require('../models/userModel');
const {successResponse, errorResponse} = require('../helpful/response');
class UserController {
  static getAllUsers(req, res) {
    try {
      const users = User.findAll();
      res.json(successResponse(users));
    } catch (error) {
      res.status(500).json({error: 'Failed to fetch users'});
    }
  }

  static addUser(req, res) {
    try {
      User.addUser(req.body);
      res.json(successResponse(null, 'Thêm người dùng thành công'));
    } catch {
      res.json(errorResponse('Thêm người dùng thất bại'));
    }
  }

  static deleteUser(req, res) {
    try {
      User.deleteUser(req.body);
      res.json(successResponse(null, 'Xóa người dùng thành công'));
    } catch {
      res.json(errorResponse('Xóa người dùng thất bại'));
    }
  }

  static editUser(req, res) {
    try {
      User.editUser(req.body);
      res.json(
        successResponse(null, 'Cập nhật thông tin người dùng thành công'),
      );
    } catch {
      res.json(errorResponse('Cập nhật thông tin người dùng thất bại'));
    }
  }

  static uploadFile(req, res) {
    try {
      User.uploadFile(req, res);
      res.json(successResponse(null, 'Import danh sách người dùng thành công'));
    } catch {
      res.json(errorResponse('Import danh sách người dùng thất bại'));
    }
  }

  static getInfoUser(req, res) {
    const users = User.getInfoUser(req.body);
    res.json(successResponse(users));
  }
}

module.exports = UserController;
