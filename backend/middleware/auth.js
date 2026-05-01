const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  const authHeader = req.header("Authorization");

  if (!authHeader) {
    return res.status(401).json({ message: "No token ❌" });
  }

  // 🔥 EXTRACT TOKEN PROPERLY
  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Invalid token format ❌" });
  }

  try {
    const decoded = jwt.verify(token, "process.env.JWT_SECRET"); // same as login
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token invalid ❌" });
  }
};