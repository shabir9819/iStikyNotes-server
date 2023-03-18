const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  email: { type: String, required: [true, "Email is required."] },
  phone: {
    type: Number,
    required: [true, "Phone number should not be blank."],
  },
  message: {
    type: String,
    minLength: 3,
    required: [true, "Message should not be blank."],
  },
});

const Message = new mongoose.model("message", messageSchema);

module.exports = Message;
