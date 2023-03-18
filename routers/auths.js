const express = require("express");
const router = express.Router();
const User = require("../models/auth");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const fetchUser = require("../middleware/fetchUser");

const JWT_SECRET_KEY = process.env.DATABASE_JWT_SECRET; //JWT_SECRET_KEY


//Route:1 Creating a new user using post

router.post("/createUser", async (req, res) => {
  try {
    const { name, email, password, phone } = req.body; // destructuring name,email,password,phone from req.body
 
    //validating an email
    let success = false;
    if (validator.isEmpty(email)) {
      return res
        .status(404)
        .json({ success, error: "Please enter a valid credentials." });
    } else if (!validator.isEmail(email)) {
      return res
        .status(404)
        .json({ success, error: "Please enter a valid credentials." });
    }

    //Bcrypting the password using bcrypt js
    const salt = await bcrypt.genSalt(10); //Generating salt using bcrypt
    const secPass = await bcrypt.hash(password, salt); //Generating newpassword using bcrypt hash


    const userData = new User({ name, email, password: secPass, phone });
    //Adding authtoken to the database
    const token = await userData.generateAuth();

    const user = await User.insertMany([userData]);
    const data = { user: { id: userData._id } };

    //Generating authtoken using jwt
    const authToken = jwt.sign(data, JWT_SECRET_KEY);

    success = true;
    res.status(201).json({ success, authToken });
  } catch (error) {
    let success = false;
    res.status(400).json({ success, error });
  }
});

//Route:2 Login using post "/api/auth/login" No login required
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body; // destructuring email,password from req.body

    //validating an email
    let success = false;
    if (validator.isEmpty(email) || validator.isEmpty(password)) {
      return res
        .status(404)
        .json({ success, error: "Please fill the section correctly." });
    } else if (!validator.isEmail(email)) {
      return res
        .status(404)
        .json({ success, error: "Please enter a valid credentials." });
    }



    const userData = await User.findOne({ email });
    if (!userData) {
      return res.status(404).send({
        error: "Please try to login with correct credentials.",
        success: success,
      });
    }

    //Verifying the input password with the database user password

    const comparePass = await bcrypt.compare(password, userData.password);

    if (!comparePass) {
      return res
        .status(404)
        .json({ error: "Please try to login with correct credentials." });
    }
    success = true;
    const data = { user: { id: userData._id } };

    //Generating authtoken using jwt
    const authToken = jwt.sign(data, JWT_SECRET_KEY);
    res.status(201).json({ success, authToken });
  } catch (error) {
    let success = false;
    res.status(500).json({ success, error });
  }
});

//Route:3 Getting user details using post "/api/auth/getUser" login required

router.post("/getUser",fetchUser, async(req,res)=>{
  try {
    let userId = req.user.id;
  const userData = await User.findById(userId).select({password:0, tokens:0});

  let success = true;
  res.status(201).json({ success, userData });
  } catch (error) {
    let success = false;
    res.status(500).json({ success, error });
  }
})

module.exports = router;
