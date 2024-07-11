// // Implement admin auth logic
// //   // You need to check the headers and validate the admin from the admin DB. Check readme for the exact headers to be expected

// const { Admin } = require("../db");

// async function adminMiddleware(req, res, next) {
//   const { username, password } = req.headers;

//   try {
//     const admin = await Admin.findOne({ username, password });

//     if (!admin) {
//       return res.status(403).json({ err: "Authentication failed" });
//     }

//     next();
//   } catch (error) {
//     res.status(500).json({ err: "Internal server error" });
//   }
// }

// module.exports = adminMiddleware;

const jwt = require("jsonwebtoken");
const jwtPassword = "!23456";

function adminMiddleware(req, res, next) {
  const token = req.headers.authorization;
  const words = token.split(" ");
  const jwtToken = words[1];
  try {
    const decodedValue = jwt.decode(jwtToken, jwtPassword);
    if (decodedValue.username) {
      next();
    } else {
      return res.status(403).json({
        msg: "You are not authenticated",
      });
    }
  } catch (err) {
    res.json({
      msg: "Incorrect inputs",
    });
  }
}

module.exports = adminMiddleware;
