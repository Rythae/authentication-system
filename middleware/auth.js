const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const userAuth = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
      if (err) {
        return res.status(401).json({ message: "Not authorized" });
      } else {
        if (decodedToken.role !== "user") {
          return res.status(401).json({ message: "Not authorized" });
        } else {
          next();
        }
      }
    });
  } else {
    return res
      .status(401)
      .json({ message: "Not authorized, token not available" });
  }
};

// const verifyToken = (req, res, next) => {
//   const authHeader = req.headers.authorization || req.headers.Authorization;
//   if (!authHeader?.startsWith("Bearer ")) return res.sendStstus(401);
//   console.log(authHeader); //Bearer token
//   const token = authHeader.split(" ")[1];
//   jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
//     if (err) return res.status(401).json({ message: "Not authorized" });
//     req.user = decodedToken.id;
//     next();
//   });
// };

const isAdmin = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    const verify = await jwt.verify(token, process.env.JWT_SECRET);
    if (verify.role !== "admin") {
      return res.status(401).json({ message: "Not authorized" });
    }
    return next();
  }
  catch (error) {
    return res.status(401).json({
      message: "Sorry you're not authorized to execute this action",
      error: error.message,
    });
  }
};

const isStaff = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    const verify = await jwt.verify(token, process.env.JWT_SECRET);
    if (verify.role !== "staff") {
      return res.status(401).json({ message: "Not authorized" });
    }
    return next();
  } catch (error) {
    return res.status(401).json({
      message: "Sorry you're not authorized to execute this action",
      error: error.message,
    });
  }
};


const isManager = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    const verify = await jwt.verify(token, process.env.JWT_SECRET);
    if (verify.role !== "manager") {
      return res.status(401).json({ message: "Not authorized" });
    }
    return next();
  } catch (error) {
    return res.status(401).json({
      message: "Sorry you're not authorized to execute this action",
      error: error.message,
    });
  }
};
const verifyAuth = {
  isAdmin,
  isStaff,
  isManager,
};


module.exports = { userAuth, verifyAuth };
