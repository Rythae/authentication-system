const express = require("express");
const router = express.Router();
const {
  register,
  login,
  logout,
  deleteUser,
  resetPasswordRequestController,
  resetPasswordController,
} = require("../controllers/Auth");
const {
  userAuth,
  verifyAuth,
} = require("../middleware/auth");

router.post("/register", register);
router.post("/login", userAuth, login);
router.post("/requestResetPassword", resetPasswordRequestController);
router.post("/resetPassword", resetPasswordController);
router.delete("/delete",verifyAuth.isAdmin, deleteUser);
router.get("/logout", logout);





module.exports = router;
