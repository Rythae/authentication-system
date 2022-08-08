const Mongoose = require("mongoose");
const UserSchema = new Mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    minlength: 6,
    required: true,
  },
  role: {
    type: String,
    enum: ['admin', 'staff', 'manager'],
    default: "staff",
    required: true,
  },
});

const User = Mongoose.model("user", UserSchema);
module.exports = User;
