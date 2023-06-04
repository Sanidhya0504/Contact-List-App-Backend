const jwt = require("jsonwebtoken");

const User = require("../models/User");

module.exports = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1]; //Bearer token

    jwt.verify(token, process.env.JWT_SECRET, async (err, payload) => {
      try {
        if (err) {
          return res.status(403).json({ msg: "Token is not valid" });
        }
        const user = await User.findOne({ _id: payload._id }).select(
          "-password"
        );
        req.user = user;
        next();
      } catch (err) {
        console.log(err);
        return res.status(500).json({ msg: err.message });
      }
    });
  } else {
    return res.status(401).json({ msg: "You must be logged in" });
  }
};
