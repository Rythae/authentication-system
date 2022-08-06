const Mongoose = require("mongoose");
const Schema = Mongoose.Schema;
const TokenSchema = new Mongoose.Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "user",
  },
  token: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
    expires: 900, // this is the expiry time in seconds
  },
});
const Token = Mongoose.model("Token", TokenSchema);
module.exports = Token;
