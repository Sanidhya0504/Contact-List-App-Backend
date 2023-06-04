const mongoose = require("mongoose");
const Joi = require("joi");

const ContactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
  },
  contact: {
    type: Number,
    required: [true, "Contact is required"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
  },
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

const Contact = mongoose.model("Contact", ContactSchema);

const validateContact = (data) => {
  const Schema = Joi.object({
    name: Joi.string().min(4).max(25).required(),
    contact: Joi.number().min(1000000000).max(9999999999).required(),
    email: Joi.string().email().required(),
  });
  return Schema.validate(data);
};
module.exports = {
  Contact,
  validateContact,
};
