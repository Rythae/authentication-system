const express = require("express");
const router = express.Router();
const { register, login, update, deleteUser, logout } = require("../controllers/Auth");
const { adminAuth, userAuth } = require("../middleware/auth");

router.post("/register", register);
router.post("/login", login);
router.put("/update", adminAuth, update);
router.delete("/delete", adminAuth, deleteUser);
router.get("/logout", userAuth, logout);


module.exports = router;
