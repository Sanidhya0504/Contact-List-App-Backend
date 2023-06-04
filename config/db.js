const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    return mongoose
      .connect(process.env.MONGODB_URI, {
        //these are options to get rid of warnings
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then(console.log(`MongoDB connected`));
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};
module.exports = connectDB;
