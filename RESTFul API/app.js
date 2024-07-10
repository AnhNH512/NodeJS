const express = require("express");
const cors = require("cors");
const app = express();
const userRoutes = require("./routes/userRoutes");
app.use(express.json());


// // Sử dụng cors middleware

const allowedOrigins = ['http://localhost:3000', 'http://localhost:3000/'];

app.use(cors({
  origin: function (origin, callback) {
    console.log('origin>>>',origin)
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}));

// Thêm route cho đường dẫn '/'
app.get("/", (req, res) => {
  res.send("Welcome to the Home Page!");
});

app.use("/users", userRoutes);

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
