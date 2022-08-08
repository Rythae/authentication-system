const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const db = require("../models");
const User = db.user;
const Role = db.role;
const { requestPasswordReset,resetPassword } = require("../Utils/auth");

dotenv.config();

const register = async (req,res,next) => {
  const { username, password } = req.body;
  if (password.length < 6) {
    return res.status(400).json({ message: "Password less than 6 characters" });
  }
  try {
      bcrypt.hash(password, 10).then(async (hash) => {
        await User.create({
          username,
          password: hash,
        })
          .then((user) => {
            const maxAge = 3 * 60 * 60;
            const token = jwt.sign(
              { id: user._id, username, },
              process.env.JWT_SECRET,
              {
                expiresIn: maxAge, // 3hrs in sec
              }
            );
            res.cookie("jwt", token, {
              httpOnly: true,
              maxAge: maxAge * 1000, // 3hrs in ms
            });
            if (req.body.roles) {
              Role.find(
                {
                  name: { $in: req.body.roles }
                },
                (err, roles) => {
                  if (err) {
                    res.status(500).send({ message: err });
                    return;
                  }
                  user.roles = roles.map(role => role._id);
                  user.save(err => {
                    if (err) {
                      res.status(500).send({ message: err });
                      return;
                    }
                    res.send({ message: "User was registered successfully!" });
                  });
                }
              );
            } else {
              Role.findOne({ name: "user" }, (err, role) => {
                if (err) {
                  res.status(500).send({ message: err });
                  return;
                }
                user.roles = [role._id];
                user.save(err => {
                  if (err) {
                    res.status(500).send({ message: err });
                    return;
                  }
                  res.send({ message: "User was registered successfully!" });
                });
              });
            }
            res.status(201).json({
              message: "User successfully created",
              user,
              token
            });
          })
          .catch((error) =>
            res.status(400).json({
              message: "User not successful created",
              error: error.message,
            })
          );
        })
  } catch (error) {
    res.status(401).json({
      message: "User not successful created",
      error: error.mesage,
    });
  }
};

const login = async (req, res, next) => {
 const { username, password } = req.body;
 // Check if username and password is provided
 if (!username || !password) {
   return res.status(400).json({
     message: "Username or Password not present",
   });
 }
 try {
   const user = await User.findOne({ username }).populate("roles", "-__v");
   if (!user) {
     res.status(400).json({
       message: "Login not successful",
       error: "User not found",
     });
   } else {
     // comparing given password with hashed password
     bcrypt.compare(password, user.password).then(function (result) {
         if (result) {
           const maxAge = 3 * 60 * 60;
           const token = jwt.sign(
             { id: user._id, username, roles: user.roles },
             process.env.JWT_SECRET,
             {
               expiresIn: maxAge, // 3hrs in sec
             }
           );
           res.cookie("jwt", token, {
             httpOnly: true,
             maxAge: maxAge * 1000, // 3hrs in ms
           });
            const authorities = [];
            for (let i = 0; i < user.roles.length; i++) {
              authorities.push("ROLE_" + user.roles[i].name.toUpperCase());
            }
           res.status(201).json({
             message: "User successfully Logged in",
             user,
             token,
             roles: authorities,
           });
         } else {
           res.status(400).json({ message: "Login not succesful" });
         }
     });
   }
 } catch (error) {
   res.status(400).json({
     message: "An error occurred",
     error: error.message,
   });
 }
};

const update = async (req, res, next) => {
  const { role, id } = req.body;
  // First - Verifying if role and id is presnt
  if (role && id) {
    // Second - Verifying if the value of role is admin,staff,manager
    if (role === "admin" || role === "staff" || role === "manager") {
      // Finds the user with the id
      await User.findById(id)
        .then((user) => {
          // Third - Verifies the user is not an admin, staff or a manager
          if (user.role !== "admin" || user.role !== "staff" || user.role !== "manager") {
            user.role = role;
            user.save((err) => {
              //Monogodb error checker
              if (err) {
                res
                  .status("400")
                  .json({ message: "An error occurred", error: err.message });
                process.exit(1);
              }
              res.status("201").json({ message: "Update successful", user });
            });
          } else {
            res.status(400).json({ message: "User is already an Admin" });
          }
        })
        .catch((error) => {
          res
            .status(400)
            .json({ message: "An error occurred", error: error.message });
        });
    }}}
    

const deleteUser = async (req, res, next) => {
  const { id } = req.body;
  await User.findById(id)
    .then((user) => user.remove())
    .then((user) =>
      res.status(201).json({ message: "User successfully deleted", user })
    )
    .catch((error) =>
      res
        .status(400)
        .json({ message: "An error occurred", error: error.message })
    );
};

const resetPasswordRequestController = async (req, res, next) => {
  const requestPasswordResetService = await requestPasswordReset(
    req.body.email
  );
  return res.json(requestPasswordResetService);
};

const resetPasswordController = async (req, res, next) => {
  const resetPasswordService = await resetPassword(
    req.body.userId,
    req.body.token,
    req.body.password
  );
  return res.json(resetPasswordService);
};


const logout = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt)
    return res.status(204).json({
    message: "Logout not successful",
    error: "User not found",
    }); // No content
  
  const token = cookies.jwt;

  //Is token in db?
  const foundUser = await User.find((user) => user.token === token);
  if (!foundUser) {
    res.clearCookie("jwt", {
      httpOnly: true,
      sameSite: "None",
      secure: true,
    });
    res.status(204).json({
      message: "Logout not successful",
      error: "User not found",
    });
  }
  // Delete token in db
  const otherUsers = User.filter((user) => user.token !== foundUser.token);
  const currentUser = { ...foundUser, token: "" };
  User.setUsers([...otherUsers, currentUser]);

  res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
  res.status(204).json({
    message: "Logout not successful",
    error: "User not found",
  });
}



module.exports = {
  register,
  login,
  update,
  deleteUser,
  resetPasswordRequestController,
  resetPasswordController,
  logout,
};