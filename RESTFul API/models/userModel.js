class User {
  constructor(id, name, email) {
    this.id = id;
    this.name = name;
    this.email = email;
  }

  // Phương thức giả để lấy tất cả người dùng
  static findAll() {
    return [
      new User(1, "John Doe", "john@example.com"),
      new User(2, "Jane Doe", "jane@example.com"),
    ];
  }
}

module.exports = User;
