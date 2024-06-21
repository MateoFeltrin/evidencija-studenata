const jwt = require("jsonwebtoken");
const config = require("../backend-api/auth.config");

//PRI POZIVU FUNKCIJE ROLE NAPISAT OVAKO "verifyToken("admin, recepcionar")"
verifyToken = (roles) => (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(403).json({
      message: "No token provided!",
    });
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        message: "Unauthorized!",
      });
    }

    req.userId = decoded.id;
    const userRole = decoded.uloga;

    if (typeof roles !== "string") {
      roles = String(roles);
    }

    const rolesArray = roles.split(",").map((role) => role.trim());

    if (rolesArray.includes(userRole)) {
      next();
    } else {
      res.status(403).json({
        message: `Require one of the following roles: ${roles}`,
      });
    }
  });
};

const authJwt = {
  verifyToken,
};
module.exports = authJwt;
