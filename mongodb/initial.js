const db = require("../models");
const Role = db.role;

function initial() {
  Role.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) {
      new Role({
        name: "user",
      }).save((err) => {
        if (err) {
          console.log("error", err);
        }
        console.log("added 'user' to roles collection");
      });
      new Role({
        name: "admin",
      }).save((err) => {
        if (err) {
          console.log("error", err);
        }
        console.log("added 'admin' to roles collection");
      });
      new Role({
        name: "staff",
      }).save((err) => {
        if (err) {
          console.log("error", err);
        }
        console.log("added 'staff' to roles collection");
      });
      new Role({
        name: "manager",
      }).save((err) => {
        if (err) {
          console.log("error", err);
        }
        console.log("added 'manager' to roles collection");
      });
    }
  });
}

module.exports = initial;
