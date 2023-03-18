const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");


const JWT_SECRET_KEY = process.env.DATABASE_JWT_SECRET; //JWT_SECRET_KEY


const userSchema = new mongoose.Schema({
  name: {
    type: String,
    uppercase: true,
    minlength: [3, "Minimum 3 characters are required"],
  },
  email: {
    type: String,
    required: [true, "Email is required."],
    unique: [true, "This email id already exists."],
  },
  password: {
    type: String,
    required: [true, "Please enter your password."]
  },
  phone: {
    type: Number,
    min: [9, "Enter a valid phone number."],
    required: [true, "Please enter your phone number."],
  },
  date: { type: Date, default: Date.now() },
  tokens:[{
    token:{
      type:String,
      required:true
    }
  }]
});

//Adding authtoken to the database
userSchema.methods.generateAuth = async function(){
  try {
  
    const token  = jwt.sign({_id:this._id}, JWT_SECRET_KEY);
    this.tokens  = await this.tokens.concat({token});

    return token;
  } catch (error) {
    res.status(400).json({error})
  }
}

//Users models
const User = new mongoose.model("user", userSchema);



//Exporting User mondel

module.exports = User;
