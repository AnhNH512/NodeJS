const User = require('../models/userModel');
const {successResponse, errorResponse} = require('../helpful/response');
const fs = require('fs');
const path = require('path');
const xlsx = require('xlsx');
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
    if (!req.file) {
      return res.status(400).send('No file uploaded.');
    }

    const tempPath = req.file.path;
    const targetPath = path.join(
      __dirname,
      '../uploads',
      req.file.originalname,
    );

    fs.rename(tempPath, targetPath, (err) => {
      if (err) return res.status(500).send('Error moving file.');

      try {
        const workbook = xlsx.readFile(targetPath);
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        console.log(workbook, 'workbook');
        console.log(sheetName, 'sheetName');
        let data = xlsx.utils.sheet_to_json(worksheet, {header: 1});
        console.log('Raw data:', data);

        // Loại bỏ các hàng trống trước khi dữ liệu thực bắt đầu
        data = data.filter((row) =>
          row.some(
            (cell) => cell !== null && cell !== undefined && cell !== '',
          ),
        );

        console.log('Filtered data:', data);

        if (data.length === 0) {
          return res.status(400).send('Empty file.');
        }

        const headers = data[0]; // Lấy hàng đầu tiên làm tiêu đề
        const rows = data.slice(1); // Lấy các hàng còn lại làm dữ liệu

        // Chuyển đổi dữ liệu thành mảng đối tượng
        const objects = rows.map((row) => {
          let obj = {};
          row.forEach((cell, index) => {
            obj[headers[index]] = cell;
          });
          return obj;
        });

        console.log('Headers:', headers);
        console.log('Rows:', rows);
        console.log('Objects:', objects);

        // Gửi dữ liệu về cho client
        res.json(
          successResponse(objects, 'Import danh sách người dùng thành công'),
        );
        // res.status(200).send({headers, rows});
      } catch (error) {
        console.error('Error reading file:', error);
        res.status(500).send('Error reading file.');
      }
    });
    // try {
    //   User.uploadFile(req, res);
    //   res.json(successResponse(null, 'Import danh sách người dùng thành công'));
    // } catch {
    //   res.json(errorResponse('Import danh sách người dùng thất bại'));
    // }
  }

  static dowloadFile(req, res) {
    try {
      // Tạo workbook và worksheet
      const wb = xlsx.utils.book_new();
      const ws_data = [
        ['name', 'email'], // Mã ẩn
        ['Tên người dùng', 'Email'], // Tiêu đề hiển thị
      ];
      const ws = xlsx.utils.aoa_to_sheet(ws_data);
      console.log('ws', ws);
      // ws.A1.hidden = true;
      ws.B1.hidden = true;
      // ws['!rows'] = [
      //   // Ẩn dòng chứa "name" và "email"
      //   {hidden: true}, // Ẩn dòng đầu tiên
      //   {hidden: true}, // Ẩn dòng thứ hai
      // ];
      // // Định dạng các cột trong worksheet để ẩn "name" và "email"
      // ws['!cols'] = [
      //   {hidden: true}, // Ẩn cột đầu tiên (name)
      //   {hidden: true}, // Ẩn cột thứ hai (email)
      // ];
      // Thêm worksheet vào workbook
      xlsx.utils.book_append_sheet(wb, ws, 'Template');

      // Định dạng file Excel
      const filePath = path.join(
        __dirname,
        '../templates',
        'user_template.xlsx',
      );
      xlsx.writeFile(wb, filePath);

      // Kiểm tra file tồn tại trước khi trả về liên kết
      fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
          console.error('File does not exist:', err);
          return res.status(500).send('Error creating file.');
        }

        console.log('File created successfully:', filePath);

        // Tạo đường dẫn tới file từ URL cơ sở của server
        const fileUrl = `http://localhost:${3002}/download-template/user_template.xlsx`;

        // Trả về liên kết tải file dưới dạng JSON
        res.json(
          successResponse(
            {downloadLink: fileUrl},
            'Import danh sách người dùng thành công',
          ),
        );
        // res.json({downloadLink: fileUrl});
      });

      // // Kiểm tra file tồn tại trước khi gửi
      // fs.access(filePath, fs.constants.F_OK, (err) => {
      //   if (err) {
      //     console.error('File does not exist:', err);
      //     return res.status(500).send('Error creating file.');
      //   }
      //   console.log('filePath', filePath);
      //   // Gửi file cho người dùng
      //   // Gửi file cho người dùng
      //   res.download(filePath, 'user_template.xlsx', (err) => {
      //     if (err) {
      //       console.error('Error sending file:', err);
      //       return res.status(500).send('Error sending file.');
      //     }

      //     console.log('File sent successfully.');

      //     // Nếu không còn cần tệp sau khi gửi thành công, bạn có thể xóa tệp
      //     // fs.unlinkSync(filePath);

      //     // Kết thúc phản hồi HTTP ở đây
      //     // res.end();
      //   });
      // });
    } catch (error) {
      res.json(errorResponse(error));
    }
  }

  static getInfoUser(req, res) {
    const users = User.getInfoUser(req.body);
    res.json(successResponse(users));
  }
}

module.exports = UserController;
