// config.js
const path = require('path');
const fs = require('fs');

const uploadDir = path.join(__dirname, 'uploads');

// Đảm bảo thư mục upload tồn tại
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

module.exports = {
  uploadDir,
  fs,
  path,
};
