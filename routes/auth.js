const express = require("express");
const router = express.Router();
const {
  register,
  login,
  update,
  deleteUser,
  resetPasswordRequestController,
  resetPasswordController,
  logout,
} = require("../controllers/Auth");
const { adminAuth, userAuth } = require("../middleware/auth");

router.post("/register", register);
router.post("/login", login);
router.post("/requestResetPassword", resetPasswordRequestController);
router.post("/resetPassword", resetPasswordController);
router.put("/update", adminAuth, update);
router.delete("/delete", adminAuth, deleteUser);
router.get("/logout", userAuth, logout);


module.exports = router;
