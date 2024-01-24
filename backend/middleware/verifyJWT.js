const jwt = require("jsonwebtoken");

const verifyJWT = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;

  if (!authHeader?.startsWith("Bearer "))
    return res.json({ message: "Unathorized" }).status(401);

  const token = authHeader.split(" ")[1];

  if (token) {
    jwt.verify(token, process.env.ACCESS_TOKEN, (err, decoded) => {
      if (err) return res.status(401).json({ message: "Unauthorized" });

      req.username = decoded.credentials.username;
      req.userId = decoded.credentials.userId

      next();
    });
  }
};


module.exports = verifyJWT