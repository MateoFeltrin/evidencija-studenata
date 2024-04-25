const jwt = require("jsonwebtoken");
const config = require("../backend-api/auth.config");

//PRI POZIVU FUNKCIJE ROLE NAPISAT OVAKO "verifyToken("admin, recepcionar")"
verifyToken = (roles) => (req, res, next) => {
  // Retrieve the token from the authorization header
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  // If no token is provided, return an error
  if (!token) {
    return res.status(403).json({
      message: "No token provided!",
    });
  }

  // Verify the token using the secret key
  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        message: "Unauthorized!",
      });
    }

    // Assign the userId and role to the request object
    req.userId = decoded.id;
    const userRole = decoded.uloga;

    // Split the input roles string by commas and trim whitespace
    const rolesArray = roles.split(",").map((role) => role.trim());

    // Check if the user's role is in the list of provided roles
    if (rolesArray.includes(userRole)) {
      // Proceed to the next middleware or endpoint handler
      next();
    } else {
      // Send a 403 response if the user's role is not allowed
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
