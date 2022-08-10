const Mongoose = require("mongoose");
const UserSchema = new Mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true,
  },
  email: {
    type: String,
    trim: true,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    minlength: 6,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
    expires: 900, // this is the expiry time in seconds
  },
  role: {
    type: String,
    default: "user",
    required: true,
  },
});

const User = Mongoose.model("user", UserSchema);
module.exports = User;
