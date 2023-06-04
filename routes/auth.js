const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config({ path: "./config/config.env" });
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  //check all are present
  if (!name || !email || !password) {
    return res.status(400).json({ msg: "Please enter all fields" });
  }

  //email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ msg: "Invalid email" });
  }

  //password validation
  if (password.length < 6) {
    return res
      .status(400)
      .json({ msg: "Password must be atleast 6 characters long" });
  }
  //name validation
  if (name.length > 25) {
    return res
      .status(400)
      .json({ msg: "Name must be less than 25 characters" });
  }

  try {
    const userExist = await User.findOne({ email });
    if (userExist) return res.status(400).json({ msg: "User already exists" });
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword });

    // save the user
    const savedUser = await newUser.save();
    savedUser._doc.password = undefined;
    return res.status(201).json({ ...savedUser._doc });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg: err.message });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ msg: "Please enter all fields" });
  }
  //email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ msg: "Invalid email" });
  }
  try {
    const doesExist = await User.findOne({ email });
    if (!doesExist) return res.status(400).json({ msg: "User does not exist" });

    const isMatch = await bcrypt.compare(password, doesExist.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    const payload = { _id: doesExist._id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    const user = { ...doesExist._doc, password: undefined };
    return res.status(200).json({ token, user });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg: err.message });
  }
});

module.exports = router;
