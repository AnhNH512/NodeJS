const express = require("express");
const app = express();
const userRoutes = require("./routes/userRoutes");

app.use(express.json());

// Thêm route cho đường dẫn '/'
app.get("/", (req, res) => {
  res.send("Welcome to the Home Page!");
});

app.use("/users", userRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
