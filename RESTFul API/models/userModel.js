const { v4: uuidv4 } = require("uuid");

class User {
  constructor(id, name, email) {
    this.setId(id);
    this.setName(name);
    this.setEmail(email);
  }

  setId(id) {
    // Kiểm tra và đảm bảo id là một số dương
    if (typeof id !== "number" || id <= 0) {
      throw new Error("Invalid id");
    }
    this.id = id;
  }

  setName(name) {
    // Kiểm tra và đảm bảo name là một chuỗi không rỗng
    if (typeof name !== "string" || name.trim().length === 0) {
      throw new Error("Invalid name");
    }
    this.name = name.trim();
  }

  setEmail(email) {
    // Kiểm tra và đảm bảo email có định dạng hợp lệ
    if (typeof email !== "string" || !isValidEmail(email)) {
      throw new Error("Invalid email");
    }
    this.email = email;
  }

  // Phương thức kiểm tra định dạng email
  isValidEmail(email) {
    // Thực hiện kiểm tra định dạng email, ví dụ đơn giản:
    return /\S+@\S+\.\S+/.test(email);
  }
}

class ListUser {
  static listUser = [];

  // Phương thức giả để lấy tất cả người dùng
  static findAll() {
    return this.listUser;
  }

  static addUser(newUser) {
    if (newUser) {
      this.listUser.push({ ...newUser, id: uuidv4() });
    } else {
      throw new Error("Invalid user object");
    }
    // if (newUser instanceof User) {
    //   return this.listUser.push(newUser);
    // } else {
    //   throw new Error("Invalid user object");
    // }
  }

  static getInfoUser(param) {
    try {
      const { id } = param;
      console.log(id, "id");
      const user = this.listUser.find((item) => item.id === id);
      console.log(this.listUser, "this.listUser");
      return user;
    } catch (error) {
      throw new Error(error);
    }
  }
}

module.exports = ListUser;
