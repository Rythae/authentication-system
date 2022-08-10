const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const connectDB = require("./mongodb/config");
const routes = require("./routes/auth");
const { adminAuth, userAuth } = require("./middleware/auth");

const app = express();

connectDB();

var corsOptions = {
  origin: "http://localhost:8081",
};
app.use(cors(corsOptions));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

app.use("/", routes);
// app.get("/admin", adminAuth, (req, res) => res.send("Admin Route"));
app.get("/staff", userAuth, (req, res) => res.send("User Route"));

app.get("/", (req, res) => {
  res.json({ message: "Welcome to authentication module system." });
});
app.get("*", (req, res) => {
  res.status(400).json({
    message: "Route Not Found",
  });
});
const port = process.env.PORT || 5000;
const server = app.listen(port, () =>
  console.log(`Server Connected to port ${port}`)
);
// Handling Error
process.on("unhandledRejection", err => {
  console.log(`An error occurred: ${err.message}`)
  server.close(() => process.exit(1));
})