const Mongoose = require("mongoose");
const Role = Mongoose.model(
  "Role",
  new Mongoose.Schema({
    name: String,
  })
);
module.exports = Role;
