const express = require("express");
const app = express();
const auth = require("./middlewares/auth");
const morgan = require("morgan");
const connectDB = require("./config/db");
const cors = require("cors");
//middleware
app.use(express.json());
app.use(morgan("tiny"));
app.use(cors());
//routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api", require("./routes/contact"));

app.get("/protected", auth, (req, res) => {
  return res.status(200).json({ ...req.user._doc });
});
const PORT = process.env.PORT;

app.listen(PORT, async () => {
  try {
    await connectDB();
    console.log(`Server started on port ${PORT}`);
  } catch (err) {
    console.log(err);
  }
});
