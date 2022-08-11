const express = require("express");
const router = express.Router();
const {
  register,
  login,
  logout,
  deleteUser,
  resetPasswordRequestController,
  resetPasswordController,
  adminProfile,
} = require("../controllers/Auth");
const { userAuth, verifyAuth, verifyUser} = require("../middleware/auth");

router.post("/register", register);
router.post("/login", login);
router.post("/requestResetPassword", resetPasswordRequestController);
router.post("/passwordReset", resetPasswordController);
router.delete("/delete/:id", verifyUser, verifyAuth.isAdmin, deleteUser);
router.get("/admin-profile", verifyUser, verifyAuth.isAdmin, adminProfile);
router.post("/logout", logout);





module.exports = router;
