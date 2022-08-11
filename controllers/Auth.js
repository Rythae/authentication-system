const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const User = require("../models/User");
const { requestPasswordReset,resetPassword } = require("../Utils/auth");

dotenv.config();

const register = async (req,res,next) => {
  const { username, password, email } = req.body;
  if (password.length < 6) {
    return res.status(400).json({ message: "Password less than 6 characters" });
  }
  try {
    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      username,
      password: hashPassword,
      email,
    })
     const maxAge = 3 * 60 * 60;
     const token = jwt.sign(
       { id: newUser._id, username, email, role: newUser.role },
       process.env.JWT_SECRET,
       {
         expiresIn: maxAge, // 3hrs in sec
       }
     );
     res.cookie("jwt", token, {
       httpOnly: true,
       maxAge: maxAge * 1000, // 3hrs in ms
     });
     res.status(201).json({
       message: "User successfully created",
       user: newUser,
       token,
     });
  } catch (error) {
    res.status(400).json({
      message: "User not successful created",
      error: error.message,
    });
  }
};

const login = async (req, res, next) => {
 const { username, password, email } = req.body;
 // Check if username and password is provided
 if (!username || !password || !email) {
   return res.status(400).json({
     message: "Username or Password or Email not present",
   });
 }
 try {
   const user = await User.findOne({ username });
   if (!user) {
     return res.status(400).json({
       message: "Login not successful",
       error: "Invalid login credentials",
     });
   } 
     // comparing given password with hashed password
   const verify = await bcrypt.compare(password, user.password);
    if (verify) {
      const maxAge = 3 * 60 * 60;
      const token = jwt.sign(
        { id: user._id, username, role: user.role },
        process.env.JWT_SECRET,
        {
          expiresIn: maxAge, // 3hrs in sec
        }
      );
      res.cookie("jwt", token, {
        httpOnly: true,
        maxAge: maxAge * 1000, // 3hrs in ms
      });
      return res.status(200).json({
        message: "User successfully Logged in",
        user,
        token,
      });
    }
   return res.status(400).json({ message: "Login not succesful" });
   
 } catch (error) {
   res.status(500).json({
     message: "An error occurred",
     error: error.message,
   });
 }
};


const logout = async (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    sameSite: "None",
    secure: true,
    maxAge: 0,
  });
  res.status(200).json({
    message: "Logout successful",
  });
}


const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { deletedCount } = await User.deleteOne({ _id: id });
    return deletedCount
      ? res.status(200).json({ message: "User successfully deleted" })
      : res.status(400).json({ message: "No User found" });
  } catch (error) {
    res.status(500).json({
      message: "An error occurred",
      error: error.message,
    });
  }
};

const adminProfile = (req, res, next) => {
   return res.status(200).json({
     message: "Profile successfully Fetched",
     user: req.user,
   });
}

const resetPasswordRequestController = async (req, res, next) => {
  const requestPasswordResetService = await requestPasswordReset(
    req.body.email
  );
  return res.json(requestPasswordResetService);
};

const resetPasswordController = async (req, res, next) => {
  const resetPasswordService = await resetPassword(
    // req.body.userId,
    req.body.token,
    req.body.password
  );
  return resetPasswordService
    ? res.json({ message: "Password reser successful" })
    : res.status(500).json({
        message: "An error occurred",
        error: error.message,
      });
};

module.exports = {
  register,
  login,
  deleteUser,
  resetPasswordRequestController,
  resetPasswordController,
  logout,
  adminProfile,
};