const jwt = require("jsonwebtoken");
const JWT_SECRET_KEY = "NewWebsite"; //JWT_SECRET_KEY

const fetchUser = async (req, res, next) => {
  try {
    let success = false;
    const token = req.header("auth-token");
    if (!token) {
      return res
        .status(401)
        .send({
          success: success,
          error: "Please authenticate using a valid token.",
        });
    }
    const data = jwt.verify(token, JWT_SECRET_KEY);
    
    req.user = data.user;
  } catch (error) {
    let success = false;
    res.status(500).json({ success, error });
  }

  next();
};

module.exports = fetchUser;
