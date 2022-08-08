const Mongoose = require("mongoose");
Mongoose.Promise = global.Promise;
const db = {};
db.Mongoose = Mongoose;
db.user = require("./User");
db.role = require("./Role");
db.ROLES = ["user", "admin", "staff", "manager"];
module.exports = db;
