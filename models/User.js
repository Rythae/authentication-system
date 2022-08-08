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
  roles: [
    {
      type: Mongoose.Schema.Types.ObjectId,
      ref: "Role"
    },
  ],
});

const User = Mongoose.model("user", UserSchema);
module.exports = User;
