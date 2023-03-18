const express = require("express");
const fetchUser = require("../middleware/fetchUser");
const router = express.Router();
const Message = require("../models/message");
const validator = require("validator");


//Route:1 Sending message to the database using "POST" ("/")

router.post("/", fetchUser, async (req, res) => {
  try {
    let success = false;
    const { email, phone, message } = req.body;
    const user = req.user.id;
    if(!user){
        return res.status(404).json({ success, error });
    }
    if(!validator.isEmail(email)  || validator.isEmpty(message)){
       return res.status(404).json({ success, error });
    }
    const messageData = { user, email, phone, message };
    const sendData = await Message.insertMany([messageData]);
    if(sendData){
        success = true;
        res.status(200).json({success, sendData});
    }
  } catch (error) {
    let success = false;
    res.status(404).json({ success, error });
  }
});


//Route:2 Getting all messages from the database using "GET" ("/getAllMesage")

router.get("/getAllMessage", fetchUser, async (req, res) => {
  try {
    let success = false;
    const { email, password, message } = req.body;

    const user = req.user.id;

    if(!user){
        return res.status(404).json({ success, error });
    }
   
    const getData = await Message.find({user});
    if(getData){
        success = true;
        res.status(200).json({success, getData});
    }
  } catch (error) {
    let success = false;
    res.status(404).json({ success, error });
  }
});

module.exports = router;
