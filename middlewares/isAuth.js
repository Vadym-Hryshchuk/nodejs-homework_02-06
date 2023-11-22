const jwt = require("jsonwebtoken");
const User = require("../models/users");

const isAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader === undefined) {
    return res.status(401).json({ message: "Not authorized" });
  }

  const [bearer, token] = authHeader.split(" ", 2);
  if (bearer !== "Bearer") {
    return res.status(401).json({ message: "Not authorized" });
  }
  jwt.verify(token, process.env.SECRET_KEY, async (err, decode) => {
    if (err) {
      return res.status(401).json({ message: "Not authorized" });
    }
    const user = await User.findById(decode.id).exec();
    if (user === null || user.token !== token) {
      return res.status(401).json({ message: "Not authorized" });
    }

    req.user = user;
    next();
  });
};

module.exports = isAuth;
