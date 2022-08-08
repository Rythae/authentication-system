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
const { adminAuth, userAuth, verifyToken, verifyAuth } = require("../middleware/auth");
const { verifySignUp } = require("../middleware/verifySignUp");

router.post("/register", register);
router.post("/login", login);
router.post("/requestResetPassword", resetPasswordRequestController);
router.post("/resetPassword", resetPasswordController);
router.put("/update", adminAuth, update);
router.delete("/delete", verifyAuth.isAdmin, deleteUser);
router.get("/logout", verifyToken, logout);
router.get("/admin", verifyToken, verifyAuth.isAdmin);
router.get("/staff", verifyToken, verifyAuth.isStaff);
router.get("/manager", verifyToken, verifyAuth.isManager);




module.exports = router;
