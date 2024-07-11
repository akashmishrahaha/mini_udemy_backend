const jwt = require("jsonwebtoken");
const jwtPassword = "12345";

function userMiddleware(req, res, next) {
  // Implement user auth logic
  // You need to check the headers and validate the user from the user DB. Check readme for the exact headers to be expected
  const token = req.headers.authorization;
  console.log(token);
  const words = token.split(" ");
  const jwtToken = words[1];
  const decodedValue = jwt.verify(jwtToken, jwtPassword);
  if (decodedValue.username) {
    // req.username = decodedValue.username;
    // req.randomData = "Adsadsadsadssd";
    next();
  } else {
    res.status(403).json({
      msg: "You are not authenticated",
    }); // Unauthorized response if token is invalid or missing username
  }
}
module.exports = userMiddleware;
