// response.js
const { Status } = require("./constant");
// Hàm trả về phản hồi thành công
const successResponse = (data, message) => {
  return {
    Status: Status.STATUS_SUCCESS_API,
    Data: data,
    Message: message,
  };
};

// Hàm trả về phản hồi lỗi
const errorResponse = (message) => {
  return {
    Status: Status.STATUS_FAILED_API,
    Message: message,
  };
};

module.exports = {
  successResponse,
  errorResponse,
};
