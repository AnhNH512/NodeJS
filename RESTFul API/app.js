const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const xlsx = require('xlsx');

const app = express();
const userRoutes = require('./routes/userRoutes');
app.use(express.json());
// // Sử dụng cors middleware

const upload = multer({dest: 'uploads/'});

const allowedOrigins = ['http://localhost:3000', 'http://localhost:3000/'];

app.use(
  cors({
    origin: function (origin, callback) {
      console.log('origin>>>', origin);
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
  }),
);
app.post('/users/uploadFile', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }
  console.log('file user send reques>>>', req.file);
  const tempPath = req.file.path;
  const targetPath = path.join(__dirname, 'uploads', req.file.originalname);

  fs.rename(tempPath, targetPath, (err) => {
    if (err) return res.status(500).send('Error moving file.');

    try {
      // Đọc dữ liệu từ file Excel sử dụng thư viện xlsx
      const workbook = xlsx.readFile(targetPath);
      const sheetName = workbook.SheetNames[0]; // Lấy tên sheet đầu tiên
      const worksheet = workbook.Sheets[sheetName];

      console.log('Sheet data:', worksheet);

      // Tự động xác định phạm vi dữ liệu
      const range = xlsx.utils.decode_range(worksheet['!ref']);
      let startRow = range.s.r;
      let endRow = range.e.r;

      console.log('Initial range:', range);

      // Tìm hàng đầu tiên có dữ liệu
      for (let R = range.s.r; R <= range.e.r; ++R) {
        const rowData = [];
        for (let C = range.s.c; C <= range.e.c; ++C) {
          const cellAddress = {c: C, r: R};
          const cellRef = xlsx.utils.encode_cell(cellAddress);
          if (worksheet[cellRef]) {
            rowData.push(worksheet[cellRef].v);
          }
        }
        if (rowData.length > 0) {
          startRow = R;
          break;
        }
      }

      console.log('Start row with data:', startRow);

      // Xác định phạm vi từ hàng đầu tiên có dữ liệu
      const dataRange = xlsx.utils.encode_range({
        s: {r: startRow, c: range.s.c},
        e: {r: endRow, c: range.e.c},
      });

      console.log('Data range:', dataRange);

      // Chuyển đổi dữ liệu từ phạm vi đã xác định
      const data = xlsx.utils.sheet_to_json(worksheet, {
        range: dataRange,
        header: 1,
      });

      console.log('Converted data:', data);

      // Gửi dữ liệu về cho client
      res.status(200).send({data});
    } catch (error) {
      console.error('Error reading file:', error);
      res.status(500).send('Error reading file.');
    }
  });
});

// Thêm route cho đường dẫn '/'
app.get('/', (req, res) => {
  res.send('Welcome to the Home Page!');
});

app.use('/users', userRoutes);

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
